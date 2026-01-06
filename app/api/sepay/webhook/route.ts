import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// SePay Webhook Handler
// Nhận thông báo khi có giao dịch chuyển khoản vào tài khoản

interface SepayWebhookPayload {
  id: number;                    // ID giao dịch trên SePay
  gateway: string;               // Tên ngân hàng (MB Bank, etc.)
  transactionDate: string;       // Thời gian giao dịch
  accountNumber: string;         // Số tài khoản
  code: string | null;           // Mã code thanh toán (nếu có)
  content: string;               // Nội dung chuyển khoản
  transferType: 'in' | 'out';    // Loại giao dịch
  transferAmount: number;        // Số tiền
  accumulated: number;           // Số dư tài khoản
  subAccount: string | null;     // Tài khoản phụ
  referenceCode: string;         // Mã tham chiếu
  description: string;           // Mô tả đầy đủ
}

export async function POST(request: Request) {
  // Tạo supabase admin client trong function
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );

  try {
    // Xác thực API Key từ SePay (nếu có cấu hình)
    const authHeader = request.headers.get('Authorization');
    const sepayApiKey = process.env.SEPAY_API_KEY;
    
    if (sepayApiKey && authHeader !== `Apikey ${sepayApiKey}`) {
      console.log('Invalid SePay API Key');
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const payload: SepayWebhookPayload = await request.json();
    
    console.log('SePay Webhook received:', payload);

    // Chỉ xử lý giao dịch tiền vào
    if (payload.transferType !== 'in') {
      return NextResponse.json({ success: true, message: 'Ignored outgoing transaction' });
    }

    // Parse mã giao dịch từ nội dung chuyển khoản
    // Format: SPM{userId}{timestamp} hoặc SPY{userId}{timestamp}
    // User ID có thể chứa dấu gạch ngang
    const content = payload.content.toUpperCase();
    
    // Loại bỏ khoảng trắng và ký tự đặc biệt không cần thiết
    const cleanContent = content.replace(/[\s]/g, '');
    
    console.log('Original content:', payload.content);
    console.log('Clean content:', cleanContent);
    
    // Regex cập nhật để match cả dấu gạch ngang trong user ID
    // SP[MY] = prefix cho Monthly/Yearly
    // [A-Z0-9-]+ = phần còn lại bao gồm userId và timestamp
    const transactionMatch = cleanContent.match(/SP[MY][A-Z0-9-]+/);
    
    if (!transactionMatch) {
      console.log('No transaction code found in content:', payload.content);
      console.log('Regex pattern used: /SP[MY][A-Z0-9-]+/');
      
      // Thử tìm với pattern rộng hơn
      const altMatch = cleanContent.match(/SP[A-Z0-9-]+/);
      if (altMatch) {
        console.log('Found alternative match:', altMatch[0]);
      }
      
      return NextResponse.json({ 
        success: true, 
        message: 'No transaction code found' 
      });
    }

    const transactionCode = transactionMatch[0];
    console.log('Transaction code found:', transactionCode);

    // Tìm pending payment với transaction code này
    // Thử tìm exact match trước
    let { data: payment, error: findError } = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('transaction_code', transactionCode)
      .eq('status', 'pending')
      .single();

    // Nếu không tìm thấy, thử tìm với LIKE pattern (case insensitive)
    if (findError || !payment) {
      console.log('Exact match not found, trying LIKE search for:', transactionCode);
      
      const { data: payments, error: likeError } = await supabaseAdmin
        .from('payments')
        .select('*')
        .eq('status', 'pending')
        .ilike('transaction_code', `%${transactionCode}%`);
      
      if (!likeError && payments && payments.length > 0) {
        payment = payments[0];
        console.log('Found payment via LIKE search:', payment.transaction_code);
      } else {
        // Thử tìm payment có transaction_code chứa trong content
        const { data: allPending } = await supabaseAdmin
          .from('payments')
          .select('*')
          .eq('status', 'pending');
        
        if (allPending) {
          for (const p of allPending) {
            // So sánh không phân biệt hoa thường
            if (cleanContent.includes(p.transaction_code.toUpperCase())) {
              payment = p;
              console.log('Found payment via content search:', p.transaction_code);
              break;
            }
          }
        }
      }
    }

    if (!payment) {
      console.log('Payment not found for code:', transactionCode, 'Error:', findError);
      console.log('Clean content was:', cleanContent);
      return NextResponse.json({ 
        success: true, 
        message: 'Payment not found or already processed' 
      });
    }
    
    console.log('Found payment:', payment.id, 'Code:', payment.transaction_code);

    // Kiểm tra số tiền
    if (payload.transferAmount < payment.amount) {
      console.log('Insufficient amount:', payload.transferAmount, 'expected:', payment.amount);
      
      // Cập nhật payment status thành failed
      await supabaseAdmin
        .from('payments')
        .update({ 
          status: 'failed',
          note: `Số tiền không đủ: ${payload.transferAmount} < ${payment.amount}`,
          updated_at: new Date().toISOString()
        })
        .eq('id', payment.id);

      return NextResponse.json({ 
        success: true, 
        message: 'Insufficient amount' 
      });
    }

    // Cập nhật payment thành công
    const { error: updatePaymentError } = await supabaseAdmin
      .from('payments')
      .update({
        status: 'completed',
        sepay_transaction_id: payload.id.toString(),
        sepay_reference_code: payload.referenceCode,
        paid_amount: payload.transferAmount,
        paid_at: payload.transactionDate,
        updated_at: new Date().toISOString()
      })
      .eq('id', payment.id);

    if (updatePaymentError) {
      console.error('Failed to update payment:', updatePaymentError);
      return NextResponse.json(
        { success: false, message: 'Failed to update payment' },
        { status: 500 }
      );
    }

    // Tính ngày hết hạn subscription
    const now = new Date();
    let periodEnd: Date;
    
    if (payment.plan_id === 'monthly') {
      periodEnd = new Date(now.getTime());
      periodEnd.setMonth(periodEnd.getMonth() + 1);
    } else {
      periodEnd = new Date(now.getTime());
      periodEnd.setFullYear(periodEnd.getFullYear() + 1);
    }

    // Tạo hoặc cập nhật subscription
    const { data: existingSub, error: subQueryError } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('user_id', payment.user_id)
      .single();

    if (subQueryError && subQueryError.code !== 'PGRST116') {
      console.error('Error querying subscription:', subQueryError);
    }

    if (existingSub) {
      // Gia hạn subscription hiện tại
      const currentEnd = new Date(existingSub.current_period_end);
      let newEnd: Date;
      
      if (currentEnd > new Date()) {
        newEnd = new Date(currentEnd.getTime());
        if (payment.plan_id === 'monthly') {
          newEnd.setMonth(newEnd.getMonth() + 1);
        } else {
          newEnd.setFullYear(newEnd.getFullYear() + 1);
        }
      } else {
        newEnd = periodEnd;
      }

      const { error: updateSubError } = await supabaseAdmin
        .from('subscriptions')
        .update({
          status: 'active',
          plan_id: payment.plan_id,
          current_period_start: now.toISOString(),
          current_period_end: newEnd.toISOString(),
        })
        .eq('id', existingSub.id);

      if (updateSubError) {
        console.error('Failed to update subscription:', updateSubError);
        return NextResponse.json(
          { success: false, message: 'Failed to update subscription' },
          { status: 500 }
        );
      }

      console.log('Subscription extended for user:', payment.user_id, 'New end:', newEnd.toISOString());
    } else {
      // Tạo subscription mới với UUID
      const subscriptionId = crypto.randomUUID();
      
      const { error: insertSubError } = await supabaseAdmin
        .from('subscriptions')
        .insert({
          id: subscriptionId,
          user_id: payment.user_id,
          status: 'active',
          plan_id: payment.plan_id,
          current_period_start: now.toISOString(),
          current_period_end: periodEnd.toISOString(),
          created: now.toISOString(),
        });

      if (insertSubError) {
        console.error('Failed to create subscription:', insertSubError);
        return NextResponse.json(
          { success: false, message: 'Failed to create subscription' },
          { status: 500 }
        );
      }

      console.log('New subscription created for user:', payment.user_id, 'ID:', subscriptionId);
    }

    console.log('Payment processed successfully for user:', payment.user_id);

    return NextResponse.json({ 
      success: true, 
      message: 'Payment processed successfully' 
    }, { status: 200 });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET method để test webhook endpoint
export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    message: 'SePay webhook endpoint is active' 
  });
}

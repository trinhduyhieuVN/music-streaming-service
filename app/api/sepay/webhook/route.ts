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
    const content = payload.content.toUpperCase();
    const transactionMatch = content.match(/SP[MY][A-Z0-9]+/);
    
    if (!transactionMatch) {
      console.log('No transaction code found in content:', payload.content);
      return NextResponse.json({ 
        success: true, 
        message: 'No transaction code found' 
      });
    }

    const transactionCode = transactionMatch[0];
    console.log('Transaction code found:', transactionCode);

    // Tìm pending payment với transaction code này
    const { data: payment, error: findError } = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('transaction_code', transactionCode)
      .eq('status', 'pending')
      .single();

    if (findError || !payment) {
      console.log('Payment not found for code:', transactionCode, 'Error:', findError);
      return NextResponse.json({ 
        success: true, 
        message: 'Payment not found or already processed' 
      });
    }

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
    const { data: existingSub } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('user_id', payment.user_id)
      .single();

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

      await supabaseAdmin
        .from('subscriptions')
        .update({
          status: 'active',
          current_period_end: newEnd.toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', existingSub.id);
    } else {
      // Tạo subscription mới
      await supabaseAdmin
        .from('subscriptions')
        .insert({
          user_id: payment.user_id,
          status: 'active',
          plan_id: payment.plan_id,
          current_period_start: new Date().toISOString(),
          current_period_end: periodEnd.toISOString(),
          created_at: new Date().toISOString()
        });
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

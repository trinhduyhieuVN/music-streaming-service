import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

// API kiểm tra giao dịch từ SePay API
// Sử dụng khi webhook không hoạt động

interface SepayTransaction {
  id: string;
  bank_brand_name: string;
  account_number: string;
  transaction_date: string;
  amount_out: string;
  amount_in: string;
  accumulated: string;
  transaction_content: string;
  reference_number: string;
  code: string | null;
  sub_account: string | null;
  bank_account_id: string;
}

interface SepayAPIResponse {
  status: number;
  error: null | string;
  messages: {
    success: boolean;
  };
  transactions: SepayTransaction[];
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Kiểm tra user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { paymentId } = body;

    if (!paymentId) {
      return NextResponse.json(
        { error: 'paymentId required' },
        { status: 400 }
      );
    }

    // Lấy thông tin payment
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('id', paymentId)
      .eq('user_id', user.id)
      .single();

    if (paymentError || !payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    // Nếu đã completed, trả về luôn
    if (payment.status === 'completed') {
      return NextResponse.json({
        success: true,
        status: 'completed',
        message: 'Payment already completed'
      });
    }

    // Kiểm tra hết hạn
    if (new Date(payment.expires_at) < new Date() && payment.status === 'pending') {
      return NextResponse.json({
        success: false,
        status: 'expired',
        message: 'Payment expired'
      });
    }

    // Gọi SePay API để lấy danh sách giao dịch gần đây
    const sepayApiKey = process.env.SEPAY_API_KEY;
    const sepayAccountId = process.env.SEPAY_ACCOUNT_ID || '';
    
    if (!sepayApiKey) {
      console.log('SEPAY_API_KEY not configured');
      return NextResponse.json({
        success: false,
        status: 'pending',
        message: 'Payment verification not available'
      });
    }

    // Gọi API lấy giao dịch trong 1 giờ gần đây với retry logic
    let response;
    let retries = 0;
    const maxRetries = 2;
    
    while (retries <= maxRetries) {
      try {
        response = await fetch(
          `https://my.sepay.vn/userapi/transactions/list?account_number=${sepayAccountId}&limit=50`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${sepayApiKey}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.ok) {
          break;
        } else if (response.status === 429 && retries < maxRetries) {
          // Rate limit - wait and retry
          console.log(`Rate limited, waiting ${(retries + 1) * 2}s before retry ${retries + 1}/${maxRetries}`);
          await new Promise(resolve => setTimeout(resolve, (retries + 1) * 2000));
          retries++;
          continue;
        } else {
          console.log('SePay API error:', response.status);
          return NextResponse.json({
            success: false,
            status: 'pending',
            message: response.status === 429 ? 'Too many requests. Please try again in a few seconds.' : 'Cannot verify payment at this time'
          });
        }
      } catch (error) {
        console.error('Fetch error:', error);
        if (retries < maxRetries) {
          retries++;
          await new Promise(resolve => setTimeout(resolve, 2000));
          continue;
        }
        return NextResponse.json({
          success: false,
          status: 'error',
          message: 'Failed to connect to payment service'
        });
      }
    }

    if (!response || !response.ok) {
      console.log('SePay API error after retries');
      return NextResponse.json({
        success: false,
        status: 'pending',
        message: 'Cannot verify payment at this time'
      });
    }

    const data: SepayAPIResponse = await response.json();
    console.log('SePay transactions:', data);

    // Tìm giao dịch khớp với transaction code
    const transactionCode = payment.transaction_code.toUpperCase();
    console.log('Looking for transaction code:', transactionCode);
    console.log('Payment amount:', payment.amount);
    
    const matchingTransaction = data.transactions?.find(tx => {
      // Chỉ xử lý giao dịch tiền vào
      if (tx.amount_out !== '0.00') return false;
      
      // Loại bỏ tất cả khoảng trắng và ký tự đặc biệt
      const content = tx.transaction_content.toUpperCase().replace(/[\s-]/g, '');
      const amount = parseFloat(tx.amount_in);
      
      console.log('Checking transaction:', {
        id: tx.id,
        content: content,
        amount: amount,
        matches: content.includes(transactionCode) && amount >= payment.amount
      });
      
      return content.includes(transactionCode) && amount >= payment.amount;
    });
    
    console.log('Matching transaction found:', matchingTransaction ? matchingTransaction.id : 'none');

    if (matchingTransaction) {
      // Tìm thấy giao dịch, cập nhật payment
      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.SUPABASE_SERVICE_ROLE_KEY || ''
      );

      // Cập nhật payment
      const { error: updateError } = await supabaseAdmin
        .from('payments')
        .update({
          status: 'completed',
          sepay_transaction_id: matchingTransaction.id,
          sepay_reference_code: matchingTransaction.reference_number,
          paid_amount: parseFloat(matchingTransaction.amount_in),
          paid_at: matchingTransaction.transaction_date,
          updated_at: new Date().toISOString()
        })
        .eq('id', payment.id);

      if (updateError) {
        console.error('Failed to update payment:', updateError);
        return NextResponse.json({
          success: false,
          status: 'error',
          message: 'Failed to update payment'
        });
      }

      // Tạo hoặc cập nhật subscription
      const now = new Date();
      let periodEnd: Date;
      
      if (payment.plan_id === 'monthly') {
        periodEnd = new Date(now.getTime());
        periodEnd.setMonth(periodEnd.getMonth() + 1);
      } else {
        periodEnd = new Date(now.getTime());
        periodEnd.setFullYear(periodEnd.getFullYear() + 1);
      }

      // Kiểm tra subscription hiện tại
      const { data: existingSub } = await supabaseAdmin
        .from('subscriptions')
        .select('*')
        .eq('user_id', payment.user_id)
        .single();

      if (existingSub) {
        // Gia hạn subscription
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
            plan_id: payment.plan_id,
            current_period_start: now.toISOString(),
            current_period_end: newEnd.toISOString(),
          })
          .eq('id', existingSub.id);
      } else {
        // Tạo subscription mới
        await supabaseAdmin
          .from('subscriptions')
          .insert({
            id: crypto.randomUUID(),
            user_id: payment.user_id,
            status: 'active',
            plan_id: payment.plan_id,
            current_period_start: now.toISOString(),
            current_period_end: periodEnd.toISOString(),
            created: now.toISOString(),
          });
      }

      return NextResponse.json({
        success: true,
        status: 'completed',
        message: 'Payment verified successfully'
      });
    }

    // Không tìm thấy giao dịch khớp
    return NextResponse.json({
      success: false,
      status: 'pending',
      message: 'Payment not found. Please ensure you transferred the correct amount with the correct content.'
    });

  } catch (error) {
    console.error('Verify payment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

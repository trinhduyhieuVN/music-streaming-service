import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// API kiểm tra trạng thái thanh toán
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get('paymentId');
    const transactionCode = searchParams.get('transactionCode');

    if (!paymentId && !transactionCode) {
      return NextResponse.json(
        { error: 'paymentId or transactionCode required' },
        { status: 400 }
      );
    }

    const supabase = createRouteHandlerClient({ cookies });

    // Kiểm tra user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Tìm payment
    let query = supabase
      .from('payments')
      .select('*')
      .eq('user_id', user.id);

    if (paymentId) {
      query = query.eq('id', paymentId);
    } else if (transactionCode) {
      query = query.eq('transaction_code', transactionCode);
    }

    const { data: payment, error } = await query.single();

    if (error || !payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    // Kiểm tra hết hạn
    const isExpired = new Date(payment.expires_at) < new Date() && payment.status === 'pending';

    return NextResponse.json({
      success: true,
      payment: {
        id: payment.id,
        status: isExpired ? 'expired' : payment.status,
        transactionCode: payment.transaction_code,
        amount: payment.amount,
        planId: payment.plan_id,
        paidAt: payment.paid_at,
        expiresAt: payment.expires_at,
      }
    });

  } catch (error) {
    console.error('Check payment status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

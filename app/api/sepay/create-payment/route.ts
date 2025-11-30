import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { PREMIUM_PLANS, generateTransactionCode, TRANSACTION_EXPIRY_MINUTES } from '@/constants/sepay';

// API tạo đơn thanh toán Premium
export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Kiểm tra user đã đăng nhập
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { planId } = body;

    // Validate plan
    const plan = PREMIUM_PLANS.find(p => p.id === planId);
    if (!plan) {
      return NextResponse.json(
        { error: 'Invalid plan' },
        { status: 400 }
      );
    }

    // Kiểm tra user đã có subscription active chưa
    const { data: existingSub } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (existingSub && new Date(existingSub.current_period_end) > new Date()) {
      return NextResponse.json(
        { error: 'Already have active subscription', subscription: existingSub },
        { status: 400 }
      );
    }

    // Hủy các pending payment cũ của user
    await supabase
      .from('payments')
      .update({ status: 'cancelled' })
      .eq('user_id', user.id)
      .eq('status', 'pending');

    // Tạo transaction code unique
    const transactionCode = generateTransactionCode(user.id, planId);
    
    // Tính thời gian hết hạn
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + TRANSACTION_EXPIRY_MINUTES);

    // Tạo payment record
    const { data: payment, error: createError } = await supabase
      .from('payments')
      .insert({
        user_id: user.id,
        plan_id: planId,
        amount: plan.price,
        transaction_code: transactionCode,
        status: 'pending',
        expires_at: expiresAt.toISOString(),
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (createError) {
      console.error('Failed to create payment:', createError);
      return NextResponse.json(
        { error: 'Failed to create payment' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      payment: {
        id: payment.id,
        transactionCode,
        amount: plan.price,
        planName: plan.name,
        expiresAt: expiresAt.toISOString(),
      }
    });

  } catch (error) {
    console.error('Create payment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

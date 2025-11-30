-- =============================================
-- SEPAY PAYMENTS TABLE
-- Chạy SQL này trong Supabase SQL Editor
-- =============================================

-- Tạo bảng payments để lưu các giao dịch thanh toán
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL,
  amount INTEGER NOT NULL,
  transaction_code TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled', 'expired')),
  
  -- Thông tin sau khi thanh toán thành công (từ SePay webhook)
  sepay_transaction_id TEXT,
  sepay_reference_code TEXT,
  paid_amount INTEGER,
  paid_at TIMESTAMPTZ,
  
  -- Metadata
  note TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index cho performance
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_transaction_code ON payments(transaction_code);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- RLS Policies
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Policy cho user đọc payments của chính họ
DROP POLICY IF EXISTS "Users can view own payments" ON payments;
CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT
  USING (auth.uid() = user_id);

-- Policy cho user tạo payments (thông qua API có auth)
DROP POLICY IF EXISTS "Users can create own payments" ON payments;
CREATE POLICY "Users can create own payments"
  ON payments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy cho service role update (webhook xử lý)
DROP POLICY IF EXISTS "Service role can update payments" ON payments;
CREATE POLICY "Service role can update payments"
  ON payments FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Cập nhật bảng subscriptions để thêm plan_id nếu chưa có
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'subscriptions' AND column_name = 'plan_id'
  ) THEN
    ALTER TABLE subscriptions ADD COLUMN plan_id TEXT;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'subscriptions' AND column_name = 'current_period_start'
  ) THEN
    ALTER TABLE subscriptions ADD COLUMN current_period_start TIMESTAMPTZ;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'subscriptions' AND column_name = 'current_period_end'
  ) THEN
    ALTER TABLE subscriptions ADD COLUMN current_period_end TIMESTAMPTZ;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'subscriptions' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE subscriptions ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
  END IF;
END $$;

-- Tạo function auto-expire payments
CREATE OR REPLACE FUNCTION expire_pending_payments()
RETURNS void AS $$
BEGIN
  UPDATE payments
  SET status = 'expired', updated_at = NOW()
  WHERE status = 'pending'
  AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Optional: Tạo scheduled job để tự động expire payments (nếu dùng pg_cron)
-- SELECT cron.schedule('expire-payments', '*/5 * * * *', 'SELECT expire_pending_payments()');

COMMENT ON TABLE payments IS 'Bảng lưu các giao dịch thanh toán qua SePay';

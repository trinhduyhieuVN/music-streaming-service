-- Migration: Fix subscriptions table for SePay
-- Date: 2026-01-06
-- Description: Add plan_id field and update subscriptions table for SePay compatibility

-- Step 1: Add plan_id column if not exists
ALTER TABLE subscriptions 
ADD COLUMN IF NOT EXISTS plan_id TEXT;

-- Step 2: Update existing subscriptions to have default plan_id
UPDATE subscriptions 
SET plan_id = 'monthly' 
WHERE plan_id IS NULL AND status = 'active';

-- Step 3: Create index for plan_id
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan_id ON subscriptions(plan_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_status ON subscriptions(user_id, status);

-- Step 4: Verify the changes
-- You can check with: SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'subscriptions';

-- Note: This migration is backward compatible with Stripe subscriptions

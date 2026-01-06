# 🔧 Hướng dẫn Fix Lỗi Payment SePay

## ❌ Vấn đề
Chuyển khoản thành công nhưng không nhận được Premium vì:
1. Database `subscriptions` table thiếu field `plan_id`
2. Webhook code insert subscription thất bại do schema không khớp
3. Không có proper error handling

## ✅ Giải pháp

### Bước 1: Chạy Migration SQL
Vào **Supabase Dashboard** → **SQL Editor** → Paste và chạy file:
```
supabase_migration_sepay_fix.sql
```

Hoặc chạy manual:
```sql
-- Add plan_id column
ALTER TABLE subscriptions 
ADD COLUMN IF NOT EXISTS plan_id TEXT;

-- Update existing subscriptions
UPDATE subscriptions 
SET plan_id = 'monthly' 
WHERE plan_id IS NULL AND status = 'active';

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan_id ON subscriptions(plan_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_status ON subscriptions(user_id, status);
```

### Bước 2: Kiểm tra Webhook Code
File đã được update: `app/api/sepay/webhook/route.ts`

Thay đổi chính:
- ✅ Thêm error handling cho query subscription
- ✅ Generate UUID cho subscription ID
- ✅ Update cả `plan_id` khi extend subscription
- ✅ Log chi tiết hơn để debug

### Bước 3: Test Lại Payment

1. **Tạo payment mới:**
   - Login vào app
   - Chọn Premium plan
   - Copy transaction code

2. **Chuyển khoản:**
   - Mở app ngân hàng
   - Chuyển đúng số tiền
   - **QUAN TRỌNG:** Nhập đúng nội dung CK (transaction code)

3. **Kiểm tra logs:**
   ```bash
   # Trong terminal của Next.js app
   # Sẽ thấy log:
   # - "SePay Webhook received: ..."
   # - "Transaction code found: SPM..."
   # - "Payment processed successfully for user: ..."
   # - "New subscription created for user: ..." HOẶC "Subscription extended..."
   ```

4. **Verify trong Supabase:**
   ```sql
   -- Check payment status
   SELECT * FROM payments 
   WHERE status = 'completed' 
   ORDER BY created_at DESC 
   LIMIT 5;

   -- Check subscription
   SELECT * FROM subscriptions 
   WHERE user_id = 'YOUR_USER_ID'
   AND status = 'active';
   ```

### Bước 4: Nếu Vẫn Lỗi

#### Debug Webhook:
1. Check webhook có được gọi không:
   ```bash
   curl https://your-domain.vercel.app/api/sepay/webhook
   # Response: {"status":"ok","message":"SePay webhook endpoint is active"}
   ```

2. Check environment variables:
   ```bash
   # Trong .env.local
   NEXT_PUBLIC_SUPABASE_URL=your_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # QUAN TRỌNG!
   SEPAY_API_KEY=your_sepay_key (optional)
   ```

3. Test manual webhook:
   ```bash
   curl -X POST https://your-domain.vercel.app/api/sepay/webhook \
     -H "Content-Type: application/json" \
     -d '{
       "id": 12345,
       "gateway": "MB Bank",
       "transactionDate": "2026-01-06T10:00:00Z",
       "accountNumber": "0342722059",
       "content": "SPM123456ABCD",
       "transferType": "in",
       "transferAmount": 2000,
       "referenceCode": "REF123"
     }'
   ```

## 📋 Checklist
- [ ] Chạy migration SQL thành công
- [ ] Restart Next.js app
- [ ] Test payment mới
- [ ] Check logs trong terminal
- [ ] Verify subscription trong Supabase
- [ ] Refresh page và check Premium status

## 🐛 Common Issues

### Issue 1: "Failed to create subscription"
**Solution:** Check `SUPABASE_SERVICE_ROLE_KEY` trong env variables

### Issue 2: "Payment not found"
**Solution:** 
- Check transaction code có đúng format không (SPM/SPY)
- Check nội dung CK có chứa transaction code không

### Issue 3: "Insufficient amount"
**Solution:** Số tiền chuyển phải >= số tiền plan (2000 hoặc 29000)

### Issue 4: Webhook không được gọi
**Solution:**
- Check SePay webhook URL configuration
- Check domain có public không (localhost sẽ không work)
- Dùng ngrok để test local: `ngrok http 3000`

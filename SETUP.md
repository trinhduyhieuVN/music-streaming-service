# 🚀 Setup Guide - Music Streaming Service

Hướng dẫn chi tiết để chạy dự án trên máy của bạn.

## 📋 Yêu cầu hệ thống

- **Node.js**: Phiên bản 18 trở lên ([Tải tại đây](https://nodejs.org/))
- **Git**: Để clone repository ([Tải tại đây](https://git-scm.com/))
- **Trình duyệt**: Chrome, Firefox, Edge, Safari
- **Supabase account**: Miễn phí ([Đăng ký tại đây](https://supabase.com))

## 📥 Bước 1: Clone Repository

```bash
# Clone dự án về máy
git clone https://github.com/YOUR_USERNAME/spotify-fullstack.git

# Di chuyển vào thư mục dự án
cd spotify-fullstack
```

## 📦 Bước 2: Cài đặt Dependencies

```bash
# Cài đặt tất cả packages cần thiết
npm install

# Hoặc nếu bạn dùng yarn
yarn install
```

⏰ **Thời gian:** Khoảng 2-5 phút tùy tốc độ mạng

## 🗄️ Bước 3: Setup Supabase Database

### 3.1. Tạo Project Supabase

1. Truy cập [supabase.com](https://supabase.com) và đăng nhập
2. Click **"New Project"**
3. Điền thông tin:
   - **Name**: `music-streaming` (hoặc tên bạn thích)
   - **Database Password**: Tạo password mạnh (lưu lại password này!)
   - **Region**: Chọn gần bạn nhất (ví dụ: Southeast Asia)
4. Click **"Create new project"**
5. Đợi 2-3 phút để Supabase khởi tạo database

### 3.2. Lấy API Keys

1. Vào project vừa tạo
2. Sidebar: **Settings** → **API**
3. Copy 3 thông tin sau:

   📋 **Project URL**
   ```
   https://xxxxxxxxxxxxx.supabase.co
   ```

   📋 **anon public** (trong phần Project API keys)
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

   📋 **service_role** (trong phần Project API keys)
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

> ⚠️ **Quan trọng**: `service_role` key rất nhạy cảm, không được share hoặc commit lên Git!

### 3.3. Chạy SQL Schema

1. Trong Supabase Dashboard, sidebar: **SQL Editor**
2. Click **"New query"**
3. Mở file `supabase_schema_complete.sql` trong dự án
4. Copy toàn bộ nội dung và paste vào SQL Editor
5. Click **"Run"** hoặc nhấn `Ctrl + Enter`
6. Đợi cho đến khi thấy ✅ "Success"

**Script này sẽ tạo:**
- ✅ Tất cả tables (songs, playlists, albums, artists, etc.)
- ✅ Row Level Security (RLS) policies
- ✅ Storage buckets (songs, images)
- ✅ Indexes để tăng performance

### 3.4. Kiểm tra Storage

1. Sidebar: **Storage**
2. Bạn sẽ thấy 2 buckets:
   - `songs` - Lưu file nhạc
   - `images` - Lưu ảnh bìa, avatar

3. **Quan trọng**: Đảm bảo cả 2 buckets là **Public**
   - Click vào từng bucket
   - Click icon ⚙️ → **Public bucket** → Bật ON

## 🔑 Bước 4: Cấu hình Environment Variables

### 4.1. Tạo file .env.local

```bash
# Copy file template
cp .env.example .env.local
```

### 4.2. Điền thông tin vào .env.local

Mở file `.env.local` và điền các thông tin đã copy ở bước 3.2:

```env
# ===== SUPABASE (BẮT BUỘC) =====
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ===== SEPAY PAYMENT (TÙY CHỌN) =====
# Chỉ cần nếu bạn muốn tính năng thanh toán
# Để trống = app vẫn chạy bình thường, chỉ không có payment
SEPAY_API_KEY=
SEPAY_ACCOUNT_ID=

# ===== APP CONFIG =====
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> 💡 **Lưu ý**: Nếu không cần payment, cứ để trống `SEPAY_API_KEY` và `SEPAY_ACCOUNT_ID`

## 👨‍💼 Bước 5: Cấu hình Admin (Tùy chọn)

Nếu bạn muốn có quyền admin (quản lý bài hát, xóa bài hát của người khác):

1. Mở file: `constants/admin.ts`
2. Thêm email của bạn:

```typescript
export const ADMIN_EMAILS = [
  'trinhduyhieu239@gmail.com',
  'your-email@gmail.com',  // ← Thêm email của bạn vào đây
];
```

> ⚠️ **Quan trọng**: Email phải trùng với email bạn dùng để đăng ký tài khoản

## ▶️ Bước 6: Chạy Development Server

```bash
npm run dev
```

Bạn sẽ thấy:
```
✓ Ready in 2.5s
○ Local:   http://localhost:3000
```

## 🌐 Bước 7: Mở trình duyệt

Truy cập: **http://localhost:3000**

Bạn sẽ thấy trang chủ của ứng dụng! 🎉

## 🎯 Bước 8: Tạo tài khoản và test

### 8.1. Đăng ký tài khoản

1. Click **"Sign Up"** hoặc **"Get Started"**
2. Chọn:
   - **Email/Password**: Điền email và mật khẩu
   - **Google OAuth**: Đăng nhập bằng Google

3. Kiểm tra email để xác nhận (nếu dùng email/password)

### 8.2. Upload bài hát đầu tiên

1. Click nút **"+"** ở sidebar
2. Điền thông tin:
   - **Title**: Tên bài hát
   - **Artist**: Tên ca sĩ
   - **Choose song**: Chọn file .mp3
   - **Choose image**: Chọn ảnh bìa
3. Click **"Create"**
4. Đợi upload xong → Bài hát xuất hiện trong Library!

### 8.3. Tạo playlist

1. Sidebar → Click **"Create Playlist"**
2. Đặt tên playlist
3. Thêm bài hát vào playlist

### 8.4. Test các tính năng

- ✅ Phát nhạc, tua, điều chỉnh âm lượng
- ✅ Tìm kiếm bài hát
- ✅ Like bài hát
- ✅ Xem lịch sử nghe nhạc
- ✅ Tạo album, artist

## 🔧 Troubleshooting - Khắc phục lỗi

### ❌ Lỗi: "Error loading songs"

**Nguyên nhân**: Chưa chạy SQL schema hoặc thiếu RLS policies

**Giải pháp**:
1. Vào Supabase → SQL Editor
2. Chạy lại file `supabase_schema_complete.sql`
3. Refresh trang

---

### ❌ Lỗi: "Upload failed" khi upload nhạc

**Nguyên nhân**: Storage buckets chưa public

**Giải pháp**:
1. Supabase → Storage
2. Click vào bucket `songs` và `images`
3. Settings → Bật **Public bucket**
4. Thử upload lại

---

### ❌ Lỗi: "Invalid API key"

**Nguyên nhân**: Sai Supabase credentials trong `.env.local`

**Giải pháp**:
1. Mở `.env.local`
2. Copy lại chính xác từ Supabase → Settings → API
3. Không có khoảng trống thừa
4. Restart dev server: `Ctrl + C` rồi `npm run dev`

---

### ❌ Admin features không hiện

**Nguyên nhân**: Email chưa được thêm vào `constants/admin.ts`

**Giải pháp**:
1. Thêm email vào `constants/admin.ts`
2. **Đăng xuất** và **đăng nhập lại**
3. Vào `/manage` để thấy trang quản lý

---

### ❌ Port 3000 đã được sử dụng

**Giải pháp**:
```bash
# Chạy trên port khác
npm run dev -- -p 3001
```

Hoặc tắt app đang chạy trên port 3000

---

## 📱 Deploy lên Production

### Deploy lên Vercel (Khuyến nghị)

1. Push code lên GitHub (nếu chưa có)
2. Truy cập [vercel.com](https://vercel.com)
3. **Import Project** → Chọn repo GitHub
4. **Environment Variables**: Thêm tất cả biến trong `.env.local`
5. Click **Deploy**

⏰ **Thời gian**: Khoảng 3-5 phút

> 💡 **Lưu ý**: Nhớ update `NEXT_PUBLIC_APP_URL` thành domain Vercel của bạn

---

## 🎓 Học thêm

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

## 💡 Tips

### Cải thiện performance
```bash
# Xóa cache và build lại
rm -rf .next
npm run build
npm run start
```

### Xem logs database
- Supabase → Logs → Postgres Logs

### Backup database
- Supabase → Database → Backups

---

## 📞 Hỗ trợ

Nếu gặp vấn đề không giải quyết được:

1. Kiểm tra lại từng bước trong hướng dẫn
2. Xem phần Troubleshooting ở trên
3. Tạo issue trên GitHub repo

---

**Chúc bạn setup thành công! 🎉**

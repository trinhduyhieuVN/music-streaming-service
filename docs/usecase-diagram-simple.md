# Use Case Diagram - Music Streaming Service

## Actors (Tác nhân)

### 👤 Guest (Khách)
- Chỉ có thể **xem** nội dung
- Không thể tương tác (play, like, upload, etc.)
- Phải đăng nhập để sử dụng các tính năng

### 👤 User (Người dùng đã đăng nhập)
- Nghe nhạc
- Upload bài hát
- Tạo và quản lý playlist
- Like bài hát
- Tìm kiếm và duyệt nội dung
- Xem lịch sử nghe nhạc
- Đăng ký Premium

### 👤 Premium User (Người dùng Premium)
- Kế thừa tất cả quyền của User
- Không quảng cáo
- Chất lượng âm thanh cao
- Tính năng Premium độc quyền

### 👤 Admin (Quản trị viên)
- Kế thừa tất cả quyền của User
- Quản lý người dùng
- Quản lý nội dung
- Xem thống kê hệ thống

### 🏦 Payment System (SePay)
- Hệ thống thanh toán bên ngoài
- Xử lý giao dịch chuyển khoản
- Gửi webhook xác nhận thanh toán

---

## Mô tả 5 Use Case Chính

### 1. 🔐 Use Case: User Authentication (Xác thực người dùng)

**Mô tả**: Cho phép người dùng đăng ký, đăng nhập và quản lý phiên làm việc

**Actor**: User, Premium User, Admin

**Luồng chính**:
1. User truy cập trang chủ
2. Chọn "Sign Up" hoặc "Login"
3. Nhập thông tin (Email/Password hoặc OAuth)
4. Hệ thống xác thực và tạo session
5. Chuyển hướng đến trang chủ với trạng thái đã đăng nhập

**Use cases con**:
- Sign Up (Đăng ký)
- Login (Đăng nhập) - **<<include>>** Validate Credentials
- OAuth Login (Google, GitHub) - **<<extend>>** Login
- Logout (Đăng xuất)

**Relationships**:
- Login **<<include>>** Validate Credentials
- OAuth Login **<<extend>>** Login
- Sign Up **<<include>>** Validate Email

**File liên quan**:
- `components/AuthModal.tsx`
- `hooks/useAuthModal.ts`
- Supabase Auth

---

### 2. 🎵 Use Case: Play Music (Nghe nhạc)

**Mô tả**: Người dùng có thể phát nhạc và điều khiển trình phát

**Actor**: User, Premium User, Admin

**Luồng chính**:
1. User chọn bài hát từ thư viện/playlist/tìm kiếm
2. Click Play
3. Trình phát bắt đầu phát nhạc
4. User có thể: Play/Pause, Next/Previous, Adjust Volume, Seek Progress
5. Nhạc phát liên tục khi chuyển trang

**Use cases con**:
- Play/Pause Song - **<<include>>** Load Audio
- Next/Previous Track
- Adjust Volume
- Seek Progress
- View Queue
- Add to Queue - **<<extend>>** Play Song

**Relationships**:
- Play Song **<<include>>** Load Audio
- Play Song **<<include>>** Update History
- Add to Queue **<<extend>>** Play Song
- View Queue **<<extend>>** Play Song

**File liên quan**:
- `components/Player.tsx`
- `components/PlayerContent.tsx`
- `components/SeekBar.tsx`
- `hooks/usePlayer.ts`
- `hooks/useOnPlay.ts`

---

### 3. 📚 Use Case: Manage Library (Quản lý thư viện)

**Mô tả**: Người dùng quản lý bài hát, playlist và nội dung yêu thích

**Actor**: User, Premium User, Admin

**Luồng chính**:
1. User truy cập Library
2. Chọn hành động:
   - Upload Song (tải bài hát mới)
   - Create Playlist (tạo playlist)
   - Add to Playlist (thêm bài hát vào playlist)
   - Like/Unlike Song (yêu thích bài hát)
3. Hệ thống cập nhật database
4. Hiển thị thông báo thành công

**Use cases con**:
- Upload Song - **<<include>>** Validate File
- Create Playlist - **<<include>>** Generate Playlist Color
- Edit Playlist
- Delete Playlist - **<<include>>** Confirm Delete
- Add/Remove Song from Playlist
- Like/Unlike Song
- View Liked Songs
- Delete Song - **<<include>>** Confirm Delete

**Relationships**:
- Upload Song **<<include>>** Validate File Format
- Upload Song **<<include>>** Upload to Storage
- Create Playlist **<<include>>** Generate Playlist Color
- Delete Playlist **<<include>>** Confirm Delete
- Delete Song **<<include>>** Confirm Delete
- Add to Playlist **<<extend>>** Create Playlist (nếu chưa có playlist)

**File liên quan**:
- `components/Library.tsx`
- `components/UploadModal.tsx`
- `components/PlaylistModal.tsx`
- `components/AddToPlaylistModal.tsx`
- `components/LikeButton.tsx`
- `actions/playlistActions.ts`

---

### 4. 🔍 Use Case: Search & Browse (Tìm kiếm & Duyệt nội dung)

**Mô tả**: Người dùng tìm kiếm và duyệt nhạc theo nhiều tiêu chí

**Actor**: User, Premium User, Admin

**Luồng chính**:
1. User nhập từ khóa tìm kiếm hoặc chọn danh mục
2. Hệ thống tìm kiếm trong database
3. Hiển thị kết quả theo:
   - Songs (bài hát)
   - Albums (album)
   - Artists (nghệ sĩ)
   - Genres (thể loại)
4. User click vào kết quả để phát hoặc xem chi tiết

**Use cases con**:
- Search Songs - **<<include>>** Query Database
- Browse by Album
- Browse by Artist
- Browse by Genre
- Advanced Search - **<<extend>>** Search Songs
- View Listening History

**Relationships**:
- Search Songs **<<include>>** Query Database
- Advanced Search **<<extend>>** Search Songs
- Search Songs **<<extend>>** Play Song (khi click kết quả)
- Browse by Album **<<extend>>** Play Song
- Browse by Artist **<<extend>>** Play Song
- Browse by Genre **<<extend>>** Play Song

**File liên quan**:
- `components/SearchInput.tsx`
- `components/AdvancedSearch.tsx`
- `components/AlbumItem.tsx`
- `components/ArtistItem.tsx`
- `components/GenreList.tsx`
- `actions/getSongs.ts`
- `actions/getSongsByTitle.ts`
- `actions/getAlbums.ts`
- `actions/getArtists.ts`

---

### 5. 💳 Use Case: Subscribe Premium (Đăng ký Premium)

**Mô tả**: Người dùng đăng ký gói Premium qua thanh toán SePay/VietQR

**Actor**: User, Payment System (SePay)

**Luồng chính**:
1. User chọn "Go Premium"
2. Xem các gói Premium (Monthly/Yearly)
3. Chọn gói và xác nhận
4. Hệ thống tạo mã QR thanh toán (VietQR)
5. User quét mã QR và chuyển khoản
6. SePay gửi webhook xác nhận thanh toán
7. Hệ thống kích hoạt Premium
8. User nhận quyền truy cập Premium

**Use cases con**:
- View Premium Plans
- Subscribe Premium - **<<include>>** Generate QR Payment
- Generate QR Payment - **<<include>>** Create Transaction Code
- Process Payment - **<<include>>** Verify Transaction
- Activate Subscription - **<<include>>** Update User Role
- Cancel Subscription - **<<include>>** Confirm Cancel

**Relationships**:
- Subscribe Premium **<<include>>** View Premium Plans
- Subscribe Premium **<<include>>** Generate QR Payment
- Generate QR Payment **<<include>>** Create Transaction Code
- Process Payment **<<include>>** Verify Transaction
- Process Payment **<<include>>** Activate Subscription
- Activate Subscription **<<include>>** Update User Role
- Cancel Subscription **<<extend>>** View Subscription (có thể hủy từ trang quản lý)

**File liên quan**:
- `components/SubscribeModal.tsx`
- `components/SubscribeModalSepay.tsx`
- `actions/getActiveProductsWithPrices.ts`
- `supabase_payments.sql`

---

## Mô hình quan hệ tổng hợp

### Include Relationships (Bắt buộc)
```
Login <<include>> Validate Credentials
Sign Up <<include>> Validate Email
Play Song <<include>> Load Audio
Play Song <<include>> Update History
Upload Song <<include>> Validate File Format
Upload Song <<include>> Upload to Storage
Create Playlist <<include>> Generate Playlist Color
Delete Playlist <<include>> Confirm Delete
Delete Song <<include>> Confirm Delete
Search Songs <<include>> Query Database
Subscribe Premium <<include>> View Premium Plans
Subscribe Premium <<include>> Generate QR Payment
Generate QR Payment <<include>> Create Transaction Code
Process Payment <<include>> Verify Transaction
Process Payment <<include>> Activate Subscription
Activate Subscription <<include>> Update User Role
```

### Extend Relationships (Tùy chọn)
```
OAuth Login <<extend>> Login
Advanced Search <<extend>> Search Songs
Search Songs <<extend>> Play Song
Browse by Album <<extend>> Play Song
Browse by Artist <<extend>> Play Song
Browse by Genre <<extend>> Play Song
Add to Queue <<extend>> Play Song
View Queue <<extend>> Play Song
Add to Playlist <<extend>> Create Playlist
Cancel Subscription <<extend>> View Subscription
```

### Generalization (Kế thừa)
```
Premium User --|> User (kế thừa tất cả use cases của User)
Admin --|> User (kế thừa tất cả use cases của User)
```

---

## Actor - Use Case Mapping (Đầy đủ)

| Use Case | User | Premium User | Admin | Payment System |
|----------|:----:|:------------:|:-----:|:--------------:|
| **Authentication** |
| Sign Up | ✓ | ✓ | ✓ | |
| Login | ✓ | ✓ | ✓ | |
| OAuth Login | ✓ | ✓ | ✓ | |
| Logout | ✓ | ✓ | ✓ | |
| **Play Music** |
| Play/Pause Song | ✓ | ✓ | ✓ | |
| Next/Previous Track | ✓ | ✓ | ✓ | |
| Adjust Volume | ✓ | ✓ | ✓ | |
| Seek Progress | ✓ | ✓ | ✓ | |
| View Queue | ✓ | ✓ | ✓ | |
| Add to Queue | ✓ | ✓ | ✓ | |
| **Library Management** |
| Upload Song | ✓ | ✓ | ✓ | |
| Create Playlist | ✓ | ✓ | ✓ | |
| Edit Playlist | ✓ | ✓ | ✓ | |
| Delete Playlist | ✓ | ✓ | ✓ | |
| Add to Playlist | ✓ | ✓ | ✓ | |
| Like/Unlike Song | ✓ | ✓ | ✓ | |
| View Liked Songs | ✓ | ✓ | ✓ | |
| Delete Song | ✓ | ✓ | ✓ | |
| **Search & Browse** |
| Search Songs | ✓ | ✓ | ✓ | |
| Browse by Album | ✓ | ✓ | ✓ | |
| Browse by Artist | ✓ | ✓ | ✓ | |
| Browse by Genre | ✓ | ✓ | ✓ | |
| Advanced Search | ✓ | ✓ | ✓ | |
| View History | ✓ | ✓ | ✓ | |
| **Premium Subscription** |
| View Premium Plans | ✓ | ✓ | ✓ | |
| Subscribe Premium | ✓ | | ✓ | |
| Process Payment | | | | ✓ |
| Activate Subscription | | | | ✓ |
| Cancel Subscription | | ✓ | ✓ | |
| **Admin Only** |
| Manage Users | | | ✓ | |
| Manage Content | | | ✓ | |
| View Analytics | | | ✓ | |

---

## Tech Stack cho Use Cases

| Use Case | Technologies |
|----------|-------------|
| Authentication | Supabase Auth, OAuth |
| Play Music | React Audio API, usePlayer hook |
| Library Management | Supabase Storage, PostgreSQL |
| Search & Browse | PostgreSQL Full-text Search |
| Premium Subscription | SePay API, Supabase Webhooks |

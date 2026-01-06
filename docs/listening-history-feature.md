# Listening History Feature

## 📝 Mô tả

Tính năng Listening History cho phép người dùng xem lại lịch sử các bài hát đã nghe, được tự động lưu khi phát nhạc.

## ✨ Tính năng

### 1. **Tự động lưu lịch sử**
- Mỗi khi bài hát bắt đầu phát, hệ thống tự động lưu vào listening history
- Lưu timestamp chính xác thời điểm phát

### 2. **Xem lịch sử**
- Truy cập qua link "History" trong sidebar
- Hiển thị danh sách bài hát đã nghe gần đây
- Nhóm theo ngày: Today, Yesterday, và các ngày cụ thể

### 3. **Thông tin hiển thị**
- Tên bài hát, nghệ sĩ
- Thời gian phát (giờ:phút)
- Ảnh cover
- Nút Like trực tiếp

### 4. **Tương tác**
- Click vào bài hát để phát lại
- Like/Unlike trực tiếp từ history
- Tự động cập nhật real-time

## 🗂️ Cấu trúc File

```
app/
  history/
    page.tsx          # Trang chính hiển thị listening history
    loading.tsx       # Loading state
    
components/
  HistoryContent.tsx  # Component hiển thị danh sách lịch sử
  Sidebar.tsx         # Thêm link History vào navigation
  PlayerContent.tsx   # Tích hợp tự động lưu history
  ui/
    skeleton.tsx      # Skeleton loading component
    
actions/
  getListeningHistory.ts         # Lấy lịch sử từ database
  listeningHistoryActions.ts     # Actions: add, clear history
  
libs/
  utils.ts           # Utility functions (cn)
```

## 🔧 Cách sử dụng

### Xem lịch sử
1. Click vào "History" trong sidebar
2. Xem danh sách bài hát đã nghe, được nhóm theo ngày
3. Click vào bài hát để phát lại

### Phát nhạc (tự động lưu)
1. Phát bất kỳ bài hát nào
2. Hệ thống tự động lưu vào listening history
3. Không cần thao tác thủ công

### Quản lý lịch sử
- Lịch sử được sắp xếp theo thời gian mới nhất
- Giới hạn 50 bài hát gần nhất
- Có thể mở rộng thêm tính năng xóa lịch sử

## 🎨 UI/UX

### Responsive Design
- Desktop: Hiển thị đầy đủ thông tin với time stamps
- Mobile: Ẩn time stamps, tập trung vào bài hát

### Grouping
- **Today**: Bài hát hôm nay
- **Yesterday**: Bài hát hôm qua  
- **Date**: Các ngày cụ thể với format đẹp

### Visual Feedback
- Hover effects trên mỗi bài hát
- Smooth transitions
- Loading states với skeleton UI

## 🔐 Security

- Row Level Security (RLS) enabled
- User chỉ xem được lịch sử của mình
- Authentication required

## 📊 Database Schema

```sql
listening_history:
  - id: UUID (primary key)
  - user_id: UUID (foreign key -> auth.users)
  - song_id: UUID (foreign key -> songs)
  - played_at: TIMESTAMPTZ
```

## 🚀 Future Enhancements

- [ ] Thêm filter theo thời gian (Last 7 days, Last month, etc.)
- [ ] Xóa lịch sử (clear all hoặc xóa từng item)
- [ ] Export lịch sử ra file
- [ ] Thống kê: Most played songs, listening time
- [ ] Search trong lịch sử
- [ ] Pagination cho danh sách dài

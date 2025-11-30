# 🎵 Music Streaming Service - Công Nghệ Sử Dụng

## 📋 Tổng Quan Dự Án

**Music Streaming Service** là ứng dụng nghe nhạc trực tuyến được xây dựng với các công nghệ hiện đại, cung cấp trải nghiệm người dùng mượt mà và tính năng đầy đủ.

---

## 🛠️ Technology Stack

### 1. Frontend

#### **Next.js 13.4** (App Router)
![Next.js](https://img.shields.io/badge/Next.js-13.4-black?style=for-the-badge&logo=next.js)

- **Mô tả**: Framework React fullstack với Server-Side Rendering (SSR) và Static Site Generation (SSG)
- **Lý do chọn**:
  - App Router mới với React Server Components
  - Tối ưu SEO với SSR
  - File-based routing đơn giản
  - API Routes tích hợp sẵn
  - Image Optimization tự động
- **Phiên bản**: 13.4.x

#### **React 18**
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)

- **Mô tả**: Thư viện JavaScript để xây dựng giao diện người dùng
- **Lý do chọn**:
  - Component-based architecture
  - Virtual DOM cho hiệu suất cao
  - Hooks API hiện đại
  - Concurrent Features trong React 18
- **Phiên bản**: 18.x

#### **TypeScript**
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)

- **Mô tả**: Superset của JavaScript với static typing
- **Lý do chọn**:
  - Type safety giảm bugs
  - IntelliSense tốt hơn trong IDE
  - Refactoring an toàn
  - Documentation tự động qua types
- **Phiên bản**: 5.x

#### **Tailwind CSS**
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?style=for-the-badge&logo=tailwind-css)

- **Mô tả**: Utility-first CSS framework
- **Lý do chọn**:
  - Rapid UI development
  - Consistent design system
  - Responsive design dễ dàng
  - Bundle size nhỏ (purge unused CSS)
  - Dark mode support
- **Phiên bản**: 3.x

---

### 2. Backend & Database

#### **Supabase**
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)

- **Mô tả**: Open-source Firebase alternative với PostgreSQL
- **Các tính năng sử dụng**:
  - **PostgreSQL Database**: Cơ sở dữ liệu quan hệ mạnh mẽ
  - **Authentication**: Đăng nhập/đăng ký với email, OAuth
  - **Storage**: Lưu trữ file nhạc và hình ảnh
  - **Row Level Security (RLS)**: Bảo mật dữ liệu ở cấp row
  - **Realtime**: Cập nhật dữ liệu realtime (subscriptions)
- **Lý do chọn**:
  - Free tier hào phóng
  - PostgreSQL mạnh mẽ
  - SDK cho JavaScript/TypeScript
  - Dashboard quản lý trực quan

#### **PostgreSQL**
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?style=for-the-badge&logo=postgresql)

- **Mô tả**: Hệ quản trị cơ sở dữ liệu quan hệ mã nguồn mở
- **Lý do chọn**:
  - ACID compliance
  - JSON support (JSONB)
  - Full-text search
  - Extensible với functions/triggers

---

### 3. Authentication

#### **Supabase Auth**
- **Mô tả**: Hệ thống xác thực tích hợp của Supabase
- **Phương thức hỗ trợ**:
  - Email/Password
  - Magic Link
  - OAuth Providers (Google, GitHub, etc.)
- **Tính năng**:
  - JWT tokens
  - Session management
  - Row Level Security integration

---

### 4. Payment Integration

#### **SePay (VietQR)**
![SePay](https://img.shields.io/badge/SePay-VietQR-blue?style=for-the-badge)

- **Mô tả**: Cổng thanh toán Việt Nam qua chuyển khoản ngân hàng
- **Cách hoạt động**:
  - Tạo mã QR VietQR
  - Người dùng quét QR chuyển khoản
  - SePay gửi webhook khi nhận tiền
  - Hệ thống tự động kích hoạt Premium
- **Lý do chọn**:
  - Phù hợp thị trường Việt Nam
  - Không cần thẻ tín dụng
  - Tích hợp đơn giản qua webhook
  - Hỗ trợ tất cả ngân hàng Việt Nam

#### **VietQR**
- **Mô tả**: Tiêu chuẩn QR code cho chuyển khoản ngân hàng tại Việt Nam
- **API**: `img.vietqr.io` để generate QR code

---

### 5. State Management

#### **Zustand**
![Zustand](https://img.shields.io/badge/Zustand-4.0-brown?style=for-the-badge)

- **Mô tả**: Thư viện state management nhẹ cho React
- **Sử dụng cho**:
  - Player state (current song, playlist, volume)
  - Modal states (auth, upload, subscribe)
  - User preferences
- **Lý do chọn**:
  - API đơn giản
  - Bundle size nhỏ (~1KB)
  - Không cần Provider wrapper
  - TypeScript support tốt

---

### 6. UI Components & Libraries

#### **Radix UI**
- **Mô tả**: Unstyled, accessible UI primitives
- **Components sử dụng**:
  - Dialog (Modal)
  - Slider (Volume, Seek bar)
  - Toast notifications

#### **React Icons**
- **Mô tả**: Thư viện icon phổ biến
- **Icon sets**: Font Awesome, Heroicons, etc.

#### **React Hot Toast**
- **Mô tả**: Toast notifications đẹp và nhẹ
- **Sử dụng**: Thông báo success/error

#### **React Hook Form**
- **Mô tả**: Form handling với performance tối ưu
- **Sử dụng**: Upload form, Auth forms

---

### 7. Audio Player

#### **use-sound**
- **Mô tả**: React hook cho audio playback
- **Tính năng**:
  - Play/Pause control
  - Volume control
  - Seek functionality

#### **HTML5 Audio API**
- **Mô tả**: Native browser audio API
- **Sử dụng**: Custom player controls

---

### 8. Development Tools

#### **ESLint**
![ESLint](https://img.shields.io/badge/ESLint-8.0-4B32C3?style=for-the-badge&logo=eslint)

- **Mô tả**: Linting tool cho JavaScript/TypeScript
- **Config**: Next.js recommended rules

#### **Prettier**
- **Mô tả**: Code formatter
- **Sử dụng**: Consistent code style

#### **PostCSS**
- **Mô tả**: CSS transformer
- **Plugins**: Tailwind CSS, Autoprefixer

---

### 9. Deployment & DevOps

#### **Vercel** (Recommended)
![Vercel](https://img.shields.io/badge/Vercel-Deploy-black?style=for-the-badge&logo=vercel)

- **Mô tả**: Platform tối ưu cho Next.js
- **Tính năng**:
  - Zero-config deployment
  - Automatic HTTPS
  - Edge Functions
  - Preview deployments

#### **ngrok** (Development)
- **Mô tả**: Tunnel localhost ra internet
- **Sử dụng**: Test webhook SePay locally

---

## 📊 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                         │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    Next.js Frontend                      │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │    │
│  │  │  React   │  │ Tailwind │  │  Zustand │  │ use-    │ │    │
│  │  │Components│  │   CSS    │  │  Store   │  │ sound   │ │    │
│  │  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Next.js API Routes                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ /api/sepay/* │  │ /api/webhooks│  │ Server Actions       │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         SUPABASE                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  PostgreSQL  │  │     Auth     │  │      Storage         │  │
│  │   Database   │  │   (JWT)      │  │  (Songs, Images)     │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                             │
│  ┌──────────────┐  ┌──────────────┐                             │
│  │    SePay     │  │   VietQR     │                             │
│  │  (Payment)   │  │  (QR Code)   │                             │
│  └──────────────┘  └──────────────┘                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
spotify-fullstack/
├── app/                    # Next.js 13 App Router
│   ├── (site)/            # Main site routes
│   ├── account/           # Account page
│   ├── album/             # Album pages
│   ├── artist/            # Artist pages
│   ├── playlist/          # Playlist pages
│   ├── search/            # Search page
│   ├── api/               # API Routes
│   │   └── sepay/         # SePay payment APIs
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
├── actions/               # Server actions (data fetching)
├── hooks/                 # Custom React hooks
├── providers/             # Context providers
├── libs/                  # Utility libraries
├── constants/             # Constants & configs
├── types/                 # TypeScript types
└── public/                # Static assets
```

---

## 🔧 Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# SePay (Optional)
SEPAY_API_KEY=your_sepay_api_key
```

---

## 📈 Performance Optimizations

1. **Image Optimization**: Next.js Image component với lazy loading
2. **Code Splitting**: Automatic với Next.js App Router
3. **SSR/SSG**: Server-side rendering cho SEO và performance
4. **CSS Purging**: Tailwind CSS loại bỏ unused styles
5. **Caching**: Supabase query caching
6. **Audio Streaming**: Progressive loading cho file nhạc

---

## 🔒 Security Features

1. **Row Level Security (RLS)**: Supabase policies bảo vệ dữ liệu
2. **JWT Authentication**: Secure token-based auth
3. **HTTPS**: Enforced trong production
4. **Input Validation**: Server-side validation
5. **CORS**: Configured cho API routes

---

## 📚 References

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [SePay API Documentation](https://docs.sepay.vn)
- [VietQR Documentation](https://vietqr.io/danh-sach-api)

---

*Document Version: 1.0*  
*Last Updated: November 2025*

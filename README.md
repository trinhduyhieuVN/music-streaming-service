# 🎵 Music Streaming Service

A modern, full-featured music streaming platform built with Next.js 13, React, Supabase, and Tailwind CSS.

![Next.js](https://img.shields.io/badge/Next.js-13.4-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?style=flat-square&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase)

## ✨ Features

### 🎧 Music Player
- Play/Pause, Next/Previous track controls
- Seek bar with progress tracking
- Volume control with mute toggle
- Continuous playback across pages

### 📚 Library Management
- Upload songs with metadata (title, artist, album, genre)
- Create and manage playlists
- Like/favorite songs
- Browse by albums, artists, genres

### 👤 User Features
- Authentication (Email/Password, OAuth)
- Personal library with uploaded songs
- **Listening History** - Automatically track and view recently played songs
  - Auto-save when playing songs
  - Grouped by date (Today, Yesterday, specific dates)
  - Real-time updates
  - Quick replay from history
- Premium subscription system

### 💳 Payment Integration (Vietnam)
- SePay integration with VietQR
- QR code bank transfer payments
- Automatic subscription activation via webhook
- Monthly and yearly premium plans

### 🎨 UI/UX
- Modern, responsive design
- Dark theme optimized for music
- Smooth animations and transitions
- Mobile-friendly interface

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 13.4 (App Router) |
| Frontend | React 18, TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| Authentication | Supabase Auth |
| Storage | Supabase Storage |
| State Management | Zustand |
| Payment | SePay (VietQR) |
| Audio | use-sound, HTML5 Audio API |

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── (site)/            # Main pages
│   ├── account/           # User account
│   ├── album/             # Album pages
│   ├── artist/            # Artist pages
│   ├── playlist/          # Playlist pages
│   ├── genre/             # Genre pages
│   └── api/               # API routes
├── components/            # React components
├── actions/               # Server actions
├── hooks/                 # Custom hooks
├── providers/             # Context providers
├── constants/             # Constants & configs
├── libs/                  # Utilities
└── types/                 # TypeScript types
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** or **yarn** (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))
- **Supabase account** ([Sign up](https://supabase.com))

### Installation

#### 1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/spotify-fullstack.git
cd spotify-fullstack
```

#### 2. **Install dependencies**
```bash
npm install
```

#### 3. **Set up Supabase**

##### 3.1. Create a new Supabase project
- Go to [supabase.com](https://supabase.com)
- Click "New Project"
- Fill in project details and create

##### 3.2. Get your credentials
- Go to Project Settings → API
- Copy:
  - `Project URL` (NEXT_PUBLIC_SUPABASE_URL)
  - `anon public` key (NEXT_PUBLIC_SUPABASE_ANON_KEY)
  - `service_role` key (SUPABASE_SERVICE_ROLE_KEY) ⚠️ Keep secret!

##### 3.3. Set up database schema
- Go to SQL Editor in Supabase
- Run the SQL file: `supabase_schema_complete.sql`
- This will create all tables, RLS policies, and storage buckets

##### 3.4. Set up Storage
Storage buckets should be auto-created by the SQL script:
- `songs` - for audio files (public)
- `images` - for album/artist images (public)

If not, create them manually:
- Go to Storage → New bucket
- Create `songs` and `images` as **public** buckets

#### 4. **Set up environment variables**

Create `.env.local` file in the root directory:
```bash
cp .env.example .env.local
```

Fill in your credentials in `.env.local`:
```env
# Supabase Configuration (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# SePay Payment (OPTIONAL - only if you want payment features)
SEPAY_API_KEY=your_sepay_api_key
SEPAY_ACCOUNT_ID=your_bank_account_number

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Note:** Payment features are optional. The app will work without SePay credentials.

#### 5. **Configure Admin Access** (Optional)

To access admin features (manage songs, delete songs):
- Open `constants/admin.ts`
- Add your email to the `ADMIN_EMAILS` array:
  ```typescript
  export const ADMIN_EMAILS = [
    'your-email@gmail.com',  // Add your email here
  ];
  ```

#### 6. **Run development server**
```bash
npm run dev
```

#### 7. **Open browser**

Navigate to [http://localhost:3000](http://localhost:3000)

---

### 🎉 First Steps After Setup

1. **Create an account** - Sign up with email or Google OAuth
2. **Upload a song** - Click the "+" button in the sidebar
3. **Create a playlist** - Go to Library and create your first playlist
4. **Explore features** - Try searching, creating albums, browsing artists

### 🔧 Troubleshooting

#### Database errors
- Make sure you ran `supabase_schema_complete.sql` completely
- Check if storage buckets `songs` and `images` are public

#### Upload not working
- Verify storage buckets are set to **public**
- Check Supabase service role key is correct

#### Admin features not showing
- Add your email to `constants/admin.ts`
- Sign out and sign back in

#### Payment features not working
- Payment is optional - you can skip SePay setup
- To enable: Get API key from [SePay](https://my.sepay.vn)

## 📊 Database Schema

### Main Tables
- `songs` - Song metadata and file references
- `albums` - Album information
- `artists` - Artist profiles
- `playlists` - User playlists
- `playlist_songs` - Playlist-song relationships
- `liked_songs` - User favorites
- `listening_history` - Track listening history
- `subscriptions` - Premium subscriptions
- `payments` - Payment transactions (SePay)
- `customers` - Stripe customer mapping

### Storage Buckets
- `songs` - Audio files (.mp3, .wav, etc.)
- `images` - Album art, artist avatars

> **Full schema:** See `supabase_schema_complete.sql` for complete table definitions and RLS policies

## 🔒 Security

- Row Level Security (RLS) on all tables
- JWT-based authentication
- Secure file uploads to Supabase Storage
- Environment variables for sensitive data

## 📱 Screenshots

*Coming soon*

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

**Trịnh Duy Hiếu**

---

⭐ Star this repo if you found it helpful!

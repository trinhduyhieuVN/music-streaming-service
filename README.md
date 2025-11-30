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
- Listening history tracking
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

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/music-streaming-service.git
   cd music-streaming-service
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

4. **Set up database**
   
   Run the SQL scripts in Supabase SQL Editor:
   - Create tables for songs, albums, artists, playlists
   - Set up Row Level Security policies
   - (Optional) Run `supabase_payments.sql` for payment system

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Open browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Database Schema

### Main Tables
- `users` - User profiles
- `songs` - Song metadata and file references
- `albums` - Album information
- `artists` - Artist profiles
- `playlists` - User playlists
- `playlist_songs` - Playlist-song relationships
- `liked_songs` - User favorites
- `subscriptions` - Premium subscriptions
- `payments` - Payment transactions

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

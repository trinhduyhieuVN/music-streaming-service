-- =============================================
-- SPOTIFY FULLSTACK - DATABASE SCHEMA
-- Chạy trong Supabase SQL Editor
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- MAIN TABLES
-- =============================================

-- Artists Table
CREATE TABLE IF NOT EXISTS artists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  image_path TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Albums Table
CREATE TABLE IF NOT EXISTS albums (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
  image_path TEXT,
  release_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Songs Table
CREATE TABLE IF NOT EXISTS songs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  title TEXT NOT NULL,
  song_path TEXT NOT NULL,
  image_path TEXT,
  album_id UUID REFERENCES albums(id) ON DELETE SET NULL,
  artist_id UUID REFERENCES artists(id) ON DELETE SET NULL,
  genre TEXT,
  duration INTEGER,
  play_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Playlists Table
CREATE TABLE IF NOT EXISTS playlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  image_path TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Playlist Songs (Junction Table)
CREATE TABLE IF NOT EXISTS playlist_songs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  playlist_id UUID NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
  song_id UUID NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
  position INTEGER NOT NULL DEFAULT 0,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  UNIQUE(playlist_id, song_id)
);

-- Liked Songs Table
CREATE TABLE IF NOT EXISTS liked_songs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  song_id UUID NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  UNIQUE(user_id, song_id)
);

-- Listening History
CREATE TABLE IF NOT EXISTS listening_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  song_id UUID NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
  played_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- =============================================
-- STRIPE/PAYMENT TABLES
-- =============================================

-- Products Table (Premium Plans)
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  active BOOLEAN DEFAULT true,
  name TEXT NOT NULL,
  description TEXT,
  image TEXT,
  metadata JSONB
);

-- Prices Table
CREATE TABLE IF NOT EXISTS prices (
  id TEXT PRIMARY KEY,
  product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
  active BOOLEAN DEFAULT true,
  description TEXT,
  unit_amount BIGINT,
  currency TEXT CHECK (char_length(currency) = 3),
  type TEXT CHECK (type IN ('one_time', 'recurring')),
  interval TEXT CHECK (interval IN ('day', 'week', 'month', 'year')),
  interval_count INTEGER,
  trial_period_days INTEGER,
  metadata JSONB
);

-- Customers Table
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT UNIQUE
);

-- Subscriptions Table
CREATE TABLE IF NOT EXISTS subscriptions (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT,
  metadata JSONB,
  price_id TEXT REFERENCES prices(id),
  quantity INTEGER,
  cancel_at_period_end BOOLEAN,
  created TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  current_period_start TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  ended_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()),
  cancel_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()),
  canceled_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()),
  trial_start TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()),
  trial_end TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW())
);

-- Payments Table (SePay)
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL,
  amount INTEGER NOT NULL,
  transaction_code TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled', 'expired')),
  sepay_transaction_id TEXT,
  sepay_reference_code TEXT,
  paid_amount INTEGER,
  paid_at TIMESTAMPTZ,
  note TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================

CREATE INDEX IF NOT EXISTS idx_songs_user_id ON songs(user_id);
CREATE INDEX IF NOT EXISTS idx_songs_album_id ON songs(album_id);
CREATE INDEX IF NOT EXISTS idx_songs_artist_id ON songs(artist_id);
CREATE INDEX IF NOT EXISTS idx_songs_genre ON songs(genre);
CREATE INDEX IF NOT EXISTS idx_playlists_user_id ON playlists(user_id);
CREATE INDEX IF NOT EXISTS idx_playlist_songs_playlist_id ON playlist_songs(playlist_id);
CREATE INDEX IF NOT EXISTS idx_playlist_songs_song_id ON playlist_songs(song_id);
CREATE INDEX IF NOT EXISTS idx_liked_songs_user_id ON liked_songs(user_id);
CREATE INDEX IF NOT EXISTS idx_liked_songs_song_id ON liked_songs(song_id);
CREATE INDEX IF NOT EXISTS idx_listening_history_user_id ON listening_history(user_id);
CREATE INDEX IF NOT EXISTS idx_listening_history_song_id ON listening_history(song_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_transaction_code ON payments(transaction_code);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlist_songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE liked_songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE listening_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Artists Policies
DROP POLICY IF EXISTS "Public artists are viewable by everyone" ON artists;
CREATE POLICY "Public artists are viewable by everyone"
  ON artists FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Artists can be inserted by authenticated users" ON artists;
CREATE POLICY "Artists can be inserted by authenticated users"
  ON artists FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Albums Policies
DROP POLICY IF EXISTS "Public albums are viewable by everyone" ON albums;
CREATE POLICY "Public albums are viewable by everyone"
  ON albums FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Albums can be inserted by authenticated users" ON albums;
CREATE POLICY "Albums can be inserted by authenticated users"
  ON albums FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Songs Policies
DROP POLICY IF EXISTS "Songs are viewable by everyone" ON songs;
CREATE POLICY "Songs are viewable by everyone"
  ON songs FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert their own songs" ON songs;
CREATE POLICY "Users can insert their own songs"
  ON songs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own songs" ON songs;
CREATE POLICY "Users can update their own songs"
  ON songs FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own songs" ON songs;
CREATE POLICY "Users can delete their own songs"
  ON songs FOR DELETE
  USING (auth.uid() = user_id);

-- Playlists Policies
DROP POLICY IF EXISTS "Public playlists are viewable by everyone" ON playlists;
CREATE POLICY "Public playlists are viewable by everyone"
  ON playlists FOR SELECT
  USING (is_public = true OR auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own playlists" ON playlists;
CREATE POLICY "Users can insert their own playlists"
  ON playlists FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own playlists" ON playlists;
CREATE POLICY "Users can update their own playlists"
  ON playlists FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own playlists" ON playlists;
CREATE POLICY "Users can delete their own playlists"
  ON playlists FOR DELETE
  USING (auth.uid() = user_id);

-- Playlist Songs Policies
DROP POLICY IF EXISTS "Playlist songs are viewable if playlist is accessible" ON playlist_songs;
CREATE POLICY "Playlist songs are viewable if playlist is accessible"
  ON playlist_songs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM playlists 
      WHERE playlists.id = playlist_songs.playlist_id 
      AND (playlists.is_public = true OR playlists.user_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can manage songs in their playlists" ON playlist_songs;
CREATE POLICY "Users can manage songs in their playlists"
  ON playlist_songs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM playlists 
      WHERE playlists.id = playlist_songs.playlist_id 
      AND playlists.user_id = auth.uid()
    )
  );

-- Liked Songs Policies
DROP POLICY IF EXISTS "Users can view their own liked songs" ON liked_songs;
CREATE POLICY "Users can view their own liked songs"
  ON liked_songs FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own liked songs" ON liked_songs;
CREATE POLICY "Users can insert their own liked songs"
  ON liked_songs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own liked songs" ON liked_songs;
CREATE POLICY "Users can delete their own liked songs"
  ON liked_songs FOR DELETE
  USING (auth.uid() = user_id);

-- Listening History Policies
DROP POLICY IF EXISTS "Users can view their own listening history" ON listening_history;
CREATE POLICY "Users can view their own listening history"
  ON listening_history FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own listening history" ON listening_history;
CREATE POLICY "Users can insert their own listening history"
  ON listening_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Products Policies
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  USING (true);

-- Prices Policies
DROP POLICY IF EXISTS "Prices are viewable by everyone" ON prices;
CREATE POLICY "Prices are viewable by everyone"
  ON prices FOR SELECT
  USING (true);

-- Customers Policies
DROP POLICY IF EXISTS "Users can view own customer data" ON customers;
CREATE POLICY "Users can view own customer data"
  ON customers FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own customer data" ON customers;
CREATE POLICY "Users can insert own customer data"
  ON customers FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Subscriptions Policies
DROP POLICY IF EXISTS "Users can view own subscriptions" ON subscriptions;
CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Payments Policies
DROP POLICY IF EXISTS "Users can view own payments" ON payments;
CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own payments" ON payments;
CREATE POLICY "Users can create own payments"
  ON payments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role can update payments" ON payments;
CREATE POLICY "Service role can update payments"
  ON payments FOR UPDATE
  USING (auth.role() = 'service_role');

-- =============================================
-- STORAGE BUCKETS
-- =============================================

-- Create storage buckets (run in Storage > Policies section or via Dashboard)
-- Bucket: songs
-- Bucket: images

-- Storage Policies for 'songs' bucket
-- Allow authenticated users to upload
-- Allow public read access

-- Storage Policies for 'images' bucket  
-- Allow authenticated users to upload
-- Allow public read access

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for playlists
DROP TRIGGER IF EXISTS update_playlists_updated_at ON playlists;
CREATE TRIGGER update_playlists_updated_at
  BEFORE UPDATE ON playlists
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for payments
DROP TRIGGER IF EXISTS update_payments_updated_at ON payments;
CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- SAMPLE DATA (Optional)
-- =============================================

-- Insert sample premium plans
INSERT INTO products (id, active, name, description) VALUES
  ('prod_monthly', true, 'Premium Monthly', 'Monthly premium subscription'),
  ('prod_yearly', true, 'Premium Yearly', 'Yearly premium subscription with 2 months free')
ON CONFLICT (id) DO NOTHING;

INSERT INTO prices (id, product_id, active, currency, unit_amount, type, interval, interval_count) VALUES
  ('price_monthly', 'prod_monthly', true, 'VND', 59000, 'recurring', 'month', 1),
  ('price_yearly', 'prod_yearly', true, 'VND', 590000, 'recurring', 'year', 1)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- COMPLETE!
-- =============================================
-- Database schema setup complete!
-- Next steps:
-- 1. Set up Storage buckets in Supabase Dashboard
-- 2. Configure Storage policies for public/private access
-- 3. Test connection from your app

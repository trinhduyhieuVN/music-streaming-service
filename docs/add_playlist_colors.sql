-- Add color column to playlists table for custom avatar colors
ALTER TABLE playlists 
ADD COLUMN IF NOT EXISTS color TEXT DEFAULT 'from-purple-700 to-blue-300';

-- Update existing playlists with random colors
DO $$
DECLARE
  playlist_record RECORD;
  colors TEXT[] := ARRAY[
    'from-red-500 to-pink-500',
    'from-purple-500 to-indigo-500',
    'from-blue-500 to-cyan-500',
    'from-green-500 to-emerald-500',
    'from-yellow-500 to-orange-500',
    'from-pink-500 to-rose-500',
    'from-indigo-500 to-purple-500',
    'from-cyan-500 to-blue-500',
    'from-emerald-500 to-teal-500',
    'from-orange-500 to-red-500'
  ];
BEGIN
  FOR playlist_record IN 
    SELECT id FROM playlists WHERE color IS NULL OR color = 'from-purple-700 to-blue-300'
  LOOP
    UPDATE playlists 
    SET color = colors[1 + floor(random() * 10)::int]
    WHERE id = playlist_record.id;
  END LOOP;
END $$;

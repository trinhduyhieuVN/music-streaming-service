// =============================================
// GENRE CONSTANTS - Danh sách thể loại nhạc chuẩn hóa
// =============================================
// Sử dụng `name` để lưu vào database và hiển thị
// Sử dụng `color` cho gradient background trên UI

export const GENRES = [
  // === ROW 1 ===
  { id: 'pop', name: 'Pop', color: 'from-pink-500 to-pink-600', hex: '#EC4899' },
  { id: 'rock', name: 'Rock', color: 'from-red-600 to-red-700', hex: '#DC2626' },
  { id: 'hip-hop', name: 'Hip-Hop', color: 'from-amber-400 to-amber-500', hex: '#F59E0B' },
  { id: 'rnb', name: 'R&B', color: 'from-purple-500 to-purple-600', hex: '#A855F7' },
  { id: 'edm', name: 'EDM', color: 'from-cyan-400 to-cyan-500', hex: '#22D3EE' },
  { id: 'electronic', name: 'Electronic', color: 'from-blue-500 to-blue-600', hex: '#3B82F6' },
  
  // === ROW 2 ===
  { id: 'jazz', name: 'Jazz', color: 'from-orange-500 to-orange-600', hex: '#F97316' },
  { id: 'classical', name: 'Classical', color: 'from-stone-500 to-stone-600', hex: '#78716C' },
  { id: 'country', name: 'Country', color: 'from-yellow-600 to-yellow-700', hex: '#CA8A04' },
  { id: 'latin', name: 'Latin', color: 'from-orange-500 to-red-500', hex: '#F97316' },
  { id: 'metal', name: 'Metal', color: 'from-slate-600 to-slate-700', hex: '#475569' },
  { id: 'blues', name: 'Blues', color: 'from-teal-500 to-teal-600', hex: '#14B8A6' },
  
  // === ROW 3 ===
  { id: 'folk', name: 'Folk', color: 'from-lime-600 to-lime-700', hex: '#65A30D' },
  { id: 'reggae', name: 'Reggae', color: 'from-green-500 to-yellow-500', hex: '#22C55E' },
  { id: 'funk', name: 'Funk', color: 'from-fuchsia-500 to-purple-500', hex: '#D946EF' },
  { id: 'soul', name: 'Soul', color: 'from-rose-500 to-rose-600', hex: '#F43F5E' },
  { id: 'disco', name: 'Disco', color: 'from-violet-500 to-violet-600', hex: '#8B5CF6' },
  { id: 'k-pop', name: 'K-Pop', color: 'from-pink-400 to-fuchsia-500', hex: '#F472B6' },
  
  // === ROW 4 ===
  { id: 'v-pop', name: 'V-Pop', color: 'from-red-500 to-orange-500', hex: '#EF4444' },
  { id: 'j-pop', name: 'J-Pop', color: 'from-rose-500 to-pink-500', hex: '#F43F5E' },
  { id: 'c-pop', name: 'C-Pop', color: 'from-red-500 to-amber-500', hex: '#EF4444' },
  { id: 'ballad', name: 'Ballad', color: 'from-blue-500 to-indigo-500', hex: '#3B82F6' },
  { id: 'indie', name: 'Indie', color: 'from-emerald-500 to-teal-500', hex: '#10B981' },
  { id: 'acoustic', name: 'Acoustic', color: 'from-amber-400 to-orange-500', hex: '#F59E0B' },
  
  // === ROW 5 ===
  { id: 'chill', name: 'Chill', color: 'from-sky-400 to-sky-500', hex: '#38BDF8' },
  { id: 'lofi', name: 'Lo-Fi', color: 'from-violet-400 to-purple-500', hex: '#A78BFA' },
  { id: 'rap', name: 'Rap', color: 'from-orange-500 to-orange-600', hex: '#F97316' },
  { id: 'bolero', name: 'Bolero', color: 'from-rose-600 to-rose-700', hex: '#E11D48' },
  { id: 'nhac-tre', name: 'Nhạc Trẻ', color: 'from-pink-500 to-rose-500', hex: '#EC4899' },
  { id: 'nhac-trinh', name: 'Nhạc Trịnh', color: 'from-emerald-500 to-green-500', hex: '#10B981' },
  
  // === SPECIAL ===
  { id: 'soundtrack', name: 'Soundtrack', color: 'from-slate-500 to-slate-600', hex: '#64748B' },
  { id: 'instrumental', name: 'Instrumental', color: 'from-gray-500 to-gray-600', hex: '#6B7280' },
  { id: 'podcast', name: 'Podcast', color: 'from-green-500 to-green-600', hex: '#22C55E' },
] as const;

// Type cho genre name (dùng để type-check)
export type GenreName = typeof GENRES[number]['name'];

// Lấy danh sách tên genre để dùng trong dropdown/select
export const GENRE_NAMES = GENRES.map(g => g.name);

// Hàm helper: Lấy thông tin genre theo tên
export const getGenreByName = (name: string) => {
  return GENRES.find(g => g.name.toLowerCase() === name.toLowerCase());
};

// Hàm helper: Lấy màu gradient theo tên genre
export const getGenreColor = (name: string): string => {
  const genre = getGenreByName(name);
  return genre?.color || 'from-neutral-600 to-neutral-700';
};

// Hàm helper: Lấy màu hex theo tên genre
export const getGenreHex = (name: string): string => {
  const genre = getGenreByName(name);
  return genre?.hex || '#6B7280';
};

// Nhóm genres theo category để hiển thị trên UI
export const GENRE_CATEGORIES = {
  'Popular': ['Pop', 'Rock', 'Hip-Hop', 'R&B', 'EDM', 'Rap'],
  'Asian': ['K-Pop', 'V-Pop', 'J-Pop', 'C-Pop'],
  'Mood': ['Ballad', 'Indie', 'Acoustic', 'Chill', 'Lo-Fi'],
  'Vietnamese': ['Bolero', 'Nhạc Trẻ', 'Nhạc Trịnh'],
  'Classic': ['Jazz', 'Classical', 'Blues', 'Folk', 'Soul'],
  'Electronic': ['Electronic', 'Disco', 'Funk'],
  'Other': ['Soundtrack', 'Instrumental', 'Podcast'],
};

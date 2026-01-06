// Generate consistent color for artist based on their name
export const getAvatarColor = (name: string): string => {
  const colors = [
    '#ef4444', // red-500
    '#dc2626', // red-600
    '#f97316', // orange-500
    '#ea580c', // orange-600
    '#f59e0b', // amber-500
    '#d97706', // amber-600
    '#eab308', // yellow-500
    '#ca8a04', // yellow-600
    '#84cc16', // lime-500
    '#65a30d', // lime-600
    '#22c55e', // green-500
    '#16a34a', // green-600
    '#10b981', // emerald-500
    '#059669', // emerald-600
    '#14b8a6', // teal-500
    '#0d9488', // teal-600
    '#06b6d4', // cyan-500
    '#0891b2', // cyan-600
    '#0ea5e9', // sky-500
    '#0284c7', // sky-600
    '#3b82f6', // blue-500
    '#2563eb', // blue-600
    '#6366f1', // indigo-500
    '#4f46e5', // indigo-600
    '#8b5cf6', // violet-500
    '#7c3aed', // violet-600
    '#a855f7', // purple-500
    '#9333ea', // purple-600
    '#d946ef', // fuchsia-500
    '#c026d3', // fuchsia-600
    '#ec4899', // pink-500
    '#db2777', // pink-600
    '#f43f5e', // rose-500
    '#e11d48', // rose-600
  ];

  // Generate hash from name
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash; // Convert to 32bit integer
  }

  // Get color index
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

// Get initials from artist name
export const getArtistInitials = (name: string, existingInitials: Set<string>): string => {
  if (!name) return '?';

  // Clean and normalize the name
  const cleanName = name.trim().toUpperCase();
  
  // Get first character
  const firstChar = cleanName.charAt(0);
  
  // If first character is unique, use it
  if (!existingInitials.has(firstChar)) {
    return firstChar;
  }
  
  // Otherwise, try first 2 characters
  const twoChars = cleanName.substring(0, 2);
  return twoChars || firstChar;
};

// Helper to track used initials and generate unique ones
export const generateUniqueInitials = (artists: { author: string }[]): Map<string, string> => {
  const initialsMap = new Map<string, string>();
  const usedSingleChars = new Set<string>();
  
  artists.forEach(artist => {
    const name = artist.author;
    const firstChar = name.trim().toUpperCase().charAt(0);
    
    // Check if this first character is already used
    if (!usedSingleChars.has(firstChar)) {
      initialsMap.set(name, firstChar);
      usedSingleChars.add(firstChar);
    } else {
      // Use 2 characters if first char is taken
      const twoChars = name.trim().toUpperCase().substring(0, 2);
      initialsMap.set(name, twoChars);
    }
  });
  
  return initialsMap;
};

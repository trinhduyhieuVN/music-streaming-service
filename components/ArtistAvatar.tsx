import { getAvatarColor } from "@/utils/avatarUtils";

interface ArtistAvatarProps {
  artistName: string;
  initials: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const ArtistAvatar: React.FC<ArtistAvatarProps> = ({
  artistName,
  initials,
  size = 'md'
}) => {
  const backgroundColor = getAvatarColor(artistName);
  
  const sizeMap = {
    sm: { width: 64, height: 64, fontSize: '1.125rem' },
    md: { width: 96, height: 96, fontSize: '1.5rem' },
    lg: { width: 128, height: 128, fontSize: '2.25rem' },
    xl: { width: 160, height: 160, fontSize: '3rem' }
  };

  const sizeStyles = sizeMap[size];

  return (
    <div 
      className="rounded-full flex items-center justify-center font-bold text-white shadow-lg select-none"
      style={{
        width: `${sizeStyles.width}px`,
        height: `${sizeStyles.height}px`,
        backgroundColor: backgroundColor,
        fontSize: sizeStyles.fontSize,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}
    >
      <span style={{ display: 'block', lineHeight: '1' }}>{initials}</span>
    </div>
  );
};

export default ArtistAvatar;

import { useRef } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useImageUpload } from '@/hooks/useImageUpload';

interface AvatarUploadProps {
  currentAvatarUrl?: string;
  userName?: string;
  onAvatarChange: (url: string) => void;
  size?: 'sm' | 'md' | 'lg';
}

export const AvatarUpload = ({ 
  currentAvatarUrl, 
  userName, 
  onAvatarChange,
  size = 'lg'
}: AvatarUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { uploadImage, uploading } = useImageUpload({
    bucket: 'avatars',
    onUploadComplete: onAvatarChange
  });

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await uploadImage(file);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const sizeClasses = {
    sm: 'h-16 w-16',
    md: 'h-24 w-24',
    lg: 'h-32 w-32'
  };

  const buttonSizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10'
  };

  return (
    <div className="relative inline-block">
      <Avatar className={sizeClasses[size]}>
        <AvatarImage src={currentAvatarUrl} alt={userName} />
        <AvatarFallback className="text-lg">
          {userName?.split(' ').map(n => n[0]).join('').toUpperCase() || '?'}
        </AvatarFallback>
      </Avatar>
      
      <Button
        variant="secondary"
        size="icon"
        className={`absolute -bottom-1 -right-1 rounded-full ${buttonSizeClasses[size]} border-2 border-background`}
        onClick={triggerFileSelect}
        disabled={uploading}
      >
        {uploading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Camera className="h-4 w-4" />
        )}
      </Button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};
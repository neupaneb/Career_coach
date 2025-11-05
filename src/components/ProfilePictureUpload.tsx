import { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Camera, X, Loader2, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface ProfilePictureUploadProps {
  currentPicture?: string;
  onUpload: (imageUrl: string) => void;
  isLoading?: boolean;
}

export function ProfilePictureUpload({ currentPicture, onUpload, isLoading = false }: ProfilePictureUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentPicture || null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setError(null);
    setSuccess(false);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreview(result);
      
      // Convert to base64 and upload
      // In a real app, you'd upload to a cloud storage service
      // For now, we'll use base64 as a placeholder
      onUpload(result);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    };
    reader.onerror = () => {
      setError('Failed to read image file');
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setPreview(null);
    setError(null);
    setSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onUpload('');
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-200 bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center flex-shrink-0">
            {preview ? (
              <img 
                src={preview} 
                alt="Profile" 
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <span className="text-white text-2xl font-semibold">?</span>
            )}
          </div>
          {preview && (
            <button
              onClick={handleRemove}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors z-10"
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        <div className="flex flex-col gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClick}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Camera className="h-4 w-4" />
                {preview ? 'Change Photo' : 'Upload Photo'}
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground">
            JPG, PNG or GIF (max 5MB)
          </p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert variant="default">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>Profile picture updated successfully!</AlertDescription>
        </Alert>
      )}
    </div>
  );
}



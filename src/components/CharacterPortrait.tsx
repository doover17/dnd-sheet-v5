import React, { useState, useRef } from 'react';
import { Camera } from 'lucide-react';

interface CharacterPortraitProps {
  imageUrl: string;
  onImageChange: (newImageUrl: string) => void;
}

const CharacterPortrait: React.FC<CharacterPortraitProps> = ({ imageUrl, onImageChange }) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageChange(reader.result as string);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative w-32 h-32 mb-4">
      {imageUrl ? (
        <img src={imageUrl} alt="Character Portrait" className="w-full h-full object-cover rounded-full" />
      ) : (
        <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
          <Camera size={32} className="text-gray-400" />
        </div>
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full"
      >
        <Camera size={16} />
      </button>
      {isUploading && <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">Uploading...</div>}
    </div>
  );
};

export default CharacterPortrait;
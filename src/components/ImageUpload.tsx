import { useState } from "react";
import Image from "next/image";

interface ImageUploadProps {
  currentImage?: string | null;
  onImageChange: (url: string | null) => void;
  onUpload: (file: File) => Promise<string | null>;
  uploading?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
  alt?: string;
  showPlaceholder?: boolean;
}

export default function ImageUpload({
  currentImage,
  onImageChange,
  onUpload,
  uploading = false,
  className = "",
  size = "md",
  alt = "Upload",
  showPlaceholder = true
}: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24", 
    lg: "w-32 h-32"
  };

  const handleFile = async (file: File) => {
    // Validate file
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('Image size must be less than 5MB');
      return;
    }

    const url = await onUpload(file);
    if (url) {
      onImageChange(url);
    } else {
      alert('Failed to upload image. Please try again.');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleRemove = () => {
    onImageChange(null);
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className={`
          ${sizeClasses[size]} 
          rounded-full 
          overflow-hidden 
          border-2 
          ${dragActive ? 'border-gold bg-gold/10' : 'border-gray-300'}
          transition-colors
          cursor-pointer
          group
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        {currentImage ? (
          <div className="relative w-full h-full">
            <Image
              src={currentImage}
              alt={alt}
              fill
              className="object-cover"
              sizes="128px"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className="bg-white text-red-500 rounded-full p-1 hover:bg-red-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ) : showPlaceholder ? (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              {uploading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mx-auto"></div>
              ) : (
                <>
                  <svg className="w-8 h-8 text-gray-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-xs text-gray-500">Add Photo</span>
                </>
              )}
            </div>
          </div>
        ) : null}
        
        {uploading && (
          <div className="absolute inset-0 bg-white/75 rounded-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gold"></div>
          </div>
        )}
      </div>
      
      <input
        id="file-input"
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
        disabled={uploading}
      />
    </div>
  );
}

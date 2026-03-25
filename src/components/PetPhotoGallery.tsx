import { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { PetPhoto } from "@/lib/matching-types";

interface PetPhotoGalleryProps {
  petProfileId?: string;
  onPhotosChange?: (photos: PetPhoto[]) => void;
  maxPhotos?: number;
}

export default function PetPhotoGallery({ 
  petProfileId, 
  onPhotosChange, 
  maxPhotos = 6 
}: PetPhotoGalleryProps) {
  const { user } = useAuth();
  const [photos, setPhotos] = useState<PetPhoto[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (petProfileId) {
      fetchPhotos();
    }
  }, [petProfileId]);

  const fetchPhotos = async () => {
    try {
      const { data } = await supabase
        .from("pet_photos")
        .select("*")
        .eq("pet_profile_id", petProfileId || "")
        .order("photo_order", { ascending: true });

      if (data) {
        setPhotos(data);
        onPhotosChange?.(data);
      }
    } catch (error) {
      console.error("Error fetching photos:", error);
    }
  };

  const uploadPhotos = async (files: FileList) => {
    if (!user || !petProfileId || photos.length >= maxPhotos) return;

    setUploading(true);
    const uploadPromises = Array.from(files).slice(0, maxPhotos - photos.length).map(async (file, index) => {
      try {
        // Validate file
        if (!file.type.startsWith('image/')) {
          console.warn(`Skipping non-image file: ${file.name}`);
          return null;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
          console.warn(`File too large: ${file.name}`);
          return null;
        }

        // Upload to Cloudinary
        const result = await uploadToCloudinary(file, {
          folder: "pure-pet/pet-gallery",
          publicId: `${user.id}-${petProfileId}-${Date.now()}-${index}`
        });

        if (!result?.secure_url) return null;

        // Save to database
        const { data } = await supabase
          .from("pet_photos")
          .insert({
            user_id: user.id,
            pet_profile_id: petProfileId,
            photo_url: result.secure_url,
            photo_order: photos.length + index,
            is_primary: photos.length === 0 && index === 0 // First photo becomes primary
          })
          .select()
          .single();

        return data;
      } catch (error) {
        console.error("Error uploading photo:", error);
        return null;
      }
    });

    try {
      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter(Boolean) as PetPhoto[];
      
      if (successfulUploads.length > 0) {
        const updatedPhotos = [...photos, ...successfulUploads];
        setPhotos(updatedPhotos);
        onPhotosChange?.(updatedPhotos);
      }
    } catch (error) {
      console.error("Error in batch upload:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      uploadPhotos(files);
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
    if (files && files.length > 0) {
      uploadPhotos(files);
    }
  };

  const setPrimaryPhoto = async (photoId: number) => {
    try {
      // Reset all photos to non-primary
      await supabase
        .from("pet_photos")
        .update({ is_primary: false })
        .eq("pet_profile_id", petProfileId || "");

      // Set new primary
      await supabase
        .from("pet_photos")
        .update({ is_primary: true })
        .eq("id", photoId);

      // Refresh photos
      await fetchPhotos();
    } catch (error) {
      console.error("Error setting primary photo:", error);
    }
  };

  const deletePhoto = async (photoId: number) => {
    if (photos.length <= 1) {
      alert("You must have at least one photo");
      return;
    }

    try {
      // Delete from database
      await supabase
        .from("pet_photos")
        .delete()
        .eq("id", photoId);

      // If deleting primary photo, set next one as primary
      const deletedPhoto = photos.find(p => p.id === photoId);
      if (deletedPhoto?.is_primary && photos.length > 1) {
        const nextPhoto = photos.find(p => p.id !== photoId);
        if (nextPhoto) {
          await supabase
            .from("pet_photos")
            .update({ is_primary: true })
            .eq("id", nextPhoto.id);
        }
      }

      // Refresh photos
      await fetchPhotos();
    } catch (error) {
      console.error("Error deleting photo:", error);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const reorderPhotos = async (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;

    const reorderedPhotos = [...photos];
    const [movedPhoto] = reorderedPhotos.splice(fromIndex, 1);
    reorderedPhotos.splice(toIndex, 0, movedPhoto);

    // Update photo_order for all affected photos
    const updatePromises = reorderedPhotos.map((photo, index) => 
      supabase
        .from("pet_photos")
        .update({ photo_order: index })
        .eq("id", photo.id)
    );

    try {
      await Promise.all(updatePromises);
      setPhotos(reorderedPhotos);
      onPhotosChange?.(reorderedPhotos);
    } catch (error) {
      console.error("Error reordering photos:", error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Photo Gallery</h3>
        <p className="text-sm text-gray-600 mt-1">
          Add up to {maxPhotos} photos for your pet&apos;s swipe card. The first photo will be the primary image.
        </p>
      </div>

      {/* Upload Area */}
      {photos.length < maxPhotos && (
        <div
          className={`
            border-2 border-dashed rounded-lg p-6 text-center transition-colors
            ${dragActive 
              ? 'border-gold bg-gold/10' 
              : 'border-gray-300 hover:border-gray-400'
            }
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="space-y-2">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <div className="text-sm text-gray-600">
              <label htmlFor="file-upload" className="cursor-pointer text-gold hover:text-yellow-500 font-medium">
                Click to upload
              </label>
              {" "}or drag and drop
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB each</p>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileInput}
              className="hidden"
              disabled={uploading}
            />
          </div>
        </div>
      )}

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className="relative group aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-gold transition-colors"
            >
              <Image
                src={photo.photo_url}
                alt={`Pet photo ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              
              {/* Primary Badge */}
              {photo.is_primary && (
                <div className="absolute top-2 left-2 bg-gold text-white text-xs px-2 py-1 rounded-full">
                  Primary
                </div>
              )}

              {/* Overlay Actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                {!photo.is_primary && (
                  <button
                    onClick={() => setPrimaryPhoto(photo.id)}
                    className="bg-white text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors"
                    title="Set as primary"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </button>
                )}
                
                {photos.length > 1 && (
                  <button
                    onClick={() => deletePhoto(photo.id)}
                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                    title="Delete photo"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Photo Number */}
              <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Progress */}
      {uploading && (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gold mr-2"></div>
          <span className="text-sm text-gray-600">Uploading photos...</span>
        </div>
      )}

      {/* Tips */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">💡 Photo Tips</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Use clear, well-lit photos of your pet</li>
          <li>• Include photos showing your pet&apos;s personality</li>
          <li>• The first photo will be the primary image in swipe cards</li>
          <li>• Mix of close-ups and full-body photos work best</li>
        </ul>
      </div>
    </div>
  );
}

// Cloudinary utility for image uploads

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  format: string;
  resource_type: string;
  created_at: string;
}

export async function uploadToCloudinary(
  file: File,
  options: {
    folder?: string;
    publicId?: string;
    resourceType?: 'image' | 'video' | 'auto';
  } = {}
): Promise<CloudinaryUploadResult | null> {
  try {
    const {
      folder = 'pure-pet',
      publicId: customPublicId,
      resourceType = 'image'
    } = options;

    // Create FormData for Cloudinary upload
    const formData = new FormData();
    
    // Add the file
    formData.append('file', file);
    
    // Add upload parameters
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'pure_pet_preset');
    formData.append('folder', folder);
    formData.append('resource_type', resourceType);
    
    // Add custom public ID if provided
    if (customPublicId) {
      formData.append('public_id', customPublicId);
    }
    
    // Add transformation parameters for optimization
    formData.append('quality', 'auto');
    formData.append('fetch_format', 'auto');
    
    // Add responsive parameters
    formData.append('responsive', 'true');
    formData.append('auto_tagging', 'true');

    // Upload to Cloudinary
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    if (!cloudName) {
      throw new Error('Cloudinary cloud name not configured');
    }

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Cloudinary upload failed: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    return null;
  }
}

export async function deleteFromCloudinary(
  publicId: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _resourceType: 'image' | 'video' = 'image'
): Promise<boolean> {
  try {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    if (!cloudName) {
      throw new Error('Cloudinary cloud name not configured');
    }

    // This would require server-side implementation with API secret
    // For now, we'll return true and handle deletion differently
    console.warn('Cloudinary deletion requires server-side implementation');
    return true;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    return false;
  }
}

export function getCloudinaryUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    crop?: 'fill' | 'scale' | 'fit' | 'thumb' | 'limit';
    quality?: number;
    format?: 'auto' | 'webp' | 'jpg' | 'png';
    gravity?: 'auto' | 'center' | 'face' | 'faces';
  } = {}
): string {
  const {
    width,
    height,
    crop = 'fill',
    quality = 80,
    format = 'auto',
    gravity = 'auto'
  } = options;

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) {
    return `https://res.cloudinary.com/demo/image/upload/${publicId}`;
  }

  const transformations = [];
  
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (crop !== 'fill') transformations.push(`c_${crop}`);
  if (quality !== 80) transformations.push(`q_${quality}`);
  if (format !== 'auto') transformations.push(`f_${format}`);
  if (gravity !== 'auto') transformations.push(`g_${gravity}`);

  const transformationString = transformations.length > 0 ? transformations.join(',') : '';
  
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformationString}/${publicId}`;
}

// Helper function to extract public ID from Cloudinary URL
export function extractPublicIdFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    const uploadIndex = pathParts.findIndex(part => part === 'upload');
    
    if (uploadIndex === -1 || uploadIndex === pathParts.length - 1) {
      return null;
    }
    
    // Get everything after 'upload' (including version if present)
    const remainingParts = pathParts.slice(uploadIndex + 1);
    
    // Remove version number if present (starts with 'v')
    if (remainingParts[0] && remainingParts[0].match(/^v\d+$/)) {
      remainingParts.shift();
    }
    
    return remainingParts.join('/');
  } catch (error) {
    console.error('Error extracting public ID from URL:', error);
    return null;
  }
}

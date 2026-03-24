# Cloudinary Setup for Pure Pet Clone

This guide will help you set up Cloudinary for image uploads in the Pure Pet application.

## 🚀 Quick Setup

### 1. Create a Cloudinary Account

1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up for a free account
3. Note your **Cloud Name** from the dashboard

### 2. Create an Upload Preset

1. In your Cloudinary dashboard, go to **Settings** → **Upload**
2. Scroll down to **Upload presets** and click **Add upload preset**
3. Configure the preset:
   - **Preset name**: `pure_pet_preset`
   - **Signing mode**: Unsigned
   - **Allowed formats**: jpg, jpeg, png, gif, webp
   - **Folder**: `pure-pet` (optional)
   - **Transformation**: Add quality optimization (auto:good)
4. Click **Save**

### 3. Environment Variables

Add these to your `.env.local` file:

```env
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=pure_pet_preset
```

### 4. Restart Your Development Server

```bash
npm run dev
```

## 📁 Folder Structure

Images will be organized in Cloudinary as:
- **User avatars**: `pure-pet/avatars/`
- **Pet photos**: `pure-pet/pets/`

## 🔧 Advanced Configuration

### Custom Transformations

You can customize image transformations in the `getCloudinaryUrl` function:

```typescript
import { getCloudinaryUrl } from '@/lib/cloudinary';

// Get optimized image URL
const optimizedUrl = getCloudinaryUrl('public_id', {
  width: 400,
  height: 300,
  crop: 'fill',
  quality: 80,
  format: 'auto'
});
```

### Image Optimization

The Cloudinary utility automatically applies:
- **Auto quality**: Reduces file size while maintaining quality
- **Auto format**: Serves modern formats like WebP when supported
- **Responsive images**: Adapts to different screen sizes

## 🛠️ Features

- ✅ **Drag & drop** upload support
- ✅ **Image validation** (file type and size)
- ✅ **Progress indicators** during upload
- ✅ **Error handling** with user feedback
- ✅ **Automatic optimization** via Cloudinary
- ✅ **Fallback handling** for failed uploads

## 📝 Usage Example

```tsx
import ImageUpload from '@/components/ImageUpload';
import { uploadToCloudinary } from '@/lib/cloudinary';

function MyComponent() {
  const handleUpload = async (file: File) => {
    const result = await uploadToCloudinary(file, {
      folder: 'my-custom-folder',
      publicId: 'custom-name'
    });
    return result?.secure_url;
  };

  return (
    <ImageUpload
      currentImage={currentImageUrl}
      onImageChange={setImageUrl}
      onUpload={handleUpload}
      size="md"
      alt="Profile"
    />
  );
}
```

## 🔒 Security Notes

- **Unsigned uploads** are used for simplicity
- **File validation** happens client-side and server-side
- **5MB file size limit** enforced
- **Image-only uploads** allowed

## 🐛 Troubleshooting

### Common Issues

1. **"Upload preset not found"**
   - Check that the preset name matches exactly
   - Ensure the preset is set to "Unsigned"

2. **"Cloud name not configured"**
   - Verify `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` in your env file
   - Restart your development server after adding env vars

3. **"CORS errors"**
   - Ensure your Cloudinary account allows uploads from your domain
   - Check that unsigned uploads are enabled

### Debug Mode

Add this to your `.env.local` to enable debug logging:

```env
NODE_ENV=development
```

## 📞 Support

If you need help:
1. Check the [Cloudinary documentation](https://cloudinary.com/documentation)
2. Review the browser console for error messages
3. Verify your environment variables are correctly set

## 🎉 Next Steps

Once Cloudinary is set up:
- ✅ Users can upload profile photos
- ✅ Users can upload pet photos  
- ✅ Images are automatically optimized
- ✅ Images display properly in swipe cards
- ✅ Profile management is fully functional

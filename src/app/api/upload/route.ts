import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    // Verify Cloudinary is configured
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error('Missing Cloudinary environment variables');
      return NextResponse.json({ error: 'Image upload is not configured. Please set CLOUDINARY environment variables.' }, { status: 500 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Allowed: JPG, PNG, WebP, GIF, SVG' }, { status: 400 });
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Maximum 10MB.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await new Promise<{ secure_url: string; public_id: string; format: string; bytes: number }>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'pure-pet-products',
          resource_type: 'image',
        },
        (error, uploadResult) => {
          if (error || !uploadResult) {
            reject(error || new Error('Upload failed'));
          } else {
            // Extract only serializable fields to avoid circular reference issues
            resolve({
              secure_url: uploadResult.secure_url,
              public_id: uploadResult.public_id,
              format: uploadResult.format,
              bytes: uploadResult.bytes,
            });
          }
        }
      ).end(buffer);
    });

    return NextResponse.json({
      url: result.secure_url,
      public_id: result.public_id,
      filename: file.name,
      size: result.bytes,
      type: file.type,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed';
    console.error('Upload error:', message, error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

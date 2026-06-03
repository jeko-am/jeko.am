import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

const UPLOAD_FOLDER = 'pure-pet-products';

export async function POST() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json(
      { error: 'Image upload is not configured. Please set Cloudinary environment variables.' },
      { status: 500 }
    );
  }

  const timestamp = Math.round(Date.now() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    { folder: UPLOAD_FOLDER, timestamp },
    apiSecret
  );

  return NextResponse.json({
    cloudName,
    apiKey,
    timestamp,
    signature,
    folder: UPLOAD_FOLDER,
  });
}

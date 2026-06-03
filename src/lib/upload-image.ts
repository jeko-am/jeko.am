const ACCEPTED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
]);

function normalizeUploadError(message: string) {
  if (/request entity too large|payload too large/i.test(message)) {
    return 'The server rejected this image upload because the request was too large.';
  }

  return message || 'Upload failed';
}

type UploadResponse = {
  url?: string;
  secure_url?: string;
  public_id?: string;
  error?: string | { message?: string };
};

type UploadSignature = {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  signature: string;
  folder: string;
  error?: string;
};

class DirectUploadUnavailableError extends Error {}

async function readUploadResponse(res: Response) {
  const text = await res.text();
  if (!text) return {};

  try {
    return JSON.parse(text) as UploadResponse;
  } catch {
    return { error: text };
  }
}

function getUploadErrorMessage(data: UploadResponse, fallback = 'Upload failed') {
  if (typeof data.error === 'string') return data.error;
  if (data.error?.message) return data.error.message;
  return fallback;
}

async function uploadDirectToCloudinary(file: File) {
  const signatureRes = await fetch('/api/upload/signature', { method: 'POST' });
  const signatureData = (await signatureRes.json().catch(() => ({}))) as UploadSignature;

  if (!signatureRes.ok) {
    throw new DirectUploadUnavailableError(signatureData.error || 'Direct upload is not configured');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', signatureData.apiKey);
  formData.append('timestamp', String(signatureData.timestamp));
  formData.append('signature', signatureData.signature);
  formData.append('folder', signatureData.folder);

  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`,
    { method: 'POST', body: formData }
  );
  const uploadData = await readUploadResponse(uploadRes);

  if (!uploadRes.ok) {
    throw new Error(normalizeUploadError(getUploadErrorMessage(uploadData)));
  }

  const url = uploadData.secure_url || uploadData.url;
  if (!url) {
    throw new Error('Upload succeeded but no image URL was returned.');
  }

  return url;
}

async function uploadThroughAppServer(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch('/api/upload', { method: 'POST', body: formData });
  const data = await readUploadResponse(res);

  if (!res.ok) {
    throw new Error(normalizeUploadError(getUploadErrorMessage(data)));
  }

  if (!data.url) {
    throw new Error('Upload succeeded but no image URL was returned.');
  }

  return data.url;
}

export async function uploadImageFile(file: File) {
  if (!ACCEPTED_IMAGE_TYPES.has(file.type)) {
    throw new Error('Invalid file type. Allowed: JPG, PNG, WebP, GIF, SVG');
  }

  try {
    return await uploadDirectToCloudinary(file);
  } catch (error) {
    if (!(error instanceof DirectUploadUnavailableError)) {
      throw error;
    }
  }

  return uploadThroughAppServer(file);
}

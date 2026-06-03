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

async function readUploadResponse(res: Response) {
  const text = await res.text();
  if (!text) return {};

  try {
    return JSON.parse(text) as { url?: string; error?: string };
  } catch {
    return { error: text };
  }
}

export async function uploadImageFile(file: File) {
  if (!ACCEPTED_IMAGE_TYPES.has(file.type)) {
    throw new Error('Invalid file type. Allowed: JPG, PNG, WebP, GIF, SVG');
  }

  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch('/api/upload', { method: 'POST', body: formData });
  const data = await readUploadResponse(res);

  if (!res.ok) {
    throw new Error(normalizeUploadError(data.error || 'Upload failed'));
  }

  if (!data.url) {
    throw new Error('Upload succeeded but no image URL was returned.');
  }

  return data.url;
}

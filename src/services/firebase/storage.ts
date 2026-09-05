const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;
const IMGBB_UPLOAD_URL = 'https://api.imgbb.com/1/upload';

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const uploadImage = async (
  file: File,
  _path: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  if (!IMGBB_API_KEY) {
    throw new Error('Image upload key is missing. Please add VITE_IMGBB_API_KEY to .env file.');
  }

  if (onProgress) onProgress(10);

  const base64 = await fileToBase64(file);

  if (onProgress) onProgress(30);

  const formData = new FormData();
  formData.append('key', IMGBB_API_KEY);
  formData.append('image', base64);
  formData.append('name', file.name.replace(/\.[^.]+$/, ''));

  if (onProgress) onProgress(50);

  try {
    const response = await fetch(IMGBB_UPLOAD_URL, {
      method: 'POST',
      body: formData,
    });

    if (onProgress) onProgress(80);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.error?.message || `Upload failed (HTTP ${response.status})`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result?.error?.message || 'Upload failed');
    }

    if (onProgress) onProgress(100);

    return result.data.url;
  } catch (error: any) {
    if (error.message?.includes('fetch')) {
      throw new Error('Network error. Please check your internet connection.');
    }
    throw error;
  }
};

export const deleteImage = async (_imageUrl: string): Promise<void> => {
  // imgbb free plan does not support delete via API
  // Images are temporary and will be auto-deleted
};

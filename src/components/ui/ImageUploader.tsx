import React, { useState, useRef, useEffect } from 'react';
import { Upload, X } from 'lucide-react';
import { uploadImage, deleteImage } from '../../services/firebase/storage';

interface ImageUploaderProps {
  onUploadSuccess: (url: string) => void;
  onUploadStart?: () => void;
  onUploadError?: (error: Error) => void;
  defaultImage?: string;
  storagePath: string;
  className?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onUploadSuccess,
  onUploadStart,
  onUploadError,
  defaultImage,
  storagePath,
  className = ''
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(defaultImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setPreviewUrl(defaultImage || null);
  }, [defaultImage]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      if (onUploadError) onUploadError(new Error("File size exceeds 5MB"));
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      setIsUploading(true);
      setProgress(0);
      if (onUploadStart) onUploadStart();

      const url = await uploadImage(file, storagePath, (p) => setProgress(p));

      if (!controller.signal.aborted) {
        setPreviewUrl(url);
        onUploadSuccess(url);
      }
    } catch (error: any) {
      if (!controller.signal.aborted) {
        const uploadError = error instanceof Error ? error : new Error(error?.message || 'Upload failed');
        if (onUploadError) onUploadError(uploadError);
      }
    } finally {
      if (!controller.signal.aborted) {
        setIsUploading(false);
        setProgress(0);
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = async () => {
    if (previewUrl && previewUrl !== defaultImage) {
      await deleteImage(previewUrl);
    }
    setPreviewUrl(null);
    onUploadSuccess('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`relative ${className}`}>
      {previewUrl ? (
        <div className="relative w-full h-full min-h-[200px] bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
          <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={handleRemove}
            disabled={isUploading}
            className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full transition-colors shadow-lg disabled:opacity-50"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div 
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className="w-full h-full min-h-[200px] border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center bg-gray-800 hover:bg-gray-700 transition-colors cursor-pointer"
        >
          {isUploading ? (
            <div className="text-center w-full px-4">
              <div className="mb-2 text-cricket-green font-medium">Uploading... {Math.round(progress)}%</div>
              <div className="w-full bg-gray-600 rounded-full h-2">
                <div 
                  className="bg-cricket-green h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <>
              <Upload size={32} className="text-gray-400 mb-2" />
              <p className="text-sm text-gray-300 font-medium">Click to upload image</p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
            </>
          )}
        </div>
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg, image/png, image/webp"
        className="hidden"
      />
    </div>
  );
};

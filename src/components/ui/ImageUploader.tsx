import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, AlertCircle, RefreshCw } from 'lucide-react';
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
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [lastFile, setLastFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    setPreviewUrl(defaultImage || null);
  }, [defaultImage]);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const doUpload = async (file: File) => {
    try {
      setUploadError(null);
      setIsUploading(true);
      setProgress(0);
      if (onUploadStart) onUploadStart();

      const url = await uploadImage(file, storagePath, (p) => {
        if (mountedRef.current) setProgress(p);
      });

      if (mountedRef.current) {
        setPreviewUrl(url);
        onUploadSuccess(url);
        setLastFile(null);
      }
    } catch (error: any) {
      if (mountedRef.current) {
        const uploadError = error instanceof Error ? error : new Error(error?.message || 'Upload failed');
        setUploadError(uploadError.message);
        if (onUploadError) onUploadError(uploadError);
        setLastFile(file);
      }
    } finally {
      if (mountedRef.current) {
        setIsUploading(false);
        setProgress(0);
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File size exceeds 5MB");
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    await doUpload(file);
  };

  const handleRetry = async () => {
    if (lastFile) {
      await doUpload(lastFile);
    }
  };

  const handleRemove = async () => {
    if (previewUrl && previewUrl !== defaultImage) {
      await deleteImage(previewUrl);
    }
    setPreviewUrl(null);
    setUploadError(null);
    setLastFile(null);
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
          ) : uploadError ? (
            <div className="text-center px-4">
              <AlertCircle size={32} className="text-red-400 mb-2 mx-auto" />
              <p className="text-sm text-red-400 font-medium mb-3">{uploadError}</p>
              {lastFile && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleRetry(); }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cricket-green hover:bg-[#0c6632] text-white text-sm rounded-md transition-colors"
                >
                  <RefreshCw size={14} />
                  Retry
                </button>
              )}
              <p className="text-xs text-gray-500 mt-3">Click to choose a different file</p>
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

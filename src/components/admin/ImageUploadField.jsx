import React, { useState, useRef } from 'react';
import { uploadImageFile } from '../../lib/imageUpload';

export default function ImageUploadField({
  label,
  value,
  onChange,
  defaultUrl = '',
  helperText = '',
  folder = 'uploads',
  previewHeight = 'h-36',
  aspectRatio = 'aspect-video',
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileProcess = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadError('Vui lòng chọn tệp hình ảnh (.jpg, .png, .webp)');
      return;
    }

    setUploadError('');
    setIsUploading(true);

    try {
      const res = await uploadImageFile(file, folder);
      if (res.success && res.url) {
        onChange(res.url);
      } else {
        setUploadError(res.error || 'Tải ảnh thất bại, vui lòng thử lại.');
      }
    } catch (err) {
      setUploadError('Đã xảy ra lỗi khi xử lý hình ảnh.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
    // Reset file input so same file can be selected again
    e.target.value = '';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleResetDefault = () => {
    if (defaultUrl) {
      onChange(defaultUrl);
      setUploadError('');
    }
  };

  return (
    <div className="space-y-2">
      {/* Field Label & Actions */}
      <div className="flex items-center justify-between gap-2">
        <label className="block text-xs font-bold text-stone-700">
          {label}
        </label>
        <div className="flex items-center gap-2">
          {defaultUrl && value !== defaultUrl && (
            <button
              type="button"
              onClick={handleResetDefault}
              className="text-[11px] text-[#0d631b] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              title="Khôi phục ảnh ban đầu"
            >
              <span className="material-symbols-outlined text-[14px]">history</span>
              <span>Đặt lại ảnh gốc</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-[11px] text-stone-500 hover:text-stone-800 underline cursor-pointer"
          >
            {showUrlInput ? 'Ẩn ô nhập URL' : 'Dán link URL'}
          </button>
        </div>
      </div>

      {/* Main Drag-Drop & Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-4 transition-all ${
          isDragging
            ? 'border-[#0d631b] bg-emerald-50/70 scale-[1.01]'
            : 'border-stone-300 hover:border-stone-400 bg-stone-50/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Image Preview Thumbnail */}
          <div className="relative group shrink-0">
            <div
              className={`w-28 sm:w-32 ${previewHeight} rounded-xl overflow-hidden bg-stone-200 border border-stone-300 shadow-xs flex items-center justify-center relative`}
            >
              {value ? (
                <img
                  src={value}
                  alt={label}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/logo.png';
                  }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-stone-400 p-2 text-center">
                  <span className="material-symbols-outlined text-[32px]">image</span>
                  <span className="text-[10px] mt-1 font-medium">Chưa có ảnh</span>
                </div>
              )}

              {/* Uploading Spinner Overlay */}
              {isUploading && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white">
                  <span className="material-symbols-outlined text-[26px] animate-spin">progress_activity</span>
                  <span className="text-[10px] mt-1 font-bold">Đang nén & tải...</span>
                </div>
              )}
            </div>

            {value && (
              <span className="absolute -bottom-2 -right-1 bg-white border border-stone-200 text-stone-700 text-[10px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                {value.startsWith('data:') ? 'Ảnh máy' : 'URL web'}
              </span>
            )}
          </div>

          {/* Action Buttons & Guidance */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="px-4 py-2 rounded-xl bg-[#0d631b] hover:bg-[#094713] text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[18px]">upload_file</span>
                <span>{value ? 'Đổi ảnh từ máy tính' : 'Chọn ảnh từ máy tính'}</span>
              </button>

              {value && (
                <button
                  type="button"
                  onClick={() => onChange('')}
                  className="px-3 py-2 rounded-xl bg-white hover:bg-stone-100 text-stone-600 border border-stone-300 text-xs font-medium cursor-pointer transition-all"
                  title="Xóa ảnh hiện tại"
                >
                  <span className="material-symbols-outlined text-[16px] text-red-600">delete</span>
                </button>
              )}
            </div>

            <p className="text-[11px] text-stone-500">
              Kéo & thả ảnh trực tiếp vào khung này hoặc bấm nút để chọn ảnh từ máy tính / điện thoại.
            </p>

            {helperText && (
              <p className="text-[11px] text-[#855300] font-medium">
                💡 {helperText}
              </p>
            )}

            {uploadError && (
              <p className="text-xs text-red-600 font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">error</span>
                <span>{uploadError}</span>
              </p>
            )}
          </div>
        </div>

        {/* Collapsible URL Input Field */}
        {showUrlInput && (
          <div className="mt-3 pt-3 border-t border-stone-200 space-y-1 animate-in fade-in duration-150">
            <label className="block text-[11px] font-bold text-stone-600">
              Nhập link ảnh trực tiếp (URL hoặc /logo.png):
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder="https://... hoặc /logo.png"
                className="flex-1 bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0d631b]"
              />
              {value && (
                <a
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs flex items-center justify-center shrink-0"
                  title="Mở ảnh trong tab mới"
                >
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

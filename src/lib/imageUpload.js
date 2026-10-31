import { supabase, isSupabaseConfigured } from './supabase';

/**
 * Nén và tối ưu hóa kích thước hình ảnh bằng HTML5 Canvas trước khi lưu trữ.
 * Giúp giảm dung lượng từ 5MB-10MB (ảnh chụp điện thoại) xuống còn ~60KB-150KB
 * mà vẫn giữ độ nét cao, giúp website tải siêu nhanh và tiết kiệm bộ nhớ.
 */
export async function compressImage(
  file,
  { maxWidth = 1200, maxHeight = 1200, quality = 0.85 } = {}
) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      return reject(new Error('Vui lòng chọn tệp hình ảnh hợp lệ (PNG, JPG, WEBP).'));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Không thể đọc tệp từ thiết bị của bạn.'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Hình ảnh bị lỗi hoặc định dạng không hỗ trợ.'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Giữ đúng tỉ lệ khung hình (aspect ratio)
        if (width > maxWidth || height > maxHeight) {
          if (width / maxWidth > height / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Trình duyệt không hỗ trợ Canvas context 2D.'));
        }

        // Vẽ ảnh lên canvas với kích thước tối ưu
        ctx.drawImage(img, 0, 0, width, height);

        const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(mimeType, quality);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return resolve({ blob: file, dataUrl, width, height });
            }
            resolve({ blob, dataUrl, width, height });
          },
          mimeType,
          quality
        );
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Tải ảnh lên hệ thống:
 * 1. Tự động nén ảnh qua Canvas.
 * 2. Thử tải lên Supabase Storage (bucket 'images').
 * 3. Tự động fallback về Data URL chuẩn nén nếu bucket chưa được tạo hoặc offline.
 */
export async function uploadImageFile(file, folder = 'uploads') {
  try {
    const { blob, dataUrl } = await compressImage(file);

    // Thử tải lên Supabase Storage nếu đã cấu hình
    if (isSupabaseConfigured() && supabase) {
      try {
        const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
        const safeExt = ['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(ext) ? ext : 'jpg';
        const cleanFileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${safeExt}`;

        const { data, error } = await supabase.storage
          .from('images')
          .upload(cleanFileName, blob, {
            cacheControl: '31536000',
            upsert: true,
            contentType: blob.type || 'image/jpeg',
          });

        if (!error && data) {
          const { data: publicUrlData } = supabase.storage
            .from('images')
            .getPublicUrl(cleanFileName);

          if (publicUrlData?.publicUrl) {
            return {
              success: true,
              url: publicUrlData.publicUrl,
              isCloud: true,
            };
          }
        }
      } catch (cloudErr) {
        console.warn('Lưu Supabase Storage chưa khả dụng, tự động lưu ảnh nén Data URL:', cloudErr);
      }
    }

    // Fallback: Sử dụng Data URL đã được Canvas nén tối ưu dung lượng
    return {
      success: true,
      url: dataUrl,
      isCloud: false,
    };
  } catch (err) {
    console.error('Lỗi upload ảnh:', err);
    return {
      success: false,
      error: err.message || 'Không thể xử lý hình ảnh.',
    };
  }
}

const LOGO_STORAGE_KEY = 'school_custom_logo_v1';
export const LOGO_CHANGE_EVENT = 'school_logo_change';

export const getCustomSchoolLogo = (): string | null => {
  try {
    return localStorage.getItem(LOGO_STORAGE_KEY);
  } catch {
    return null;
  }
};

export const saveCustomSchoolLogo = (dataUrl: string): void => {
  try {
    localStorage.setItem(LOGO_STORAGE_KEY, dataUrl);
    window.dispatchEvent(new Event(LOGO_CHANGE_EVENT));
  } catch (err) {
    console.error('Failed to save logo to localStorage:', err);
  }
};

export const resetCustomSchoolLogo = (): void => {
  try {
    localStorage.removeItem(LOGO_STORAGE_KEY);
    window.dispatchEvent(new Event(LOGO_CHANGE_EVENT));
  } catch (err) {
    console.error('Failed to reset logo:', err);
  }
};

/**
 * Optimizes and converts any uploaded image file (JPG, JPEG, PNG, WEBP)
 * to a base64 Data URL, scaling down if larger than maxDim to ensure quick loading
 * and stay well within localStorage quotas.
 */
export const processLogoImageFile = (file: File, maxDim: number = 800): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('กรุณาเลือกไฟล์รูปภาพที่ถูกต้อง (JPG หรือ PNG)'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (!result) {
        reject(new Error('ไม่สามารถอ่านไฟล์รูปภาพได้'));
        return;
      }

      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(result);
          return;
        }

        // Draw image (keep transparency if PNG)
        ctx.drawImage(img, 0, 0, width, height);

        const isPng = file.type === 'image/png';
        const outputType = isPng ? 'image/png' : 'image/jpeg';
        const quality = isPng ? undefined : 0.92;
        const outputDataUrl = canvas.toDataURL(outputType, quality);
        resolve(outputDataUrl);
      };

      img.onerror = () => {
        reject(new Error('ไม่สามารถประมวลผลไฟล์รูปภาพได้'));
      };

      img.src = result;
    };

    reader.onerror = () => reject(new Error('เกิดข้อผิดพลาดในการอ่านไฟล์'));
    reader.readAsDataURL(file);
  });
};

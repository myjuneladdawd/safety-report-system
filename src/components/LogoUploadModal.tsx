import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  X,
  Image as ImageIcon,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Camera,
} from 'lucide-react';
import { SchoolEmblem } from './SchoolEmblem';
import {
  getCustomSchoolLogo,
  saveCustomSchoolLogo,
  resetCustomSchoolLogo,
  processLogoImageFile,
} from '../services/logoStorage';

interface LogoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LogoUploadModal: React.FC<LogoUploadModalProps> = ({ isOpen, onClose }) => {
  const [currentLogo, setCurrentLogo] = useState<string | null>(getCustomSchoolLogo());
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCurrentLogo(getCustomSchoolLogo());
      setPreviewUrl(null);
      setErrorMsg(null);
      setSuccessMsg(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileSelect = async (file: File) => {
    setErrorMsg(null);
    setSuccessMsg(null);

    // Validate type
    if (!['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type)) {
      setErrorMsg('รองรับเฉพาะไฟล์รูปภาพ .jpg, .jpeg, .png หรือ .webp เท่านั้น');
      return;
    }

    // Validate size (max 8MB before compression)
    if (file.size > 8 * 1024 * 1024) {
      setErrorMsg('ขนาดไฟล์ใหญ่เกิน 8MB กรุณาเลือกไฟล์ภาพที่เล็กลง');
      return;
    }

    try {
      setIsLoading(true);
      const dataUrl = await processLogoImageFile(file, 800);
      setPreviewUrl(dataUrl);
    } catch (err: any) {
      setErrorMsg(err?.message || 'ไม่สามารถประมวลผลไฟล์รูปภาพได้');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSave = () => {
    if (previewUrl) {
      saveCustomSchoolLogo(previewUrl);
      setCurrentLogo(previewUrl);
      setSuccessMsg('บันทึกรูปตราโรงเรียนเรียบร้อยแล้ว!');
      setTimeout(() => {
        onClose();
      }, 1000);
    }
  };

  const handleReset = () => {
    resetCustomSchoolLogo();
    setCurrentLogo(null);
    setPreviewUrl(null);
    setSuccessMsg('รีเซ็ตกลับเป็นตราสัญลักษณ์ดั้งเดิมแล้ว');
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  return (
    <div
      id="logo-upload-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="logo-upload-modal"
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-rose-50/50 via-white to-amber-50/40">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-xs">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-900 text-base sm:text-lg">
                เปลี่ยนรูปตราสัญลักษณ์โรงเรียน
              </h2>
              <p className="text-xs text-slate-500">
                รองรับไฟล์ภาพ JPG หรือ PNG สำหรับโรงเรียนบ้านบวกหมื้อ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="ปิดหน้าต่าง"
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Messages */}
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2.5 text-xs text-rose-700 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-700 font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Current & Preview Box */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-around gap-4 text-center">
            <div className="flex flex-col items-center">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                {previewUrl ? 'รูปภาพใหม่ (พรีวิว)' : 'รูปภาพปัจจุบัน'}
              </span>
              <div className="w-24 h-32 bg-white rounded-2xl border border-slate-200 shadow-inner flex items-center justify-center p-2 overflow-hidden">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="พรีวิวตราโรงเรียน"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <SchoolEmblem className="w-20 h-28" />
                )}
              </div>
            </div>

            <div className="text-left text-xs text-slate-600 max-w-xs space-y-1.5">
              <div className="font-bold text-slate-800">คำแนะนำไฟล์รูปภาพ:</div>
              <ul className="list-disc list-inside space-y-1 text-slate-500 text-[11px]">
                <li>รองรับไฟล์นามสกุล <strong>.PNG</strong> (โปร่งใส) หรือ <strong>.JPG / .JPEG</strong></li>
                <li>ภาพแนวตั้งอัตราส่วนประมาณ 1:1.4 จะแสดงผลได้สวยงามที่สุด</li>
                <li>ระบบจะปรับขนาดและบันทึกอัตโนมัติ ใช้งานได้ทันทีทั่วทั้งเว็บไซต์</li>
              </ul>
            </div>
          </div>

          {/* Dropzone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
              isDragging
                ? 'border-rose-500 bg-rose-50/50 scale-[1.01]'
                : 'border-slate-300 hover:border-rose-400 bg-white hover:bg-slate-50/50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/webp"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileSelect(e.target.files[0]);
                }
              }}
            />

            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shadow-xs">
              <Upload className="w-6 h-6" />
            </div>

            <div>
              <div className="font-bold text-slate-800 text-sm">
                คลิกเพื่อเลือกไฟล์ JPG หรือ PNG
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                หรือลากไฟล์ภาพมาวางในช่องนี้
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-[11px] font-bold text-slate-600">
              <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
              <span>JPG, JPEG, PNG, WEBP</span>
            </span>
          </div>

          {/* Options */}
          {currentLogo && (
            <div className="flex items-center justify-between pt-1 border-t border-slate-100">
              <span className="text-xs text-slate-500 font-medium">ต้องการกลับไปใช้ตราสัญลักษณ์เริ่มต้น?</span>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>รีเซ็ตเป็นตราเดิม</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-200/60 transition-all cursor-pointer"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            disabled={!previewUrl || isLoading}
            onClick={handleSave}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white shadow-xs transition-all cursor-pointer ${
              previewUrl && !isLoading
                ? 'bg-rose-600 hover:bg-rose-700 active:scale-95 shadow-rose-600/20'
                : 'bg-slate-300 cursor-not-allowed opacity-70'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isLoading ? 'กำลังประมวลผล...' : 'บันทึกรูปภาพ'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

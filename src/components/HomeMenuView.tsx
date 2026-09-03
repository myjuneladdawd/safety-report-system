import React, { useState } from 'react';
import { SchoolEmblem } from './SchoolEmblem';
import { LogoUploadModal } from './LogoUploadModal';
import {
  AlertTriangle,
  MapPin,
  Shield,
  Search,
  MessageCircle,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  PhoneCall,
  Activity,
  CheckCircle2,
  Sparkles,
  Camera,
} from 'lucide-react';

interface HomeMenuViewProps {
  onSelectRutan: () => void;
  onSelectWeSeeAlert: () => void;
  onSelectRiskTracker: () => void;
  onSelectTracking: () => void;
  onOpenEmergency: () => void;
  onOpenMessenger: () => void;
}

export const HomeMenuView: React.FC<HomeMenuViewProps> = ({
  onSelectRutan,
  onSelectWeSeeAlert,
  onSelectRiskTracker,
  onSelectTracking,
  onOpenEmergency,
  onOpenMessenger,
}) => {
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);

  return (
    <div
      id="home-menu-container"
      className="relative min-h-[calc(100vh-140px)] flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#FDF8F9] via-[#FAF5F7] to-[#F3F4F6] px-4 sm:px-6 py-6 sm:py-10"
    >
      {/* Background Watermark Graphics */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden opacity-[0.045] flex items-center justify-between">
        <div className="transform -rotate-90 text-7xl sm:text-8xl font-black text-slate-900 tracking-widest whitespace-nowrap -ml-28">
          โรงเรียนบ้านบวกหมื้อ
        </div>
        <div className="hidden lg:block w-[600px] h-[600px] rounded-full bg-rose-500/30 blur-3xl absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="transform rotate-90 text-7xl sm:text-8xl font-black text-slate-900 tracking-widest whitespace-nowrap -mr-28">
          SAFETY CENTER
        </div>
      </div>

      {/* Main Center Content */}
      <div className="relative z-10 max-w-6xl mx-auto w-full flex flex-col items-center text-center my-auto pt-2 pb-8">
        {/* Official School Emblem - โรงเรียนบ้านบวกหมื้อ */}
        <div className="mb-4 sm:mb-6 transition-transform hover:scale-105 duration-300">
          <div className="relative mx-auto drop-shadow-lg flex items-center justify-center group/home-logo">
            <SchoolEmblem className="w-32 h-44 sm:w-40 sm:h-56" />
            <button
              id="btn-upload-logo-home"
              type="button"
              onClick={() => setIsLogoModalOpen(true)}
              title="เปลี่ยนรูปตราโรงเรียน (ใช้ไฟล์ JPG หรือ PNG)"
              aria-label="เปลี่ยนรูปตราโรงเรียน (ใช้ไฟล์ JPG หรือ PNG)"
              className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 flex items-center gap-1.5 px-3 py-1.5 bg-white/95 hover:bg-white text-slate-700 hover:text-rose-600 rounded-full text-xs font-bold shadow-md border border-slate-200/90 backdrop-blur-xs transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <Camera className="w-3.5 h-3.5 text-rose-600" />
              <span>เปลี่ยนรูป (JPG/PNG)</span>
            </button>
          </div>
        </div>

        {/* Title Block matching the school identity */}
        <div className="space-y-1 sm:space-y-1.5 max-w-2xl px-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#C0154B] tracking-tight leading-tight">
            ระบบรับแจ้งเหตุ
          </h1>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#C0154B] tracking-tight leading-tight">
            ความไม่ปลอดภัย/จุดเสี่ยง
          </h2>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight pt-1">
            โรงเรียนบ้านบวกหมื้อ
          </h3>
          <p className="text-sm sm:text-base md:text-lg font-bold text-[#D81B60] pt-0.5">
            สพป.เชียงใหม่ เขต 2 • รู้เร็ว รู้ทัน บรรเทาเหตุ
          </p>

          {/* Pill Badge */}
          <div className="pt-2">
            <span className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-1.5 rounded-full bg-[#FCE7F3] text-[#BE185D] text-xs sm:text-sm font-extrabold tracking-wide border border-[#FBCFE8] shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#BE185D]" />
              <span>ระบบความปลอดภัยสถานศึกษา โรงเรียนบ้านบวกหมื้อ</span>
            </span>
          </div>
        </div>

        {/* 4 Main Interactive Bento Menu Cards matching the reference layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 w-full mt-8 sm:mt-10 max-w-5xl">
          {/* 1. RUTAN (รู้ทัน) */}
          <button
            id="menu-card-rutan"
            onClick={onSelectRutan}
            className="group relative bg-gradient-to-b from-[#EF144A] to-[#DC143C] text-white rounded-3xl p-6 sm:p-7 text-center shadow-lg shadow-rose-500/20 hover:shadow-xl hover:shadow-rose-500/30 transition-all duration-300 hover:-translate-y-1.5 active:scale-98 flex flex-col items-center justify-between min-h-[220px] sm:min-h-[240px] cursor-pointer overflow-hidden border border-white/10"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

            {/* Icon Bubble */}
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-white/20 flex items-center justify-center mb-3 backdrop-blur-xs group-hover:scale-110 transition-transform duration-300 border border-white/30">
              <AlertTriangle className="w-8 h-8 sm:w-9 sm:h-9 text-white" />
            </div>

            {/* Texts */}
            <div className="space-y-1.5 mt-auto">
              <h4 className="text-lg sm:text-xl font-black tracking-tight text-white drop-shadow-xs">
                RUTAN (รู้ทัน)
              </h4>
              <p className="text-xs sm:text-sm text-white/95 font-medium leading-relaxed max-w-[200px] mx-auto">
                แจ้งเหตุความไม่ปลอดภัย/จุดเสี่ยง
              </p>
            </div>

            <div className="mt-4 inline-flex items-center gap-1 text-[11px] font-bold text-white/90 bg-white/15 px-3 py-1 rounded-full group-hover:bg-white/25 transition-colors">
              <span>กดเพื่อแจ้งเหตุ</span>
              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>

          {/* 2. We See Alert */}
          <button
            id="menu-card-wesee"
            onClick={onSelectWeSeeAlert}
            className="group relative bg-gradient-to-b from-[#F97316] to-[#EA580C] text-white rounded-3xl p-6 sm:p-7 text-center shadow-lg shadow-orange-500/20 hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300 hover:-translate-y-1.5 active:scale-98 flex flex-col items-center justify-between min-h-[220px] sm:min-h-[240px] cursor-pointer overflow-hidden border border-white/10"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

            {/* Icon Bubble */}
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-white/20 flex items-center justify-center mb-3 backdrop-blur-xs group-hover:scale-110 transition-transform duration-300 border border-white/30">
              <div className="relative">
                <MapPin className="w-8 h-8 sm:w-9 sm:h-9 text-white" />
              </div>
            </div>

            {/* Texts */}
            <div className="space-y-1.5 mt-auto">
              <h4 className="text-lg sm:text-xl font-black tracking-tight text-white drop-shadow-xs">
                We See Alert
              </h4>
              <p className="text-xs sm:text-sm text-white/95 font-medium leading-relaxed max-w-[210px] mx-auto">
                แจ้งพฤติกรรมไม่เหมาะสมของนักเรียนนอกสถานศึกษา (พสน.)
              </p>
            </div>

            <div className="mt-4 inline-flex items-center gap-1 text-[11px] font-bold text-white/90 bg-white/15 px-3 py-1 rounded-full group-hover:bg-white/25 transition-colors">
              <span>แจ้งเหตุ พสน.</span>
              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>

          {/* 3. Risk Tracker */}
          <button
            id="menu-card-risktracker"
            onClick={onSelectRiskTracker}
            className="group relative bg-gradient-to-b from-[#7C3AED] to-[#6D28D9] text-white rounded-3xl p-6 sm:p-7 text-center shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 hover:-translate-y-1.5 active:scale-98 flex flex-col items-center justify-between min-h-[220px] sm:min-h-[240px] cursor-pointer overflow-hidden border border-white/10"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

            {/* Icon Bubble */}
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-white/20 flex items-center justify-center mb-3 backdrop-blur-xs group-hover:scale-110 transition-transform duration-300 border border-white/30">
              <Shield className="w-8 h-8 sm:w-9 sm:h-9 text-white" />
            </div>

            {/* Texts */}
            <div className="space-y-1.5 mt-auto">
              <h4 className="text-lg sm:text-xl font-black tracking-tight text-white drop-shadow-xs">
                Risk Tracker
              </h4>
              <p className="text-xs sm:text-sm text-white/95 font-medium leading-relaxed max-w-[200px] mx-auto">
                ติดตามสถานะ กิจกรรมความเสี่ยงสูง (Check-in)
              </p>
            </div>

            <div className="mt-4 inline-flex items-center gap-1 text-[11px] font-bold text-white/90 bg-white/15 px-3 py-1 rounded-full group-hover:bg-white/25 transition-colors">
              <span>เช็กอินกิจกรรม</span>
              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>

          {/* 4. ติดตามสถานะ */}
          <button
            id="menu-card-tracking"
            onClick={onSelectTracking}
            className="group relative bg-gradient-to-b from-[#2563EB] to-[#1D4ED8] text-white rounded-3xl p-6 sm:p-7 text-center shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 hover:-translate-y-1.5 active:scale-98 flex flex-col items-center justify-between min-h-[220px] sm:min-h-[240px] cursor-pointer overflow-hidden border border-white/10"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

            {/* Icon Bubble */}
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-white/20 flex items-center justify-center mb-3 backdrop-blur-xs group-hover:scale-110 transition-transform duration-300 border border-white/30">
              <Search className="w-8 h-8 sm:w-9 sm:h-9 text-white" />
            </div>

            {/* Texts */}
            <div className="space-y-1.5 mt-auto">
              <h4 className="text-lg sm:text-xl font-black tracking-tight text-white drop-shadow-xs">
                ติดตามสถานะ
              </h4>
              <p className="text-xs sm:text-sm text-white/95 font-medium leading-relaxed max-w-[200px] mx-auto">
                ตรวจสอบความคืบหน้า การแจ้งเหตุด้วยเบอร์โทรศัพท์
              </p>
            </div>

            <div className="mt-4 inline-flex items-center gap-1 text-[11px] font-bold text-white/90 bg-white/15 px-3 py-1 rounded-full group-hover:bg-white/25 transition-colors">
              <span>ค้นหาสถานะ</span>
              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        </div>

        {/* Quick Emergency Call Strip inside Home view */}
        <div className="w-full max-w-5xl mt-6 sm:mt-8">
          <div className="bg-gradient-to-r from-rose-50 via-red-50 to-orange-50 border border-rose-200/90 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <PhoneCall className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="font-extrabold text-sm text-slate-900 flex items-center justify-center sm:justify-start gap-2">
                  <span>เหตุฉุกเฉินเร่งด่วน โทรสายด่วนความปลอดภัย</span>
                  <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-rose-600 text-white">24 ชม.</span>
                </div>
                <div className="text-xs text-slate-600 mt-0.5">
                  หากพบเหตุไฟไหม้ อุบัติเหตุรุนแรง หรืออันตรายถึงชีวิต โทรติดต่อเจ้าหน้าที่ได้ทันที
                </div>
              </div>
            </div>
            <button
              id="btn-home-emergency"
              onClick={onOpenEmergency}
              className="shrink-0 flex items-center justify-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap w-full sm:w-auto"
            >
              <PhoneCall className="w-4 h-4" />
              <span>เปิดเบอร์สายด่วน</span>
            </button>
          </div>
        </div>
      </div>

      {/* School Emblem Image Upload Modal */}
      <LogoUploadModal
        isOpen={isLogoModalOpen}
        onClose={() => setIsLogoModalOpen(false)}
      />
    </div>
  );
};

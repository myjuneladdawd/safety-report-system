import React, { useState } from 'react';
import { SchoolEmblem } from './SchoolEmblem';
import { LogoUploadModal } from './LogoUploadModal';
import {
  ShieldAlert,
  AlertTriangle,
  MapPin,
  Shield,
  Search,
  Settings,
  BookOpen,
  PhoneCall,
  Home,
  Sparkles,
  Camera,
} from 'lucide-react';

export type ActiveTab = 'home' | 'report' | 'wesee' | 'risk_tracker' | 'track' | 'admin' | 'guide';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenEmergency: () => void;
  pendingCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenEmergency,
  pendingCount,
}) => {
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);

  return (
    <header id="main-header" className="sticky top-0 z-40 px-4 sm:px-6 pt-3 pb-2 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col gap-2.5">
        {/* Top emergency micro-banner Bento Pill */}
        <div className="bg-gradient-to-r from-rose-700 via-[#C0154B] to-red-600 text-white px-3 sm:px-4 py-2 sm:py-1.5 text-xs rounded-2xl shadow-xs flex flex-col sm:flex-row items-center justify-between gap-2 border border-rose-500/30">
          <div className="flex items-center gap-2 font-medium min-w-0 text-center sm:text-left">
            <span className="inline-flex h-2 w-2 rounded-full bg-yellow-300 animate-ping shrink-0" />
            <span className="text-[11px] sm:text-xs">
              ระบบรับแจ้งเหตุความไม่ปลอดภัย/จุดเสี่ยง โรงเรียนบ้านบวกหมื้อ (สพป.เชียงใหม่ เขต 2) • รู้เร็ว รู้ทัน บรรเทาเหตุ
            </span>
          </div>
          <button
            id="btn-emergency-topbar"
            onClick={onOpenEmergency}
            className="shrink-0 flex items-center justify-center gap-1.5 bg-white text-[#C0154B] px-3.5 py-1 rounded-full font-bold text-xs hover:bg-rose-50 transition-all shadow-xs active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <PhoneCall className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            <span>สายด่วนฉุกเฉิน</span>
          </button>
        </div>

        {/* Main Navigation Bento Bar */}
        <div className="bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl px-4 sm:px-6 py-3 shadow-xs">
          <div className="flex items-center justify-between gap-4">
            {/* Logo & School Branding */}
            <div
              id="brand-logo-container"
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-3 cursor-pointer select-none group shrink-0"
            >
              {/* Official School Emblem */}
              <div className="relative flex items-center justify-center group/emblem">
                <SchoolEmblem className="w-10 h-14 sm:w-11 sm:h-16 group-hover:scale-105 transition-transform" />
                <button
                  id="btn-upload-logo-header"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsLogoModalOpen(true);
                  }}
                  title="เปลี่ยนรูปตราโรงเรียน (ใช้ไฟล์ JPG หรือ PNG)"
                  aria-label="เปลี่ยนรูปตราโรงเรียน (ใช้ไฟล์ JPG หรือ PNG)"
                  className="absolute -bottom-1 -right-1 w-6 h-6 bg-rose-600 hover:bg-rose-700 text-white rounded-full flex items-center justify-center shadow-md border-2 border-white transition-all cursor-pointer hover:scale-110"
                >
                  <Camera className="w-3 h-3" />
                </button>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-base sm:text-lg text-slate-900 tracking-tight leading-none">
                    โรงเรียนบ้านบวกหมื้อ
                  </span>
                  <span className="hidden sm:inline-block px-2.5 py-0.5 text-[10px] font-extrabold tracking-wider bg-[#FCE7F3] text-[#BE185D] border border-[#FBCFE8] rounded-full">
                    สพป.เชียงใหม่ เขต 2
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 font-medium hidden sm:block">
                  ระบบแจ้งเหตุความไม่ปลอดภัยและจุดเสี่ยง • เพื่อสวัสดิภาพของทุกคน
                </p>
              </div>
            </div>

            {/* Nav Tabs Desktop Bento Pills */}
            <nav id="nav-tabs" className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/60 overflow-x-auto">
              <button
                id="tab-btn-home"
                onClick={() => setActiveTab('home')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'home'
                    ? 'bg-white text-rose-700 shadow-xs ring-1 ring-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                <span>หน้าแรก</span>
              </button>

              <button
                id="tab-btn-rutan"
                onClick={() => setActiveTab('report')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'report'
                    ? 'bg-[#EF144A] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <AlertTriangle className={`w-3.5 h-3.5 ${activeTab === 'report' ? 'text-white' : 'text-rose-600'}`} />
                <span>RUTAN (รู้ทัน)</span>
              </button>

              <button
                id="tab-btn-wesee"
                onClick={() => setActiveTab('wesee')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'wesee'
                    ? 'bg-[#F97316] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <MapPin className={`w-3.5 h-3.5 ${activeTab === 'wesee' ? 'text-white' : 'text-orange-600'}`} />
                <span>We See Alert</span>
              </button>

              <button
                id="tab-btn-risk-tracker"
                onClick={() => setActiveTab('risk_tracker')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'risk_tracker'
                    ? 'bg-[#7C3AED] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <Shield className={`w-3.5 h-3.5 ${activeTab === 'risk_tracker' ? 'text-white' : 'text-purple-600'}`} />
                <span>Risk Tracker</span>
              </button>

              <button
                id="tab-btn-track"
                onClick={() => setActiveTab('track')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'track'
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <Search className={`w-3.5 h-3.5 ${activeTab === 'track' ? 'text-white' : 'text-blue-600'}`} />
                <span>ติดตามสถานะ</span>
              </button>

              <button
                id="tab-btn-guide"
                onClick={() => setActiveTab('guide')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'guide'
                    ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-slate-600" />
                <span>คู่มือ</span>
              </button>

              <button
                id="tab-btn-admin"
                onClick={() => setActiveTab('admin')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all relative cursor-pointer ${
                  activeTab === 'admin'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <Settings className="w-3.5 h-3.5 text-slate-400" />
                <span>เจ้าหน้าที่</span>
                {pendingCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 bg-rose-600 text-white rounded-full text-[10px] font-bold">
                    {pendingCount}
                  </span>
                )}
              </button>
            </nav>
          </div>

          {/* Mobile Navigation Tabs */}
          <div id="mobile-nav-tabs" className="flex lg:hidden items-center justify-between border-t border-slate-100 mt-3 pt-2 gap-1 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center py-1.5 px-2 rounded-xl text-[11px] font-bold shrink-0 transition-colors ${
                activeTab === 'home' ? 'bg-rose-50 text-rose-600' : 'text-slate-600'
              }`}
            >
              <Home className="w-4 h-4 mb-0.5" />
              <span>หน้าแรก</span>
            </button>

            <button
              onClick={() => setActiveTab('report')}
              className={`flex flex-col items-center py-1.5 px-2 rounded-xl text-[11px] font-bold shrink-0 transition-colors ${
                activeTab === 'report' ? 'bg-rose-50 text-rose-600' : 'text-slate-600'
              }`}
            >
              <AlertTriangle className="w-4 h-4 mb-0.5 text-rose-600" />
              <span>RUTAN</span>
            </button>

            <button
              onClick={() => setActiveTab('wesee')}
              className={`flex flex-col items-center py-1.5 px-2 rounded-xl text-[11px] font-bold shrink-0 transition-colors ${
                activeTab === 'wesee' ? 'bg-orange-50 text-orange-600' : 'text-slate-600'
              }`}
            >
              <MapPin className="w-4 h-4 mb-0.5 text-orange-600" />
              <span>We See</span>
            </button>

            <button
              onClick={() => setActiveTab('risk_tracker')}
              className={`flex flex-col items-center py-1.5 px-2 rounded-xl text-[11px] font-bold shrink-0 transition-colors ${
                activeTab === 'risk_tracker' ? 'bg-purple-50 text-purple-600' : 'text-slate-600'
              }`}
            >
              <Shield className="w-4 h-4 mb-0.5 text-purple-600" />
              <span>Risk Tracker</span>
            </button>

            <button
              onClick={() => setActiveTab('track')}
              className={`flex flex-col items-center py-1.5 px-2 rounded-xl text-[11px] font-bold shrink-0 transition-colors ${
                activeTab === 'track' ? 'bg-blue-50 text-blue-600' : 'text-slate-600'
              }`}
            >
              <Search className="w-4 h-4 mb-0.5 text-blue-600" />
              <span>ติดตาม</span>
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`flex flex-col items-center py-1.5 px-2 rounded-xl text-[11px] font-bold shrink-0 relative transition-colors ${
                activeTab === 'admin' ? 'bg-slate-900 text-white' : 'text-slate-600'
              }`}
            >
              <Settings className="w-4 h-4 mb-0.5" />
              <span>เจ้าหน้าที่</span>
              {pendingCount > 0 && (
                <span className="absolute top-1 right-2 w-2 h-2 bg-rose-600 rounded-full" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* School Emblem Image Upload Modal */}
      <LogoUploadModal
        isOpen={isLogoModalOpen}
        onClose={() => setIsLogoModalOpen(false)}
      />
    </header>
  );
};


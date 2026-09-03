import React, { useState, useEffect, useCallback } from 'react';
import { ActiveTab, Header } from './components/Header';
import { SchoolEmblem } from './components/SchoolEmblem';
import { HomeMenuView } from './components/HomeMenuView';
import { RiskTrackerView } from './components/RiskTrackerView';
import { MessengerChatModal } from './components/MessengerChatModal';
import { ReportForm } from './components/ReportForm';
import { TrackingView } from './components/TrackingView';
import { AdminDashboard } from './components/AdminDashboard';
import { SafetyGuidelines } from './components/SafetyGuidelines';
import { EmergencyModal } from './components/EmergencyModal';
import { getIncidentReports } from './services/storage';
import { IncidentReport } from './types';
import { PhoneCall, ShieldCheck, MessageCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [reports, setReports] = useState<IncidentReport[]>([]);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState<boolean>(false);
  const [isMessengerOpen, setIsMessengerOpen] = useState<boolean>(false);
  const [trackingSelectedId, setTrackingSelectedId] = useState<string | undefined>(undefined);

  // Load reports from storage
  const loadReports = useCallback(() => {
    const data = getIncidentReports();
    setReports(data);
  }, []);

  useEffect(() => {
    loadReports();

    const handleStorageChange = () => {
      loadReports();
    };

    window.addEventListener('school_safety_data_change', handleStorageChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('school_safety_data_change', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [loadReports]);

  // When a new report is created successfully
  const handleReportSubmitted = (newReportId: string) => {
    loadReports();
    setTrackingSelectedId(newReportId);
    setActiveTab('track');
  };

  const pendingCount = reports.filter((r) => r.status === 'pending').length;

  return (
    <div className="min-h-screen flex flex-col bg-[#F1F5F9] text-slate-900 selection:bg-rose-500 selection:text-white">
      {/* Top Header & Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'track') {
            setTrackingSelectedId(undefined);
          }
        }}
        onOpenEmergency={() => setIsEmergencyModalOpen(true)}
        pendingCount={pendingCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {/* หน้าเมนูแรก (Home Menu Bento Grid) */}
        {activeTab === 'home' && (
          <HomeMenuView
            onSelectRutan={() => setActiveTab('report')}
            onSelectWeSeeAlert={() => setActiveTab('wesee')}
            onSelectRiskTracker={() => setActiveTab('risk_tracker')}
            onSelectTracking={() => setActiveTab('track')}
            onOpenEmergency={() => setIsEmergencyModalOpen(true)}
            onOpenMessenger={() => setIsMessengerOpen(true)}
          />
        )}

        {/* RUTAN (รู้ทัน) - แจ้งเหตุจุดเสี่ยง / ความไม่ปลอดภัย */}
        {activeTab === 'report' && (
          <ReportForm
            mode="rutan"
            onSuccess={handleReportSubmitted}
            onOpenEmergency={() => setIsEmergencyModalOpen(true)}
            onBackToHome={() => setActiveTab('home')}
          />
        )}

        {/* We See Alert - แจ้งพฤติกรรมไม่เหมาะสมของนักเรียนนอกสถานศึกษา (พสน.) */}
        {activeTab === 'wesee' && (
          <ReportForm
            mode="wesee"
            onSuccess={handleReportSubmitted}
            onOpenEmergency={() => setIsEmergencyModalOpen(true)}
            onBackToHome={() => setActiveTab('home')}
          />
        )}

        {/* Risk Tracker - ระบบลงทะเบียนติดตามกิจกรรมเสี่ยงและเช็คอินความปลอดภัย */}
        {activeTab === 'risk_tracker' && (
          <RiskTrackerView
            onBackToHome={() => setActiveTab('home')}
            onGoToReport={() => setActiveTab('report')}
          />
        )}

        {/* ติดตามสถานะ (Tracking View) */}
        {activeTab === 'track' && (
          <TrackingView
            reports={reports}
            initialSelectedId={trackingSelectedId}
            onRefresh={loadReports}
            onGoToReport={() => setActiveTab('report')}
            onBackToHome={() => setActiveTab('home')}
          />
        )}

        {/* เจ้าหน้าที่ / ครู (Admin Dashboard) */}
        {activeTab === 'admin' && (
          <AdminDashboard
            reports={reports}
            onRefresh={loadReports}
          />
        )}

        {/* คู่มือความปลอดภัย (Safety Guidelines) */}
        {activeTab === 'guide' && (
          <SafetyGuidelines
            onOpenEmergency={() => setIsEmergencyModalOpen(true)}
            onGoToReport={() => setActiveTab('report')}
          />
        )}
      </main>

      {/* Emergency Hotline Modal */}
      <EmergencyModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
      />

      {/* Messenger Chat Support Modal */}
      <MessengerChatModal
        isOpen={isMessengerOpen}
        onClose={() => setIsMessengerOpen(false)}
        onGoToReport={() => {
          setIsMessengerOpen(false);
          setActiveTab('report');
        }}
        onOpenEmergency={() => {
          setIsMessengerOpen(false);
          setIsEmergencyModalOpen(true);
        }}
      />

      {/* Floating Action Buttons Dock */}
      <aside aria-label="เมนูช่วยเหลือด่วน" className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-2.5 pointer-events-auto">
        {/* Floating Messenger Button */}
        <button
          id="btn-floating-messenger"
          onClick={() => setIsMessengerOpen(true)}
          aria-label="ติดต่อเจ้าหน้าที่ผ่านแชท Messenger"
          className="group flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#0084FF] to-[#0066FF] hover:from-[#0073E6] hover:to-[#0052CC] text-white font-bold text-xs sm:text-sm shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/20"
        >
          <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center shrink-0 shadow-2xs">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-[#0084FF] fill-current">
              <path d="M12 2C6.477 2 2 6.145 2 11.259c0 2.913 1.454 5.512 3.727 7.185V22l3.435-1.884c.915.253 1.884.39 2.838.39 5.523 0 10-4.145 10-9.247C22 6.145 17.523 2 12 2zm1.034 12.443l-2.613-2.787-5.099 2.787 5.61-5.955 2.678 2.787 5.034-2.787-5.61 5.955z" />
            </svg>
          </div>
          <span className="whitespace-nowrap">แชทผ่าน Messenger</span>
        </button>

        {/* Floating Emergency Hotline Button */}
        <button
          id="btn-floating-emergency"
          onClick={() => setIsEmergencyModalOpen(true)}
          aria-label="สายด่วนฉุกเฉินโรงเรียน"
          className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-rose-600 via-rose-700 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-black text-xs sm:text-sm shadow-xl shadow-rose-600/35 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/25"
        >
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <PhoneCall className="w-3.5 h-3.5 text-white animate-bounce" />
          </div>
          <span className="whitespace-nowrap">สายด่วนฉุกเฉิน</span>
        </button>
      </aside>

      {/* Bento Footer */}
      <footer className="w-full px-4 sm:px-6 pb-6 mt-auto">
        <div className="max-w-7xl mx-auto bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <SchoolEmblem className="w-9 h-13 shrink-0" />
            <div>
              <div className="font-bold text-slate-800 text-sm">
                ศูนย์รับแจ้งเหตุความไม่ปลอดภัยและจุดเสี่ยง โรงเรียนบ้านบวกหมื้อ
              </div>
              <div className="text-[11px] text-slate-400">
                สพป.เชียงใหม่ เขต 2 • รู้เร็ว รู้ทัน บรรเทาเหตุ • RUTAN • We See Alert • Risk Tracker
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center text-xs">
            <button
              onClick={() => setActiveTab('home')}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors cursor-pointer"
            >
              หน้าเมนูแรก
            </button>
            <button
              onClick={() => setIsEmergencyModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 font-semibold hover:bg-rose-100 transition-colors cursor-pointer"
            >
              เบอร์โทรฉุกเฉิน
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className="px-3 py-1.5 rounded-xl hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              คู่มือเผชิญเหตุ
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className="px-3 py-1.5 rounded-xl hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              ระบบเจ้าหน้าที่
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

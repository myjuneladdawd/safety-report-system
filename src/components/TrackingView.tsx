import React, { useState, useMemo } from 'react';
import {
  Search,
  CheckCircle,
  Clock,
  MapPin,
  Shield,
  FileText,
  ChevronRight,
  RefreshCw,
  ExternalLink,
  SlidersHorizontal,
  X,
  ArrowLeft,
} from 'lucide-react';
import { INCIDENT_CATEGORIES, STATUS_DEFINITIONS, URGENCY_LEVELS } from '../data/mockData';
import { IncidentReport, IncidentStatus } from '../types';
import { CategoryIcon } from './CategoryIcon';

interface TrackingViewProps {
  reports: IncidentReport[];
  initialSelectedId?: string;
  onRefresh: () => void;
  onGoToReport: () => void;
  onBackToHome?: () => void;
}

export const TrackingView: React.FC<TrackingViewProps> = ({
  reports,
  initialSelectedId,
  onRefresh,
  onGoToReport,
  onBackToHome,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>(initialSelectedId || '');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeReportId, setActiveReportId] = useState<string | null>(
    initialSelectedId || (reports.length > 0 ? reports[0].id : null)
  );
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Filtered reports
  const filteredReports = useMemo(() => {
    return reports.filter((item) => {
      // Search query matches ID, Title, Location, Description, or Reporter phone contact
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.id.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.locationZone.toLowerCase().includes(q) ||
        item.locationDetail.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        (item.reporterContact && item.reporterContact.toLowerCase().includes(q));

      const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [reports, searchQuery, selectedStatus, selectedCategory]);

  const activeReport = useMemo(() => {
    if (!activeReportId) return null;
    return reports.find((r) => r.id === activeReportId) || null;
  }, [reports, activeReportId]);

  const getCategoryMeta = (catId: string) => {
    return INCIDENT_CATEGORIES.find((c) => c.id === catId) || INCIDENT_CATEGORIES[0];
  };

  const statusStepIndex = (status: IncidentStatus): number => {
    switch (status) {
      case 'pending':
        return 0;
      case 'investigating':
        return 1;
      case 'in_progress':
        return 2;
      case 'resolved':
        return 3;
      case 'dismissed':
        return -1;
      default:
        return 0;
    }
  };

  return (
    <div id="tracking-view-container" className="max-w-7xl mx-auto py-4 px-4 sm:px-6 space-y-4">
      {/* Bento Header & Search Bar */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-xs">
        {onBackToHome && (
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 mb-3 px-3 py-1 bg-slate-100 rounded-full cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>กลับสู่หน้าเมนูแรก</span>
          </button>
        )}

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-xs font-bold text-blue-700 mb-2">
              <Shield className="w-3.5 h-3.5 text-blue-600" />
              <span>ระบบตรวจสอบความคืบหน้า • โรงเรียนบ้านบวกหมื้อ</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span>ติดตามสถานะการแจ้งเหตุความไม่ปลอดภัย</span>
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              ตรวจสอบความคืบหน้าด้วยรหัส Ticket ID หรือเบอร์โทรศัพท์ที่ใช้แจ้งเหตุ และผลการดำเนินการของเจ้าหน้าที่แบบเรียลไทม์
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              id="btn-refresh-tracking"
              onClick={onRefresh}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-100/90 hover:bg-slate-200/80 text-slate-700 rounded-2xl text-xs font-bold transition-all active:scale-95 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>รีเฟรชข้อมูล</span>
            </button>
            <button
              id="btn-goto-new-report"
              onClick={onGoToReport}
              className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <span>+ แจ้งเหตุใหม่</span>
            </button>
          </div>
        </div>

        {/* Bento Search and Filters Bar */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-12 gap-3 pt-4 border-t border-slate-100">
          {/* Search box */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="input-tracking-search"
              placeholder="ค้นหาด้วยรหัส Ticket ID, เบอร์โทรศัพท์, หรือชื่อเหตุการณ์..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300/80 rounded-2xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="sm:col-span-3">
            <select
              id="select-tracking-status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300/80 rounded-2xl text-xs sm:text-sm text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-rose-500 cursor-pointer"
            >
              <option value="all">สถานะทั้งหมด</option>
              <option value="pending">รับเรื่องแล้ว</option>
              <option value="investigating">กำลังเข้าตรวจสอบ</option>
              <option value="in_progress">กำลังดำเนินการแก้ไข</option>
              <option value="resolved">แก้ไขเรียบร้อยแล้ว</option>
              <option value="dismissed">ยกเลิก/ปิดเรื่อง</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="sm:col-span-3">
            <select
              id="select-tracking-category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300/80 rounded-2xl text-xs sm:text-sm text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-rose-500 cursor-pointer"
            >
              <option value="all">ทุกประเภทเหตุการณ์</option>
              {INCIDENT_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main 2-Column Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Left Column: Report List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 px-2 font-medium">
            <span>พบทั้งหมด <strong>{filteredReports.length}</strong> รายการ</span>
            <span>เรียงจากเหตุล่าสุด</span>
          </div>

          {filteredReports.length === 0 ? (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-8 text-center shadow-xs">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="font-bold text-slate-700 text-sm">ไม่พบรายการแจ้งเหตุที่ตรงกับเงื่อนไข</p>
              <p className="text-xs text-slate-400 mt-1">ลองล้างคำค้นหาหรือตัวกรองสถานะ</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedStatus('all');
                  setSelectedCategory('all');
                }}
                className="mt-4 px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                ล้างการค้นหา
              </button>
            </div>
          ) : (
            <div className="space-y-3 max-h-[750px] overflow-y-auto pr-1">
              {filteredReports.map((report) => {
                const isSelected = activeReportId === report.id;
                const statusMeta = STATUS_DEFINITIONS[report.status] || STATUS_DEFINITIONS.pending;
                const urgencyMeta = URGENCY_LEVELS[report.urgency];
                const catMeta = getCategoryMeta(report.category);

                return (
                  <div
                    key={report.id}
                    id={`report-item-${report.id}`}
                    onClick={() => setActiveReportId(report.id)}
                    className={`p-4 sm:p-5 rounded-2xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'border-rose-500 bg-rose-50/40 ring-2 ring-rose-500/20 shadow-xs'
                        : 'border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/60 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="font-mono text-xs font-extrabold text-slate-600 bg-slate-100/90 px-2.5 py-0.5 rounded-lg border border-slate-200/60">
                        {report.id}
                      </span>
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${statusMeta.badgeClass}`}>
                        {statusMeta.label}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-sm line-clamp-1 mb-1.5">
                      {report.title}
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span className="truncate">{report.locationZone}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-2.5 border-t border-slate-100">
                      <span className="text-slate-400">
                        {new Date(report.createdAt).toLocaleDateString('th-TH', {
                          day: 'numeric',
                          month: 'short',
                          year: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${urgencyMeta.badgeClass}`}>
                        {urgencyMeta.label.split(':')[0]}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Active Ticket Detail Bento Box */}
        <div className="lg:col-span-7">
          {activeReport ? (
            <div
              id="active-report-card"
              className="bg-white border border-slate-200/80 rounded-3xl shadow-xs overflow-hidden sticky top-24"
            >
              {/* Header */}
              <div className="p-6 sm:p-7 border-b border-slate-100 bg-slate-50/50">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-black text-slate-800 bg-white border border-slate-200 px-3 py-1 rounded-xl shadow-2xs">
                      {activeReport.id}
                    </span>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        STATUS_DEFINITIONS[activeReport.status]?.badgeClass
                      }`}
                    >
                      {STATUS_DEFINITIONS[activeReport.status]?.label}
                    </span>
                  </div>

                  <span className={`text-xs font-bold px-2.5 py-1 rounded-xl ${URGENCY_LEVELS[activeReport.urgency].badgeClass}`}>
                    {URGENCY_LEVELS[activeReport.urgency].label}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
                  {activeReport.title}
                </h2>

                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-500 mt-3">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span>
                      {activeReport.locationZone} — <strong>{activeReport.locationDetail}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      แจ้งเมื่อ:{' '}
                      {new Date(activeReport.createdAt).toLocaleDateString('th-TH', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}{' '}
                      น.
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Stepper Bento (4 steps) */}
              <div className="px-6 py-4 bg-white border-b border-slate-100">
                <div className="text-xs font-bold text-slate-700 mb-3">ขั้นตอนการดำเนินงาน:</div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  {[
                    { key: 'pending', label: '1. รับเรื่อง' },
                    { key: 'investigating', label: '2. ตรวจสอบ' },
                    { key: 'in_progress', label: '3. ดำเนินการ' },
                    { key: 'resolved', label: '4. แก้ไขเสร็จสิ้น' },
                  ].map((step, idx) => {
                    const currentIdx = statusStepIndex(activeReport.status);
                    const isDone = currentIdx >= idx;
                    const isCurrent = currentIdx === idx;

                    return (
                      <div key={step.key} className="flex flex-col items-center">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                            isDone
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-400'
                          } ${isCurrent ? 'ring-2 ring-emerald-400 ring-offset-2' : ''}`}
                        >
                          {isDone ? '✓' : idx + 1}
                        </div>
                        <span
                          className={`text-[11px] mt-1.5 font-medium ${
                            isDone ? 'text-emerald-700 font-semibold' : 'text-slate-400'
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Content Details Bento Blocks */}
              <div className="p-6 sm:p-7 space-y-6 max-h-[500px] overflow-y-auto">
                {/* Description */}
                <div>
                  <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">
                    รายละเอียดเหตุการณ์
                  </h4>
                  <div className="p-4 bg-slate-50/80 rounded-2xl text-slate-700 text-sm leading-relaxed border border-slate-100 whitespace-pre-line">
                    {activeReport.description}
                  </div>
                </div>

                {/* Attached Photo */}
                {activeReport.imageUrl && (
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">
                      รูปภาพประกอบ
                    </h4>
                    <div
                      className="border border-slate-200/80 rounded-2xl overflow-hidden cursor-pointer group max-w-sm shadow-2xs"
                      onClick={() => setPreviewImage(activeReport.imageUrl || null)}
                    >
                      <img
                        src={activeReport.imageUrl}
                        alt="หลักฐานประกอบ"
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="p-2 bg-slate-900/80 text-white text-[11px] text-center">
                        คลิกเพื่อดูภาพขนาดใหญ่
                      </div>
                    </div>
                  </div>
                )}

                {/* Responsible department & Officer notes Bento */}
                {(activeReport.assignedDepartment || activeReport.adminNotes) && (
                  <div className="p-5 bg-blue-50/60 border border-blue-100 rounded-2xl space-y-2.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                      <Shield className="w-4 h-4 text-blue-600" />
                      <span>บันทึกจากเจ้าหน้าที่ / ผู้รับผิดชอบ</span>
                    </div>

                    {activeReport.assignedDepartment && (
                      <p className="text-xs text-blue-800">
                        <strong>ฝ่ายที่รับผิดชอบ:</strong> {activeReport.assignedDepartment}{' '}
                        {activeReport.assignedOfficer && `(${activeReport.assignedOfficer})`}
                      </p>
                    )}

                    {activeReport.adminNotes && (
                      <p className="text-xs text-slate-700 bg-white p-3.5 rounded-xl border border-blue-100">
                        {activeReport.adminNotes}
                      </p>
                    )}
                  </div>
                )}

                {/* Timeline History Bento */}
                <div>
                  <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>ไทม์ไลน์ความคืบหน้า</span>
                  </h4>

                  <div className="relative pl-6 space-y-4 border-l-2 border-slate-200 ml-2">
                    {activeReport.timeline.map((entry) => (
                      <div key={entry.id} className="relative">
                        <div className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-rose-600" />
                        <div>
                          <span className="text-[11px] font-bold text-slate-400">
                            {entry.timestamp}
                          </span>
                          <p className="text-xs text-slate-800 mt-0.5 font-medium leading-relaxed">
                            {entry.message}
                          </p>
                          {entry.officer && (
                            <span className="text-[10px] text-slate-500 block mt-0.5">
                              โดย: {entry.officer}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reporter information privacy badge */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>
                    ผู้แจ้ง:{' '}
                    {activeReport.isAnonymous
                      ? '🔒 ไม่เปิดเผยตัวตน (คุ้มครองความปลอดภัย)'
                      : `${activeReport.reporterName} (${activeReport.reporterRole || 'ผู้แจ้ง'})`}
                  </span>
                  <span className="text-[11px]">สถานศึกษาปลอดภัย</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center shadow-xs">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="font-bold text-slate-700">กรุณาเลือกรายการเหตุการณ์เพื่อดูรายละเอียด</p>
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-3xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <img src={previewImage} alt="ขยายรูปภาพ" className="max-w-full max-h-[85vh] rounded-2xl object-contain" />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-3 -right-3 p-2 bg-white text-slate-900 rounded-full shadow-lg hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

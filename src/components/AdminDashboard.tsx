import React, { useState, useMemo } from 'react';
import { SchoolEmblem } from './SchoolEmblem';
import {
  AlertOctagon,
  CheckCircle2,
  Clock,
  Edit3,
  Filter,
  Flame,
  HelpCircle,
  MapPin,
  RefreshCw,
  Search,
  Shield,
  Trash2,
  UserCheck,
  Wrench,
  X,
  FileSpreadsheet,
  RotateCcw,
} from 'lucide-react';
import { INCIDENT_CATEGORIES, STATUS_DEFINITIONS, URGENCY_LEVELS } from '../data/mockData';
import {
  deleteIncidentReport,
  resetToInitialReports,
  updateIncidentReport,
} from '../services/storage';
import { IncidentCategory, IncidentReport, IncidentStatus, UrgencyLevel } from '../types';
import { CategoryIcon } from './CategoryIcon';

interface AdminDashboardProps {
  reports: IncidentReport[];
  onRefresh: () => void;
}

const DEPARTMENTS = [
  'กลุ่มงานบริหารกิจการนักเรียน (ฝ่ายปกครอง)',
  'งานอาคารสถานที่และซ่อมบำรุง',
  'งานสุขาภิบาลและห้องพยาบาล',
  'งานรักษาความปลอดภัยและยานพาหนะ',
  'กลุ่มงานบริหารทั่วไป / อำนวยการ',
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ reports, onRefresh }) => {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterUrgency, setFilterUrgency] = useState<string>('all');

  // Edit Modal State
  const [editingReport, setEditingReport] = useState<IncidentReport | null>(null);
  const [editStatus, setEditStatus] = useState<IncidentStatus>('pending');
  const [editDepartment, setEditDepartment] = useState<string>('');
  const [editOfficer, setEditOfficer] = useState<string>('');
  const [editNotes, setEditNotes] = useState<string>('');
  const [timelineMessage, setTimelineMessage] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = reports.length;
    const pending = reports.filter((r) => r.status === 'pending').length;
    const inProgress = reports.filter((r) => r.status === 'in_progress' || r.status === 'investigating').length;
    const resolved = reports.filter((r) => r.status === 'resolved').length;
    const critical = reports.filter((r) => r.urgency === 'critical' && r.status !== 'resolved').length;

    return { total, pending, inProgress, resolved, critical };
  }, [reports]);

  // Filtered reports
  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      const q = search.toLowerCase().trim();
      const matchQuery =
        !q ||
        r.id.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q) ||
        r.locationZone.toLowerCase().includes(q) ||
        r.locationDetail.toLowerCase().includes(q);

      const matchStatus = filterStatus === 'all' || r.status === filterStatus;
      const matchCat = filterCategory === 'all' || r.category === filterCategory;
      const matchUrg = filterUrgency === 'all' || r.urgency === filterUrgency;

      return matchQuery && matchStatus && matchCat && matchUrg;
    });
  }, [reports, search, filterStatus, filterCategory, filterUrgency]);

  const handleOpenEdit = (report: IncidentReport) => {
    setEditingReport(report);
    setEditStatus(report.status);
    setEditDepartment(report.assignedDepartment || DEPARTMENTS[0]);
    setEditOfficer(report.assignedOfficer || '');
    setEditNotes(report.adminNotes || '');
    setTimelineMessage('');
  };

 const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReport) return;

    setIsSaving(true);
try {
  await updateIncidentReport(editingReport.id, {
    status: editStatus,
    assignedDepartment: editDepartment,
    assignedOfficer: editOfficer.trim(),
    adminNotes: editNotes.trim(),
    newTimelineMessage: timelineMessage.trim() || undefined,
  });

 onRefresh();
setEditingReport(null);
    } catch (err) {
      console.error('Failed to update report:', err);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setIsSaving(false);
    }
  };

 const handleDelete = async (id: string, title: string) => {
  if (confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบรายการเหตุ "${title}" (${id})?`)) {
    await deleteIncidentReport(id);
    onRefresh();
  }
};

const handleResetData = async () => {
  if (
    confirm(
      'คุณต้องการรีเซ็ตข้อมูลด้วยการกลับเป็นค่าเริ่มต้นหรือไม่? ข้อมูลที่บันทึกใหม่จะถูกแทนที่ด้วยข้อมูลทดสอบมาตรฐาน'
    )
  ) {
    await resetToInitialReports();
    onRefresh();
  }
};

  const exportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(reports, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `school_safety_reports_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div id="admin-dashboard-container" className="max-w-7xl mx-auto py-4 px-4 sm:px-6 space-y-4">
      {/* Top Banner Bento Box */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="hidden sm:block shrink-0 bg-white/10 p-2 rounded-2xl border border-white/10 shadow-inner">
              <SchoolEmblem className="w-12 h-16" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Staff & Admin Portal
                </span>
                <span className="text-xs text-slate-400">โรงเรียนบ้านบวกหมื้อ • สพป.เชียงใหม่ เขต 2</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                ศูนย์บัญชาการและจัดการเหตุความปลอดภัย โรงเรียนบ้านบวกหมื้อ
              </h1>
              <p className="text-slate-400 text-sm mt-1 max-w-2xl">
                ตรวจสอบเหตุการณ์ที่ได้รับแจ้ง มอบหมายผู้รับผิดชอบ อัปเดตความคืบหน้าการแก้ปัญหา
                และบันทึกผลการปฏิบัติงานตามมาตรฐานความปลอดภัยสถานศึกษา
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="btn-admin-refresh"
              onClick={onRefresh}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl text-xs font-bold transition-all border border-slate-700 active:scale-95 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>รีเฟรช</span>
            </button>
            <button
              id="btn-admin-export"
              onClick={exportJSON}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl text-xs font-bold transition-all border border-slate-700 active:scale-95 cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>ส่งออก (JSON)</span>
            </button>
            <button
              id="btn-admin-reset"
              onClick={handleResetData}
              title="รีเซ็ตเป็นข้อมูลตัวอย่างเริ่มต้น"
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800/80 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 rounded-2xl text-xs font-semibold transition-all border border-slate-700 active:scale-95 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>คืนค่าตัวอย่าง</span>
            </button>
          </div>
        </div>

        {/* Bento Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-6 border-t border-slate-800">
          <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-4">
            <span className="text-xs text-slate-400 block font-semibold">เหตุทั้งหมด</span>
            <span className="text-2xl sm:text-3xl font-black text-white mt-1 block">{stats.total}</span>
          </div>

          <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-4">
            <span className="text-xs text-amber-300 block font-semibold">รอรับเรื่อง</span>
            <span className="text-2xl sm:text-3xl font-black text-amber-400 mt-1 block">{stats.pending}</span>
          </div>

          <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-4">
            <span className="text-xs text-blue-300 block font-semibold">กำลังดำเนินการ</span>
            <span className="text-2xl sm:text-3xl font-black text-blue-400 mt-1 block">{stats.inProgress}</span>
          </div>

          <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-4">
            <span className="text-xs text-emerald-300 block font-semibold">แก้ไขเรียบร้อย</span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1 block">{stats.resolved}</span>
          </div>

          <div className="col-span-2 sm:col-span-1 bg-rose-950/50 border border-rose-800/60 rounded-2xl p-4">
            <span className="text-xs text-rose-300 block font-bold">⚠️ ฉุกเฉินวิกฤต</span>
            <span className="text-2xl sm:text-3xl font-black text-rose-400 mt-1 block">{stats.critical}</span>
          </div>
        </div>
      </div>

      {/* Bento Filter and Search controls */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="admin-search-input"
              placeholder="ค้นหารหัส, หัวข้อ, สถานที่..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300/80 rounded-2xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500 focus:bg-white text-slate-800 transition-colors"
            />
          </div>

          <div>
            <select
              id="admin-filter-status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300/80 rounded-2xl text-xs sm:text-sm text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-rose-500 cursor-pointer"
            >
              <option value="all">สถานะ: ทั้งหมด</option>
              <option value="pending">รอรับเรื่อง (Pending)</option>
              <option value="investigating">กำลังเข้าตรวจ (Investigating)</option>
              <option value="in_progress">กำลังดำเนินการ (In Progress)</option>
              <option value="resolved">แก้ไขแล้ว (Resolved)</option>
              <option value="dismissed">ยกเลิก (Dismissed)</option>
            </select>
          </div>

          <div>
            <select
              id="admin-filter-urgency"
              value={filterUrgency}
              onChange={(e) => setFilterUrgency(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300/80 rounded-2xl text-xs sm:text-sm text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-rose-500 cursor-pointer"
            >
              <option value="all">ความเร่งด่วน: ทั้งหมด</option>
              <option value="critical">ระดับ 4: ฉุกเฉินวิกฤต</option>
              <option value="high">ระดับ 3: เร่งด่วนสูง</option>
              <option value="medium">ระดับ 2: ปานกลาง</option>
              <option value="low">ระดับ 1: ตรวจสอบปกติ</option>
            </select>
          </div>

          <div>
            <select
              id="admin-filter-category"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300/80 rounded-2xl text-xs sm:text-sm text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-rose-500 cursor-pointer"
            >
              <option value="all">หมวดหมู่: ทั้งหมด</option>
              {INCIDENT_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Incident List Table Bento Container */}
      <div className="bg-white border border-slate-200/80 rounded-3xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-600 font-bold text-xs">
                <th className="py-3.5 px-4 sm:px-5">รหัส / วันเวลา</th>
                <th className="py-3.5 px-4 sm:px-5">เหตุการณ์และสถานที่</th>
                <th className="py-3.5 px-4">ความเร่งด่วน</th>
                <th className="py-3.5 px-4">สถานะ</th>
                <th className="py-3.5 px-4">ผู้รับผิดชอบ</th>
                <th className="py-3.5 px-4">ผู้แจ้ง</th>
                <th className="py-3.5 px-4 sm:px-5 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    ไม่พบข้อมูลแจ้งเหตุตามเงื่อนไขที่ค้นหา
                  </td>
                </tr>
              ) : (
                filteredReports.map((item) => {
                  const statusMeta = STATUS_DEFINITIONS[item.status] || STATUS_DEFINITIONS.pending;
                  const urgencyMeta = URGENCY_LEVELS[item.urgency];

                  return (
                    <tr
                      key={item.id}
                      id={`admin-row-${item.id}`}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="py-4 px-4 sm:px-5 align-top">
                        <span className="font-mono font-extrabold text-slate-800 bg-slate-100/90 px-2.5 py-0.5 rounded-lg border border-slate-200/60 block w-max">
                          {item.id}
                        </span>
                        <span className="text-[11px] text-slate-400 mt-1 block">
                          {new Date(item.createdAt).toLocaleDateString('th-TH', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </td>

                      <td className="py-4 px-4 sm:px-5 align-top max-w-xs">
                        <div className="font-bold text-slate-900 leading-snug">{item.title}</div>
                        <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span className="truncate">
                            {item.locationZone} ({item.locationDetail})
                          </span>
                        </div>
                        {item.imageUrl && (
                          <span className="inline-block mt-1.5 text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/60">
                            📷 มีรูปภาพแนบ
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-4 align-top">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${urgencyMeta.badgeClass}`}
                        >
                          {urgencyMeta.label.split(':')[0]}
                        </span>
                      </td>

                      <td className="py-4 px-4 align-top">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${statusMeta.badgeClass}`}
                        >
                          {statusMeta.label}
                        </span>
                      </td>

                      <td className="py-4 px-4 align-top text-xs text-slate-600">
                        {item.assignedDepartment ? (
                          <div>
                            <div className="font-bold text-slate-800">{item.assignedDepartment}</div>
                            {item.assignedOfficer && (
                              <div className="text-[11px] text-slate-500 mt-0.5">
                                ({item.assignedOfficer})
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">ยังไม่มอบหมาย</span>
                        )}
                      </td>

                      <td className="py-4 px-4 align-top text-xs text-slate-600">
                        {item.isAnonymous ? (
                          <span className="text-slate-500 font-medium">🔒 ไม่เปิดเผยตัวตน</span>
                        ) : (
                          <div>
                            <span className="font-bold text-slate-800">{item.reporterName}</span>
                            <span className="text-[11px] text-slate-400 block">
                              {item.reporterRole || 'นักเรียน'}
                            </span>
                            {item.reporterContact && (
                              <span className="text-[10px] text-slate-500 block">
                                {item.reporterContact}
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      <td className="py-4 px-4 sm:px-5 align-top text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            id={`btn-edit-${item.id}`}
                            onClick={() => handleOpenEdit(item)}
                            title="อัปเดตสถานะและบันทึกงาน"
                            className="p-2 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl transition-all active:scale-95 cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            id={`btn-delete-${item.id}`}
                            onClick={() => handleDelete(item.id, item.title)}
                            title="ลบรายการ"
                            className="p-2 bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all active:scale-95 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Management Action Modal */}
      {editingReport && (
        <div
          id="admin-edit-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setEditingReport(null)}
        >
          <div
            id="admin-edit-modal-content"
            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200/80 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-6 sm:px-7 py-5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-rose-400 bg-rose-950/80 px-2.5 py-0.5 rounded-lg border border-rose-800/50">
                    {editingReport.id}
                  </span>
                  <h3 className="font-extrabold text-base sm:text-lg">อัปเดตสถานะและมอบหมายงาน</h3>
                </div>
                <p className="text-xs text-slate-400 mt-1 truncate max-w-md">
                  {editingReport.title}
                </p>
              </div>
              <button
                onClick={() => setEditingReport(null)}
                className="text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveEdit}>
              <div className="p-6 sm:p-7 space-y-4 max-h-[70vh] overflow-y-auto text-xs sm:text-sm">
                {/* Status selector */}
                <div>
                  <label className="block font-bold text-slate-800 mb-2">
                    ปรับเปลี่ยนสถานะการดำเนินงาน <span className="text-rose-600">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(['pending', 'investigating', 'in_progress', 'resolved'] as IncidentStatus[]).map(
                      (st) => {
                        const isSelected = editStatus === st;
                        const meta = STATUS_DEFINITIONS[st];
                        return (
                          <button
                            key={st}
                            type="button"
                            onClick={() => setEditStatus(st)}
                            className={`p-3 rounded-2xl border text-center font-bold text-xs transition-all cursor-pointer ${
                              isSelected
                                ? `${meta.badgeClass} ring-2 ring-rose-500 shadow-2xs`
                                : 'border-slate-200 bg-slate-50/80 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            {meta.label}
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>

                {/* Responsible department */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      หน่วยงานที่รับผิดชอบ
                    </label>
                    <select
                      value={editDepartment}
                      onChange={(e) => setEditDepartment(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300/80 rounded-2xl text-xs sm:text-sm cursor-pointer"
                    >
                      {DEPARTMENTS.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      ชื่อเจ้าหน้าที่ผู้ดำเนินการ
                    </label>
                    <input
                      type="text"
                      placeholder="เช่น ครูสมเกียรติ, ช่างประสิทธิ์"
                      value={editOfficer}
                      onChange={(e) => setEditOfficer(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300/80 rounded-2xl text-xs sm:text-sm"
                    />
                  </div>
                </div>

                {/* Officer note */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    สรุปผลการจัดการ / หมายเหตุอย่างเป็นทางการ
                  </label>
                  <textarea
                    rows={2}
                    placeholder="ระบุสิ่งที่ดำเนินการแก้ไข เช่น ซ่อมแซมแล้วเสร็จ, ดำเนินการปรับความเข้าใจ, ส่งตัวห้องพยาบาล..."
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300/80 rounded-2xl text-xs sm:text-sm"
                  />
                </div>

                {/* Add new timeline message */}
                <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80">
                  <label className="block font-bold text-slate-800 mb-1">
                    ➕ บันทึกข้อความไทม์ไลน์ใหม่ (ผู้แจ้งเหตุจะมองเห็นข้อความนี้)
                  </label>
                  <input
                    type="text"
                    placeholder="เช่น 'กำลังประสานงานช่างเข้าซ่อมแซมช่วง 15:30 น.' หรือ 'ตรวจสถานที่เรียบร้อย ปลอดภัยแล้ว'"
                    value={timelineMessage}
                    onChange={(e) => setTimelineMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300/80 rounded-xl text-xs sm:text-sm"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    ระบบจะบันทึกวันที่-เวลา และแนบชื่อเจ้าหน้าที่ลงในไทม์ไลน์โดยอัตโนมัติ
                  </span>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-slate-50/80 px-6 sm:px-7 py-4 border-t border-slate-200/80 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingReport(null)}
                  className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors cursor-pointer"
                >
                  {isSaving ? 'กำลังบันทึก...' : 'บันทึกการอัปเดต'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  Camera,
  CheckCircle2,
  Copy,
  Info,
  Lock,
  MapPin,
  PhoneCall,
  Send,
  Upload,
  UserCheck,
  X,
} from 'lucide-react';
import { INCIDENT_CATEGORIES, SCHOOL_ZONES, URGENCY_LEVELS } from '../data/mockData';
import { addIncidentReport, generateIncidentId } from '../services/storage';
import { IncidentCategory, IncidentReport, UrgencyLevel } from '../types';
import { CategoryIcon } from './CategoryIcon';

interface ReportFormProps {
  onSuccess: (newReportId: string) => void;
  onOpenEmergency: () => void;
  mode?: 'rutan' | 'wesee';
  onBackToHome?: () => void;
}

export const ReportForm: React.FC<ReportFormProps> = ({
  onSuccess,
  onOpenEmergency,
  mode = 'rutan',
  onBackToHome,
}) => {
  // Form States
  const [category, setCategory] = useState<IncidentCategory>(
    mode === 'wesee' ? 'bullying' : 'accident'
  );
  const [urgency, setUrgency] = useState<UrgencyLevel>('medium');
  const [locationZone, setLocationZone] = useState<string>(
    mode === 'wesee' ? 'ภายนอกสถานศึกษา / ชุมชนโดยรอบ' : SCHOOL_ZONES[0]
  );

  useEffect(() => {
    if (mode === 'wesee') {
      setCategory('bullying');
      setLocationZone('ภายนอกสถานศึกษา / ชุมชนโดยรอบ');
    }
  }, [mode]);
  const [locationDetail, setLocationDetail] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [dateTime, setDateTime] = useState<string>(() => {
    const now = new Date();
    // format YYYY-MM-DDThh:mm
    const tzOffset = now.getTimezoneOffset() * 60000;
    return new Date(now.getTime() - tzOffset).toISOString().slice(0, 16);
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Identity States
  const [isAnonymous, setIsAnonymous] = useState<boolean>(true);
  const [reporterName, setReporterName] = useState<string>('');
  const [reporterRole, setReporterRole] = useState<'นักเรียน' | 'ครู/บุคลากร' | 'ผู้ปกครอง' | 'บุคคลภายนอก'>('นักเรียน');
  const [reporterContact, setReporterContact] = useState<string>('');

  // UI States
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedReport, setSubmittedReport] = useState<IncidentReport | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Image Upload Handler with size downscaling
  const handleImageChange = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      // Downscale image if too large for localStorage safety
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const scaleSize = MAX_WIDTH / img.width;
        if (scaleSize < 1) {
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
        } else {
          canvas.width = img.width;
          canvas.height = img.height;
        }
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          setImagePreview(canvas.toDataURL('image/jpeg', 0.8));
        } else {
          setImagePreview(result);
        }
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageChange(e.dataTransfer.files[0]);
    }
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!title.trim()) {
      errs.title = 'กรุณากรอกหัวข้อเหตุการณ์สั้นๆ';
    }
    if (!description.trim()) {
      errs.description = 'กรุณาระบุรายละเอียดเหตุการณ์ที่เกิดขึ้น';
    }
    if (!locationDetail.trim()) {
      errs.locationDetail = 'กรุณาระบุจุดเกิดเหตุให้ชัดเจน (เช่น ชั้น, หมายเลขห้อง, ฝั่ง)';
    }
    if (!isAnonymous && !reporterName.trim()) {
      errs.reporterName = 'กรุณาระบุชื่อผู้แจ้ง หรือเลือกโหมดไม่เปิดเผยตัวตน';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const now = new Date();
      const thaiTimestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} น.`;
      const id = generateIncidentId();

      const newReport: IncidentReport = {
        id,
        title: title.trim(),
        category,
        urgency,
        locationZone,
        locationDetail: locationDetail.trim(),
        dateTime: new Date(dateTime).toISOString(),
        description: description.trim(),
        imageUrl: imagePreview || undefined,
        isAnonymous,
        reporterName: isAnonymous ? undefined : reporterName.trim(),
        reporterRole: isAnonymous ? undefined : reporterRole,
        reporterContact: isAnonymous ? undefined : reporterContact.trim(),
        status: 'pending',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        timeline: [
          {
            id: `tl-${Date.now()}`,
            status: 'pending',
            message: `รับแจ้งเรื่องในระบบเรียบร้อยแล้ว รหัสติดตาม ${id}`,
            timestamp: thaiTimestamp,
          },
        ],
      };

      addIncidentReport(newReport);
      setSubmittedReport(newReport);
    } catch (err) {
      console.error('Error submitting report:', err);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyTrackingId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setLocationDetail('');
    setImagePreview(null);
    setSubmittedReport(null);
    setErrors({});
    setIsAnonymous(true);
    setReporterName('');
    setReporterContact('');
  };

  // SUCCESS SUBMISSION SCREEN
  if (submittedReport) {
    return (
      <div id="submission-success-card" className="max-w-2xl mx-auto my-8 bg-white rounded-3xl shadow-sm border border-emerald-100 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 px-6 py-8 text-center text-white">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3 backdrop-blur-xs">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">บันทึกข้อมูลการแจ้งเหตุสำเร็จ</h2>
          <p className="text-emerald-100 text-sm mt-1">
            เจ้าหน้าที่ฝ่ายความปลอดภัยและงานที่เกี่ยวข้องได้รับเรื่องแล้ว
          </p>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-6 text-center shadow-2xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              รหัสติดตามเหตุการณ์ของคุณ (Ticket ID)
            </span>
            <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-wider my-3 font-mono">
              {submittedReport.id}
            </div>
            <p className="text-xs text-slate-500 mb-4 max-w-sm mx-auto">
              โปรดจดหรือบันทึกรหัสนี้ไว้ เพื่อใช้ตรวจสอบสถานะความคืบหน้าการแก้ไขปัญหา
            </p>
            <button
              id="btn-copy-ticket-id"
              onClick={() => copyTrackingId(submittedReport.id)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-300/80 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-600">คัดลอกรหัสแล้ว!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-500" />
                  <span>คัดลอกรหัสติดตาม</span>
                </>
              )}
            </button>
          </div>

          <div className="border border-slate-200/80 rounded-2xl p-5 bg-white space-y-3 text-sm shadow-2xs">
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
              <span className="text-slate-500 text-xs font-medium">เรื่อง:</span>
              <span className="font-bold text-slate-800 text-right">{submittedReport.title}</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
              <span className="text-slate-500 text-xs font-medium">สถานที่:</span>
              <span className="text-slate-800 text-right">{submittedReport.locationZone} ({submittedReport.locationDetail})</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
              <span className="text-slate-500 text-xs font-medium">ระดับความเร่งด่วน:</span>
              <span className="font-bold text-slate-800 text-right">{URGENCY_LEVELS[submittedReport.urgency].label}</span>
            </div>
            <div className="flex justify-between items-center py-1.5">
              <span className="text-slate-500 text-xs font-medium">การระบุตัวตน:</span>
              <span className="text-slate-800 text-right">
                {submittedReport.isAnonymous ? 'ไม่เปิดเผยตัวตน (Anonymous)' : submittedReport.reporterName}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              id="btn-goto-tracking"
              onClick={() => onSuccess(submittedReport.id)}
              className="flex-1 py-3 px-5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <span>ไปที่หน้าติดตามสถานะ</span>
            </button>
            <button
              id="btn-report-another"
              onClick={resetForm}
              className="py-3 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-colors"
            >
              แจ้งเหตุรายการอื่น
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="report-form-container" className="max-w-4xl mx-auto py-4 px-4 sm:px-6 space-y-4">
      {/* Bento Introduction Header Card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs">
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

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 border border-rose-100 rounded-full text-xs font-bold text-rose-700 mb-2">
              <Lock className="w-3.5 h-3.5" />
              <span>
                {mode === 'wesee'
                  ? 'We See Alert • พสน. โรงเรียนบ้านบวกหมื้อ (สพป.เชียงใหม่ เขต 2)'
                  : 'RUTAN (รู้ทัน) • โรงเรียนบ้านบวกหมื้อ (ข้อมูลปลอดภัย)'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {mode === 'wesee'
                ? 'แจ้งพฤติกรรมไม่เหมาะสมของนักเรียนนอกสถานศึกษา (พสน.)'
                : 'แบบฟอร์มแจ้งเหตุความไม่ปลอดภัย/จุดเสี่ยง (RUTAN)'}
            </h1>
            <p className="text-slate-600 text-sm mt-1.5 leading-relaxed max-w-2xl">
              {mode === 'wesee'
                ? 'ศูนย์พนักงานเจ้าหน้าที่ส่งเสริมความประพฤตินักเรียนและนักศึกษา (พสน.) สพป.เชียงใหม่ เขต 2 รับแจ้งเหตุพฤติกรรมเสี่ยง แหล่งมั่วสุม หนีเรียน หรือความรุนแรงนอกรั้วโรงเรียน พร้อมคุ้มครองความลับผู้แจ้ง'
                : 'ร่วมสร้างสถานศึกษาปลอดภัย หากพบเห็นอันตราย สิ่งชำรุด หรือเหตุการณ์ที่อาจส่งผลต่อสวัสดิภาพ สามารถแจ้งได้ทันที และเลือกที่จะไม่เปิดเผยตัวตนได้'}
            </p>
          </div>
          <button
            type="button"
            id="btn-form-emergency"
            onClick={onOpenEmergency}
            className="shrink-0 flex items-center gap-2 px-4 py-3 bg-rose-50 border border-rose-200/80 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-2xl transition-all shadow-2xs active:scale-95 cursor-pointer"
          >
            <PhoneCall className="w-4 h-4 text-rose-600" />
            <span>เหตุวิกฤต? สายด่วน</span>
          </button>
        </div>
      </div>

      {/* Main Bento Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200/80 rounded-3xl shadow-xs overflow-hidden">
        <div className="p-6 sm:p-8 space-y-8">
          {/* Bento Section 1: Categories */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 text-xs flex items-center justify-center font-bold">1</span>
                <span>เลือกประเภทเหตุการณ์</span>
                <span className="text-rose-600">*</span>
              </label>
              <span className="text-xs text-slate-500 hidden sm:inline">เลือกประเภทที่ตรงกับเหตุการณ์มากที่สุด</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {INCIDENT_CATEGORIES.map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    id={`cat-card-${cat.id}`}
                    onClick={() => setCategory(cat.id)}
                    className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-rose-600 bg-rose-50/50 shadow-xs ring-2 ring-rose-500/20'
                        : 'border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/60 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className={`p-2 rounded-xl ${cat.colorClass}`}>
                        <CategoryIcon name={cat.iconName} className="w-5 h-5" />
                      </div>
                      <span className={`text-xs font-bold ${isSelected ? 'text-rose-900' : 'text-slate-800'}`}>
                        {cat.label}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-tight">
                      {cat.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bento Section 2: Urgency Level */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <label className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 text-xs flex items-center justify-center font-bold">2</span>
              <span>ระดับความเร่งด่วน</span>
              <span className="text-rose-600">*</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {(Object.keys(URGENCY_LEVELS) as UrgencyLevel[]).map((key) => {
                const u = URGENCY_LEVELS[key];
                const isSelected = urgency === key;
                return (
                  <div
                    key={key}
                    id={`urgency-option-${key}`}
                    onClick={() => setUrgency(key)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? key === 'critical'
                          ? 'border-rose-600 bg-rose-50 ring-2 ring-rose-500/20 shadow-xs'
                          : 'border-rose-600 bg-rose-50/40 ring-2 ring-rose-500/20 shadow-xs'
                        : 'border-slate-200/80 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${u.badgeClass}`}>
                        {u.label}
                      </span>
                      <input
                        type="radio"
                        name="urgency"
                        checked={isSelected}
                        onChange={() => setUrgency(key)}
                        className="accent-rose-600"
                      />
                    </div>
                    <p className="text-[11px] text-slate-600 leading-normal">{u.description}</p>
                  </div>
                );
              })}
            </div>

            {/* Warning when critical is selected */}
            {urgency === 'critical' && (
              <div className="p-4 bg-rose-100/70 border border-rose-300 rounded-2xl flex items-start gap-3 text-xs text-rose-900 animate-in fade-in duration-200">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-bold">⚠️ กรณีฉุกเฉินวิกฤต: </span>
                  หากเหตุการณ์ดังกล่าวอาจทำให้เกิดอันตรายถึงชีวิต ให้โทรแจ้งสายด่วนทันที เช่น{' '}
                  <button
                    type="button"
                    onClick={onOpenEmergency}
                    className="underline font-bold text-rose-800 hover:text-rose-950"
                  >
                    ห้องพยาบาล หรือ สายด่วน 1669 / 191
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Bento Section 3: Location and Time */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <label className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 text-xs flex items-center justify-center font-bold">3</span>
              <span>สถานที่และเวลาเกิดเหตุ</span>
              <span className="text-rose-600">*</span>
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  โซน / บริเวณในโรงเรียน
                </label>
                <select
                  id="select-location-zone"
                  value={locationZone}
                  onChange={(e) => setLocationZone(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300/80 rounded-2xl text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500 focus:bg-white text-slate-800 transition-colors"
                >
                  {SCHOOL_ZONES.map((zone) => (
                    <option key={zone} value={zone}>
                      {zone}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  วัน-เวลาที่พบเหตุ
                </label>
                <input
                  type="datetime-local"
                  id="input-datetime"
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300/80 rounded-2xl text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500 focus:bg-white text-slate-800 transition-colors"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  จุดเกิดเหตุที่ชัดเจน (ห้อง / ชั้น / ตำแหน่งอ้างอิง) <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  id="input-location-detail"
                  placeholder="ตัวอย่าง: ชั้น 3 หน้าห้อง 302 ใกล้บันไดฝั่งตะวันออก"
                  value={locationDetail}
                  onChange={(e) => setLocationDetail(e.target.value)}
                  className={`w-full px-4 py-2.5 bg-slate-50 border rounded-2xl text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500 focus:bg-white text-slate-800 transition-colors ${
                    errors.locationDetail ? 'border-rose-500 bg-rose-50/20' : 'border-slate-300/80'
                  }`}
                />
                {errors.locationDetail && (
                  <p className="text-xs text-rose-600 mt-1">{errors.locationDetail}</p>
                )}
              </div>
            </div>
          </div>

          {/* Bento Section 4: Incident Details */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <label className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 text-xs flex items-center justify-center font-bold">4</span>
              <span>รายละเอียดเหตุการณ์</span>
              <span className="text-rose-600">*</span>
            </label>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                หัวข้อเหตุการณ์สรุปสั้นๆ <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                id="input-title"
                placeholder="ตัวอย่าง: แผ่นฝ้าเพดานหลุดร่วง, พบควันไฟจากแอร์, นักเรียนบาดเจ็บข้อเท้าแพลง"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-2xl text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500 focus:bg-white text-slate-800 transition-colors ${
                  errors.title ? 'border-rose-500 bg-rose-50/20' : 'border-slate-300/80'
                }`}
              />
              {errors.title && <p className="text-xs text-rose-600 mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                คำอธิบายรายละเอียดเหตุการณ์ <span className="text-rose-600">*</span>
              </label>
              <textarea
                id="input-description"
                rows={4}
                placeholder="อธิบายสิ่งที่พบเห็น ลักษณะอาการ คนที่เกี่ยวข้อง หรือความช่วยเหลือที่ต้องการเร่งด่วน..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`w-full px-4 py-3 bg-slate-50 border rounded-2xl text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500 focus:bg-white text-slate-800 transition-colors ${
                  errors.description ? 'border-rose-500 bg-rose-50/20' : 'border-slate-300/80'
                }`}
              />
              {errors.description && <p className="text-xs text-rose-600 mt-1">{errors.description}</p>}
            </div>

            {/* Photo Attachment Bento Box */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                แนบภาพถ่ายประกอบเหตุการณ์ (ถ้ามี)
              </label>

              {imagePreview ? (
                <div className="relative inline-block border border-slate-300/80 rounded-2xl overflow-hidden shadow-xs group">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-56 max-w-full rounded-2xl object-contain bg-slate-900"
                  />
                  <button
                    type="button"
                    id="btn-remove-image"
                    onClick={() => setImagePreview(null)}
                    className="absolute top-2 right-2 p-1.5 bg-rose-600 text-white rounded-full hover:bg-rose-700 shadow-md transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  id="image-drop-zone"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-rose-400 hover:bg-rose-50/20 rounded-2xl p-6 text-center cursor-pointer transition-colors"
                >
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-2 text-slate-500">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-bold text-slate-700">
                    คลิกเพื่ออัปโหลด หรือลากไฟล์รูปภาพมาวางที่นี่
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    รองรับ JPG, PNG (รูปภาพจะช่วยให้เจ้าหน้าที่ประเมินสถานการณ์ได้รวดเร็วขึ้น)
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleImageChange(e.target.files[0]);
                      }
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Bento Section 5: Anonymous vs Identified */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 text-xs flex items-center justify-center font-bold">5</span>
                <span>ข้อมูลผู้แจ้งเหตุและมาตรการคุ้มครอง</span>
              </label>
            </div>

            {/* Toggle Card Bento */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                id="btn-mode-anonymous"
                onClick={() => setIsAnonymous(true)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                  isAnonymous
                    ? 'border-emerald-500 bg-emerald-50/40 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'border-slate-200/80 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700 shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">แจ้งแบบไม่เปิดเผยตัวตน</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      แนะนำ
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                    ระบบจะไม่บันทึกชื่อ นามสกุล หรือข้อมูลส่วนตัวใดๆ ปลอดภัยสำหรับนักเรียน 100%
                  </p>
                </div>
              </div>

              <div
                id="btn-mode-identified"
                onClick={() => setIsAnonymous(false)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                  !isAnonymous
                    ? 'border-blue-500 bg-blue-50/40 ring-2 ring-blue-500/20 shadow-xs'
                    : 'border-slate-200/80 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="p-2.5 rounded-xl bg-blue-100 text-blue-700 shrink-0">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900">ระบุข้อมูลผู้แจ้ง</span>
                  <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                    ช่วยให้เจ้าหน้าที่สามารถติดต่อสอบถามรายละเอียดเพิ่มเติมหรือแจ้งผลได้โดยตรง
                  </p>
                </div>
              </div>
            </div>

            {/* Identified fields Bento */}
            {!isAnonymous && (
              <div className="p-5 bg-slate-50/80 border border-slate-200/80 rounded-2xl space-y-3 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      สถานะผู้แจ้ง
                    </label>
                    <select
                      id="select-reporter-role"
                      value={reporterRole}
                      onChange={(e) => setReporterRole(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white border border-slate-300/80 rounded-xl text-xs"
                    >
                      <option value="นักเรียน">นักเรียน</option>
                      <option value="ครู/บุคลากร">ครู/บุคลากร</option>
                      <option value="ผู้ปกครอง">ผู้ปกครอง</option>
                      <option value="บุคคลภายนอก">บุคคลภายนอก</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      ชื่อ-นามสกุล หรือชื่อเล่น <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="input-reporter-name"
                      placeholder="เช่น ด.ช.สมชาย หรือ ครูสมหญิง"
                      value={reporterName}
                      onChange={(e) => setReporterName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300/80 rounded-xl text-xs"
                    />
                    {errors.reporterName && (
                      <p className="text-xs text-rose-600 mt-1">{errors.reporterName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      เบอร์โทรศัพท์ หรือ ระดับชั้น
                    </label>
                    <input
                      type="text"
                      id="input-reporter-contact"
                      placeholder="เช่น 081-xxx-xxxx หรือ ม.3/4"
                      value={reporterContact}
                      onChange={(e) => setReporterContact(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300/80 rounded-xl text-xs"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bento Form Footer / Submit */}
        <div className="bg-slate-50/90 px-6 sm:px-8 py-5 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-slate-400 shrink-0" />
            <span>ข้อมูลจะถูกส่งเข้าศูนย์ปฏิบัติการความปลอดภัยโรงเรียนโดยทันที</span>
          </div>

          <button
            type="submit"
            id="btn-submit-report"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-7 py-3 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 disabled:opacity-50 text-white font-bold text-sm rounded-2xl shadow-md shadow-rose-200 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
          >
            {isSubmitting ? (
              <span>กำลังส่งข้อมูล...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>ยืนยันส่งข้อมูลแจ้งเหตุ</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Shield,
  Plus,
  MapPin,
  Clock,
  Users,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  ChevronRight,
  ArrowLeft,
  Building2,
  Phone,
  Search,
} from 'lucide-react';

export interface RiskActivity {
  id: string;
  activityName: string;
  schoolName: string;
  category: 'ทัศนศึกษา' | 'กิจกรรมทางน้ำ' | 'กิจกรรมผจญภัย/ลูกเสือ' | 'ห้องปฏิบัติการวิทยาศาสตร์' | 'การแข่งขันกีฬา' | 'อื่นๆ';
  location: string;
  leaderTeacher: string;
  contactPhone: string;
  studentCount: number;
  startDate: string;
  endDate: string;
  safetyChecklistPassed: boolean;
  status: 'planning' | 'checked_in' | 'in_progress' | 'completed';
  notes?: string;
}

const INITIAL_ACTIVITIES: RiskActivity[] = [
  {
    id: 'ACT-CME2-001',
    activityName: 'ทัศนศึกษาศูนย์การเรียนรู้ดาราศาสตร์ อ.แม่ริม',
    schoolName: 'โรงเรียนบ้านแม่ริม',
    category: 'ทัศนศึกษา',
    location: 'อุทยานดาราศาสตร์สิรินธร อ.แม่ริม จ.เชียงใหม่',
    leaderTeacher: 'ครูสมพร สุขเกษม',
    contactPhone: '089-123-4567',
    studentCount: 85,
    startDate: '2025-09-03 08:30',
    endDate: '2025-09-03 16:30',
    safetyChecklistPassed: true,
    status: 'in_progress',
    notes: 'เดินทางด้วยรถบัส 2 คัน มีครูเวรดูแล 6 ท่าน ตรวจความพร้อมเบาะและเข็มขัดนิรภัยเรียบร้อย',
  },
  {
    id: 'ACT-CME2-002',
    activityName: 'ค่ายพักแรมลูกเสือ-เนตรนารี ประจำปีการศึกษา 2568',
    schoolName: 'โรงเรียนสันทรายวิทยา',
    category: 'กิจกรรมผจญภัย/ลูกเสือ',
    location: 'ค่ายลูกเสือเหนือดอย อ.แม่แตง',
    leaderTeacher: 'ครูชัยยุทธ กิตติศักดิ์',
    contactPhone: '081-445-6789',
    studentCount: 140,
    startDate: '2025-09-05 08:00',
    endDate: '2025-09-07 15:00',
    safetyChecklistPassed: true,
    status: 'checked_in',
    notes: 'จัดเตรียมหน่วยปฐมพยาบาลและประสานงาน รพ.สต. ใกล้เคียงเรียบร้อย',
  },
  {
    id: 'ACT-CME2-003',
    activityName: 'การฝึกทักษะการว่ายน้ำเพื่อเอาชีวิตรอด (Survival Swim)',
    schoolName: 'โรงเรียนบ้านป่าแดด',
    category: 'กิจกรรมทางน้ำ',
    location: 'สระว่ายน้ำเทศบาลตำบลแม่ริม',
    leaderTeacher: 'ครูณัฐพล วงศ์สว่าง (ครูพละ/กู้ชีพทางน้ำ)',
    contactPhone: '086-778-9900',
    studentCount: 42,
    startDate: '2025-09-02 13:00',
    endDate: '2025-09-02 15:30',
    safetyChecklistPassed: true,
    status: 'completed',
    notes: 'มีไลฟ์การ์ด 3 คน และเสื้อชูชีพขนาดพอดีตัวครบทุกคน',
  },
];

interface RiskTrackerViewProps {
  onBackToHome: () => void;
  onGoToReport: () => void;
}

export const RiskTrackerView: React.FC<RiskTrackerViewProps> = ({
  onBackToHome,
  onGoToReport,
}) => {
  const [activities, setActivities] = useState<RiskActivity[]>(INITIAL_ACTIVITIES);
  const [showCheckInModal, setShowCheckInModal] = useState<boolean>(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // New check-in form state
  const [formActivityName, setFormActivityName] = useState('');
  const [formSchoolName, setFormSchoolName] = useState('');
  const [formCategory, setFormCategory] = useState<RiskActivity['category']>('ทัศนศึกษา');
  const [formLocation, setFormLocation] = useState('');
  const [formTeacher, setFormTeacher] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formStudentCount, setFormStudentCount] = useState<number>(30);
  const [formNotes, setFormNotes] = useState('');
  const [checklistSafetyGear, setChecklistSafetyGear] = useState(false);
  const [checklistParentConsent, setChecklistParentConsent] = useState(false);
  const [checklistFirstAid, setChecklistFirstAid] = useState(false);

  const handleCreateCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formActivityName || !formSchoolName || !formTeacher || !formPhone) {
      alert('กรุณากรอกข้อมูลสำคัญให้ครบถ้วน');
      return;
    }

    const newActivity: RiskActivity = {
      id: `ACT-CME2-${String(activities.length + 1).padStart(3, '0')}`,
      activityName: formActivityName,
      schoolName: formSchoolName,
      category: formCategory,
      location: formLocation || 'ภายในเขตพื้นที่',
      leaderTeacher: formTeacher,
      contactPhone: formPhone,
      studentCount: formStudentCount,
      startDate: new Date().toLocaleDateString('th-TH') + ' ' + new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      endDate: 'ตามกำหนดการของโรงเรียน',
      safetyChecklistPassed: checklistSafetyGear && checklistParentConsent && checklistFirstAid,
      status: 'checked_in',
      notes: formNotes || 'เช็กอินบันทึกความปลอดภัยก่อนเริ่มกิจกรรมเรียบร้อย',
    };

    setActivities([newActivity, ...activities]);
    setShowCheckInModal(false);
    // Reset form
    setFormActivityName('');
    setFormSchoolName('');
    setFormTeacher('');
    setFormPhone('');
    setFormNotes('');
    setChecklistSafetyGear(false);
    setChecklistParentConsent(false);
    setChecklistFirstAid(false);
  };

  const handleUpdateStatus = (id: string, newStatus: RiskActivity['status']) => {
    setActivities((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
  };

  const filtered = activities.filter((act) => {
    const matchCat = filterCategory === 'all' || act.category === filterCategory;
    const matchSearch =
      !searchQuery ||
      act.activityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.schoolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.leaderTeacher.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div id="risk-tracker-container" className="max-w-7xl mx-auto py-4 px-4 sm:px-6 space-y-4">
      {/* Top Banner Bento */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-purple-900 text-white rounded-3xl p-6 sm:p-8 shadow-xs border border-purple-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-1.5 text-xs text-purple-200 hover:text-white mb-3 px-3 py-1 bg-white/10 rounded-full cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>กลับสู่หน้าเมนูแรก</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Risk Tracker • โรงเรียนบ้านบวกหมื้อ (สพป.เชียงใหม่ เขต 2)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-2">
              ติดตามสถานะกิจกรรมความเสี่ยงสูง (Check-in System)
            </h1>
            <p className="text-purple-200 text-xs sm:text-sm mt-1 max-w-2xl">
              ระบบเฝ้าระวังและเช็กอินสวัสดิภาพการจัดกิจกรรมนอกสถานที่ ทัศนศึกษา แคมป์ปิ้ง และกิจกรรมทางน้ำ เพื่อความปลอดภัยสูงสุดของนักเรียน
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="btn-open-checkin"
              onClick={() => setShowCheckInModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ เช็กอินกิจกรรมใหม่</span>
            </button>
            <button
              onClick={onGoToReport}
              className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>แจ้งเหตุฉุกเฉินระหว่างกิจกรรม</span>
            </button>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-purple-800/80">
          <div className="bg-purple-950/60 border border-purple-800/60 rounded-2xl p-4">
            <span className="text-xs text-purple-300 block font-semibold">กิจกรรมทั้งหมด</span>
            <span className="text-2xl sm:text-3xl font-black text-white mt-1 block">{activities.length}</span>
          </div>
          <div className="bg-purple-950/60 border border-purple-800/60 rounded-2xl p-4">
            <span className="text-xs text-amber-300 block font-semibold">กำลังดำเนินกิจกรรม</span>
            <span className="text-2xl sm:text-3xl font-black text-amber-400 mt-1 block">
              {activities.filter((a) => a.status === 'in_progress').length}
            </span>
          </div>
          <div className="bg-purple-950/60 border border-purple-800/60 rounded-2xl p-4">
            <span className="text-xs text-blue-300 block font-semibold">เช็กอินแล้ว / เตรียมพร้อม</span>
            <span className="text-2xl sm:text-3xl font-black text-blue-400 mt-1 block">
              {activities.filter((a) => a.status === 'checked_in').length}
            </span>
          </div>
          <div className="bg-purple-950/60 border border-purple-800/60 rounded-2xl p-4">
            <span className="text-xs text-emerald-300 block font-semibold">เสร็จสิ้นปลอดภัย</span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1 block">
              {activities.filter((a) => a.status === 'completed').length}
            </span>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ค้นหากิจกรรม, ชื่อโรงเรียน หรือครูผู้รับผิดชอบ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300/80 rounded-2xl text-xs sm:text-sm focus:ring-2 focus:ring-purple-500 focus:bg-white text-slate-800 transition-colors"
            />
          </div>
          <div className="sm:col-span-4">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300/80 rounded-2xl text-xs sm:text-sm text-slate-700 focus:ring-2 focus:ring-purple-500 cursor-pointer"
            >
              <option value="all">ทุกประเภทกิจกรรม</option>
              <option value="ทัศนศึกษา">ทัศนศึกษา</option>
              <option value="กิจกรรมทางน้ำ">กิจกรรมทางน้ำ</option>
              <option value="กิจกรรมผจญภัย/ลูกเสือ">กิจกรรมผจญภัย/ลูกเสือ</option>
              <option value="ห้องปฏิบัติการวิทยาศาสตร์">ห้องปฏิบัติการวิทยาศาสตร์</option>
              <option value="การแข่งขันกีฬา">การแข่งขันกีฬา</option>
              <option value="อื่นๆ">อื่นๆ</option>
            </select>
          </div>
        </div>
      </div>

      {/* Activity List Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filtered.map((item) => {
          const statusBadge =
            item.status === 'in_progress'
              ? { text: 'กำลังดำเนินกิจกรรม', bg: 'bg-amber-100 text-amber-800 border-amber-200' }
              : item.status === 'checked_in'
              ? { text: 'เช็กอินพร้อมเริ่ม', bg: 'bg-blue-100 text-blue-800 border-blue-200' }
              : { text: 'เสร็จสิ้นเรียบร้อย', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200' };

          return (
            <div
              key={item.id}
              className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200/60">
                    {item.id}
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${statusBadge.bg}`}
                  >
                    {statusBadge.text}
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-slate-900 leading-snug line-clamp-2 mb-2">
                  {item.activityName}
                </h3>

                <div className="space-y-1.5 text-xs text-slate-600 mb-4">
                  <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                    <Building2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    <span>{item.schoolName}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Users className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span>นักเรียนเข้าร่วม {item.studentCount} คน</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>เริ่ม: {item.startDate}</span>
                  </div>
                </div>

                {item.notes && (
                  <div className="p-3 bg-slate-50 rounded-2xl text-xs text-slate-600 border border-slate-100 mb-4 leading-relaxed">
                    {item.notes}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 truncate">
                    ครูผู้รับผิดชอบ: <strong>{item.leaderTeacher}</strong>
                  </span>
                  <a
                    href={`tel:${item.contactPhone.replace(/[^0-9]/g, '')}`}
                    className="inline-flex items-center gap-1 text-purple-700 font-bold hover:underline shrink-0"
                  >
                    <Phone className="w-3 h-3" />
                    <span>{item.contactPhone}</span>
                  </a>
                </div>

                {/* Status action toggle */}
                <div className="flex items-center gap-1.5 pt-1">
                  {item.status === 'checked_in' && (
                    <button
                      onClick={() => handleUpdateStatus(item.id, 'in_progress')}
                      className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      เริ่มดำเนินกิจกรรม
                    </button>
                  )}
                  {item.status === 'in_progress' && (
                    <button
                      onClick={() => handleUpdateStatus(item.id, 'completed')}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      ✓ บันทึกสิ้นสุดกิจกรรมปลอดภัย
                    </button>
                  )}
                  {item.status === 'completed' && (
                    <div className="w-full text-center py-1.5 text-emerald-700 bg-emerald-50 rounded-xl font-bold text-xs">
                      ✓ กิจกรรมเสร็จสิ้นอย่างปลอดภัย
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Check-In Modal */}
      {showCheckInModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setShowCheckInModal(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">เช็กอินกิจกรรมความเสี่ยงสูง (Check-in)</h3>
                <p className="text-xs text-slate-500">บันทึกข้อมูลและมาตรการป้องกันความปลอดภัยก่อนเริ่มกิจกรรม</p>
              </div>
              <button
                onClick={() => setShowCheckInModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCheckIn} className="space-y-3.5 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-800 mb-1">ชื่อกิจกรรม *</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น ทัศนศึกษาดอยสุเทพ, การเรียนว่ายน้ำ ป.4"
                  value={formActivityName}
                  onChange={(e) => setFormActivityName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">ชื่อโรงเรียน *</label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น โรงเรียนบ้านแม่ริม"
                    value={formSchoolName}
                    onChange={(e) => setFormSchoolName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">ประเภทกิจกรรม *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-slate-800"
                  >
                    <option value="ทัศนศึกษา">ทัศนศึกษา</option>
                    <option value="กิจกรรมทางน้ำ">กิจกรรมทางน้ำ</option>
                    <option value="กิจกรรมผจญภัย/ลูกเสือ">กิจกรรมผจญภัย/ลูกเสือ</option>
                    <option value="ห้องปฏิบัติการวิทยาศาสตร์">ห้องปฏิบัติการวิทยาศาสตร์</option>
                    <option value="การแข่งขันกีฬา">การแข่งขันกีฬา</option>
                    <option value="อื่นๆ">อื่นๆ</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">สถานที่จัดกิจกรรม</label>
                  <input
                    type="text"
                    placeholder="เช่น อุทยานแห่งชาติ, สระว่ายน้ำ"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">จำนวนนักเรียน (คน)</label>
                  <input
                    type="number"
                    min={1}
                    value={formStudentCount}
                    onChange={(e) => setFormStudentCount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">ครูหัวหน้ากิจกรรม *</label>
                  <input
                    type="text"
                    required
                    placeholder="ชื่อ-สกุล ครูผู้ดูแล"
                    value={formTeacher}
                    onChange={(e) => setFormTeacher(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">เบอร์โทรติดต่อฉุกเฉิน *</label>
                  <input
                    type="tel"
                    required
                    placeholder="08x-xxx-xxxx"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-slate-800"
                  />
                </div>
              </div>

              {/* Safety Checklist */}
              <div className="p-3.5 bg-purple-50/70 border border-purple-100 rounded-2xl space-y-2">
                <span className="font-bold text-purple-950 block text-xs">
                  ✓ ตรวจสอบมาตรการความปลอดภัยพื้นฐาน (Safety Checklist)
                </span>
                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checklistParentConsent}
                    onChange={(e) => setChecklistParentConsent(e.target.checked)}
                    className="rounded text-purple-600 focus:ring-purple-500"
                  />
                  <span>มีหนังสือขออนุญาตผู้ปกครองครบถ้วนทุกคน</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checklistSafetyGear}
                    onChange={(e) => setChecklistSafetyGear(e.target.checked)}
                    className="rounded text-purple-600 focus:ring-purple-500"
                  />
                  <span>มียานพาหนะ/อุปกรณ์นิรภัย/ชูชีพพร้อมใช้งานตามมาตรฐาน</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checklistFirstAid}
                    onChange={(e) => setChecklistFirstAid(e.target.checked)}
                    className="rounded text-purple-600 focus:ring-purple-500"
                  />
                  <span>จัดเตรียมชุดปฐมพยาบาลและข้อมูลประวัติแพ้ยาของนักเรียน</span>
                </label>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowCheckInModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs shadow-xs cursor-pointer"
                >
                  ยืนยันเช็กอินกิจกรรม
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

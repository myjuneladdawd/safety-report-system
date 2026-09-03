import React from 'react';
import {
  AlertTriangle,
  Bandage,
  BookOpen,
  Flame,
  HeartPulse,
  Phone,
  PhoneCall,
  ShieldAlert,
  ShieldCheck,
  UserX,
  Users,
} from 'lucide-react';
import { EMERGENCY_HOTLINES } from '../data/mockData';

interface SafetyGuidelinesProps {
  onOpenEmergency: () => void;
  onGoToReport: () => void;
}

export const SafetyGuidelines: React.FC<SafetyGuidelinesProps> = ({
  onOpenEmergency,
  onGoToReport,
}) => {
  return (
    <div id="safety-guidelines-container" className="max-w-7xl mx-auto py-4 px-4 sm:px-6 space-y-4">
      {/* Hero Header Bento Box */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xs border border-slate-800">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-rose-300 mb-3 border border-white/10">
            <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
            <span>คู่มือสวัสดิภาพและความปลอดภัยในสถานศึกษา</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            ขั้นตอนปฏิบัติเมื่อเกิดเหตุฉุกเฉินในโรงเรียน
          </h1>
          <p className="text-slate-300 text-sm mt-2 leading-relaxed">
            คู่มือสำหรับนักเรียน ครู และบุคลากรทางการศึกษา เพื่อให้ทุกคนมีความรู้และสามารถรับมือกับสถานการณ์ไม่คาดคิดได้อย่างถูกต้อง ปลอดภัย และทันท่วงที
          </p>

          <div className="flex flex-wrap gap-3 mt-6">
            <button
              onClick={onOpenEmergency}
              className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-2xl shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>เปิดรายชื่อสายด่วนฉุกเฉิน</span>
            </button>
            <button
              onClick={onGoToReport}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-2xl transition-all border border-white/20 active:scale-95 cursor-pointer"
            >
              <span>แจ้งเหตุความไม่ปลอดภัย</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Bento Safety Protocols */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Protocol 1: Fire & Evacuation */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
          <div>
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100/80 shrink-0">
                <Flame className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900">1. เมื่อเกิดเหตุเพลิงไหม้ (Fire Alarm)</h3>
                <span className="text-xs text-slate-500">ขั้นตอนการอพยพหนีไฟอย่างปลอดภัย</span>
              </div>
            </div>

            <ul className="space-y-3 text-xs text-slate-600">
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-rose-600 shrink-0">✓</span>
                <span><strong>มีสติ ไม่แตกตื่น:</strong> กดสัญญาณเตือนภัยทันทีเมื่อพบควันไฟหรือเปลวเพลิง</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-rose-600 shrink-0">✓</span>
                <span><strong>ห้ามใช้ลิฟต์เด็ดขาด:</strong> ให้อพยพผ่านบันไดหนีไฟตามป้ายสัญลักษณ์สีเขียว</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-rose-600 shrink-0">✓</span>
                <span><strong>หมอบต่ำเมื่อมีควัน:</strong> ใช้ผ้าชุบน้ำปิดจมูกและปาก คลานต่ำเนื่องจากอากาศบริสุทธิ์อยู่ใกล้พื้น</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-rose-600 shrink-0">✓</span>
                <span><strong>ไปที่จุดรวมพล (Assembly Point):</strong> รวมตัวกันที่สนามฟุตบอลกลาง และเช็กชื่อกับครูประจำชั้น</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-rose-700 font-bold">
            <span>สายด่วนดับเพลิง: 199</span>
            <span>จุดรวมพล: สนามฟุตบอลใหญ่</span>
          </div>
        </div>

        {/* Protocol 2: Anti-Bullying & Cyberbullying */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
          <div>
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100/80 shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900">2. การรับมือการบูลลี่และการคุกคาม</h3>
                <span className="text-xs text-slate-500">นโยบาย Zero-Tolerance โรงเรียนปลอดภัย</span>
              </div>
            </div>

            <ul className="space-y-3 text-xs text-slate-600">
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-purple-600 shrink-0">✓</span>
                <span><strong>หยุด (STOP):</strong> แสดงออกอย่างหนักแน่นว่าการกระทำนี้ไม่ถูกต้องและให้หยุดทันที</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-purple-600 shrink-0">✓</span>
                <span><strong>เก็บหลักฐาน (SCREENSHOT):</strong> กรณีทางออนไลน์ ให้แคปหน้าจอ วันเวลา ข้อความ และชื่อบัญชีผู้ส่ง</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-purple-600 shrink-0">✓</span>
                <span><strong>บอกผู้ใหญ่หรือแจ้งระบบ (REPORT):</strong> แจ้งในระบบแบบ "ไม่เปิดเผยตัวตน" เพื่อให้ฝ่ายปกครองเข้าช่วยเหลือ</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-purple-600 shrink-0">✓</span>
                <span><strong>ไม่เป็นผู้ยืนดูเงียบๆ (Upstander):</strong> หากเห็นเพื่อนโดนแกล้ง ให้พาเพื่อนออกมาและแจ้งครูทันที</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-purple-700 font-bold">
            <span>สายด่วน พม. คุ้มครองเด็ก: 1300</span>
            <span>ฝ่ายปกครอง: 081-999-8877</span>
          </div>
        </div>

        {/* Protocol 3: First Aid & Injury */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
          <div>
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100/80 shrink-0">
                <HeartPulse className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900">3. การปฐมพยาบาลเบื้องต้น (First Aid)</h3>
                <span className="text-xs text-slate-500">ช่วยชีวิตและบรรเทาอาการก่อนถึงมือแพทย์</span>
              </div>
            </div>

            <ul className="space-y-3 text-xs text-slate-600">
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-600 shrink-0">✓</span>
                <span><strong>เลือดกำเดาไหล:</strong> ให้นั่งก้มหน้าเล็กน้อย บีบปีกจมูก 5-10 นาที และประคบเย็นที่ดั้งจมูก (ห้ามเงยหน้า)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-600 shrink-0">✓</span>
                <span><strong>เป็นลมแดด / เป็นลม:</strong> พาย้ายเข้าที่ร่ม อากาศถ่ายเท คลายเสื้อผ้า ยกขาสูง ใช้ผ้าชุบน้ำเช็ดตามซอกคอ</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-600 shrink-0">✓</span>
                <span><strong>ข้อเท้าแพลง / กระแทก:</strong> ใช้หลัก RICE (Rest พัก, Ice ประคบเย็น, Compress รัดพัน, Elevate ยกสูง)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-600 shrink-0">✓</span>
                <span><strong>หมดสติไม่หายใจ:</strong> เริ่มทำ CPR กดหน้าอก 100-120 ครั้ง/นาที และโทรเรียกรถกู้ชีพ 1669 ทันที</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-700 font-bold">
            <span>กู้ชีพฉุกเฉิน: 1669</span>
            <span>ห้องพยาบาล: อาคาร 1 ชั้น 1</span>
          </div>
        </div>

        {/* Protocol 4: Intruder & Active Threat */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
          <div>
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100/80 shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900">4. บุคคลภายนอกต้องสงสัย / บุกรุก</h3>
                <span className="text-xs text-slate-500">แผนเผชิญเหตุบุคคลไม่พึงประสงค์ (Lockdown)</span>
              </div>
            </div>

            <ul className="space-y-3 text-xs text-slate-600">
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-amber-600 shrink-0">✓</span>
                <span><strong>หนี (RUN):</strong> หากมีเส้นทางปลอดภัย ให้ออกจากพื้นที่ทันที ทิ้งสิ่งของไว้ และเตือนผู้อื่น</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-amber-600 shrink-0">✓</span>
                <span><strong>ซ่อน (HIDE):</strong> หากหนีไม่ได้ ให้เข้าห้อง ล็อกประตู ปิดม่าน ปิดไฟ ปิดเสียงโทรศัพท์ และอยู่เงียบๆ</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-amber-600 shrink-0">✓</span>
                <span><strong>แจ้งครูหรือ รปภ.:</strong> แจ้งตำแหน่งและลักษณะของบุคคลต้องสงสัยอย่างเงียบๆ</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-amber-600 shrink-0">✓</span>
                <span><strong>รอสัญญาณปลอดภัย:</strong> อย่าเปิดประตูจนกว่าเจ้าหน้าที่ตำรวจหรือผู้บริหารโรงเรียนจะแจ้งด้วยตนเอง</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-amber-700 font-bold">
            <span>แจ้งเหตุด่วนตำรวจ: 191</span>
            <span>ป้อม รปภ. ประตูใหญ่: ต่อ 101</span>
          </div>
        </div>
      </div>

      {/* School Safety Pledge Bento Box */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 text-center shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3 border border-rose-100/80">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h3 className="font-extrabold text-lg text-slate-900">คำมั่นสัญญาด้านความปลอดภัยในสถานศึกษา</h3>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto mt-2 leading-relaxed">
          "นักเรียน ครู และบุคลากรทุกคน มีสิทธิได้รับการศึกษาและปฏิบัติหน้าที่ในสิ่งแวดล้อมที่มั่นคง ปลอดภัย ปราศจากความรุนแรง
          การกลั่นแกล้ง และอันตรายทางกายภาพ โรงเรียนพร้อมรับฟังทุกการแจ้งเหตุและคุ้มครองผู้แจ้งอย่างสูงสุด"
        </p>
      </div>
    </div>
  );
};

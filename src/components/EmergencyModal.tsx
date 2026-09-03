import React from 'react';
import { Phone, ShieldAlert, X, Clock, ExternalLink } from 'lucide-react';
import { EMERGENCY_HOTLINES } from '../data/mockData';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      id="emergency-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="emergency-modal-content"
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-rose-200/80 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-rose-600 px-6 sm:px-7 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-2xl">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-lg leading-tight">สายด่วนฉุกเฉินโรงเรียน</h3>
              <p className="text-rose-100 text-xs mt-0.5">โทรทันทีหากเกิดเหตุอันตรายเร่งด่วนถึงชีวิต</p>
            </div>
          </div>
          <button
            id="btn-close-emergency-modal"
            onClick={onClose}
            className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice */}
        <div className="bg-rose-50/80 border-b border-rose-100/80 px-6 py-3.5 text-xs text-rose-800 flex items-start gap-2">
          <span className="font-bold text-rose-900 shrink-0">⚠️ คำเตือน:</span>
          <span className="leading-relaxed">
            หากเกิดเหตุฉุกเฉินร้ายแรง เช่น ไฟไหม้ บาดเจ็บสาหัส หรือมีอาวุธ ให้โทรติดต่อสายด่วนทันทีก่อนการกรอกแบบฟอร์ม
          </span>
        </div>

        {/* Contact List Bento items */}
        <div className="p-5 sm:p-6 max-h-[60vh] overflow-y-auto space-y-3">
          {EMERGENCY_HOTLINES.map((contact) => (
            <div
              key={contact.id}
              id={`hotline-card-${contact.id}`}
              className={`p-4 rounded-2xl border transition-all hover:shadow-xs flex items-center justify-between gap-3 ${
                contact.isExternal
                  ? 'bg-slate-50/80 border-slate-200/80 hover:border-slate-300'
                  : 'bg-rose-50/40 border-rose-100 hover:border-rose-200'
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm text-slate-900 truncate">{contact.name}</span>
                  {contact.badge && (
                    <span className="px-2.5 py-0.5 text-[11px] rounded-full font-bold bg-rose-100 text-rose-700">
                      {contact.badge}
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-600 mt-0.5">{contact.role}</div>
                <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{contact.availableHours}</span>
                </div>
              </div>

              <a
                id={`call-button-${contact.id}`}
                href={`tel:${contact.phone.replace(/[^0-9]/g, '')}`}
                className="shrink-0 flex items-center gap-1.5 px-3.5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{contact.phone}</span>
              </a>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="bg-slate-50/80 px-6 py-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>โรงเรียนบ้านบวกหมื้อ • สพป.เชียงใหม่ เขต 2</span>
          <button
            id="btn-dismiss-emergency"
            onClick={onClose}
            className="text-slate-700 hover:text-slate-900 font-bold cursor-pointer"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};

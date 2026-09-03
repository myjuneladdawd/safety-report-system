import React, { useState } from 'react';
import {
  X,
  Send,
  ExternalLink,
  MessageCircle,
  Shield,
  PhoneCall,
  Sparkles,
  HelpCircle,
  CheckCheck,
} from 'lucide-react';

interface MessengerChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToReport: () => void;
  onOpenEmergency: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
}

export const MessengerChatModal: React.FC<MessengerChatModalProps> = ({
  isOpen,
  onClose,
  onGoToReport,
  onOpenEmergency,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'bot',
      text: 'สวัสดีครับ! ยินดีต้อนรับสู่ศูนย์รับแจ้งเหตุความไม่ปลอดภัยและจุดเสี่ยง โรงเรียนบ้านบวกหมื้อ มีเรื่องใดให้เจ้าหน้าที่ช่วยดูแลไหมครับ?',
      time: 'เมื่อสักครู่',
    },
  ]);
  const [inputText, setInputText] = useState('');

  if (!isOpen) return null;

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText,
      time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentInput = inputText;
    setInputText('');

    // Automated smart assistant response
    setTimeout(() => {
      let replyText = 'ขอบคุณที่ติดต่อศูนย์ความปลอดภัย โรงเรียนบ้านบวกหมื้อ ครับ เจ้าหน้าที่ได้รับข้อความแล้ว หากเป็นเหตุฉุกเฉินเร่งด่วนกรุณาใช้สายด่วน 191 หรือ 1669 ทันที';

      if (currentInput.includes('แจ้งเหตุ') || currentInput.includes('พสน') || currentInput.includes('ไม่ปลอดภัย')) {
        replyText = 'สำหรับการแจ้งเหตุความไม่ปลอดภัย หรือพฤติกรรมไม่เหมาะสมนอกสถานศึกษา (พสน.) ท่านสามารถกรอกแบบฟอร์ม RUTAN ผ่านระบบของโรงเรียนบ้านบวกหมื้อได้ทันที โดยเลือกแบบ "ไม่เปิดเผยตัวตน" เพื่อความปลอดภัยสูงสุดครับ';
      } else if (currentInput.includes('โทร') || currentInput.includes('เบอร์') || currentInput.includes('ด่วน')) {
        replyText = 'สามารถติดต่อสายด่วนโรงเรียนบ้านบวกหมื้อ หรือศูนย์ความปลอดภัย สพป.เชียงใหม่ เขต 2 ได้ที่ 053-123-456 หรือสายด่วนกระทรวงศึกษาธิการ MOE Safety Center 1579 (โทรฟรี 24 ชม.) ครับ';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: replyText,
          time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 600);
  };

  return (
    <div
      id="messenger-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-end sm:items-center justify-center sm:justify-end p-2 sm:p-6"
      onClick={onClose}
    >
      <div
        id="messenger-chat-window"
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 flex flex-col h-[560px] max-h-[90vh] animate-in slide-in-from-bottom-5 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Messenger Header */}
        <div className="bg-gradient-to-r from-[#0078FF] via-[#4F46E5] to-[#9333EA] text-white p-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#0078FF] font-black shadow-xs">
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 text-[#0078FF] fill-current"
                >
                  <path d="M12 2C6.477 2 2 6.145 2 11.259c0 2.913 1.454 5.512 3.727 7.185V22l3.435-1.884c.915.253 1.884.39 2.838.39 5.523 0 10-4.145 10-9.247C22 6.145 17.523 2 12 2zm1.034 12.443l-2.613-2.787-5.099 2.787 5.61-5.955 2.678 2.787 5.034-2.787-5.61 5.955z" />
                </svg>
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full" />
            </div>
            <div>
              <div className="font-extrabold text-sm flex items-center gap-1.5">
                <span>ระบบช่วยเหลือ • รร.บ้านบวกหมื้อ</span>
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              </div>
              <p className="text-white/80 text-[11px]">โรงเรียนบ้านบวกหมื้อ (สพป.เชียงใหม่ เขต 2)</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/20 text-white/90 hover:text-white cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Actions Bar */}
        <div className="bg-slate-50 border-b border-slate-100 px-3 py-2 flex items-center gap-2 overflow-x-auto text-[11px] no-scrollbar">
          <button
            onClick={() => {
              onClose();
              onGoToReport();
            }}
            className="shrink-0 px-2.5 py-1 bg-rose-50 text-rose-700 font-bold rounded-full border border-rose-200 hover:bg-rose-100 transition-colors"
          >
            🚨 แจ้งเหตุ RUTAN
          </button>
          <button
            onClick={() => {
              onClose();
              onOpenEmergency();
            }}
            className="shrink-0 px-2.5 py-1 bg-amber-50 text-amber-700 font-bold rounded-full border border-amber-200 hover:bg-amber-100 transition-colors"
          >
            📞 สายด่วน 24 ชม.
          </button>
          <a
            href="https://m.me"
            target="_blank"
            rel="noreferrer"
            className="shrink-0 px-2.5 py-1 bg-blue-50 text-blue-700 font-bold rounded-full border border-blue-200 hover:bg-blue-100 transition-colors flex items-center gap-1"
          >
            <span>เปิด Facebook App</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FAF8FA] text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-[#0078FF] text-white rounded-br-xs shadow-xs'
                    : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs shadow-xs'
                }`}
              >
                {m.text}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-1">{m.time}</span>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <form
          onSubmit={handleSend}
          className="p-3 bg-white border-t border-slate-100 flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="พิมพ์ข้อความติดต่อเจ้าหน้าที่..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0078FF] focus:bg-white text-slate-800"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 bg-[#0078FF] hover:bg-[#0066D6] disabled:opacity-40 text-white rounded-2xl shadow-xs transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Phone, Clock, Mail, Send, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { language, t, storeSettings, showToast } = useApp();

  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [topic, setTopic] = useState('feedback');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim() || !message.trim()) return;

    setIsSent(true);
    showToast(t.contact.sendSuccess, 'success');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn">
      
      {/* Title */}
      <div className="border-b border-[#262922] pb-6">
        <span className="text-xs font-mono font-bold text-[#B7FF00] uppercase tracking-wider">
          GET IN TOUCH
        </span>
        <h1 className="text-3xl sm:text-4xl font-heading font-black text-[#F4F4EC] mt-1">
          {t.contact.title}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Contact Details */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="p-6 rounded-3xl bg-[#1C1E19] border border-[#262922] space-y-5">
            <h3 className="font-display font-bold text-lg text-[#F4F4EC]">
              NICE NIGHT THONGLOR
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#B7FF00] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#F4F4EC] block mb-0.5">{t.contact.addressTitle}</strong>
                  <p className="text-[#9A9D91] leading-relaxed">{t.contact.addressDetail}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#B7FF00] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#F4F4EC] block mb-0.5">{t.contact.hoursTitle}</strong>
                  <p className="text-[#9A9D91] font-mono">{t.contact.hoursDetail}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#B7FF00] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#F4F4EC] block mb-0.5">{t.contact.phoneTitle}</strong>
                  <p className="text-[#F4F4EC] font-mono">{t.contact.phoneNumber}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#B7FF00] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#F4F4EC] block mb-0.5">Email</strong>
                  <p className="text-[#9A9D91] font-mono">{storeSettings.email}</p>
                </div>
              </div>
            </div>

            {/* Map Placeholder Graphic */}
            <div className="rounded-2xl overflow-hidden aspect-16/9 bg-[#10110F] border border-[#353830] flex flex-col items-center justify-center text-center p-4">
              <MapPin className="w-6 h-6 text-[#B7FF00] mb-2 animate-bounce" />
              <span className="font-display font-bold text-xs text-[#F4F4EC]">
                Thonglor Soi 13, Sukhumvit 55
              </span>
              <span className="text-[10px] text-[#9A9D91] font-mono mt-0.5">
                Bangkok 10110 (13.7314° N, 100.5812° E)
              </span>
            </div>
          </div>

        </div>

        {/* Right Column: Contact Message Form */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#1C1E19] border border-[#262922]">
            <h3 className="font-display font-bold text-lg text-[#F4F4EC] mb-2">
              {t.contact.formTitle}
            </h3>
            <p className="text-xs text-[#9A9D91] mb-6">
              {language === 'th' ? 'มีคำถาม ติชมรสชาติ หรือต้องการสั่งจัดเลี้ยงรอบดึก ส่งข้อความถึงเราได้เลย' : 'Have a question or feedback on your burger? Drop us a line.'}
            </p>

            {isSent ? (
              <div className="p-8 rounded-2xl bg-[#10110F] border border-[#B7FF00]/40 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#B7FF00]/20 text-[#B7FF00] mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-display font-bold text-base text-[#F4F4EC]">
                  {t.contact.sendSuccess}
                </h4>
                <button
                  onClick={() => {
                    setIsSent(false);
                    setMessage('');
                  }}
                  className="px-4 py-2 rounded-xl bg-[#1C1E19] text-xs font-mono text-[#B7FF00] hover:bg-[#262922]"
                >
                  {language === 'th' ? 'ส่งอีกข้อความ' : 'Send Another Message'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold text-[#9A9D91] mb-1.5 uppercase">
                      {t.contact.name} *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="เช่น ธนภัทร"
                      className="w-full bg-[#10110F] border border-[#262922] focus:border-[#B7FF00] rounded-xl px-3.5 py-2.5 text-xs text-[#F4F4EC] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-[#9A9D91] mb-1.5 uppercase">
                      {t.contact.emailOrPhone} *
                    </label>
                    <input
                      type="text"
                      required
                      value={contact}
                      onChange={e => setContact(e.target.value)}
                      placeholder="08X-XXX-XXXX หรือ email@demo.com"
                      className="w-full bg-[#10110F] border border-[#262922] focus:border-[#B7FF00] rounded-xl px-3.5 py-2.5 text-xs text-[#F4F4EC] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-[#9A9D91] mb-1.5 uppercase">
                    {t.contact.topic}
                  </label>
                  <select
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                    className="w-full bg-[#10110F] border border-[#262922] focus:border-[#B7FF00] rounded-xl px-3.5 py-2.5 text-xs text-[#F4F4EC] focus:outline-none"
                  >
                    <option value="feedback">{t.contact.topics.feedback}</option>
                    <option value="orderIssue">{t.contact.topics.orderIssue}</option>
                    <option value="catering">{t.contact.topics.catering}</option>
                    <option value="other">{t.contact.topics.other}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-[#9A9D91] mb-1.5 uppercase">
                    {t.contact.message} *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="พิมพ์ข้อความของคุณที่นี่..."
                    className="w-full bg-[#10110F] border border-[#262922] focus:border-[#B7FF00] rounded-xl px-3.5 py-2.5 text-xs text-[#F4F4EC] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#B7FF00] hover:bg-[#D4FF4F] text-[#10110F] font-display font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(183,255,0,0.3)] transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{t.contact.sendBtn}</span>
                </button>
              </form>
            )}

          </div>
        </div>

      </div>

    </div>
  );
};

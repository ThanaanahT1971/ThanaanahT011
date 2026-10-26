import React from 'react';
import { useApp } from '../../context/AppContext';
import { MapPin, Phone, Clock, Instagram, Facebook, Flame, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t, language, navigate, storeSettings, setIsRoleModalOpen } = useApp();

  return (
    <footer className="bg-[#10110F] border-t border-[#262922] pt-16 pb-12 text-[#9A9D91] relative overflow-hidden">
      
      {/* Background Graphic Watermark */}
      <div className="absolute right-0 bottom-0 pointer-events-none select-none opacity-[0.03] text-[20vw] font-heading font-black leading-none text-[#F4F4EC] translate-y-1/3">
        NICE
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Street Hero Poster Ticker in Footer */}
        <div className="border border-[#353830] rounded-2xl bg-[#1C1E19] p-8 mb-16 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <div className="inline-block px-3 py-1 rounded bg-[#B7FF00] text-[#10110F] font-mono font-black text-xs uppercase tracking-wider mb-3">
                LATE NIGHT HEADQUARTERS
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-[#F4F4EC] tracking-tight">
                {t.brand.tagline}
              </h2>
              <p className="text-sm sm:text-base text-[#9A9D91] mt-2 font-display">
                {t.brand.secondaryTagline}
              </p>
            </div>
            <button
              onClick={() => navigate('/menu')}
              className="px-6 py-4 rounded-xl bg-[#B7FF00] hover:bg-[#D4FF4F] text-[#10110F] font-display font-black text-base transition-all shadow-[0_0_20px_rgba(183,255,0,0.3)] shrink-0 cursor-pointer"
            >
              {t.nav.orderNow} ➔
            </button>
          </div>
        </div>

        {/* 4-Column Directory */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#B7FF00] text-[#10110F] font-display font-black flex items-center justify-center text-sm">
                NN
              </div>
              <span className="font-heading font-black text-lg text-[#F4F4EC]">
                NICE NIGHT BURGER
              </span>
            </div>
            <p className="text-xs leading-relaxed text-[#9A9D91] mb-6">
              {language === 'th'
                ? 'เบอร์เกอร์สไตล์สตรีทสแมชสูตรเข้มข้น เนื้อพรีเมียม ชีสเยิ้ม เปิดบริการมื้อดึกถึงตี 3 ทุกคืน ณ ใจกลางทองหล่อ'
                : 'Bold, messy, late-night smashed burger joint in Thonglor, Bangkok. Serving night owls and burger fiends until 3 AM.'}
            </p>
            <div className="flex items-center gap-3 text-[#F4F4EC]">
              <a href="#" className="p-2 rounded-lg bg-[#1C1E19] hover:bg-[#B7FF00] hover:text-[#10110F] transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-[#1C1E19] hover:bg-[#B7FF00] hover:text-[#10110F] transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <button 
                onClick={() => setIsRoleModalOpen(true)}
                className="px-2.5 py-1.5 rounded-lg bg-[#1C1E19] text-xs font-mono font-bold text-[#B7FF00] hover:bg-[#262922]"
              >
                ROLE SWITCHER
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#F4F4EC] mb-4">
              {language === 'th' ? 'เมนู & การสั่งซื้อ' : 'Menu & Ordering'}
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <button onClick={() => navigate('/menu')} className="hover:text-[#B7FF00] transition-colors">
                  {t.categories.signature}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/menu')} className="hover:text-[#B7FF00] transition-colors">
                  {t.categories.chicken}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/menu')} className="hover:text-[#B7FF00] transition-colors">
                  {t.categories['plant-based']}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/menu')} className="hover:text-[#B7FF00] transition-colors">
                  {t.categories.combos}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/promotions')} className="hover:text-[#B7FF00] transition-colors">
                  {t.nav.promotions}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/track-order')} className="hover:text-[#B7FF00] transition-colors">
                  {t.nav.trackOrder}
                </button>
              </li>
            </ul>
          </div>

          {/* Store Hours & Location */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#F4F4EC] mb-4">
              {language === 'th' ? 'เวลา & ที่ตั้งร้าน' : 'Hours & Location'}
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#B7FF00] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[#F4F4EC] font-semibold">
                    {language === 'th' ? storeSettings.openingHoursTh : storeSettings.openingHoursEn}
                  </div>
                  <div className="text-[11px] text-[#9A9D91]">Kitchen closes at 02:30 AM</div>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#B7FF00] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[#F4F4EC] font-semibold">Thonglor 13, Sukhumvit 55</div>
                  <div className="text-[11px] text-[#9A9D91]">{storeSettings.city}</div>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#B7FF00] shrink-0 mt-0.5" />
                <div className="text-[#F4F4EC] font-mono">{storeSettings.phone}</div>
              </div>
            </div>
          </div>

          {/* Demo Notice Banner Box */}
          <div className="p-4 rounded-xl bg-[#1C1E19] border border-[#353830]">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#B7FF00] mb-2">
              <span className="w-2 h-2 rounded-full bg-[#B7FF00]" />
              PROTOTYPE NOTICE
            </div>
            <p className="text-[11px] leading-relaxed text-[#9A9D91]">
              {t.brand.demoNotice}
            </p>
            <div className="mt-3 pt-3 border-t border-[#262922] flex items-center justify-between text-[11px]">
              <span className="text-[#9A9D91]">Timezone:</span>
              <span className="font-mono text-[#F4F4EC]">Asia/Bangkok (UTC+7)</span>
            </div>
          </div>

        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-8 border-t border-[#262922] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div>
            © 2026 NICE NIGHT BURGER. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/about')} className="hover:text-[#F4F4EC] transition-colors">
              {t.nav.about}
            </button>
            <button onClick={() => navigate('/contact')} className="hover:text-[#F4F4EC] transition-colors">
              {t.nav.contact}
            </button>
            <button onClick={() => navigate('/admin')} className="text-[#B7FF00] font-mono hover:underline">
              [ADMIN CONSOLE]
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};

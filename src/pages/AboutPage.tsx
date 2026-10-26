import React from 'react';
import { useApp } from '../context/AppContext';
import { Flame, ShieldCheck, Clock, Award, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { language, t, navigate } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-12 animate-fadeIn">
      
      {/* Brand Hero Manifesto */}
      <div className="text-center space-y-4">
        <span className="street-badge bg-[#B7FF00] text-[#10110F] text-xs px-3 py-1 rounded font-black">
          THE UNDERGROUND BURGER CULTURE
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black text-[#F4F4EC] tracking-tight">
          {t.about.title}
        </h1>
        <p className="text-xl font-display font-bold text-[#B7FF00]">
          "{t.brand.tagline}"
        </p>
        <p className="text-sm sm:text-base text-[#9A9D91] max-w-2xl mx-auto leading-relaxed">
          {t.about.manifesto}
        </p>
      </div>

      {/* Visual Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-3xl overflow-hidden border border-[#262922]">
        <img
          src="https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1000&q=80"
          alt="Nice Night Grill"
          className="w-full h-64 object-cover"
        />
        <img
          src="https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=1000&q=80"
          alt="Smashed Beef"
          className="w-full h-64 object-cover"
        />
      </div>

      {/* Core Brand Pillars */}
      <div className="space-y-6">
        <h2 className="text-2xl font-heading font-black text-[#F4F4EC] text-center">
          OUR THREE CRAFT RULES
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {t.about.pillars.map((pillar, i) => (
            <div key={i} className="p-6 rounded-3xl bg-[#1C1E19] border border-[#262922] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#10110F] border border-[#353830] text-[#B7FF00] flex items-center justify-center font-mono font-black text-sm">
                0{i + 1}
              </div>
              <h3 className="font-display font-black text-base text-[#F4F4EC]">
                {pillar.title}
              </h3>
              <p className="text-xs text-[#9A9D91] leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Box */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-[#1C1E19] to-[#262922] border border-[#B7FF00]/40 text-center space-y-4">
        <h3 className="text-2xl font-heading font-black text-[#F4F4EC]">
          HUNGRY YET?
        </h3>
        <p className="text-xs text-[#9A9D91] max-w-md mx-auto">
          {language === 'th' ? 'ครัวเปิดเตาร้อน ๆ รอสแมชเบอร์เกอร์ให้คุณ สั่งเลย!' : 'Grills are blazing. Smash your late night burger craving right now.'}
        </p>
        <button
          onClick={() => navigate('/menu')}
          className="px-8 py-3.5 rounded-xl bg-[#B7FF00] hover:bg-[#D4FF4F] text-[#10110F] font-display font-black text-sm uppercase tracking-wider inline-flex items-center gap-2 shadow-[0_0_20px_rgba(183,255,0,0.3)] transition-all cursor-pointer"
        >
          <span>{t.nav.orderNow}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { dataService } from '../services/dataService';
import { Tag, Copy, Check, Sparkles, Clock, ArrowRight } from 'lucide-react';

export const PromotionsPage: React.FC = () => {
  const { language, t, applyPromoCode, setIsCartDrawerOpen, showToast, navigate } = useApp();
  const promotions = dataService.getPromotions();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    showToast(t.promotions.copied + ` (${code})`, 'success');
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleApplyDirect = (code: string) => {
    applyPromoCode(code);
    setIsCartDrawerOpen(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn">
      
      {/* Page Title */}
      <div className="border-b border-[#262922] pb-6">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#B7FF00] uppercase tracking-wider mb-1">
          <Sparkles className="w-4 h-4" />
          <span>EXCLUSIVE MIDNIGHT DEALS</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-heading font-black text-[#F4F4EC]">
          {t.promotions.title}
        </h1>
        <p className="text-xs sm:text-sm text-[#9A9D91] mt-1 max-w-xl">
          {t.promotions.subtitle}
        </p>
      </div>

      {/* Promotions Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {promotions.map(promo => {
          const desc = language === 'th' ? promo.descriptionTh : promo.descriptionEn;
          const isCopied = copiedCode === promo.code;

          return (
            <div
              key={promo.id}
              className="rounded-3xl bg-[#1C1E19] border border-[#262922] hover:border-[#B7FF00]/50 p-6 flex flex-col justify-between transition-all duration-300 relative group overflow-hidden"
            >
              {/* Background Accent Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#B7FF00]/5 rounded-full blur-2xl pointer-events-none group-hover:bg-[#B7FF00]/10 transition-colors" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-xl bg-[#10110F] border border-[#353830] text-[#B7FF00]">
                    <Tag className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#10110F] text-[#D4FF4F] border border-[#353830]">
                    {promo.discountType === 'percentage' ? `${promo.discountValue}% OFF` : `฿${promo.discountValue} OFF`}
                  </span>
                </div>

                {/* Promo Code Plaque */}
                <div className="p-3 rounded-2xl bg-[#10110F] border border-[#353830] flex items-center justify-between mb-3">
                  <span className="font-mono font-black text-lg tracking-wider text-[#B7FF00]">
                    {promo.code}
                  </span>
                  <button
                    onClick={() => handleCopy(promo.code)}
                    className="p-1.5 rounded-lg text-[#9A9D91] hover:text-[#F4F4EC] hover:bg-[#262922] transition-colors"
                    title={t.promotions.copyCode}
                  >
                    {isCopied ? <Check className="w-4 h-4 text-[#B7FF00]" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <p className="text-xs text-[#F4F4EC] font-medium leading-relaxed mb-4">
                  {desc}
                </p>

                <div className="space-y-1 text-[11px] font-mono text-[#9A9D91]">
                  <div>
                    {t.promotions.minSpend}: <strong className="text-[#F4F4EC]">฿{promo.minimumSpend}</strong>
                  </div>
                  <div>
                    {t.promotions.expires}: {new Date(promo.expiresAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="mt-6 pt-4 border-t border-[#262922] flex gap-2">
                <button
                  onClick={() => handleApplyDirect(promo.code)}
                  className="w-full py-2.5 rounded-xl bg-[#B7FF00] hover:bg-[#D4FF4F] text-[#10110F] font-display font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>{t.promotions.applyNow}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Terms Notice */}
      <div className="p-4 rounded-2xl bg-[#141512] border border-[#262922] text-xs text-[#9A9D91]">
        💡 <strong className="text-[#F4F4EC]">Notice:</strong> {t.promotions.terms}
      </div>

    </div>
  );
};

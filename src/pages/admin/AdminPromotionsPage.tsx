import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { dataService } from '../../services/dataService';
import { Promotion } from '../../types';
import { Tag, Plus, Check, X, Trash2 } from 'lucide-react';

export const AdminPromotionsPage: React.FC = () => {
  const { language, t, showToast } = useApp();
  const [promotions, setPromotions] = useState<Promotion[]>(() => dataService.getPromotions());

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [descTh, setDescTh] = useState('');
  const [descEn, setDescEn] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState(10);
  const [minimumSpend, setMinimumSpend] = useState(200);

  const refreshPromos = () => {
    setPromotions(dataService.getPromotions());
  };

  const handleTogglePromo = (promo: Promotion) => {
    const updated = promotions.map(p => p.id === promo.id ? { ...p, isActive: !p.isActive } : p);
    dataService.savePromotions(updated);
    refreshPromos();
    showToast(language === 'th' ? `อัปเดตสถานะโค้ด ${promo.code}` : `Updated ${promo.code}`, 'info');
  };

  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    const newPromo: Promotion = {
      id: `promo-${Date.now()}`,
      code: code.trim().toUpperCase(),
      descriptionTh: descTh.trim() || `${code} discount`,
      descriptionEn: descEn.trim() || `${code} discount`,
      discountType,
      discountValue: Number(discountValue) || 10,
      minimumSpend: Number(minimumSpend) || 0,
      startAt: new Date().toISOString(),
      expiresAt: '2026-12-31T23:59:59Z',
      isActive: true,
      usageCount: 0,
    };

    const next = [...promotions, newPromo];
    dataService.savePromotions(next);
    refreshPromos();
    setIsModalOpen(false);
    setCode('');
    setDescTh('');
    setDescEn('');
    showToast(language === 'th' ? `สร้างโค้ด ${newPromo.code} สำเร็จ` : `Created promo ${newPromo.code}`, 'success');
  };

  const handleDeletePromo = (id: string) => {
    const next = promotions.filter(p => p.id !== id);
    dataService.savePromotions(next);
    refreshPromos();
    showToast(language === 'th' ? 'ลบโค้ดโปรโมชั่นแล้ว' : 'Deleted promo code', 'info');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-black text-[#F4F4EC]">
            {t.admin.promotions}
          </h2>
          <p className="text-xs text-[#9A9D91]">
            {language === 'th' ? 'จัดการโค้ดส่วนลดรอบดึกและเงื่อนไขการสั่งซื้อขั้นต่ำ' : 'Manage coupon codes, minimum spend thresholds, and activations'}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#B7FF00] hover:bg-[#D4FF4F] text-[#10110F] font-display font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(183,255,0,0.3)] transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create Coupon</span>
        </button>
      </div>

      {/* Promotions List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {promotions.map(promo => (
          <div
            key={promo.id}
            className="p-5 rounded-3xl bg-[#1C1E19] border border-[#262922] flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono font-black text-lg text-[#B7FF00]">
                  {promo.code}
                </span>
                <button
                  onClick={() => handleTogglePromo(promo)}
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded cursor-pointer ${
                    promo.isActive ? 'bg-[#B7FF00]/15 text-[#B7FF00] border border-[#B7FF00]/30' : 'bg-red-500/15 text-red-400 border border-red-500/30'
                  }`}
                >
                  {promo.isActive ? 'ACTIVE' : 'DISABLED'}
                </button>
              </div>

              <p className="text-xs text-[#F4F4EC] font-medium leading-relaxed">
                {language === 'th' ? promo.descriptionTh : promo.descriptionEn}
              </p>

              <div className="mt-3 space-y-1 text-[11px] font-mono text-[#9A9D91]">
                <div>Value: <strong className="text-[#F4F4EC]">{promo.discountType === 'percentage' ? `${promo.discountValue}%` : `฿${promo.discountValue}`}</strong></div>
                <div>Min Spend: <strong className="text-[#F4F4EC]">฿{promo.minimumSpend}</strong></div>
                <div>Redemptions: <strong className="text-[#B7FF00]">{promo.usageCount}</strong></div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#262922] flex justify-end">
              <button
                onClick={() => handleDeletePromo(promo.id)}
                className="p-1.5 rounded-lg text-[#9A9D91] hover:text-red-400 hover:bg-[#10110F] transition-colors"
                title="Delete Promo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add Promo */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#1C1E19] border border-[#353830] rounded-3xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#262922] pb-3">
              <h3 className="font-display font-black text-lg text-[#F4F4EC]">
                Create Promo Code
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#9A9D91]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePromo} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#9A9D91] font-mono mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MIDNIGHT20"
                  value={code}
                  onChange={e => setCode(e.target.value.toUpperCase())}
                  className="w-full bg-[#10110F] border border-[#262922] focus:border-[#B7FF00] rounded-xl px-3 py-2 text-[#F4F4EC] font-mono uppercase focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#9A9D91] font-mono mb-1">Type</label>
                  <select
                    value={discountType}
                    onChange={e => setDiscountType(e.target.value as any)}
                    className="w-full bg-[#10110F] border border-[#262922] rounded-xl px-3 py-2 text-[#F4F4EC]"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Baht (฿)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#9A9D91] font-mono mb-1">Value</label>
                  <input
                    type="number"
                    required
                    value={discountValue}
                    onChange={e => setDiscountValue(Number(e.target.value))}
                    className="w-full bg-[#10110F] border border-[#262922] rounded-xl px-3 py-2 text-[#F4F4EC] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#9A9D91] font-mono mb-1">Minimum Spend (฿)</label>
                <input
                  type="number"
                  value={minimumSpend}
                  onChange={e => setMinimumSpend(Number(e.target.value))}
                  className="w-full bg-[#10110F] border border-[#262922] rounded-xl px-3 py-2 text-[#F4F4EC] font-mono"
                />
              </div>

              <div>
                <label className="block text-[#9A9D91] font-mono mb-1">Description (Thai)</label>
                <input
                  type="text"
                  value={descTh}
                  onChange={e => setDescTh(e.target.value)}
                  placeholder="เช่น ลด 15% เมื่อสั่งครบ ฿250"
                  className="w-full bg-[#10110F] border border-[#262922] rounded-xl px-3 py-2 text-[#F4F4EC]"
                />
              </div>

              <div className="pt-3 border-t border-[#262922] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-[#9A9D91]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#B7FF00] text-[#10110F] font-bold"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

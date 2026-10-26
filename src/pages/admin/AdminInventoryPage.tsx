import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { dataService } from '../../services/dataService';
import { Product } from '../../types';
import { Boxes, Plus, Minus, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';

export const AdminInventoryPage: React.FC = () => {
  const { language, t, showToast } = useApp();
  const [products, setProducts] = useState<Product[]>(() => dataService.getProducts());

  const refreshProducts = () => {
    setProducts(dataService.getProducts());
  };

  const handleAdjustStock = (product: Product, delta: number) => {
    const newStock = Math.max(0, product.stockQuantity + delta);
    const updated = {
      ...product,
      stockQuantity: newStock,
      isAvailable: newStock > 0 ? product.isAvailable : false,
    };
    dataService.upsertProduct(updated);
    refreshProducts();
    showToast(`${language === 'th' ? 'ปรับสต็อก' : 'Adjusted stock'}: ${product.nameEn} (${delta > 0 ? `+${delta}` : delta})`, 'info');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-black text-[#F4F4EC]">
            {t.admin.inventory}
          </h2>
          <p className="text-xs text-[#9A9D91]">
            {language === 'th' ? 'ติดตามจำนวนสต็อกสินค้าคงเหลือและระดับเตือนใกล้หมด' : 'Track stock levels, low-threshold alerts, and instant adjustments'}
          </p>
        </div>

        <button
          onClick={refreshProducts}
          className="p-2 rounded-xl bg-[#1C1E19] border border-[#262922] text-[#9A9D91] hover:text-[#B7FF00] self-start sm:self-auto"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Grid of Items Inventory Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(p => {
          const isLow = p.stockQuantity <= p.lowStockThreshold;
          const isOut = p.stockQuantity === 0;

          return (
            <div
              key={p.id}
              className={`p-5 rounded-3xl bg-[#1C1E19] border transition-colors flex flex-col justify-between ${
                isOut
                  ? 'border-red-500/50 bg-red-950/10'
                  : isLow
                  ? 'border-amber-500/40 bg-amber-950/10'
                  : 'border-[#262922]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-[#10110F] text-[#9A9D91] border border-[#262922]">
                    {p.categoryId}
                  </span>
                  {isOut ? (
                    <span className="text-[10px] font-mono font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/30">
                      OUT OF STOCK
                    </span>
                  ) : isLow ? (
                    <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> LOW STOCK
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> IN STOCK
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={p.imageUrl}
                    alt={p.nameEn}
                    className="w-12 h-12 rounded-xl object-cover bg-[#10110F] shrink-0"
                  />
                  <div>
                    <h4 className="font-display font-bold text-sm text-[#F4F4EC] line-clamp-1">
                      {language === 'th' ? p.nameTh : p.nameEn}
                    </h4>
                    <span className="font-mono text-xs text-[#B7FF00]">
                      ฿{p.basePrice}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stock Count and Adjust Bar */}
              <div className="mt-4 pt-3 border-t border-[#262922] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-[#9A9D91] block uppercase">
                    CURRENT STOCK
                  </span>
                  <span className="font-mono font-black text-xl text-[#F4F4EC]">
                    {p.stockQuantity} <span className="text-xs font-normal text-[#9A9D91]">units</span>
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleAdjustStock(p, -5)}
                    className="px-2 py-1 rounded-lg bg-[#10110F] border border-[#353830] text-xs font-mono text-[#9A9D91] hover:text-red-400 transition-colors"
                    title="-5 stock"
                  >
                    -5
                  </button>
                  <button
                    onClick={() => handleAdjustStock(p, -1)}
                    className="p-1 rounded-lg bg-[#10110F] border border-[#353830] text-[#9A9D91] hover:text-[#F4F4EC] transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleAdjustStock(p, 1)}
                    className="p-1 rounded-lg bg-[#10110F] border border-[#353830] text-[#9A9D91] hover:text-[#B7FF00] transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleAdjustStock(p, 10)}
                    className="px-2 py-1 rounded-lg bg-[#10110F] border border-[#353830] text-xs font-mono text-[#9A9D91] hover:text-[#B7FF00] transition-colors"
                    title="+10 stock"
                  >
                    +10
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};

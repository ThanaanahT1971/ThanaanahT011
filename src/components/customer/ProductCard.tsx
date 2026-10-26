import React from 'react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { Plus, SlidersHorizontal, Sparkles, AlertCircle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { language, t, openProductCustomizer, addToCart } = useApp();

  const name = language === 'th' ? product.nameTh : product.nameEn;
  const description = language === 'th' ? product.descriptionTh : product.descriptionEn;
  const isOutOfStock = !product.isAvailable || product.stockQuantity <= 0;

  const handleCardClick = () => {
    if (isOutOfStock) return;
    openProductCustomizer(product);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    
    // If product has required customizations, open modal instead of quick adding
    const hasRequired = product.customizationGroups?.some(g => g.required);
    if (hasRequired) {
      openProductCustomizer(product);
      return;
    }

    addToCart(product, 1, []);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group rounded-2xl bg-[#1C1E19] border transition-all duration-300 flex flex-col justify-between overflow-hidden relative cursor-pointer ${
        isOutOfStock
          ? 'border-[#353830] opacity-60 cursor-not-allowed'
          : 'border-[#262922] hover:border-[#B7FF00]/50 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:-translate-y-1'
      }`}
    >
      {/* Product Image & Badges */}
      <div className="relative aspect-4/3 w-full bg-[#10110F] overflow-hidden">
        <img
          src={product.imageUrl}
          alt={name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient Overlay for Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1E19] via-transparent to-black/20" />

        {/* Street Stickers / Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {product.isBestSeller && (
            <span className="street-badge bg-[#B7FF00] text-[#10110F] text-[10px] px-2 py-0.5 rounded shadow-sm">
              🔥 {t.badges.bestSeller}
            </span>
          )}
          {product.isNew && (
            <span className="street-badge bg-[#D4FF4F] text-[#10110F] text-[10px] px-2 py-0.5 rounded shadow-sm">
              ⚡ {t.badges.new}
            </span>
          )}
          {product.isPlantBased && (
            <span className="street-badge bg-emerald-400 text-[#10110F] text-[10px] px-2 py-0.5 rounded shadow-sm">
              🌱 {t.badges.plantBased}
            </span>
          )}
          {isOutOfStock && (
            <span className="street-badge bg-red-600 text-white text-[10px] px-2 py-0.5 rounded shadow-sm">
              ✕ {t.badges.outOfStock}
            </span>
          )}
        </div>

        {/* Price Tag in Image */}
        <div className="absolute bottom-3 right-3 bg-[#10110F]/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-[#353830] z-10">
          <span className="font-mono font-black text-sm text-[#B7FF00]">
            ฿{product.basePrice.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-display font-bold text-base sm:text-lg text-[#F4F4EC] group-hover:text-[#B7FF00] transition-colors line-clamp-1">
            {name}
          </h3>
          <p className="text-xs text-[#9A9D91] mt-1.5 line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Action Button Row */}
        <div className="mt-4 pt-3 border-t border-[#262922] flex items-center justify-between">
          <span className="text-[11px] font-mono text-[#9A9D91] flex items-center gap-1">
            {product.customizationGroups && product.customizationGroups.length > 0 ? (
              <span className="text-[#D4FF4F] flex items-center gap-1">
                <SlidersHorizontal className="w-3 h-3" />
                {t.menu.customizable}
              </span>
            ) : (
              <span>{t.common.currency}{product.basePrice}</span>
            )}
          </span>

          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className={`px-3 py-1.5 rounded-lg text-xs font-display font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isOutOfStock
                ? 'bg-[#262922] text-[#9A9D91] cursor-not-allowed'
                : 'bg-[#B7FF00] hover:bg-[#D4FF4F] text-[#10110F] shadow-[0_0_10px_rgba(183,255,0,0.2)]'
            }`}
          >
            {product.customizationGroups && product.customizationGroups.length > 0 ? (
              <>
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>{t.menu.customize}</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>{t.menu.addToCart}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

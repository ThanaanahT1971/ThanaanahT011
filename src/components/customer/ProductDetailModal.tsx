import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { SelectedCustomization } from '../../types';
import { X, Plus, Minus, Check, Flame, Sliders, AlertCircle } from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const { customizingProduct, closeProductCustomizer, addToCart, language, t } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [selectedRadioOptions, setSelectedRadioOptions] = useState<Record<string, string>>({});
  const [selectedCheckboxOptions, setSelectedCheckboxOptions] = useState<Record<string, string[]>>({});
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Initialize defaults whenever customizingProduct changes
  useEffect(() => {
    if (customizingProduct) {
      setQuantity(1);
      setSpecialInstructions('');
      setValidationError(null);

      const radios: Record<string, string> = {};
      const checks: Record<string, string[]> = {};

      customizingProduct.customizationGroups?.forEach(group => {
        if (group.type === 'radio') {
          const defaultOpt = group.options.find(o => o.isDefault) || group.options[0];
          if (defaultOpt) {
            radios[group.id] = defaultOpt.id;
          }
        } else {
          const defaults = group.options.filter(o => o.isDefault).map(o => o.id);
          checks[group.id] = defaults;
        }
      });

      setSelectedRadioOptions(radios);
      setSelectedCheckboxOptions(checks);
    }
  }, [customizingProduct]);

  if (!customizingProduct) return null;

  const name = language === 'th' ? customizingProduct.nameTh : customizingProduct.nameEn;
  const description = language === 'th' ? customizingProduct.descriptionTh : customizingProduct.descriptionEn;

  // Calculate Extra Costs
  let extrasTotal = 0;
  const selectedCustomizationList: SelectedCustomization[] = [];

  customizingProduct.customizationGroups?.forEach(group => {
    if (group.type === 'radio') {
      const selectedId = selectedRadioOptions[group.id];
      const opt = group.options.find(o => o.id === selectedId);
      if (opt) {
        extrasTotal += opt.price;
        selectedCustomizationList.push({
          groupId: group.id,
          groupTitle: language === 'th' ? group.titleTh : group.titleEn,
          selectedOptionIds: [opt.id],
          selectedOptionNames: [language === 'th' ? opt.nameTh : opt.nameEn],
          extraCost: opt.price,
        });
      }
    } else {
      const selectedIds = selectedCheckboxOptions[group.id] || [];
      const opts = group.options.filter(o => selectedIds.includes(o.id));
      const groupCost = opts.reduce((sum, o) => sum + o.price, 0);
      extrasTotal += groupCost;
      if (opts.length > 0) {
        selectedCustomizationList.push({
          groupId: group.id,
          groupTitle: language === 'th' ? group.titleTh : group.titleEn,
          selectedOptionIds: selectedIds,
          selectedOptionNames: opts.map(o => language === 'th' ? o.nameTh : o.nameEn),
          extraCost: groupCost,
        });
      }
    }
  });

  const unitPrice = customizingProduct.basePrice + extrasTotal;
  const totalPrice = unitPrice * quantity;

  const handleCheckboxToggle = (groupId: string, optionId: string, maxSelections?: number) => {
    const current = selectedCheckboxOptions[groupId] || [];
    if (current.includes(optionId)) {
      setSelectedCheckboxOptions({
        ...selectedCheckboxOptions,
        [groupId]: current.filter(id => id !== optionId),
      });
      setValidationError(null);
    } else {
      if (maxSelections && current.length >= maxSelections) {
        setValidationError(t.productModal.maxReached.replace('{max}', maxSelections.toString()));
        return;
      }
      setSelectedCheckboxOptions({
        ...selectedCheckboxOptions,
        [groupId]: [...current, optionId],
      });
      setValidationError(null);
    }
  };

  const handleAddToCart = () => {
    // Validate required groups
    for (const group of customizingProduct.customizationGroups || []) {
      if (group.required) {
        if (group.type === 'radio' && !selectedRadioOptions[group.id]) {
          setValidationError(t.productModal.requiredSelection);
          return;
        }
      }
    }

    addToCart(customizingProduct, quantity, selectedCustomizationList, specialInstructions);
    closeProductCustomizer();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div 
        className="bg-[#1C1E19] border border-[#353830] rounded-3xl w-full max-w-xl max-h-[92vh] flex flex-col shadow-2xl relative overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Sticky Close Button */}
        <button
          onClick={closeProductCustomizer}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#10110F]/80 text-[#9A9D91] hover:text-[#F4F4EC] border border-[#353830] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto flex-1">
          
          {/* Hero Image */}
          <div className="relative aspect-16/9 sm:aspect-2/1 w-full bg-[#10110F]">
            <img
              src={customizingProduct.imageUrl}
              alt={name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C1E19] via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 sm:left-6 right-6">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded bg-[#B7FF00] text-[#10110F] font-mono font-black text-[10px] tracking-wider uppercase">
                  {t.categories[customizingProduct.categoryId] || customizingProduct.categoryId}
                </span>
                {customizingProduct.isBestSeller && (
                  <span className="px-2 py-0.5 rounded bg-[#10110F] text-[#B7FF00] font-mono font-bold text-[10px] border border-[#B7FF00]/40">
                    🔥 BESTSELLER
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-black text-[#F4F4EC]">
                {name}
              </h2>
            </div>
          </div>

          <div className="p-4 sm:p-6 space-y-6">
            <p className="text-sm text-[#9A9D91] leading-relaxed">
              {description}
            </p>

            {/* Validation Alert */}
            {validationError && (
              <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Customization Groups */}
            {customizingProduct.customizationGroups?.map(group => {
              const groupTitle = language === 'th' ? group.titleTh : group.titleEn;
              const isRadio = group.type === 'radio';

              return (
                <div key={group.id} className="pt-4 border-t border-[#262922]">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-display font-bold text-sm text-[#F4F4EC] flex items-center gap-1.5">
                      <span>{groupTitle}</span>
                      {group.required && (
                        <span className="text-[10px] font-mono font-bold text-[#B7FF00] bg-[#B7FF00]/10 px-1.5 py-0.5 rounded">
                          REQUIRED
                        </span>
                      )}
                    </h3>
                    {group.maxSelections && (
                      <span className="text-xs text-[#9A9D91] font-mono">
                        Max {group.maxSelections}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    {group.options.map(option => {
                      const optName = language === 'th' ? option.nameTh : option.nameEn;
                      const isSelected = isRadio
                        ? selectedRadioOptions[group.id] === option.id
                        : (selectedCheckboxOptions[group.id] || []).includes(option.id);

                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => {
                            if (isRadio) {
                              setSelectedRadioOptions({
                                ...selectedRadioOptions,
                                [group.id]: option.id,
                              });
                              setValidationError(null);
                            } else {
                              handleCheckboxToggle(group.id, option.id, group.maxSelections);
                            }
                          }}
                          className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#B7FF00]/10 border-[#B7FF00] text-[#F4F4EC]'
                              : 'bg-[#10110F] border-[#262922] text-[#9A9D91] hover:border-[#353830]'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-${isRadio ? 'full' : 'md'} border flex items-center justify-center ${
                              isSelected ? 'border-[#B7FF00] bg-[#B7FF00]' : 'border-[#353830]'
                            }`}>
                              {isSelected && (
                                <Check className={`w-3 h-3 text-[#10110F] stroke-[3]`} />
                              )}
                            </div>
                            <span className={`text-xs sm:text-sm font-medium ${isSelected ? 'text-[#F4F4EC] font-semibold' : ''}`}>
                              {optName}
                            </span>
                          </div>

                          <span className={`text-xs font-mono ${isSelected ? 'text-[#B7FF00] font-bold' : 'text-[#9A9D91]'}`}>
                            {option.price > 0 ? `+฿${option.price}` : '฿0'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Special Instructions Input */}
            <div className="pt-4 border-t border-[#262922]">
              <label className="block text-xs font-mono font-bold text-[#F4F4EC] mb-2 uppercase tracking-wider">
                {t.productModal.specialInstructions}
              </label>
              <textarea
                value={specialInstructions}
                onChange={e => setSpecialInstructions(e.target.value)}
                placeholder={t.productModal.specialInstructionsPlaceholder}
                rows={2}
                maxLength={200}
                className="w-full bg-[#10110F] border border-[#262922] focus:border-[#B7FF00] rounded-xl p-3 text-xs sm:text-sm text-[#F4F4EC] placeholder-[#9A9D91]/60 focus:outline-none transition-colors"
              />
            </div>

          </div>
        </div>

        {/* Modal Sticky Footer with Quantity & Add Button */}
        <div className="p-4 sm:p-5 bg-[#141512] border-t border-[#262922] flex items-center justify-between gap-4">
          
          {/* Quantity Controls */}
          <div className="flex items-center bg-[#10110F] border border-[#353830] rounded-xl p-1 shrink-0">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="p-1.5 rounded-lg text-[#9A9D91] hover:text-[#F4F4EC] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-mono font-bold text-sm w-8 text-center text-[#F4F4EC]">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(Math.min(20, quantity + 1))}
              className="p-1.5 rounded-lg text-[#9A9D91] hover:text-[#F4F4EC] transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="flex-1 py-3.5 px-6 rounded-xl bg-[#B7FF00] hover:bg-[#D4FF4F] text-[#10110F] font-display font-black text-sm sm:text-base flex items-center justify-between shadow-[0_0_20px_rgba(183,255,0,0.3)] transition-all cursor-pointer"
          >
            <span>{t.menu.addToCart}</span>
            <span className="font-mono font-black">
              ฿{totalPrice.toLocaleString()}
            </span>
          </button>

        </div>
      </div>
    </div>
  );
};

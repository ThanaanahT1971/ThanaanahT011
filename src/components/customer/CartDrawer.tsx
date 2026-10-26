import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Plus, Minus, Trash2, Tag, ArrowRight, ShoppingBag, CheckCircle } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { 
    isCartDrawerOpen, 
    setIsCartDrawerOpen, 
    cart, 
    cartSubtotal, 
    cartDiscount, 
    cartTotal,
    cartItemCount,
    updateCartItemQuantity, 
    removeFromCart, 
    appliedPromo, 
    applyPromoCode, 
    removePromoCode, 
    language, 
    t, 
    navigate,
    storeSettings
  } = useApp();

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState<string | null>(null);

  if (!isCartDrawerOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromoCode(promoInput);
    if (res.success) {
      setPromoInput('');
      setPromoError(null);
    } else {
      setPromoError(res.message);
    }
  };

  const handleCheckoutClick = () => {
    setIsCartDrawerOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-fadeIn">
      {/* Backdrop click to close */}
      <div 
        className="fixed inset-0" 
        onClick={() => setIsCartDrawerOpen(false)} 
      />

      {/* Drawer content */}
      <div className="relative w-full max-w-md bg-[#161713] border-l border-[#262922] h-full flex flex-col shadow-2xl z-10">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#262922] flex items-center justify-between bg-[#1C1E19]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#B7FF00]" />
            <h2 className="font-display font-black text-lg text-[#F4F4EC]">
              {t.cart.title}
            </h2>
            <span className="font-mono text-xs bg-[#B7FF00]/15 text-[#B7FF00] px-2 py-0.5 rounded-full font-bold">
              {cartItemCount}
            </span>
          </div>
          <button
            onClick={() => setIsCartDrawerOpen(false)}
            className="p-1.5 rounded-lg text-[#9A9D91] hover:text-[#F4F4EC] hover:bg-[#262922] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-[#1C1E19] border border-[#353830] flex items-center justify-center text-3xl">
                🍔
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-[#F4F4EC]">
                  {t.cart.emptyTitle}
                </h3>
                <p className="text-xs text-[#9A9D91] mt-1 max-w-xs">
                  {t.cart.emptySub}
                </p>
              </div>
              <button
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  navigate('/menu');
                }}
                className="mt-2 px-5 py-2.5 rounded-xl bg-[#B7FF00] hover:bg-[#D4FF4F] text-[#10110F] font-display font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                {t.cart.browseMenu}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map(item => {
                const prodName = language === 'th' ? item.product.nameTh : item.product.nameEn;

                return (
                  <div
                    key={item.cartItemId}
                    className="p-3.5 rounded-2xl bg-[#1C1E19] border border-[#262922] flex gap-3 relative group"
                  >
                    {/* Item Image */}
                    <img
                      src={item.product.imageUrl}
                      alt={prodName}
                      className="w-18 h-18 rounded-xl object-cover bg-[#10110F] shrink-0"
                    />

                    {/* Item Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-display font-bold text-sm text-[#F4F4EC] truncate">
                          {prodName}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="text-[#9A9D91] hover:text-red-400 p-1 transition-colors"
                          title={t.cart.removeItem}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Customization Badges */}
                      {item.selectedCustomizations.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {item.selectedCustomizations.flatMap(c => 
                            c.selectedOptionNames.map((name, i) => (
                              <span
                                key={i}
                                className="text-[10px] font-mono bg-[#10110F] border border-[#353830] text-[#D4FF4F] px-1.5 py-0.5 rounded"
                              >
                                {name}
                              </span>
                            ))
                          )}
                        </div>
                      )}

                      {/* Special instructions */}
                      {item.specialInstructions && (
                        <p className="text-[10px] text-[#9A9D91] italic mt-1 bg-[#10110F] px-1.5 py-0.5 rounded border border-[#262922]">
                          "{item.specialInstructions}"
                        </p>
                      )}

                      {/* Quantity & Item Subtotal */}
                      <div className="mt-2.5 flex items-center justify-between">
                        <div className="flex items-center bg-[#10110F] border border-[#353830] rounded-lg p-0.5">
                          <button
                            onClick={() => updateCartItemQuantity(item.cartItemId, item.quantity - 1)}
                            className="p-1 rounded text-[#9A9D91] hover:text-[#F4F4EC] transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-mono font-bold text-xs w-6 text-center text-[#F4F4EC]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartItemQuantity(item.cartItemId, item.quantity + 1)}
                            className="p-1 rounded text-[#9A9D91] hover:text-[#F4F4EC] transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="font-mono font-bold text-xs text-[#B7FF00]">
                          ฿{item.totalPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Drawer Footer with Calculations */}
        {cart.length > 0 && (
          <div className="p-5 bg-[#141512] border-t border-[#262922] space-y-4">
            
            {/* Promo Code Input */}
            <div>
              {appliedPromo ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#B7FF00]/10 border border-[#B7FF00]/40 text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#B7FF00]" />
                    <div>
                      <span className="font-mono font-bold text-[#B7FF00]">{appliedPromo.code}</span>
                      <span className="text-[#9A9D91] ml-2 text-[11px]">
                        ({appliedPromo.discountType === 'percentage' ? `-${appliedPromo.discountValue}%` : `-฿${appliedPromo.discountValue}`})
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={removePromoCode}
                    className="text-red-400 text-xs hover:underline font-mono"
                  >
                    {t.cart.removePromo}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="space-y-1.5">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 text-[#9A9D91] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={promoInput}
                        onChange={e => {
                          setPromoInput(e.target.value);
                          setPromoError(null);
                        }}
                        placeholder={t.cart.promoCode + ' (e.g. NIGHT10)'}
                        className="w-full bg-[#10110F] border border-[#262922] focus:border-[#B7FF00] rounded-xl pl-8 pr-3 py-2 text-xs font-mono text-[#F4F4EC] uppercase placeholder-[#9A9D91]/50 focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-[#1C1E19] border border-[#353830] hover:border-[#B7FF00] hover:text-[#B7FF00] text-xs font-display font-bold text-[#F4F4EC] transition-colors cursor-pointer"
                    >
                      {t.cart.applyCode}
                    </button>
                  </div>
                  {promoError && (
                    <p className="text-[11px] text-red-400 pl-1">{promoError}</p>
                  )}
                </form>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[#9A9D91]">
                <span>{t.cart.subtotal}</span>
                <span className="font-mono text-[#F4F4EC]">฿{cartSubtotal.toLocaleString()}</span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-[#B7FF00]">
                  <span>{t.cart.discount} ({appliedPromo?.code})</span>
                  <span className="font-mono font-bold">-฿{cartDiscount.toLocaleString()}</span>
                </div>
              )}
              <div className="pt-2 border-t border-[#262922] flex justify-between items-baseline text-sm">
                <span className="font-display font-bold text-[#F4F4EC]">{t.cart.total}</span>
                <div className="text-right">
                  <span className="font-mono font-black text-xl text-[#B7FF00]">
                    ฿{cartTotal.toLocaleString()}
                  </span>
                  <div className="text-[10px] text-[#9A9D91]">
                    {language === 'th' ? '+ ค่าจัดส่งคำนวณในหน้าชำระเงิน' : '+ delivery fee calculated at checkout'}
                  </div>
                </div>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={handleCheckoutClick}
              className="w-full py-4 rounded-xl bg-[#B7FF00] hover:bg-[#D4FF4F] text-[#10110F] font-display font-black text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(183,255,0,0.3)] transition-all cursor-pointer"
            >
              <span>{t.cart.checkoutBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { dataService } from '../services/dataService';
import confetti from 'canvas-confetti';
import { CheckCircle2, ArrowRight, Clock, MapPin, Store, Sparkles, ChefHat } from 'lucide-react';

export const OrderConfirmationPage: React.FC = () => {
  const { routeParams, language, t, navigate } = useApp();
  const orderId = routeParams.orderId;

  const order = orderId ? dataService.getOrderById(orderId) : undefined;

  useEffect(() => {
    // Fire celebratory neon confetti!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#B7FF00', '#D4FF4F', '#F4F4EC', '#10110F']
    });
  }, []);

  if (!order) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-display font-black text-2xl text-[#F4F4EC]">
          {t.tracking.orderNotFound}
        </h2>
        <button
          onClick={() => navigate('/')}
          className="px-5 py-2.5 rounded-xl bg-[#B7FF00] text-[#10110F] font-bold text-xs"
        >
          {t.tracking.backToHome}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8 animate-fadeIn">
      
      {/* Header Badge & Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex p-3 rounded-full bg-[#B7FF00]/15 border border-[#B7FF00] text-[#B7FF00] mb-2 animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="flex items-center justify-center gap-2">
          <span className="street-badge bg-[#B7FF00] text-[#10110F] text-xs px-3 py-1 rounded font-black">
            ORDER CONFIRMED • DEMO
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-heading font-black text-[#F4F4EC]">
          {language === 'th' ? 'ขอบคุณสำหรับออเดอร์!' : 'Order Placed Successfully!'}
        </h1>

        <p className="text-sm text-[#9A9D91]">
          {language === 'th'
            ? 'ครัวได้รับออเดอร์ของคุณแล้ว เชฟกำลังจัดเตรียมเนื้อสแมชอย่างพิถีพิถัน'
            : 'Our kitchen crew has received your order. Patties are getting prepped!'}
        </p>

        {/* Order Number Plaque */}
        <div className="inline-block p-4 rounded-2xl bg-[#1C1E19] border border-[#353830] mt-2">
          <span className="text-xs font-mono text-[#9A9D91] block uppercase tracking-wider">
            {t.tracking.orderNo}
          </span>
          <span className="font-mono font-black text-2xl sm:text-3xl text-[#B7FF00] tracking-wider">
            #{order.orderNumber}
          </span>
        </div>
      </div>

      {/* Main Order Plaque & Tracking Callout */}
      <div className="rounded-3xl bg-[#1C1E19] border border-[#262922] p-6 sm:p-8 space-y-6">
        
        {/* Estimated Prep Box */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-[#10110F] border border-[#353830]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#1C1E19] text-[#B7FF00]">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-[#9A9D91] block">
                {t.tracking.estPrep}
              </span>
              <span className="font-display font-bold text-sm text-[#F4F4EC]">
                ~{order.estimatedPreparationMinutes} {t.tracking.minutes}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-[#9A9D91] block">
              {t.checkout.fulfillment}
            </span>
            <span className="font-mono font-bold text-xs uppercase text-[#D4FF4F]">
              {order.fulfillmentMethod === 'delivery' ? t.checkout.delivery : t.checkout.pickup}
            </span>
          </div>
        </div>

        {/* Items Summary */}
        <div className="space-y-3">
          <h3 className="font-display font-bold text-sm text-[#F4F4EC]">
            {t.tracking.detailsTitle}
          </h3>
          <div className="space-y-2 border-t border-[#262922] pt-3">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-start text-xs">
                <div>
                  <span className="font-semibold text-[#F4F4EC]">
                    {item.quantity}x {language === 'th' ? item.nameTh : item.nameEn}
                  </span>
                  {item.customizationSummary.length > 0 && (
                    <div className="text-[11px] text-[#9A9D91]">
                      {item.customizationSummary.join(', ')}
                    </div>
                  )}
                </div>
                <span className="font-mono text-[#F4F4EC] font-bold">
                  ฿{item.totalPrice.toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing Total */}
          <div className="border-t border-[#262922] pt-3 space-y-1.5 text-xs">
            <div className="flex justify-between text-[#9A9D91]">
              <span>{t.cart.subtotal}</span>
              <span className="font-mono text-[#F4F4EC]">฿{order.subtotal.toLocaleString()}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-[#B7FF00]">
                <span>{t.cart.discount} ({order.appliedPromoCode})</span>
                <span className="font-mono font-bold">-฿{order.discount.toLocaleString()}</span>
              </div>
            )}
            {order.deliveryFee > 0 && (
              <div className="flex justify-between text-[#9A9D91]">
                <span>{t.cart.deliveryFee}</span>
                <span className="font-mono text-[#F4F4EC]">฿{order.deliveryFee}</span>
              </div>
            )}
            <div className="pt-2 border-t border-[#262922] flex justify-between font-bold text-sm">
              <span className="text-[#F4F4EC]">{t.cart.total}</span>
              <span className="font-mono font-black text-xl text-[#B7FF00]">
                ฿{order.total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Primary Action to Track Order */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate(`/track-order/${order.id}`)}
            className="flex-1 py-4 px-6 rounded-xl bg-[#B7FF00] hover:bg-[#D4FF4F] text-[#10110F] font-display font-black text-base flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(183,255,0,0.3)] transition-all cursor-pointer"
          >
            <ChefHat className="w-5 h-5" />
            <span>{language === 'th' ? 'ติดตามสถานะออเดอร์สด ๆ' : 'Track Order Status Live'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => navigate('/')}
            className="py-4 px-6 rounded-xl bg-[#10110F] border border-[#353830] text-[#F4F4EC] font-display font-bold text-sm hover:bg-[#262922] transition-colors"
          >
            {t.tracking.backToHome}
          </button>
        </div>

      </div>

    </div>
  );
};

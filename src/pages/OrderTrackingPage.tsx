import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { dataService } from '../services/dataService';
import { Order, OrderStatus } from '../types';
import { 
  Clock, 
  MapPin, 
  Store, 
  Bike, 
  CheckCircle2, 
  AlertCircle, 
  ChefHat, 
  Sparkles, 
  Search, 
  Phone,
  Flame,
  ArrowRight,
  RotateCcw
} from 'lucide-react';

export const OrderTrackingPage: React.FC = () => {
  const { routeParams, language, t, navigate, showToast } = useApp();

  const [searchOrderInput, setSearchOrderInput] = useState('');
  const [currentOrder, setCurrentOrder] = useState<Order | undefined>(() => {
    const id = routeParams.orderId;
    if (id) {
      return dataService.getOrderById(id);
    }
    // Default to the most recent order for demonstration ease!
    const orders = dataService.getOrders();
    return orders[0];
  });

  // Keep synced if routeParams change or dataService updates
  useEffect(() => {
    const id = routeParams.orderId;
    if (id) {
      const found = dataService.getOrderById(id);
      if (found) setCurrentOrder(found);
    }
  }, [routeParams.orderId]);

  useEffect(() => {
    const handleDataChange = () => {
      if (currentOrder) {
        const refreshed = dataService.getOrderById(currentOrder.id);
        if (refreshed) setCurrentOrder(refreshed);
      }
    };
    window.addEventListener('nnb_data_change', handleDataChange);
    return () => window.removeEventListener('nnb_data_change', handleDataChange);
  }, [currentOrder?.id]);

  const handleSearchOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchOrderInput.trim()) return;
    const found = dataService.getOrderById(searchOrderInput.trim());
    if (found) {
      setCurrentOrder(found);
      navigate(`/track-order/${found.id}`);
    } else {
      showToast(t.tracking.orderNotFound, 'error');
    }
  };

  // Status Stepper Definitions
  const isDelivery = currentOrder?.fulfillmentMethod === 'delivery';

  const statusSteps: { key: OrderStatus; labelTh: string; labelEn: string; descTh: string; descEn: string }[] = [
    {
      key: 'received',
      labelTh: 'ได้รับออเดอร์',
      labelEn: 'Order Received',
      descTh: 'ระบบรับข้อมูลเรียบร้อย',
      descEn: 'Logged into kitchen queue',
    },
    {
      key: 'confirmed',
      labelTh: 'ร้านค้ายืนยัน',
      labelEn: 'Confirmed',
      descTh: 'เชฟเตรียมวัตถุดิบเนื้อพรีเมียม',
      descEn: 'Ingredients prepped',
    },
    {
      key: 'preparing',
      labelTh: 'กำลังปรุงอาหาร',
      labelEn: 'Sizzling on Grill',
      descTh: 'สแมชเนื้อบนเตาร้อน ๆ',
      descEn: 'Smashing fresh patties',
    },
    ...(isDelivery
      ? [
          {
            key: 'out_for_delivery' as OrderStatus,
            labelTh: 'กำลังจัดส่ง',
            labelEn: 'Out for Delivery',
            descTh: 'ไรเดอร์กำลังนำส่งถึงคุณ',
            descEn: 'Rider is on the way',
          },
        ]
      : [
          {
            key: 'ready_for_pickup' as OrderStatus,
            labelTh: 'พร้อมรับอาหาร',
            labelEn: 'Ready for Pickup',
            descTh: 'แพ็กเกจเรียบร้อย รอคุณมารับ',
            descEn: 'Hot & ready at the counter',
          },
        ]),
    {
      key: 'completed',
      labelTh: 'เสร็จสิ้น',
      labelEn: 'Completed',
      descTh: 'อร่อยกับมื้อดึกของคุณ',
      descEn: 'Feast enjoyed',
    },
  ];

  const getStepIndex = (status?: OrderStatus) => {
    if (!status || status === 'cancelled') return -1;
    if (status === 'ready_for_pickup' || status === 'out_for_delivery') return 3;
    if (status === 'completed') return 4;
    if (status === 'preparing') return 2;
    if (status === 'confirmed') return 1;
    return 0;
  };

  const currentStepIndex = getStepIndex(currentOrder?.orderStatus);

  // Simulator: Advance status to next step
  const handleSimulateNextStep = () => {
    if (!currentOrder) return;
    const current = currentOrder.orderStatus;
    let next: OrderStatus = 'confirmed';

    if (current === 'received') next = 'confirmed';
    else if (current === 'confirmed') next = 'preparing';
    else if (current === 'preparing') next = isDelivery ? 'out_for_delivery' : 'ready_for_pickup';
    else if (current === 'ready_for_pickup' || current === 'out_for_delivery') next = 'completed';
    else if (current === 'completed') {
      showToast(language === 'th' ? 'ออเดอร์นี้เสร็จสิ้นแล้ว' : 'Order already completed', 'info');
      return;
    }

    const updated = dataService.updateOrderStatus(currentOrder.id, next);
    if (updated) {
      setCurrentOrder(updated);
      showToast(language === 'th' ? `จำลองสถานะ: ${updated.orderStatus}` : `Simulated status: ${updated.orderStatus}`, 'success');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn">
      
      {/* Page Title & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#262922] pb-6">
        <div>
          <span className="text-xs font-mono font-bold text-[#B7FF00] uppercase tracking-wider">
            LIVE KITCHEN DISPATCH
          </span>
          <h1 className="text-3xl font-heading font-black text-[#F4F4EC] mt-1">
            {t.tracking.title}
          </h1>
          <p className="text-xs text-[#9A9D91] mt-1">
            {t.tracking.trackSub}
          </p>
        </div>

        {/* Search Order by Number */}
        <form onSubmit={handleSearchOrder} className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-60">
            <Search className="w-4 h-4 text-[#9A9D91] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchOrderInput}
              onChange={e => setSearchOrderInput(e.target.value)}
              placeholder="NNB-XXXX"
              className="w-full bg-[#1C1E19] border border-[#262922] focus:border-[#B7FF00] rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-[#F4F4EC] uppercase focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-[#1C1E19] border border-[#353830] hover:border-[#B7FF00] text-xs font-display font-bold text-[#F4F4EC] hover:text-[#B7FF00] transition-colors cursor-pointer"
          >
            {language === 'th' ? 'ค้นหา' : 'Search'}
          </button>
        </form>
      </div>

      {!currentOrder ? (
        <div className="p-12 text-center bg-[#1C1E19] border border-[#262922] rounded-3xl space-y-4">
          <div className="text-4xl">🔎</div>
          <h3 className="font-display font-bold text-lg text-[#F4F4EC]">
            {t.tracking.orderNotFound}
          </h3>
          <p className="text-xs text-[#9A9D91]">
            {language === 'th' ? 'กรุณาระบุหมายเลขออเดอร์ที่ถูกต้อง เช่น NNB-8491' : 'Please enter a valid order number, e.g. NNB-8491'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Top Order Overview Banner */}
          <div className="p-6 rounded-3xl bg-[#1C1E19] border border-[#353830] relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-[#9A9D91] uppercase tracking-wider">
                    {t.tracking.orderNo}
                  </span>
                  <span className="font-mono font-black text-xl sm:text-2xl text-[#B7FF00]">
                    #{currentOrder.orderNumber}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#10110F] border border-[#353830] text-[#D4FF4F]">
                    {currentOrder.fulfillmentMethod}
                  </span>
                </div>
                <div className="text-xs text-[#9A9D91] flex items-center gap-3">
                  <span>
                    {new Date(currentOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span>•</span>
                  <span>{currentOrder.customerName}</span>
                </div>
              </div>

              {/* Status Pill */}
              <div className="sm:text-right">
                <span className="text-[10px] font-mono text-[#9A9D91] block uppercase">
                  STATUS
                </span>
                <span className={`inline-block font-display font-bold text-sm px-3 py-1 rounded-xl mt-0.5 ${
                  currentOrder.orderStatus === 'completed'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : currentOrder.orderStatus === 'cancelled'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                    : 'bg-[#B7FF00]/15 text-[#B7FF00] border border-[#B7FF00]/40 animate-pulse'
                }`}>
                  {t.orderStatus[currentOrder.orderStatus] || currentOrder.orderStatus}
                </span>
              </div>
            </div>

            {/* Cancelled Alert Box */}
            {currentOrder.orderStatus === 'cancelled' && (
              <div className="mt-4 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>
                  {language === 'th' ? 'เหตุผลที่ยกเลิก' : 'Reason'}: {currentOrder.cancellationReason || 'Store cancelled'}
                </span>
              </div>
            )}
          </div>

          {/* Stepper Progress Bar Visual */}
          {currentOrder.orderStatus !== 'cancelled' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-[#141512] border border-[#262922] space-y-8">
              
              <div className="relative">
                {/* Horizontal Connecting Line */}
                <div className="hidden sm:block absolute top-5 left-8 right-8 h-1 bg-[#262922] z-0">
                  <div
                    className="h-full bg-[#B7FF00] transition-all duration-500"
                    style={{
                      width: `${Math.min(100, Math.max(0, (currentStepIndex / (statusSteps.length - 1)) * 100))}%`,
                    }}
                  />
                </div>

                {/* Steps Nodes */}
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 sm:gap-2 relative z-10">
                  {statusSteps.map((step, idx) => {
                    const isDone = currentStepIndex > idx;
                    const isCurrent = currentStepIndex === idx;

                    return (
                      <div key={step.key} className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2">
                        {/* Step Circle */}
                        <div
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center font-display font-black text-sm transition-all duration-300 shrink-0 ${
                            isDone
                              ? 'bg-[#B7FF00] text-[#10110F] shadow-[0_0_12px_rgba(183,255,0,0.3)]'
                              : isCurrent
                              ? 'bg-[#B7FF00] text-[#10110F] ring-4 ring-[#B7FF00]/25 animate-pulse'
                              : 'bg-[#1C1E19] text-[#9A9D91] border border-[#353830]'
                          }`}
                        >
                          {isDone ? <CheckCircle2 className="w-5 h-5 stroke-[3]" /> : idx + 1}
                        </div>

                        {/* Step Text */}
                        <div>
                          <div className={`font-display text-xs sm:text-sm font-bold ${
                            isCurrent ? 'text-[#B7FF00]' : isDone ? 'text-[#F4F4EC]' : 'text-[#9A9D91]'
                          }`}>
                            {language === 'th' ? step.labelTh : step.labelEn}
                          </div>
                          <div className="text-[10px] text-[#9A9D91] hidden sm:block mt-0.5">
                            {language === 'th' ? step.descTh : step.descEn}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status Message Spotlight */}
              <div className="p-4 rounded-2xl bg-[#1C1E19] border border-[#353830] text-center">
                <span className="text-xs font-mono font-bold text-[#D4FF4F] uppercase tracking-wider block mb-1">
                  CURRENT STAGE
                </span>
                <p className="text-sm font-medium text-[#F4F4EC]">
                  {t.orderStatusDesc[currentOrder.orderStatus]}
                </p>
              </div>

            </div>
          )}

          {/* Interactive Demo Kitchen Simulator Tool */}
          <div className="p-5 rounded-3xl bg-[#1C1E19] border border-dashed border-[#B7FF00]/50 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-mono font-bold text-[#B7FF00] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  {t.tracking.demoControlTitle}
                </span>
                <p className="text-xs text-[#9A9D91] mt-0.5">
                  {language === 'th'
                    ? 'ปุ่มนี้ช่วยให้คุณทดสอบจำลองขั้นตอนการทำอาหารและการจัดส่งได้ทันที โดยไม่ต้องสลับไปหน้าแอดมิน'
                    : 'Advance order lifecycle step-by-step to test the full customer progression.'}
                </p>
              </div>

              <button
                onClick={handleSimulateNextStep}
                disabled={currentOrder.orderStatus === 'completed' || currentOrder.orderStatus === 'cancelled'}
                className="px-5 py-2.5 rounded-xl bg-[#B7FF00] hover:bg-[#D4FF4F] disabled:opacity-30 disabled:cursor-not-allowed text-[#10110F] font-display font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(183,255,0,0.25)] shrink-0 cursor-pointer"
              >
                {t.tracking.advanceStatusBtn}
              </button>
            </div>
          </div>

          {/* Order Details & Summary Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Fulfillment & Payment */}
            <div className="p-5 sm:p-6 rounded-3xl bg-[#1C1E19] border border-[#262922] space-y-4">
              <h3 className="font-display font-bold text-sm text-[#F4F4EC] flex items-center gap-2">
                <Store className="w-4 h-4 text-[#B7FF00]" />
                <span>{t.tracking.deliveryInfo}</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[#9A9D91] block">{t.checkout.fulfillment}</span>
                  <span className="font-semibold text-[#F4F4EC] uppercase">
                    {currentOrder.fulfillmentMethod === 'delivery' ? t.checkout.delivery : t.checkout.pickup}
                  </span>
                </div>

                {currentOrder.fulfillmentMethod === 'delivery' && currentOrder.deliveryAddress && (
                  <div>
                    <span className="text-[#9A9D91] block">{t.checkout.deliveryAddress}</span>
                    <span className="text-[#F4F4EC]">
                      {currentOrder.deliveryAddress.street}, {currentOrder.deliveryAddress.district}, {currentOrder.deliveryAddress.province} {currentOrder.deliveryAddress.postalCode}
                    </span>
                    {currentOrder.deliveryAddress.instructions && (
                      <p className="text-[11px] text-[#B7FF00] italic mt-0.5">
                        "{currentOrder.deliveryAddress.instructions}"
                      </p>
                    )}
                  </div>
                )}

                {currentOrder.fulfillmentMethod === 'pickup' && (
                  <div>
                    <span className="text-[#9A9D91] block">{t.checkout.pickupTime}</span>
                    <span className="text-[#F4F4EC] font-mono">
                      {currentOrder.pickupTime || 'ASAP (~20 mins)'}
                    </span>
                  </div>
                )}

                <div className="pt-2 border-t border-[#262922] flex justify-between items-center">
                  <div>
                    <span className="text-[#9A9D91] block">{t.tracking.paymentStatus}</span>
                    <span className="font-mono font-bold uppercase text-[#B7FF00]">
                      {currentOrder.paymentStatus.toUpperCase()} ({currentOrder.paymentMethod})
                    </span>
                  </div>
                  <a
                    href="tel:029998888"
                    className="p-2 rounded-xl bg-[#10110F] border border-[#353830] text-[#9A9D91] hover:text-[#B7FF00] transition-colors"
                    title={t.tracking.contactShop}
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Items Receipt */}
            <div className="p-5 sm:p-6 rounded-3xl bg-[#1C1E19] border border-[#262922] space-y-4">
              <h3 className="font-display font-bold text-sm text-[#F4F4EC] flex items-center justify-between">
                <span>{t.tracking.detailsTitle}</span>
                <span className="font-mono text-xs text-[#B7FF00]">
                  ฿{currentOrder.total.toLocaleString()}
                </span>
              </h3>

              <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1 text-xs">
                {currentOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-[#F4F4EC]">
                        {item.quantity}x {language === 'th' ? item.nameTh : item.nameEn}
                      </div>
                      {item.customizationSummary.length > 0 && (
                        <div className="text-[10px] text-[#9A9D91]">
                          {item.customizationSummary.join(', ')}
                        </div>
                      )}
                    </div>
                    <span className="font-mono text-[#F4F4EC]">
                      ฿{item.totalPrice.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-[#262922] flex justify-between items-center text-xs">
                <span className="text-[#9A9D91]">{t.cart.total}</span>
                <span className="font-mono font-black text-base text-[#B7FF00]">
                  ฿{currentOrder.total.toLocaleString()}
                </span>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};

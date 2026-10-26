import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { dataService } from '../services/dataService';
import { PromptPayModal } from '../components/customer/PromptPayModal';
import { FulfillmentMethod, PaymentMethod } from '../types';
import { 
  ShoppingBag, 
  MapPin, 
  Store, 
  Bike, 
  CreditCard, 
  Banknote, 
  QrCode, 
  Clock, 
  AlertCircle, 
  CheckCircle,
  ArrowRight
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { 
    cart, 
    cartSubtotal, 
    cartDiscount, 
    appliedPromo, 
    clearCart, 
    language, 
    t, 
    navigate, 
    storeSettings, 
    currentUser,
    showToast 
  } = useApp();

  // If cart is empty, redirect or prompt
  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-[#1C1E19] border border-[#353830] mx-auto flex items-center justify-center text-3xl">
          🍔
        </div>
        <h2 className="font-display font-black text-2xl text-[#F4F4EC]">
          {t.cart.emptyTitle}
        </h2>
        <p className="text-xs text-[#9A9D91]">
          {t.cart.emptySub}
        </p>
        <button
          onClick={() => navigate('/menu')}
          className="px-6 py-3 rounded-xl bg-[#B7FF00] hover:bg-[#D4FF4F] text-[#10110F] font-display font-black text-sm uppercase tracking-wider"
        >
          {t.cart.browseMenu}
        </button>
      </div>
    );
  }

  // Form State
  const [fulfillmentMethod, setFulfillmentMethod] = useState<FulfillmentMethod>(
    storeSettings.deliveryEnabled ? 'delivery' : 'pickup'
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('promptpay');

  // Contact Info
  const [customerName, setCustomerName] = useState(currentUser.name || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser.phone || '');
  const [customerEmail, setCustomerEmail] = useState(currentUser.email || '');

  // Pickup Details
  const [pickupTime, setPickupTime] = useState('ASAP');
  const [orderNotes, setOrderNotes] = useState('');

  // Delivery Details
  const defaultAddr = currentUser.savedAddresses?.find(a => a.isDefault) || currentUser.savedAddresses?.[0];
  const [streetAddress, setStreetAddress] = useState(defaultAddr?.street || '');
  const [district, setDistrict] = useState(defaultAddr?.district || 'คลองตันเหนือ, วัฒนา');
  const [province] = useState('กรุงเทพมหานคร');
  const [postalCode, setPostalCode] = useState(defaultAddr?.postalCode || '10110');
  const [deliveryInstructions, setDeliveryInstructions] = useState(defaultAddr?.instructions || '');

  // Submitting & PromptPay Modal
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPromptPayModal, setShowPromptPayModal] = useState(false);
  const [pendingOrderNumber, setPendingOrderNumber] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Calculations
  const deliveryFee = fulfillmentMethod === 'delivery' ? storeSettings.deliveryFee : 0;
  const grandTotal = Math.max(0, cartSubtotal - cartDiscount + deliveryFee);

  // Validate form
  const validateForm = (): boolean => {
    if (!customerName.trim()) {
      setFormError(t.checkout.validationError + ' (' + t.checkout.fullName + ')');
      return false;
    }
    const cleanPhone = customerPhone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 9 || cleanPhone.length > 10) {
      setFormError(t.checkout.phoneError);
      return false;
    }
    if (fulfillmentMethod === 'delivery') {
      if (!streetAddress.trim() || !district.trim()) {
        setFormError(t.checkout.validationError + ' (' + t.checkout.deliveryAddress + ')');
        return false;
      }
    }
    setFormError(null);
    return true;
  };

  const executeOrderCreation = (isPaidPromptPay: boolean = false) => {
    setIsSubmitting(true);

    try {
      const orderItems = cart.map(item => ({
        productId: item.product.id,
        nameTh: item.product.nameTh,
        nameEn: item.product.nameEn,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        customizationSummary: item.selectedCustomizations.flatMap(c => c.selectedOptionNames),
        specialInstructions: item.specialInstructions,
      }));

      const newOrder = dataService.createOrder({
        customerId: currentUser.id,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || undefined,
        items: orderItems,
        fulfillmentMethod,
        deliveryAddress: fulfillmentMethod === 'delivery' ? {
          street: streetAddress.trim(),
          district: district.trim(),
          province,
          postalCode: postalCode.trim(),
          instructions: deliveryInstructions.trim() || undefined,
        } : undefined,
        pickupTime: fulfillmentMethod === 'pickup' ? pickupTime : undefined,
        subtotal: cartSubtotal,
        discount: cartDiscount,
        appliedPromoCode: appliedPromo?.code,
        deliveryFee,
        total: grandTotal,
        paymentMethod,
        paymentStatus: isPaidPromptPay ? 'paid' : 'pending',
        orderStatus: 'received',
        specialInstructions: orderNotes.trim() || undefined,
        estimatedPreparationMinutes: storeSettings.estimatedPreparationMinutes,
      });

      clearCart();
      showToast(language === 'th' ? `สั่งซื้อสำเร็จ #${newOrder.orderNumber}` : `Order Placed #${newOrder.orderNumber}`, 'success');
      navigate(`/order-confirmation/${newOrder.id}`);
    } catch (err) {
      setFormError(language === 'th' ? 'เกิดข้อผิดพลาดในการสร้างออเดอร์ กรุณาลองใหม่อีกครั้ง' : 'Failed to place order. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeSettings.isOpen) {
      setFormError(t.checkout.storeClosed);
      return;
    }
    if (!validateForm()) return;

    if (paymentMethod === 'promptpay') {
      const demoRef = `NNB-${Math.floor(1000 + Math.random() * 9000)}`;
      setPendingOrderNumber(demoRef);
      setShowPromptPayModal(true);
    } else {
      executeOrderCreation(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Checkout Title */}
      <div className="mb-8 border-b border-[#262922] pb-4">
        <span className="text-xs font-mono font-bold text-[#B7FF00] uppercase tracking-wider">
          ORDER COMPLETION
        </span>
        <h1 className="text-3xl font-heading font-black text-[#F4F4EC] mt-1">
          {t.checkout.title}
        </h1>
      </div>

      {/* Store Closed Banner if applicable */}
      {!storeSettings.isOpen && (
        <div className="mb-6 p-4 rounded-2xl bg-red-950/60 border border-red-500/50 text-red-200 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <div>
            <strong>{language === 'th' ? 'ร้านปิดรับออเดอร์ชั่วคราว' : 'Store is Temporarily Closed'}:</strong>{' '}
            {t.checkout.storeClosed}
          </div>
        </div>
      )}

      {/* Form Error Alert */}
      {formError && (
        <div className="mb-6 p-4 rounded-2xl bg-red-950/60 border border-red-500/50 text-red-200 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Fulfillment & Details Form */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Fulfillment Toggle */}
            <div className="p-5 sm:p-6 rounded-3xl bg-[#1C1E19] border border-[#262922]">
              <h2 className="text-base font-display font-bold text-[#F4F4EC] mb-4 flex items-center gap-2">
                <Store className="w-4 h-4 text-[#B7FF00]" />
                <span>{t.checkout.fulfillment}</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Delivery Option */}
                <button
                  type="button"
                  disabled={!storeSettings.deliveryEnabled}
                  onClick={() => {
                    setFulfillmentMethod('delivery');
                    if (paymentMethod === 'cash_on_pickup') setPaymentMethod('cash_on_delivery');
                  }}
                  className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                    !storeSettings.deliveryEnabled
                      ? 'opacity-40 cursor-not-allowed bg-[#10110F] border-[#262922]'
                      : fulfillmentMethod === 'delivery'
                      ? 'bg-[#B7FF00]/10 border-[#B7FF00] text-[#F4F4EC]'
                      : 'bg-[#10110F] border-[#262922] text-[#9A9D91] hover:border-[#353830]'
                  }`}
                >
                  <div className={`p-2 rounded-xl ${fulfillmentMethod === 'delivery' ? 'bg-[#B7FF00] text-[#10110F]' : 'bg-[#1C1E19] text-[#9A9D91]'}`}>
                    <Bike className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-display font-bold text-sm text-[#F4F4EC]">
                      {t.checkout.delivery}
                    </div>
                    <div className="text-xs text-[#9A9D91] mt-0.5">
                      +฿{storeSettings.deliveryFee} (Bangkok Area)
                    </div>
                    {!storeSettings.deliveryEnabled && (
                      <div className="text-[10px] text-red-400 mt-1 font-mono">
                        {t.checkout.deliveryDisabled}
                      </div>
                    )}
                  </div>
                </button>

                {/* Pickup Option */}
                <button
                  type="button"
                  onClick={() => {
                    setFulfillmentMethod('pickup');
                    if (paymentMethod === 'cash_on_delivery') setPaymentMethod('cash_on_pickup');
                  }}
                  className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                    fulfillmentMethod === 'pickup'
                      ? 'bg-[#B7FF00]/10 border-[#B7FF00] text-[#F4F4EC]'
                      : 'bg-[#10110F] border-[#262922] text-[#9A9D91] hover:border-[#353830]'
                  }`}
                >
                  <div className={`p-2 rounded-xl ${fulfillmentMethod === 'pickup' ? 'bg-[#B7FF00] text-[#10110F]' : 'bg-[#1C1E19] text-[#9A9D91]'}`}>
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-display font-bold text-sm text-[#F4F4EC]">
                      {t.checkout.pickup}
                    </div>
                    <div className="text-xs text-[#9A9D91] mt-0.5 font-mono">
                      {language === 'th' ? 'ฟรี • รับที่ทองหล่อ 13' : 'Free • Thonglor 13'}
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* 2. Customer Contact Info */}
            <div className="p-5 sm:p-6 rounded-3xl bg-[#1C1E19] border border-[#262922] space-y-4">
              <h2 className="text-base font-display font-bold text-[#F4F4EC] flex items-center gap-2">
                <span>{t.checkout.contactInfo}</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-[#9A9D91] mb-1.5 uppercase">
                    {t.checkout.fullName} *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    placeholder="เช่น สมชาย ใจดี"
                    className="w-full bg-[#10110F] border border-[#262922] focus:border-[#B7FF00] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#F4F4EC] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-[#9A9D91] mb-1.5 uppercase">
                    {t.checkout.phone} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    placeholder="08X-XXX-XXXX"
                    className="w-full bg-[#10110F] border border-[#262922] focus:border-[#B7FF00] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#F4F4EC] focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* 3. Delivery Address or Pickup Slot */}
            {fulfillmentMethod === 'delivery' ? (
              <div className="p-5 sm:p-6 rounded-3xl bg-[#1C1E19] border border-[#262922] space-y-4">
                <h2 className="text-base font-display font-bold text-[#F4F4EC] flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#B7FF00]" />
                  <span>{t.checkout.deliveryAddress}</span>
                </h2>

                <div>
                  <label className="block text-xs font-mono font-bold text-[#9A9D91] mb-1.5 uppercase">
                    {t.checkout.streetAddress} *
                  </label>
                  <input
                    type="text"
                    required
                    value={streetAddress}
                    onChange={e => setStreetAddress(e.target.value)}
                    placeholder="88/12 คอนโดไอดีโอ สุขุมวิท ซอย 55"
                    className="w-full bg-[#10110F] border border-[#262922] focus:border-[#B7FF00] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#F4F4EC] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold text-[#9A9D91] mb-1.5 uppercase">
                      {t.checkout.district} *
                    </label>
                    <input
                      type="text"
                      required
                      value={district}
                      onChange={e => setDistrict(e.target.value)}
                      placeholder="คลองตันเหนือ, วัฒนา"
                      className="w-full bg-[#10110F] border border-[#262922] focus:border-[#B7FF00] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#F4F4EC] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-bold text-[#9A9D91] mb-1.5 uppercase">
                      {t.checkout.postalCode}
                    </label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={e => setPostalCode(e.target.value)}
                      placeholder="10110"
                      className="w-full bg-[#10110F] border border-[#262922] focus:border-[#B7FF00] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#F4F4EC] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-[#9A9D91] mb-1.5 uppercase">
                    {t.checkout.deliveryNotes}
                  </label>
                  <textarea
                    rows={2}
                    value={deliveryInstructions}
                    onChange={e => setDeliveryInstructions(e.target.value)}
                    placeholder="เช่น ฝากไว้กับรปภ. หรือ โทรแจ้งเมื่อถึงหน้าคอนโด"
                    className="w-full bg-[#10110F] border border-[#262922] focus:border-[#B7FF00] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-[#F4F4EC] focus:outline-none"
                  />
                </div>
              </div>
            ) : (
              <div className="p-5 sm:p-6 rounded-3xl bg-[#1C1E19] border border-[#262922] space-y-4">
                <h2 className="text-base font-display font-bold text-[#F4F4EC] flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#B7FF00]" />
                  <span>{t.checkout.pickupTime}</span>
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'ASAP', label: t.checkout.pickupTimeAsap },
                    { id: '30m', label: t.checkout.pickupTime30 },
                    { id: '45m', label: t.checkout.pickupTime45 },
                    { id: '60m', label: t.checkout.pickupTime60 },
                  ].map(slot => (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => setPickupTime(slot.id)}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        pickupTime === slot.id
                          ? 'bg-[#B7FF00]/10 border-[#B7FF00] text-[#B7FF00] font-bold'
                          : 'bg-[#10110F] border-[#262922] text-[#9A9D91] hover:border-[#353830]'
                      }`}
                    >
                      <span className="text-xs font-medium block">{slot.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Payment Method */}
            <div className="p-5 sm:p-6 rounded-3xl bg-[#1C1E19] border border-[#262922] space-y-3">
              <h2 className="text-base font-display font-bold text-[#F4F4EC] flex items-center gap-2 mb-3">
                <CreditCard className="w-4 h-4 text-[#B7FF00]" />
                <span>{t.checkout.paymentMethod}</span>
              </h2>

              {/* PromptPay */}
              <button
                type="button"
                onClick={() => setPaymentMethod('promptpay')}
                className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  paymentMethod === 'promptpay'
                    ? 'bg-[#B7FF00]/10 border-[#B7FF00] text-[#F4F4EC]'
                    : 'bg-[#10110F] border-[#262922] text-[#9A9D91] hover:border-[#353830]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[#003D6B] text-white">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-display font-bold text-sm text-[#F4F4EC]">
                      {t.checkout.promptpay}
                    </div>
                    <div className="text-xs text-[#9A9D91]">
                      {t.checkout.promptpayDesc}
                    </div>
                  </div>
                </div>
                {paymentMethod === 'promptpay' && (
                  <CheckCircle className="w-4 h-4 text-[#B7FF00]" />
                )}
              </button>

              {/* Cash Options */}
              {fulfillmentMethod === 'delivery' ? (
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash_on_delivery')}
                  className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    paymentMethod === 'cash_on_delivery'
                      ? 'bg-[#B7FF00]/10 border-[#B7FF00] text-[#F4F4EC]'
                      : 'bg-[#10110F] border-[#262922] text-[#9A9D91] hover:border-[#353830]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-[#1C1E19] text-[#B7FF00] border border-[#353830]">
                      <Banknote className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-display font-bold text-sm text-[#F4F4EC]">
                        {t.checkout.cashDelivery}
                      </div>
                      <div className="text-xs text-[#9A9D91]">
                        {language === 'th' ? 'เตรียมเงินสดพอดีชำระกับไรเดอร์' : 'Pay cash directly to the courier'}
                      </div>
                    </div>
                  </div>
                  {paymentMethod === 'cash_on_delivery' && (
                    <CheckCircle className="w-4 h-4 text-[#B7FF00]" />
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash_on_pickup')}
                  className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    paymentMethod === 'cash_on_pickup'
                      ? 'bg-[#B7FF00]/10 border-[#B7FF00] text-[#F4F4EC]'
                      : 'bg-[#10110F] border-[#262922] text-[#9A9D91] hover:border-[#353830]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-[#1C1E19] text-[#B7FF00] border border-[#353830]">
                      <Banknote className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-display font-bold text-sm text-[#F4F4EC]">
                        {t.checkout.cashPickup}
                      </div>
                      <div className="text-xs text-[#9A9D91]">
                        {language === 'th' ? 'ชำระที่เคาน์เตอร์ร้านตอนมารับอาหาร' : 'Pay at the counter when you pick up'}
                      </div>
                    </div>
                  </div>
                  {paymentMethod === 'cash_on_pickup' && (
                    <CheckCircle className="w-4 h-4 text-[#B7FF00]" />
                  )}
                </button>
              )}
            </div>

          </div>

          {/* Right Column: Order Summary & Place Button */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-5 sm:p-6 rounded-3xl bg-[#1C1E19] border border-[#262922] sticky top-24 space-y-5">
              <h2 className="text-base font-display font-bold text-[#F4F4EC] flex items-center justify-between">
                <span>{t.checkout.orderSummary}</span>
                <span className="font-mono text-xs text-[#B7FF00] bg-[#B7FF00]/10 px-2 py-0.5 rounded">
                  {cart.length} {t.menu.itemCount}
                </span>
              </h2>

              {/* Items List */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {cart.map(item => {
                  const prodName = language === 'th' ? item.product.nameTh : item.product.nameEn;
                  return (
                    <div key={item.cartItemId} className="flex justify-between items-start text-xs gap-3">
                      <div className="flex-1">
                        <div className="font-semibold text-[#F4F4EC]">
                          {item.quantity}x {prodName}
                        </div>
                        {item.selectedCustomizations.length > 0 && (
                          <div className="text-[10px] text-[#9A9D91] mt-0.5">
                            {item.selectedCustomizations.flatMap(c => c.selectedOptionNames).join(', ')}
                          </div>
                        )}
                      </div>
                      <span className="font-mono text-[#F4F4EC] shrink-0 font-bold">
                        ฿{item.totalPrice.toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Price Calculations */}
              <div className="pt-4 border-t border-[#262922] space-y-2 text-xs">
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

                <div className="flex justify-between text-[#9A9D91]">
                  <span>{t.cart.deliveryFee}</span>
                  <span className="font-mono text-[#F4F4EC]">
                    {deliveryFee > 0 ? `฿${deliveryFee.toLocaleString()}` : '฿0 (Free)'}
                  </span>
                </div>

                <div className="pt-3 border-t border-[#262922] flex justify-between items-baseline">
                  <span className="font-display font-bold text-base text-[#F4F4EC]">
                    {t.cart.total}
                  </span>
                  <span className="font-mono font-black text-2xl text-[#B7FF00]">
                    ฿{grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Submit Order Button */}
              <button
                type="submit"
                disabled={isSubmitting || !storeSettings.isOpen}
                className={`w-full py-4 rounded-xl font-display font-black text-base flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(183,255,0,0.3)] transition-all cursor-pointer ${
                  !storeSettings.isOpen
                    ? 'bg-[#262922] text-[#9A9D91] cursor-not-allowed'
                    : 'bg-[#B7FF00] hover:bg-[#D4FF4F] text-[#10110F]'
                }`}
              >
                <span>
                  {isSubmitting ? t.checkout.processingOrder : t.checkout.placeOrderBtn}
                </span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <div className="text-[11px] font-mono text-center text-[#9A9D91]">
                🔒 DEMO PROTOCOL • NO REAL CHARGES
              </div>

            </div>
          </div>

        </div>
      </form>

      {/* PromptPay Interactive Simulation Modal */}
      {showPromptPayModal && (
        <PromptPayModal
          amount={grandTotal}
          orderNumber={pendingOrderNumber}
          onConfirmPayment={() => {
            setShowPromptPayModal(false);
            executeOrderCreation(true);
          }}
          onClose={() => setShowPromptPayModal(false)}
        />
      )}

    </div>
  );
};

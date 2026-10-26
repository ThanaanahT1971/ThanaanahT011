import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { dataService } from '../../services/dataService';
import { StoreSettings } from '../../types';
import { 
  Store, 
  Bike, 
  Clock, 
  RotateCcw, 
  Save, 
  Megaphone, 
  AlertTriangle,
  CheckCircle2,
  Phone,
  MapPin
} from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { language, t, storeSettings, reloadStoreSettings, showToast } = useApp();

  const [isOpen, setIsOpen] = useState(storeSettings.isOpen);
  const [deliveryEnabled, setDeliveryEnabled] = useState(storeSettings.deliveryEnabled);
  const [pickupEnabled, setPickupEnabled] = useState(storeSettings.pickupEnabled);
  const [deliveryFee, setDeliveryFee] = useState(storeSettings.deliveryFee);
  const [prepMinutes, setPrepMinutes] = useState(storeSettings.estimatedPreparationMinutes);
  const [announcementTh, setAnnouncementTh] = useState(storeSettings.announcementTh);
  const [announcementEn, setAnnouncementEn] = useState(storeSettings.announcementEn);
  const [phone, setPhone] = useState(storeSettings.phone);
  const [address, setAddress] = useState(storeSettings.address);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: StoreSettings = {
      ...storeSettings,
      isOpen,
      deliveryEnabled,
      pickupEnabled,
      deliveryFee: Number(deliveryFee) || 0,
      estimatedPreparationMinutes: Number(prepMinutes) || 20,
      announcementTh: announcementTh.trim(),
      announcementEn: announcementEn.trim(),
      phone: phone.trim(),
      address: address.trim(),
    };

    dataService.saveStoreSettings(updated);
    reloadStoreSettings();
    showToast(language === 'th' ? 'บันทึกการตั้งค่าร้านค้าเรียบร้อยแล้ว' : 'Saved store settings', 'success');
  };

  const handleResetAllData = () => {
    if (window.confirm(t.admin.resetConfirm)) {
      dataService.resetAllDemoData();
      reloadStoreSettings();
      showToast(language === 'th' ? 'รีเซ็ตข้อมูลระบบกลับเป็นค่าเริ่มต้นเรียบร้อย' : 'Demo data reset to factory state', 'info');
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Title */}
      <div>
        <h2 className="text-2xl font-heading font-black text-[#F4F4EC]">
          {t.admin.settings}
        </h2>
        <p className="text-xs text-[#9A9D91]">
          {language === 'th' ? 'ควบคุมการเปิดรับออเดอร์ บริการจัดส่ง ค่าส่ง และข้อความประกาศ' : 'Control store availability, fulfillment switches, delivery fees, and reset demo data'}
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        
        {/* 1. Global Store Availability */}
        <div className="p-6 rounded-3xl bg-[#1C1E19] border border-[#262922] space-y-4">
          <h3 className="font-display font-bold text-base text-[#F4F4EC] flex items-center gap-2">
            <Store className="w-5 h-5 text-[#B7FF00]" />
            <span>{t.admin.storeOpenStatus}</span>
          </h3>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#10110F] border border-[#353830]">
            <div>
              <span className={`font-display font-bold text-sm ${isOpen ? 'text-[#B7FF00]' : 'text-red-400'}`}>
                {isOpen ? t.admin.open : t.admin.closed}
              </span>
              <p className="text-xs text-[#9A9D91] mt-0.5">
                {isOpen
                  ? (language === 'th' ? 'ลูกค้าสามารถกดสั่งซื้อและชำระเงินได้ตามปกติ' : 'Accepting new customer orders')
                  : (language === 'th' ? 'ระบบจะปิดรับออเดอร์ในหน้า Checkout ชั่วคราว' : 'New orders are temporarily blocked')}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                isOpen
                  ? 'bg-[#B7FF00] text-[#10110F]'
                  : 'bg-red-500/20 text-red-400 border border-red-500/40'
              }`}
            >
              {isOpen ? 'STORE IS OPEN' : 'STORE IS CLOSED'}
            </button>
          </div>
        </div>

        {/* 2. Fulfillment Switches (Pickup & Delivery) */}
        <div className="p-6 rounded-3xl bg-[#1C1E19] border border-[#262922] space-y-4">
          <h3 className="font-display font-bold text-base text-[#F4F4EC] flex items-center gap-2">
            <Bike className="w-5 h-5 text-[#B7FF00]" />
            <span>{language === 'th' ? 'บริการจัดส่ง & รับที่ร้าน' : 'Fulfillment Switches'}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Delivery Toggle */}
            <div className="p-4 rounded-2xl bg-[#10110F] border border-[#353830] flex items-center justify-between">
              <div>
                <span className="font-semibold text-xs text-[#F4F4EC] block">
                  {t.admin.deliveryStatus}
                </span>
                <span className="text-[11px] text-[#9A9D91]">
                  {deliveryEnabled ? t.admin.enabled : t.admin.disabled}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setDeliveryEnabled(!deliveryEnabled)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  deliveryEnabled ? 'bg-[#B7FF00]' : 'bg-[#262922]'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-[#10110F] absolute top-1 transition-transform ${
                  deliveryEnabled ? 'right-1' : 'left-1'
                }`} />
              </button>
            </div>

            {/* Pickup Toggle */}
            <div className="p-4 rounded-2xl bg-[#10110F] border border-[#353830] flex items-center justify-between">
              <div>
                <span className="font-semibold text-xs text-[#F4F4EC] block">
                  {t.admin.pickupStatus}
                </span>
                <span className="text-[11px] text-[#9A9D91]">
                  {pickupEnabled ? t.admin.enabled : t.admin.disabled}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPickupEnabled(!pickupEnabled)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  pickupEnabled ? 'bg-[#B7FF00]' : 'bg-[#262922]'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-[#10110F] absolute top-1 transition-transform ${
                  pickupEnabled ? 'right-1' : 'left-1'
                }`} />
              </button>
            </div>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-mono text-[#9A9D91] mb-1">
                {t.admin.deliveryFeeSettings}
              </label>
              <input
                type="number"
                value={deliveryFee}
                onChange={e => setDeliveryFee(Number(e.target.value))}
                className="w-full bg-[#10110F] border border-[#353830] focus:border-[#B7FF00] rounded-xl px-3 py-2 text-xs font-mono text-[#F4F4EC] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#9A9D91] mb-1">
                {t.admin.estPrepSettings}
              </label>
              <input
                type="number"
                value={prepMinutes}
                onChange={e => setPrepMinutes(Number(e.target.value))}
                className="w-full bg-[#10110F] border border-[#353830] focus:border-[#B7FF00] rounded-xl px-3 py-2 text-xs font-mono text-[#F4F4EC] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 3. Announcement Ticker Text */}
        <div className="p-6 rounded-3xl bg-[#1C1E19] border border-[#262922] space-y-4">
          <h3 className="font-display font-bold text-base text-[#F4F4EC] flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-[#B7FF00]" />
            <span>{language === 'th' ? 'แถบประกาศหัวเว็บไซต์' : 'Header Announcement Banner'}</span>
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-mono text-[#9A9D91] mb-1">Announcement (Thai)</label>
              <input
                type="text"
                value={announcementTh}
                onChange={e => setAnnouncementTh(e.target.value)}
                className="w-full bg-[#10110F] border border-[#353830] focus:border-[#B7FF00] rounded-xl px-3 py-2 text-xs text-[#F4F4EC] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#9A9D91] mb-1">Announcement (English)</label>
              <input
                type="text"
                value={announcementEn}
                onChange={e => setAnnouncementEn(e.target.value)}
                className="w-full bg-[#10110F] border border-[#353830] focus:border-[#B7FF00] rounded-xl px-3 py-2 text-xs text-[#F4F4EC] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Save Settings Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3.5 rounded-xl bg-[#B7FF00] hover:bg-[#D4FF4F] text-[#10110F] font-display font-black text-sm flex items-center gap-2 shadow-[0_0_15px_rgba(183,255,0,0.3)] transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{t.admin.saveChanges}</span>
          </button>
        </div>

      </form>

      {/* 4. Danger Zone: Reset All Demo Data */}
      <div className="p-6 rounded-3xl bg-red-950/20 border border-red-500/30 space-y-3">
        <h3 className="font-display font-bold text-base text-red-400 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          <span>{language === 'th' ? 'พื้นที่รีเซ็ตระบบทดสอบ' : 'Demo State Factory Reset'}</span>
        </h3>
        <p className="text-xs text-[#9A9D91]">
          {language === 'th'
            ? 'คลิกปุ่มนี้เพื่อล้างข้อมูลและรีเซ็ตเมนูอาหาร ออเดอร์ และการตั้งค่าทั้งหมดกลับเป็นค่าตั้งต้นจากโรงงาน'
            : 'Reset all stored orders, products, coupons, and store settings back to original demonstration seeds.'}
        </p>
        <button
          type="button"
          onClick={handleResetAllData}
          className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{t.admin.resetDemoData}</span>
        </button>
      </div>

    </div>
  );
};

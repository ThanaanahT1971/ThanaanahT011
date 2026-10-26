import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { dataService } from '../services/dataService';
import { 
  User, 
  MapPin, 
  Clock, 
  ShoppingBag, 
  RotateCcw, 
  Plus, 
  ShieldCheck, 
  ChefHat, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { Address } from '../types';

export const AccountPage: React.FC = () => {
  const { 
    currentUser, 
    language, 
    t, 
    reorderItems, 
    navigate, 
    setIsRoleModalOpen,
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses'>('orders');

  // New address modal state
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newStreet, setNewStreet] = useState('');
  const [newDistrict, setNewDistrict] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newPostal, setNewPostal] = useState('10110');

  // Customer orders
  const allOrders = dataService.getOrders();
  const userOrders = allOrders.filter(o => 
    o.customerId === currentUser.id || o.customerPhone === currentUser.phone
  );

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet.trim() || !newDistrict.trim()) return;

    const newAddr: Address = {
      id: `addr-${Date.now()}`,
      title: newTitle.trim() || (language === 'th' ? 'ที่อยู่จัดส่ง' : 'Delivery Address'),
      street: newStreet.trim(),
      district: newDistrict.trim(),
      province: 'กรุงเทพมหานคร',
      postalCode: newPostal.trim() || '10110',
    };

    const currentAddrs = currentUser.savedAddresses || [];
    const updatedUser = {
      ...currentUser,
      savedAddresses: [...currentAddrs, newAddr],
    };

    dataService.setCurrentUser(updatedUser);
    setIsAddingAddress(false);
    setNewStreet('');
    setNewDistrict('');
    setNewTitle('');
    showToast(language === 'th' ? 'บันทึกที่อยู่เรียบร้อยแล้ว' : 'Saved new address', 'success');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn">
      
      {/* Account Profile Header Card */}
      <div className="rounded-3xl bg-[#1C1E19] border border-[#262922] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#B7FF00] text-[#10110F] flex items-center justify-center font-heading font-black text-2xl shadow-[0_0_20px_rgba(183,255,0,0.3)]">
            {currentUser.name[0] || 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-black text-xl sm:text-2xl text-[#F4F4EC]">
                {currentUser.name}
              </h1>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#10110F] text-[#B7FF00] border border-[#B7FF00]/40 uppercase">
                {currentUser.role}
              </span>
            </div>
            <p className="text-xs text-[#9A9D91] mt-0.5 font-mono">
              {currentUser.email} • {currentUser.phone || 'No phone'}
            </p>
          </div>
        </div>

        {/* Demo Role Switcher Trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsRoleModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#10110F] border border-[#353830] hover:border-[#B7FF00] text-xs font-display font-bold text-[#B7FF00] transition-colors cursor-pointer"
          >
            {t.nav.switchRole}
          </button>
          {(currentUser.role === 'admin' || currentUser.role === 'staff') && (
            <button
              onClick={() => navigate('/admin')}
              className="px-4 py-2 rounded-xl bg-[#B7FF00] hover:bg-[#D4FF4F] text-[#10110F] text-xs font-display font-black transition-colors cursor-pointer"
            >
              {t.nav.adminDashboard}
            </button>
          )}
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex border-b border-[#262922] gap-6 text-sm font-display font-bold">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 transition-colors cursor-pointer ${
            activeTab === 'orders'
              ? 'text-[#B7FF00] border-b-2 border-[#B7FF00]'
              : 'text-[#9A9D91] hover:text-[#F4F4EC]'
          }`}
        >
          {t.account.orderHistory} ({userOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('addresses')}
          className={`pb-3 transition-colors cursor-pointer ${
            activeTab === 'addresses'
              ? 'text-[#B7FF00] border-b-2 border-[#B7FF00]'
              : 'text-[#9A9D91] hover:text-[#F4F4EC]'
          }`}
        >
          {t.account.savedAddresses} ({currentUser.savedAddresses?.length || 0})
        </button>
      </div>

      {/* Tab: Order History */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {userOrders.length === 0 ? (
            <div className="p-12 rounded-3xl bg-[#1C1E19] border border-[#262922] text-center space-y-3">
              <ShoppingBag className="w-8 h-8 text-[#9A9D91] mx-auto opacity-40" />
              <h3 className="font-display font-bold text-base text-[#F4F4EC]">
                {t.account.noOrders}
              </h3>
              <p className="text-xs text-[#9A9D91]">
                {language === 'th' ? 'สั่งซื้อเบอร์เกอร์รอบดึกครั้งแรกของคุณเลย!' : 'Place your first late night burger order!'}
              </p>
              <button
                onClick={() => navigate('/menu')}
                className="mt-2 px-5 py-2.5 rounded-xl bg-[#B7FF00] text-[#10110F] font-display font-black text-xs uppercase"
              >
                {t.nav.orderNow}
              </button>
            </div>
          ) : (
            userOrders.map(order => (
              <div
                key={order.id}
                className="p-5 sm:p-6 rounded-3xl bg-[#1C1E19] border border-[#262922] hover:border-[#353830] transition-colors space-y-4"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#262922] pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-black text-base text-[#B7FF00]">
                      #{order.orderNumber}
                    </span>
                    <span className="text-xs text-[#9A9D91] font-mono">
                      {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <span className={`inline-block text-xs font-mono font-bold px-2.5 py-0.5 rounded-full ${
                    order.orderStatus === 'completed'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : order.orderStatus === 'cancelled'
                      ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                      : 'bg-[#B7FF00]/15 text-[#B7FF00] border border-[#B7FF00]/30'
                  }`}>
                    {t.orderStatus[order.orderStatus] || order.orderStatus}
                  </span>
                </div>

                {/* Items */}
                <div className="space-y-1.5 text-xs">
                  {order.items.map((it, i) => (
                    <div key={i} className="flex justify-between text-[#9A9D91]">
                      <span>
                        <strong className="text-[#F4F4EC]">{it.quantity}x</strong> {language === 'th' ? it.nameTh : it.nameEn}
                      </span>
                      <span className="font-mono text-[#F4F4EC]">
                        ฿{it.totalPrice.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer Controls: Total & Actions */}
                <div className="pt-3 border-t border-[#262922] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-xs">
                    <span className="text-[#9A9D91]">{t.cart.total}: </span>
                    <span className="font-mono font-black text-base text-[#B7FF00]">
                      ฿{order.total.toLocaleString()}
                    </span>
                    <span className="text-[11px] text-[#9A9D91] ml-2 font-mono">
                      ({order.fulfillmentMethod})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => reorderItems(order.items)}
                      className="px-4 py-2 rounded-xl bg-[#B7FF00] hover:bg-[#D4FF4F] text-[#10110F] font-display font-black text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{t.account.reorderBtn}</span>
                    </button>

                    <button
                      onClick={() => navigate(`/track-order/${order.id}`)}
                      className="px-3.5 py-2 rounded-xl bg-[#10110F] border border-[#353830] text-xs font-display font-bold text-[#F4F4EC] hover:text-[#B7FF00] hover:border-[#B7FF00] transition-colors"
                    >
                      {t.account.viewDetails}
                    </button>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>
      )}

      {/* Tab: Saved Addresses */}
      {activeTab === 'addresses' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-display font-bold text-base text-[#F4F4EC]">
              {t.account.savedAddresses}
            </h3>
            <button
              onClick={() => setIsAddingAddress(!isAddingAddress)}
              className="px-3.5 py-1.5 rounded-xl bg-[#1C1E19] border border-[#353830] hover:border-[#B7FF00] text-xs font-display font-bold text-[#B7FF00] flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.account.addNewAddress}</span>
            </button>
          </div>

          {/* Add Address Form Box */}
          {isAddingAddress && (
            <form onSubmit={handleSaveAddress} className="p-5 rounded-2xl bg-[#141512] border border-[#B7FF00]/40 space-y-3">
              <h4 className="font-display font-bold text-xs text-[#B7FF00] uppercase tracking-wider">
                {t.account.addNewAddress}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="ชื่อที่อยู่ (เช่น คอนโด, บ้าน, ออฟฟิศ)"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="bg-[#1C1E19] border border-[#353830] rounded-xl px-3 py-2 text-xs text-[#F4F4EC]"
                />
                <input
                  type="text"
                  required
                  placeholder="บ้านเลขที่, ถนน, ซอย"
                  value={newStreet}
                  onChange={e => setNewStreet(e.target.value)}
                  className="bg-[#1C1E19] border border-[#353830] rounded-xl px-3 py-2 text-xs text-[#F4F4EC]"
                />
                <input
                  type="text"
                  required
                  placeholder="แขวง / เขต"
                  value={newDistrict}
                  onChange={e => setNewDistrict(e.target.value)}
                  className="bg-[#1C1E19] border border-[#353830] rounded-xl px-3 py-2 text-xs text-[#F4F4EC]"
                />
                <input
                  type="text"
                  placeholder="รหัสไปรษณีย์"
                  value={newPostal}
                  onChange={e => setNewPostal(e.target.value)}
                  className="bg-[#1C1E19] border border-[#353830] rounded-xl px-3 py-2 text-xs text-[#F4F4EC]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingAddress(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-[#9A9D91]"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#B7FF00] text-[#10110F] font-bold text-xs"
                >
                  {t.common.save}
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentUser.savedAddresses?.map(addr => (
              <div
                key={addr.id}
                className="p-5 rounded-2xl bg-[#1C1E19] border border-[#262922] space-y-2 relative"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-bold text-sm text-[#F4F4EC] flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#B7FF00]" />
                    <span>{addr.title}</span>
                  </h4>
                  {addr.isDefault && (
                    <span className="text-[10px] font-mono text-[#B7FF00] bg-[#B7FF00]/10 px-2 py-0.5 rounded">
                      DEFAULT
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#9A9D91]">
                  {addr.street}, {addr.district}, {addr.province} {addr.postalCode}
                </p>
                {addr.instructions && (
                  <p className="text-[11px] text-[#9A9D91] italic pt-1 border-t border-[#262922]">
                    "{addr.instructions}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

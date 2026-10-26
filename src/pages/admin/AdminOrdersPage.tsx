import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { dataService } from '../../services/dataService';
import { Order, OrderStatus } from '../../types';
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  Flame, 
  Clock, 
  Bike, 
  Store, 
  XCircle, 
  Phone, 
  ChevronRight,
  AlertCircle,
  Eye,
  RefreshCw
} from 'lucide-react';

export const AdminOrdersPage: React.FC = () => {
  const { language, t, showToast, navigate } = useApp();

  const [orders, setOrders] = useState<Order[]>(() => dataService.getOrders());
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Cancel Modal State
  const [cancelModalOrderId, setCancelModalOrderId] = useState<string | null>(null);
  const [cancellationReason, setCancellationReason] = useState('');

  const refreshOrders = () => {
    setOrders(dataService.getOrders());
  };

  const filteredOrders = orders.filter(order => {
    if (statusFilter !== 'all' && order.orderStatus !== statusFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchNo = order.orderNumber.toLowerCase().includes(q);
      const matchName = order.customerName.toLowerCase().includes(q);
      const matchPhone = order.customerPhone.includes(q);
      if (!matchNo && !matchName && !matchPhone) return false;
    }
    return true;
  });

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    const updated = dataService.updateOrderStatus(orderId, newStatus);
    if (updated) {
      refreshOrders();
      showToast(`${language === 'th' ? 'อัปเดตออเดอร์ #' : 'Updated order #'}${updated.orderNumber} -> ${newStatus}`, 'success');
    }
  };

  const handleConfirmCancel = () => {
    if (!cancelModalOrderId) return;
    const reason = cancellationReason.trim() || 'Store Cancelled';
    const updated = dataService.updateOrderStatus(cancelModalOrderId, 'cancelled', reason);
    if (updated) {
      refreshOrders();
      showToast(language === 'th' ? `ยกเลิกออเดอร์ #${updated.orderNumber} แล้ว` : `Cancelled order #${updated.orderNumber}`, 'info');
    }
    setCancelModalOrderId(null);
    setCancellationReason('');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Title & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-black text-[#F4F4EC]">
            {t.admin.orders}
          </h2>
          <p className="text-xs text-[#9A9D91]">
            {language === 'th' ? 'จัดการออเดอร์ คำนวณเวลา และส่งต่อไปยังครัว' : 'Real-time kitchen order dispatch and fulfillment manager'}
          </p>
        </div>

        {/* Search & Refresh */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-[#9A9D91] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={t.admin.searchOrder}
              className="bg-[#1C1E19] border border-[#262922] focus:border-[#B7FF00] rounded-xl pl-9 pr-3 py-2 text-xs text-[#F4F4EC] focus:outline-none w-56 sm:w-64"
            />
          </div>

          <button
            onClick={refreshOrders}
            className="p-2 rounded-xl bg-[#1C1E19] border border-[#262922] text-[#9A9D91] hover:text-[#B7FF00] transition-colors"
            title="Refresh orders"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Status Filter Badges */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { key: 'all', label: t.admin.allStatus, count: orders.length },
          { key: 'received', label: t.orderStatus.received, count: orders.filter(o => o.orderStatus === 'received').length },
          { key: 'confirmed', label: t.orderStatus.confirmed, count: orders.filter(o => o.orderStatus === 'confirmed').length },
          { key: 'preparing', label: t.orderStatus.preparing, count: orders.filter(o => o.orderStatus === 'preparing').length },
          { key: 'ready_for_pickup', label: t.orderStatus.ready_for_pickup, count: orders.filter(o => o.orderStatus === 'ready_for_pickup').length },
          { key: 'out_for_delivery', label: t.orderStatus.out_for_delivery, count: orders.filter(o => o.orderStatus === 'out_for_delivery').length },
          { key: 'completed', label: t.orderStatus.completed, count: orders.filter(o => o.orderStatus === 'completed').length },
          { key: 'cancelled', label: t.orderStatus.cancelled, count: orders.filter(o => o.orderStatus === 'cancelled').length },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              statusFilter === tab.key
                ? 'bg-[#B7FF00] text-[#10110F]'
                : 'bg-[#1C1E19] text-[#9A9D91] border border-[#262922] hover:text-[#F4F4EC]'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`text-[10px] px-1 rounded ${statusFilter === tab.key ? 'bg-[#10110F]/20' : 'bg-[#10110F]'}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center bg-[#1C1E19] border border-[#262922] rounded-3xl text-sm text-[#9A9D91]">
            {language === 'th' ? 'ไม่พบคำสั่งซื้อในหมวดนี้' : 'No orders found matching the filter criteria.'}
          </div>
        ) : (
          filteredOrders.map(order => {
            const isDelivery = order.fulfillmentMethod === 'delivery';

            return (
              <div
                key={order.id}
                className="p-5 sm:p-6 rounded-3xl bg-[#1C1E19] border border-[#262922] hover:border-[#353830] transition-colors space-y-4"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#262922] pb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-black text-lg text-[#B7FF00]">
                      #{order.orderNumber}
                    </span>
                    <span className="font-mono text-xs text-[#9A9D91]">
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-[#10110F] text-[#D4FF4F] border border-[#353830] uppercase">
                      {isDelivery ? <Bike className="w-3.5 h-3.5" /> : <Store className="w-3.5 h-3.5" />}
                      {order.fulfillmentMethod}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full ${
                      order.orderStatus === 'completed'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : order.orderStatus === 'cancelled'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                        : 'bg-[#B7FF00]/15 text-[#B7FF00] border border-[#B7FF00]/40'
                    }`}>
                      {t.orderStatus[order.orderStatus] || order.orderStatus}
                    </span>

                    <button
                      onClick={() => navigate(`/track-order/${order.id}`)}
                      className="p-1.5 rounded-lg bg-[#10110F] border border-[#353830] text-[#9A9D91] hover:text-[#B7FF00]"
                      title="View Customer Tracking View"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Body: Items & Customer Details */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  
                  {/* Items Column */}
                  <div className="md:col-span-7 space-y-2">
                    <span className="text-[11px] font-mono text-[#9A9D91] uppercase block">
                      ORDER ITEMS ({order.items.length})
                    </span>
                    <div className="space-y-2 text-xs">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-[#141512] border border-[#262922]">
                          <div className="flex justify-between items-baseline font-semibold text-[#F4F4EC]">
                            <span>{it.quantity}x {language === 'th' ? it.nameTh : it.nameEn}</span>
                            <span className="font-mono text-[#B7FF00]">฿{it.totalPrice}</span>
                          </div>
                          {it.customizationSummary.length > 0 && (
                            <div className="text-[11px] text-[#D4FF4F] mt-0.5">
                              {it.customizationSummary.join(', ')}
                            </div>
                          )}
                          {it.specialInstructions && (
                            <div className="text-[10px] text-[#9A9D91] italic mt-1 bg-[#10110F] px-2 py-0.5 rounded">
                              Note: {it.specialInstructions}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Customer & Address Details */}
                  <div className="md:col-span-5 space-y-3 text-xs bg-[#141512] p-4 rounded-2xl border border-[#262922]">
                    <div>
                      <span className="text-[#9A9D91] block text-[11px] font-mono uppercase">{t.checkout.contactInfo}</span>
                      <div className="font-semibold text-[#F4F4EC] text-sm mt-0.5">{order.customerName}</div>
                      <div className="text-[#9A9D91] font-mono flex items-center gap-1.5 mt-0.5">
                        <Phone className="w-3 h-3 text-[#B7FF00]" />
                        <span>{order.customerPhone}</span>
                      </div>
                    </div>

                    {isDelivery && order.deliveryAddress && (
                      <div className="pt-2 border-t border-[#262922]">
                        <span className="text-[#9A9D91] block text-[11px] font-mono uppercase">{t.checkout.deliveryAddress}</span>
                        <p className="text-[#F4F4EC] mt-0.5">
                          {order.deliveryAddress.street}, {order.deliveryAddress.district}
                        </p>
                      </div>
                    )}

                    {!isDelivery && (
                      <div className="pt-2 border-t border-[#262922]">
                        <span className="text-[#9A9D91] block text-[11px] font-mono uppercase">{t.checkout.pickupTime}</span>
                        <p className="text-[#B7FF00] font-mono mt-0.5">
                          {order.pickupTime || 'ASAP (~20 mins)'}
                        </p>
                      </div>
                    )}

                    <div className="pt-2 border-t border-[#262922] flex justify-between items-baseline font-mono">
                      <span className="text-[#9A9D91]">TOTAL:</span>
                      <span className="font-black text-base text-[#B7FF00]">
                        ฿{order.total.toLocaleString()}
                      </span>
                    </div>
                  </div>

                </div>

                {/* Kitchen / Dispatch Action Toolbar */}
                {order.orderStatus !== 'completed' && order.orderStatus !== 'cancelled' && (
                  <div className="pt-3 border-t border-[#262922] flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {order.orderStatus === 'received' && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'confirmed')}
                          className="px-4 py-2 rounded-xl bg-[#B7FF00] hover:bg-[#D4FF4F] text-[#10110F] font-display font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{t.admin.confirmOrder}</span>
                        </button>
                      )}

                      {(order.orderStatus === 'received' || order.orderStatus === 'confirmed') && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'preparing')}
                          className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-display font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Flame className="w-3.5 h-3.5" />
                          <span>{t.admin.startPreparing}</span>
                        </button>
                      )}

                      {order.orderStatus === 'preparing' && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, isDelivery ? 'out_for_delivery' : 'ready_for_pickup')}
                          className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-display font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Bike className="w-3.5 h-3.5" />
                          <span>{isDelivery ? 'Dispatch for Delivery' : t.admin.markReady}</span>
                        </button>
                      )}

                      {(order.orderStatus === 'ready_for_pickup' || order.orderStatus === 'out_for_delivery') && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'completed')}
                          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-display font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{t.admin.completeOrder}</span>
                        </button>
                      )}
                    </div>

                    <button
                      onClick={() => setCancelModalOrderId(order.id)}
                      className="px-3 py-1.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-mono transition-colors cursor-pointer"
                    >
                      {t.admin.cancelOrder}
                    </button>
                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

      {/* Cancel Reason Dialog */}
      {cancelModalOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#1C1E19] border border-[#353830] rounded-2xl w-full max-w-sm p-6 space-y-4">
            <h3 className="font-display font-bold text-base text-[#F4F4EC]">
              {t.admin.cancelReasonModalTitle}
            </h3>
            <textarea
              rows={3}
              value={cancellationReason}
              onChange={e => setCancellationReason(e.target.value)}
              placeholder={t.admin.cancelReasonPlaceholder}
              className="w-full bg-[#10110F] border border-[#262922] focus:border-red-500 rounded-xl p-3 text-xs text-[#F4F4EC] focus:outline-none"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setCancelModalOrderId(null)}
                className="px-4 py-2 rounded-xl text-xs text-[#9A9D91]"
              >
                {t.admin.close}
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs"
              >
                {t.admin.confirmCancel}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

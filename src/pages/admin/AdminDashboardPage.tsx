import React from 'react';
import { useApp } from '../../context/AppContext';
import { dataService } from '../../services/dataService';
import { 
  ShoppingBag, 
  Flame, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  ArrowRight,
  Eye
} from 'lucide-react';

interface AdminDashboardPageProps {
  onGoToOrders: () => void;
  onGoToInventory: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onGoToOrders, onGoToInventory }) => {
  const { language, t, navigate } = useApp();

  const orders = dataService.getOrders();
  const products = dataService.getProducts();

  // Calculate Metrics from Live Order Data
  const totalOrdersCount = orders.length;
  const totalSalesBaht = orders.reduce((sum, o) => sum + (o.orderStatus !== 'cancelled' ? o.total : 0), 0);
  const pendingConfirmationCount = orders.filter(o => o.orderStatus === 'received').length;
  const inKitchenCount = orders.filter(o => o.orderStatus === 'confirmed' || o.orderStatus === 'preparing').length;
  const completedCount = orders.filter(o => o.orderStatus === 'completed').length;
  const lowStockProducts = products.filter(p => p.stockQuantity <= p.lowStockThreshold);

  // Hourly breakdown simulation for late night peak (17:00 - 03:00)
  const hourlySales = [
    { hour: '17:00', amount: 890, count: 3 },
    { hour: '19:00', amount: 1840, count: 6 },
    { hour: '21:00', amount: 3120, count: 11 },
    { hour: '23:00', amount: 4890, count: 16 },
    { hour: '01:00', amount: 5640, count: 18 },
    { hour: '02:00', amount: 3450, count: 12 },
  ];
  const maxHourlyAmount = Math.max(...hourlySales.map(h => h.amount));

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Sales Today */}
        <div className="p-5 rounded-3xl bg-[#1C1E19] border border-[#262922] relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-[#9A9D91] mb-2">
            <span>{t.admin.todaySales}</span>
            <TrendingUp className="w-4 h-4 text-[#B7FF00]" />
          </div>
          <div className="font-mono font-black text-2xl sm:text-3xl text-[#B7FF00]">
            ฿{totalSalesBaht.toLocaleString()}
          </div>
          <div className="text-[11px] font-mono text-[#9A9D91] mt-1">
            {totalOrdersCount} orders placed
          </div>
        </div>

        {/* Pending Orders */}
        <div className="p-5 rounded-3xl bg-[#1C1E19] border border-[#262922] relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-[#9A9D91] mb-2">
            <span>{t.admin.pendingConfirmation}</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-mono font-black text-2xl sm:text-3xl text-[#F4F4EC]">
            {pendingConfirmationCount}
          </div>
          <div className="text-[11px] text-[#9A9D91] mt-1">
            {language === 'th' ? 'ต้องการการยืนยัน' : 'Awaiting confirmation'}
          </div>
        </div>

        {/* In the Kitchen */}
        <div className="p-5 rounded-3xl bg-[#1C1E19] border border-[#262922] relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-[#9A9D91] mb-2">
            <span>{t.admin.cookingQueue}</span>
            <Flame className="w-4 h-4 text-orange-400" />
          </div>
          <div className="font-mono font-black text-2xl sm:text-3xl text-orange-400">
            {inKitchenCount}
          </div>
          <div className="text-[11px] text-[#9A9D91] mt-1">
            {language === 'th' ? 'กำลังสแมชบนเตา' : 'Sizzling on griddle'}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div 
          onClick={onGoToInventory}
          className="p-5 rounded-3xl bg-[#1C1E19] border border-[#262922] hover:border-red-500/50 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-[#9A9D91] mb-2">
            <span>{t.admin.lowStockAlert}</span>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div className="font-mono font-black text-2xl sm:text-3xl text-red-400">
            {lowStockProducts.length}
          </div>
          <div className="text-[11px] text-[#9A9D91] mt-1 flex items-center justify-between">
            <span>{language === 'th' ? 'คลิกดูสต็อก' : 'Inspect inventory'}</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>

      </div>

      {/* Hourly Sales Activity Chart */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#1C1E19] border border-[#262922] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-display font-bold text-base text-[#F4F4EC]">
              {language === 'th' ? 'กราฟยอดขายช่วงเวลาดึก (17:00 - 03:00 น.)' : 'Late Night Sales Velocity (17:00 - 03:00)'}
            </h3>
            <p className="text-xs text-[#9A9D91]">
              {language === 'th' ? 'สถิติจำลองการขายช่วงพีคของร้าน Nice Night' : 'Simulated hourly peak activity distribution'}
            </p>
          </div>
          <span className="font-mono text-xs text-[#B7FF00] bg-[#10110F] px-2.5 py-1 rounded border border-[#353830]">
            PEAK: 00:00 - 02:00 AM
          </span>
        </div>

        {/* Bar Chart Visual */}
        <div className="grid grid-cols-6 gap-3 sm:gap-6 items-end h-44 pt-4 border-b border-[#262922] pb-2">
          {hourlySales.map(item => {
            const heightPercent = Math.round((item.amount / maxHourlyAmount) * 100);
            return (
              <div key={item.hour} className="flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-mono text-[#B7FF00] opacity-0 group-hover:opacity-100 transition-opacity">
                  ฿{item.amount}
                </span>
                <div
                  className="w-full max-w-[42px] bg-[#262922] group-hover:bg-[#B7FF00] rounded-xl transition-all duration-300 relative"
                  style={{ height: `${heightPercent}%` }}
                >
                  <div className="absolute inset-0 bg-[#B7FF00]/10 rounded-xl" />
                </div>
                <span className="text-[10px] font-mono text-[#9A9D91]">
                  {item.hour}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Orders Stream */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#1C1E19] border border-[#262922] space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-base text-[#F4F4EC]">
            {t.admin.recentOrders}
          </h3>
          <button
            onClick={onGoToOrders}
            className="text-xs font-mono font-bold text-[#B7FF00] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>{language === 'th' ? 'ดูออเดอร์ทั้งหมด' : 'View all in Order Manager'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#262922] text-[#9A9D91] font-mono">
                <th className="pb-3">{t.tracking.orderNo}</th>
                <th className="pb-3">{t.checkout.fullName}</th>
                <th className="pb-3">{t.checkout.fulfillment}</th>
                <th className="pb-3">{t.cart.total}</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262922]">
              {orders.slice(0, 5).map(o => (
                <tr key={o.id} className="hover:bg-[#10110F]/50 transition-colors">
                  <td className="py-3 font-mono font-bold text-[#B7FF00]">
                    #{o.orderNumber}
                  </td>
                  <td className="py-3 text-[#F4F4EC]">
                    {o.customerName}
                  </td>
                  <td className="py-3 text-[#9A9D91] uppercase font-mono">
                    {o.fulfillmentMethod}
                  </td>
                  <td className="py-3 font-mono font-bold text-[#F4F4EC]">
                    ฿{o.total.toLocaleString()}
                  </td>
                  <td className="py-3">
                    <span className={`inline-block font-mono text-[10px] px-2 py-0.5 rounded ${
                      o.orderStatus === 'completed'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : o.orderStatus === 'cancelled'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-[#B7FF00]/15 text-[#B7FF00]'
                    }`}>
                      {o.orderStatus.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => navigate(`/track-order/${o.id}`)}
                      className="p-1.5 rounded-lg bg-[#10110F] text-[#9A9D91] hover:text-[#B7FF00] transition-colors"
                      title="View Customer Tracking View"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

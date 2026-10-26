import React, { ReactNode } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Flame, 
  ShoppingBag, 
  SlidersHorizontal, 
  Boxes, 
  Tag, 
  Settings, 
  ArrowLeft, 
  LogOut, 
  ShieldCheck, 
  ChefHat,
  MessageSquareQuote
} from 'lucide-react';

interface AdminLayoutProps {
  currentTab: 'dashboard' | 'orders' | 'menu' | 'inventory' | 'promotions' | 'settings' | 'reviews';
  setCurrentTab: (tab: 'dashboard' | 'orders' | 'menu' | 'inventory' | 'promotions' | 'settings' | 'reviews') => void;
  children: ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ currentTab, setCurrentTab, children }) => {
  const { language, t, currentUser, navigate, setIsRoleModalOpen } = useApp();

  const isStaff = currentUser.role === 'staff';

  const navItems = [
    { id: 'dashboard' as const, label: t.admin.dashboard, icon: <Flame className="w-4 h-4" /> },
    { id: 'orders' as const, label: t.admin.orders, icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'menu' as const, label: t.admin.menu, icon: <SlidersHorizontal className="w-4 h-4" /> },
    { id: 'inventory' as const, label: t.admin.inventory, icon: <Boxes className="w-4 h-4" /> },
    { id: 'promotions' as const, label: t.admin.promotions, icon: <Tag className="w-4 h-4" /> },
    { id: 'reviews' as const, label: t.admin.reviews, icon: <MessageSquareQuote className="w-4 h-4" /> },
    { id: 'settings' as const, label: t.admin.settings, icon: <Settings className="w-4 h-4" />, disabled: isStaff },
  ];

  return (
    <div className="min-h-screen bg-[#10110F] text-[#F4F4EC] flex flex-col">
      
      {/* Admin Top Command Bar */}
      <header className="sticky top-0 z-40 bg-[#161713]/95 backdrop-blur-md border-b border-[#262922] px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="p-2 rounded-xl bg-[#1C1E19] border border-[#353830] text-[#9A9D91] hover:text-[#B7FF00] transition-colors"
              title="Return to Customer Storefront"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#B7FF00] text-[#10110F] flex items-center justify-center font-display font-black text-sm">
                NN
              </div>
              <div>
                <div className="font-heading font-black text-base text-[#F4F4EC] leading-none flex items-center gap-1.5">
                  COMMAND CENTER
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#B7FF00]/15 text-[#B7FF00] border border-[#B7FF00]/40">
                    {currentUser.role.toUpperCase()}
                  </span>
                </div>
                <div className="text-[10px] font-mono text-[#9A9D91]">
                  NICE NIGHT BURGER • THONGLOR
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Role Switcher Pill */}
            <button
              onClick={() => setIsRoleModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1C1E19] border border-[#353830] hover:border-[#B7FF00] text-xs font-mono text-[#F4F4EC] transition-colors cursor-pointer"
            >
              {currentUser.role === 'admin' ? (
                <ShieldCheck className="w-3.5 h-3.5 text-[#B7FF00]" />
              ) : (
                <ChefHat className="w-3.5 h-3.5 text-amber-400" />
              )}
              <span>{currentUser.name}</span>
            </button>

            <button
              onClick={() => navigate('/')}
              className="px-3 py-1.5 rounded-xl bg-[#B7FF00] text-[#10110F] text-xs font-display font-bold hover:bg-[#D4FF4F] transition-colors"
            >
              {language === 'th' ? 'หน้าร้านค้า' : 'Storefront'} ➔
            </button>
          </div>

        </div>
      </header>

      {/* Admin Subnav Tabs */}
      <div className="bg-[#141512] border-b border-[#262922] px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto py-2 scrollbar-none">
          {navItems.map(item => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                disabled={item.disabled}
                onClick={() => setCurrentTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-display font-bold whitespace-nowrap transition-all cursor-pointer ${
                  item.disabled
                    ? 'opacity-30 cursor-not-allowed text-[#9A9D91]'
                    : isActive
                    ? 'bg-[#B7FF00] text-[#10110F] shadow-[0_0_12px_rgba(183,255,0,0.3)]'
                    : 'text-[#9A9D91] hover:text-[#F4F4EC] hover:bg-[#1C1E19]'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Admin Demo Watermark */}
      <div className="bg-[#1C1E19]/80 border-b border-[#262922] py-1.5 px-4 text-center">
        <span className="text-[11px] font-mono text-[#B7FF00]">
          ⚡ {t.admin.demoWatermark}
        </span>
      </div>

      {/* Main Admin Tab View Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>

    </div>
  );
};

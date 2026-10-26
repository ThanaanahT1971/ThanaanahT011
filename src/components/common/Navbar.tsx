import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShoppingBag, 
  Menu as MenuIcon, 
  X, 
  Globe, 
  Bell, 
  User, 
  Flame, 
  Clock, 
  Sparkles,
  ChevronDown,
  Compass,
  ArrowRight
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    language, 
    setLanguage, 
    t, 
    currentPath, 
    navigate, 
    cartItemCount, 
    setIsCartDrawerOpen, 
    currentUser, 
    setIsRoleModalOpen,
    storeSettings,
    notifications,
    unreadNotificationCount,
    markNotificationsAsRead
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);

  const navLinks = [
    { path: '/', label: t.nav.home },
    { path: '/menu', label: t.nav.menu },
    { path: '/promotions', label: t.nav.promotions },
    { path: '/track-order', label: t.nav.trackOrder },
    { path: '/about', label: t.nav.about },
    { path: '/contact', label: t.nav.contact },
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const isAdminOrStaff = currentUser.role === 'admin' || currentUser.role === 'staff';

  return (
    <>
      {/* Top Street Ticker / Announcement Bar */}
      <div className="bg-[#1C1E19] border-b border-[#353830] text-xs py-1.5 px-4 overflow-hidden select-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[#9A9D91]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-mono font-bold text-[#B7FF00] text-[11px] bg-[#B7FF00]/10 px-2 py-0.5 rounded border border-[#B7FF00]/30">
              <span className={`w-2 h-2 rounded-full ${storeSettings.isOpen ? 'bg-[#B7FF00] animate-pulse' : 'bg-red-500'}`} />
              {storeSettings.isOpen ? (language === 'th' ? 'เปิดถึง 03:00 น.' : 'OPEN TIL 3:00 AM') : (language === 'th' ? 'ปิดร้านชั่วคราว' : 'TEMPORARILY CLOSED')}
            </span>
            <span className="hidden md:inline-flex items-center gap-1.5 text-[#F4F4EC]">
              <Sparkles className="w-3.5 h-3.5 text-[#B7FF00]" />
              {language === 'th' ? storeSettings.announcementTh : storeSettings.announcementEn}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsRoleModalOpen(true)}
              className="text-[11px] font-mono hover:text-[#B7FF00] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span className="px-1.5 py-0.5 rounded bg-[#10110F] border border-[#353830] text-[#B7FF00]">
                DEMO: {currentUser.role.toUpperCase()}
              </span>
              <span className="hidden sm:inline">({currentUser.name.split(' ')[0]})</span>
            </button>
            <div className="h-3 w-px bg-[#353830]" />
            <span className="hidden lg:inline text-[11px] font-mono text-[#9A9D91]">
              BANGKOK: 17:00 - 03:00
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 bg-[#10110F]/95 backdrop-blur-md border-b border-[#262922] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          
          {/* Brand Logo */}
          <button 
            onClick={() => handleNavClick('/')}
            className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-[#1C1E19] border border-[#B7FF00]/40 flex items-center justify-center font-display font-black text-xl text-[#B7FF00] shadow-[0_0_12px_rgba(183,255,0,0.2)] group-hover:scale-105 transition-transform">
              NN
            </div>
            <div>
              <div className="font-heading font-black tracking-tight text-xl text-[#F4F4EC] leading-none flex items-center gap-1.5">
                NICE NIGHT
                <span className="text-[#B7FF00] text-sm">●</span>
              </div>
              <div className="text-[10px] font-mono font-bold tracking-widest text-[#9A9D91] group-hover:text-[#B7FF00] transition-colors">
                LATE NIGHT BURGER
              </div>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 font-display font-semibold text-sm">
            {navLinks.map(link => {
              const isActive = currentPath === link.path || (link.path !== '/' && currentPath.startsWith(link.path));
              return (
                <button
                  key={link.path}
                  onClick={() => handleNavClick(link.path)}
                  className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
                    isActive
                      ? 'text-[#10110F] bg-[#B7FF00] font-bold shadow-[0_0_15px_rgba(183,255,0,0.3)]'
                      : 'text-[#9A9D91] hover:text-[#F4F4EC] hover:bg-[#1C1E19]'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Admin Command Center Link */}
            {isAdminOrStaff && (
              <button
                onClick={() => handleNavClick('/admin')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#B7FF00]/10 border border-[#B7FF00]/40 text-[#B7FF00] font-display text-xs font-bold hover:bg-[#B7FF00] hover:text-[#10110F] transition-all cursor-pointer"
              >
                <Flame className="w-3.5 h-3.5" />
                {t.nav.adminDashboard}
              </button>
            )}

            {/* Language Switcher */}
            <div className="flex items-center bg-[#1C1E19] border border-[#353830] rounded-lg p-0.5">
              <button
                onClick={() => setLanguage('th')}
                className={`px-2 py-1 text-xs font-bold font-mono rounded transition-colors ${
                  language === 'th' ? 'bg-[#B7FF00] text-[#10110F]' : 'text-[#9A9D91] hover:text-[#F4F4EC]'
                }`}
                title="ภาษาไทย"
              >
                TH
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 text-xs font-bold font-mono rounded transition-colors ${
                  language === 'en' ? 'bg-[#B7FF00] text-[#10110F]' : 'text-[#9A9D91] hover:text-[#F4F4EC]'
                }`}
                title="English"
              >
                EN
              </button>
            </div>

            {/* In-App Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsNotifDropdownOpen(!isNotifDropdownOpen);
                  if (unreadNotificationCount > 0) {
                    markNotificationsAsRead();
                  }
                }}
                className="relative p-2 rounded-lg bg-[#1C1E19] border border-[#353830] text-[#9A9D91] hover:text-[#F4F4EC] hover:border-[#9A9D91] transition-colors cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#B7FF00] text-[#10110F] text-[10px] font-bold flex items-center justify-center animate-bounce">
                    {unreadNotificationCount}
                  </span>
                )}
              </button>

              {/* Dropdown Menu */}
              {isNotifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-[#1C1E19] border border-[#353830] rounded-2xl shadow-2xl p-4 z-50 animate-fadeIn">
                  <div className="flex items-center justify-between pb-3 border-b border-[#262922] mb-3">
                    <span className="font-display font-bold text-sm text-[#F4F4EC]">
                      {language === 'th' ? 'การแจ้งเตือน' : 'Notifications'}
                    </span>
                    <span className="text-[11px] font-mono text-[#B7FF00]">
                      {notifications.length} {language === 'th' ? 'รายการ' : 'items'}
                    </span>
                  </div>

                  <div className="space-y-2.5 max-h-72 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-[#9A9D91] text-center py-4">
                        {language === 'th' ? 'ไม่มีการแจ้งเตือนใหม่' : 'No notifications'}
                      </p>
                    ) : (
                      notifications.slice(0, 6).map(n => (
                        <div
                          key={n.id}
                          onClick={() => {
                            if (n.link) navigate(n.link);
                            setIsNotifDropdownOpen(false);
                          }}
                          className="p-2.5 rounded-xl bg-[#10110F] border border-[#262922] hover:border-[#B7FF00]/40 transition-colors cursor-pointer text-left"
                        >
                          <div className="text-xs font-semibold text-[#F4F4EC] flex items-center justify-between">
                            <span>{language === 'th' ? n.titleTh : n.titleEn}</span>
                            <span className="text-[10px] text-[#9A9D91]">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#9A9D91] mt-0.5 line-clamp-2">
                            {language === 'th' ? n.messageTh : n.messageEn}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Account / Profile Button */}
            <button
              onClick={() => handleNavClick('/account')}
              className="p-2 rounded-lg bg-[#1C1E19] border border-[#353830] text-[#9A9D91] hover:text-[#F4F4EC] hover:border-[#9A9D91] transition-colors cursor-pointer"
              title={t.nav.account}
            >
              <User className="w-4 h-4" />
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative flex items-center gap-2 px-3 py-2 rounded-lg bg-[#B7FF00] text-[#10110F] font-display font-bold text-sm hover:bg-[#D4FF4F] transition-all shadow-[0_0_15px_rgba(183,255,0,0.3)] cursor-pointer"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline font-mono font-extrabold">{cartItemCount}</span>
              {cartItemCount > 0 && (
                <span className="sm:hidden absolute -top-1.5 -right-1.5 bg-[#10110F] text-[#B7FF00] border border-[#B7FF00] text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center font-mono">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-[#1C1E19] border border-[#353830] text-[#F4F4EC] hover:bg-[#262922]"
              aria-label="Toggle navigation"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-[#10110F] border-b border-[#262922] px-4 py-6 space-y-4 animate-fadeIn">
            <div className="space-y-1">
              {navLinks.map(link => {
                const isActive = currentPath === link.path;
                return (
                  <button
                    key={link.path}
                    onClick={() => handleNavClick(link.path)}
                    className={`w-full text-left px-4 py-3 rounded-xl font-display font-bold text-base transition-colors flex items-center justify-between ${
                      isActive
                        ? 'bg-[#B7FF00] text-[#10110F]'
                        : 'text-[#F4F4EC] hover:bg-[#1C1E19]'
                    }`}
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="w-4 h-4 opacity-50" />
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-[#262922] space-y-2">
              <button
                onClick={() => handleNavClick('/admin')}
                className="w-full py-3 px-4 rounded-xl bg-[#1C1E19] border border-[#B7FF00]/40 text-[#B7FF00] font-display font-bold text-sm flex items-center justify-center gap-2"
              >
                <Flame className="w-4 h-4" />
                {t.nav.adminDashboard} ({currentUser.role.toUpperCase()})
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsRoleModalOpen(true);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-[#1C1E19] text-xs font-mono text-[#9A9D91] hover:text-[#F4F4EC]"
              >
                {t.nav.switchRole}: {currentUser.name}
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

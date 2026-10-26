import React from 'react';
import { useApp } from '../../context/AppContext';
import { dataService } from '../../services/dataService';
import { X, ShieldCheck, UserCheck, ChefHat, UserX } from 'lucide-react';
import { User } from '../../types';

export const RoleSwitcherModal: React.FC = () => {
  const { isRoleModalOpen, setIsRoleModalOpen, currentUser, switchUser, language, t } = useApp();

  if (!isRoleModalOpen) return null;

  const users = dataService.getUsers();

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <ShieldCheck className="w-5 h-5 text-[#B7FF00]" />;
      case 'staff':
        return <ChefHat className="w-5 h-5 text-amber-400" />;
      default:
        return <UserCheck className="w-5 h-5 text-emerald-400" />;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#B7FF00]/15 text-[#B7FF00] border border-[#B7FF00]/40">ADMIN / MANAGER</span>;
      case 'staff':
        return <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-400/15 text-amber-400 border border-amber-400/40">KITCHEN STAFF</span>;
      default:
        return <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-400/15 text-emerald-400 border border-emerald-400/40">CUSTOMER</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#1C1E19] border border-[#353830] rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
        <button
          onClick={() => setIsRoleModalOpen(false)}
          className="absolute top-4 right-4 text-[#9A9D91] hover:text-[#F4F4EC] p-1 rounded-lg hover:bg-[#262922]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <div className="w-2.5 h-2.5 rounded-full bg-[#B7FF00] animate-pulse"></div>
          <span className="text-xs font-mono text-[#B7FF00] uppercase tracking-wider font-bold">
            DEMO ACCOUNT SWITCHER
          </span>
        </div>

        <h3 className="text-xl font-display font-bold text-[#F4F4EC] mb-2">
          {language === 'th' ? 'สลับบัญชีทดสอบระบบ' : 'Switch Demo Identity'}
        </h3>
        <p className="text-sm text-[#9A9D91] mb-6">
          {t.account.switchRoleDesc}
        </p>

        <div className="space-y-3 mb-6">
          {users.map(u => {
            const isSelected = currentUser.id === u.id;
            return (
              <button
                key={u.id}
                onClick={() => {
                  switchUser(u);
                  setIsRoleModalOpen(false);
                }}
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-[#B7FF00]/10 border-[#B7FF00] ring-1 ring-[#B7FF00]'
                    : 'bg-[#10110F] border-[#353830] hover:border-[#9A9D91]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-[#1C1E19] border border-[#353830]">
                    {getRoleIcon(u.role)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-[#F4F4EC]">{u.name}</span>
                      {getRoleBadge(u.role)}
                    </div>
                    <div className="text-xs text-[#9A9D91] mt-0.5">{u.email}</div>
                  </div>
                </div>
                {isSelected && (
                  <span className="text-xs font-bold font-mono text-[#B7FF00]">ACTIVE</span>
                )}
              </button>
            );
          })}

          {/* Guest Role Option */}
          <button
            onClick={() => {
              const guestUser: User = {
                id: 'guest-' + Date.now(),
                name: 'Guest Diner',
                email: 'guest@nicenight.demo',
                phone: '',
                role: 'guest',
                createdAt: new Date().toISOString()
              };
              switchUser(guestUser);
              setIsRoleModalOpen(false);
            }}
            className="w-full text-left p-3.5 rounded-xl border border-dashed border-[#353830] hover:border-[#9A9D91] bg-[#10110F]/50 flex items-center justify-between transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#1C1E19]">
                <UserX className="w-5 h-5 text-[#9A9D91]" />
              </div>
              <div>
                <span className="font-medium text-sm text-[#F4F4EC]">
                  {language === 'th' ? 'สั่งซื้อแบบไม่ลงชื่อเข้าใช้ (Guest)' : 'Continue as Guest'}
                </span>
                <p className="text-xs text-[#9A9D91]">
                  {language === 'th' ? 'ทดสอบการสั่งซื้อด่วนโดยไม่มีบัญชี' : 'Test quick checkout without account'}
                </p>
              </div>
            </div>
          </button>
        </div>

        <div className="p-3 rounded-lg bg-[#10110F] border border-[#353830] text-xs text-[#9A9D91]">
          💡 <strong className="text-[#F4F4EC]">Tip:</strong> {language === 'th' ? 'เลือกบัญชี Admin เพื่อทดลองจัดการเมนูและเปลี่ยนสถานะออเดอร์ในครัว' : 'Select Admin role to try modifying menu items & advancing kitchen statuses.'}
        </div>
      </div>
    </div>
  );
};

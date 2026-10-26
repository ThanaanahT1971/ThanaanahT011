import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, QrCode, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

interface PromptPayModalProps {
  amount: number;
  orderNumber: string;
  onConfirmPayment: () => void;
  onClose: () => void;
}

export const PromptPayModal: React.FC<PromptPayModalProps> = ({
  amount,
  orderNumber,
  onConfirmPayment,
  onClose,
}) => {
  const { language } = useApp();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#1C1E19] border border-[#353830] rounded-3xl w-full max-w-sm p-6 shadow-2xl relative text-center">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#9A9D91] hover:text-[#F4F4EC] hover:bg-[#262922]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* PromptPay Header */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="px-2.5 py-1 rounded bg-[#003D6B] text-white font-mono font-black text-xs tracking-wider">
            PROMPTPAY
          </div>
          <span className="text-[11px] font-mono text-[#B7FF00] font-bold">
            THAI QR PAYMENT
          </span>
        </div>

        <h3 className="font-display font-black text-xl text-[#F4F4EC] mb-1">
          {language === 'th' ? 'สแกนเพื่อชำระเงิน' : 'Scan to Pay'}
        </h3>
        <p className="text-xs text-[#9A9D91] mb-4">
          NICE NIGHT BURGER (THAI BANKING APPS)
        </p>

        {/* Amount Badge */}
        <div className="p-3 rounded-2xl bg-[#10110F] border border-[#353830] mb-4">
          <span className="text-xs text-[#9A9D91] block mb-0.5">
            {language === 'th' ? 'ยอดชำระสุทธิ' : 'Total Amount'}
          </span>
          <span className="font-mono font-black text-2xl text-[#B7FF00]">
            ฿{amount.toLocaleString()}
          </span>
          <span className="text-[10px] font-mono text-[#9A9D91] block mt-1">
            Ref: {orderNumber}
          </span>
        </div>

        {/* Simulated High-Res PromptPay QR Visual */}
        <div className="p-4 bg-white rounded-2xl inline-block shadow-inner relative group border-4 border-[#003D6B]">
          {/* SVG generated QR code with demo styling */}
          <svg className="w-48 h-48 mx-auto" viewBox="0 0 200 200" fill="none">
            <rect width="200" height="200" fill="white" />
            
            {/* Top Left Finder */}
            <rect x="20" y="20" width="45" height="45" fill="black" />
            <rect x="28" y="28" width="29" height="29" fill="white" />
            <rect x="34" y="34" width="17" height="17" fill="black" />

            {/* Top Right Finder */}
            <rect x="135" y="20" width="45" height="45" fill="black" />
            <rect x="143" y="28" width="29" height="29" fill="white" />
            <rect x="149" y="34" width="17" height="17" fill="black" />

            {/* Bottom Left Finder */}
            <rect x="20" y="135" width="45" height="45" fill="black" />
            <rect x="28" y="143" width="29" height="29" fill="white" />
            <rect x="34" y="149" width="17" height="17" fill="black" />

            {/* Data matrix pattern simulation */}
            <rect x="80" y="25" width="10" height="10" fill="black" />
            <rect x="100" y="25" width="10" height="10" fill="black" />
            <rect x="90" y="45" width="10" height="10" fill="black" />
            <rect x="110" y="45" width="10" height="10" fill="black" />
            <rect x="75" y="65" width="10" height="10" fill="black" />
            <rect x="95" y="65" width="10" height="10" fill="black" />
            <rect x="115" y="65" width="10" height="10" fill="black" />

            <rect x="25" y="80" width="10" height="10" fill="black" />
            <rect x="45" y="80" width="10" height="10" fill="black" />
            <rect x="35" y="100" width="10" height="10" fill="black" />
            <rect x="55" y="100" width="10" height="10" fill="black" />

            <rect x="80" y="85" width="40" height="40" fill="#10110F" rx="8" />
            <text x="100" y="110" fill="#B7FF00" fontSize="16" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">NN</text>

            <rect x="135" y="80" width="10" height="10" fill="black" />
            <rect x="155" y="80" width="10" height="10" fill="black" />
            <rect x="145" y="100" width="10" height="10" fill="black" />
            <rect x="165" y="100" width="10" height="10" fill="black" />

            <rect x="80" y="140" width="10" height="10" fill="black" />
            <rect x="100" y="140" width="10" height="10" fill="black" />
            <rect x="120" y="140" width="10" height="10" fill="black" />
            <rect x="90" y="160" width="10" height="10" fill="black" />
            <rect x="110" y="160" width="10" height="10" fill="black" />
            <rect x="135" y="160" width="10" height="10" fill="black" />
            <rect x="155" y="140" width="10" height="10" fill="black" />
          </svg>

          {/* Demo watermark banner across QR */}
          <div className="absolute inset-x-0 bottom-6 bg-[#B7FF00]/95 py-1 text-[10px] font-mono font-black text-[#10110F] uppercase tracking-wider transform -rotate-6 shadow">
            DEMO PAYMENT • SIMULATOR
          </div>
        </div>

        {/* Clear Prototype Disclaimer */}
        <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-[11px] text-left flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong>{language === 'th' ? 'การทดสอบจำลอง' : 'Simulated Checkout'}:</strong>{' '}
            {language === 'th'
              ? 'QR Code นี้เป็นภาพจำลองสำหรับทดสอบระบบ ไม่มีการหักเงินจริง'
              : 'This QR code is a demo simulation. No real money will be charged.'}
          </div>
        </div>

        {/* Simulate Payment Complete Button */}
        <div className="mt-5 space-y-2">
          <button
            onClick={onConfirmPayment}
            className="w-full py-3.5 px-4 rounded-xl bg-[#B7FF00] hover:bg-[#D4FF4F] text-[#10110F] font-display font-black text-sm flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(183,255,0,0.3)] transition-all cursor-pointer"
          >
            <CheckCircle className="w-4 h-4" />
            <span>
              {language === 'th' ? 'จำลองการชำระเงินสำเร็จ (Demo)' : 'Simulate Payment Success'}
            </span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-2 text-xs font-mono text-[#9A9D91] hover:text-[#F4F4EC]"
          >
            {language === 'th' ? 'ยกเลิก / เลือกวิธีอื่น' : 'Cancel / Change Payment'}
          </button>
        </div>

      </div>
    </div>
  );
};

import React from 'react';
import { useApp } from '../context/AppContext';
import { dataService } from '../services/dataService';
import { ProductCard } from '../components/customer/ProductCard';
import { 
  Flame, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  MapPin, 
  Star, 
  CheckCircle2, 
  SlidersHorizontal,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { t, language, navigate, storeSettings, openProductCustomizer } = useApp();

  const products = dataService.getProducts();
  const reviews = dataService.getReviews();

  const signatureBurgers = products.filter(p => p.categoryId === 'signature').slice(0, 3);
  const bestSellers = products.filter(p => p.isBestSeller).slice(0, 4);
  const combos = products.filter(p => p.categoryId === 'combos');
  const heroFeaturedBurger = products.find(p => p.id === 'prod-1') || products[0];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center pt-8 sm:pt-12 overflow-hidden">
        {/* Subtle Neon Glow Ambient Background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#B7FF00]/5 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Typography & Hero Copy */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Street Badges */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="street-badge bg-[#B7FF00] text-[#10110F] text-xs px-3 py-1 rounded font-black tracking-wider">
                  🔥 {language === 'th' ? 'สแมชเบอร์เกอร์รอบดึก' : 'LATE NIGHT SMASHED'}
                </span>
                <span className="street-badge bg-[#1C1E19] text-[#F4F4EC] border border-[#353830] text-xs px-3 py-1 rounded font-mono">
                  OPEN 17:00 - 03:00 AM
                </span>
                <span className="street-badge bg-[#D4FF4F]/20 text-[#D4FF4F] border border-[#D4FF4F]/40 text-xs px-3 py-1 rounded font-mono font-bold">
                  THAI BAHT (฿)
                </span>
              </div>

              {/* Main Headline */}
              <div className="space-y-1">
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-heading font-black tracking-tight text-[#F4F4EC] uppercase leading-[0.95]">
                  BAD DAY? <br />
                  <span className="text-[#B7FF00] underline decoration-[#B7FF00]/40 underline-offset-8">
                    GOOD BURGER.
                  </span> <br />
                  NICE NIGHT.
                </h1>
              </div>

              {/* Supporting Text */}
              <p className="text-base sm:text-lg text-[#9A9D91] max-w-xl font-display leading-relaxed">
                {t.brand.heroSub}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => navigate('/menu')}
                  className="px-8 py-4 rounded-xl bg-[#B7FF00] hover:bg-[#D4FF4F] text-[#10110F] font-display font-black text-base flex items-center gap-2.5 shadow-[0_0_25px_rgba(183,255,0,0.35)] transition-all transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <span>{t.nav.orderNow}</span>
                  <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                </button>

                <button
                  onClick={() => navigate('/menu')}
                  className="px-6 py-4 rounded-xl bg-[#1C1E19] hover:bg-[#262922] text-[#F4F4EC] border border-[#353830] hover:border-[#9A9D91] font-display font-bold text-base transition-all cursor-pointer"
                >
                  {t.nav.viewAllMenu}
                </button>
              </div>

              {/* Micro-Features Row */}
              <div className="pt-6 border-t border-[#262922] grid grid-cols-3 gap-4 max-w-lg text-xs">
                <div>
                  <div className="font-mono font-black text-[#B7FF00] text-sm sm:text-base">100%</div>
                  <div className="text-[#9A9D91] text-[11px] mt-0.5">Grass-fed Beef</div>
                </div>
                <div>
                  <div className="font-mono font-black text-[#B7FF00] text-sm sm:text-base">~20 MIN</div>
                  <div className="text-[#9A9D91] text-[11px] mt-0.5">Average Prep</div>
                </div>
                <div>
                  <div className="font-mono font-black text-[#B7FF00] text-sm sm:text-base">03:00 AM</div>
                  <div className="text-[#9A9D91] text-[11px] mt-0.5">Kitchen Closes</div>
                </div>
              </div>

            </div>

            {/* Right Large Burger Hero Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {/* Poster Card Frame */}
                <div className="relative rounded-3xl bg-[#1C1E19] border border-[#353830] p-4 sm:p-5 shadow-2xl overflow-hidden group">
                  
                  {/* Burger Image */}
                  <div className="aspect-square rounded-2xl overflow-hidden bg-[#10110F] relative">
                    <img
                      src={heroFeaturedBurger.imageUrl}
                      alt={heroFeaturedBurger.nameEn}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#10110F]/80 via-transparent to-transparent" />
                    
                    {/* Floating Price Tag */}
                    <div className="absolute bottom-4 left-4 bg-[#10110F]/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-[#B7FF00]/40">
                      <span className="text-[10px] font-mono text-[#9A9D91] block">NIGHT SPECIAL</span>
                      <span className="font-mono font-black text-xl text-[#B7FF00]">
                        ฿{heroFeaturedBurger.basePrice}
                      </span>
                    </div>

                    <button
                      onClick={() => openProductCustomizer(heroFeaturedBurger)}
                      className="absolute bottom-4 right-4 p-3 rounded-xl bg-[#B7FF00] text-[#10110F] font-bold shadow-lg hover:scale-110 transition-transform cursor-pointer"
                      title={t.menu.customize}
                    >
                      <SlidersHorizontal className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Title Bar below Image */}
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono font-bold text-[#D4FF4F] tracking-wider uppercase">
                        SIGNATURE SENSATION
                      </span>
                      <h3 className="font-display font-black text-lg text-[#F4F4EC]">
                        {language === 'th' ? heroFeaturedBurger.nameTh : heroFeaturedBurger.nameEn}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1 text-amber-400 text-xs font-mono font-bold">
                      <Star className="w-4 h-4 fill-amber-400" />
                      <span>4.9</span>
                    </div>
                  </div>

                </div>

                {/* Street Tag Sticker Floating Overlay */}
                <div className="absolute -top-4 -right-4 bg-[#B7FF00] text-[#10110F] font-mono font-black text-xs px-3 py-1.5 rounded-lg shadow-xl transform rotate-6 border border-[#10110F]">
                  CRISPY EDGES ONLY!
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. LIMITED-TIME OFFER BANNER / TICKER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="rounded-2xl bg-gradient-to-r from-[#1C1E19] via-[#262922] to-[#1C1E19] border border-[#B7FF00]/30 p-6 sm:p-8 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#B7FF00] text-[#10110F] flex items-center justify-center font-bold text-xl shrink-0">
                ⚡
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-black text-[#B7FF00] uppercase tracking-wider">
                    LIMITED PROMO
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#10110F] text-[#F4F4EC] text-[10px] font-mono">
                    CODE: NIGHT10
                  </span>
                </div>
                <h3 className="font-heading font-black text-xl sm:text-2xl text-[#F4F4EC] mt-0.5">
                  {language === 'th' ? 'ลดทันที 10% ทุกเมนูรอบดึก' : '10% OFF ALL MIDNIGHT CRAVINGS'}
                </h3>
                <p className="text-xs text-[#9A9D91]">
                  {language === 'th' ? 'เมื่อสั่งซื้อขั้นต่ำ ฿200 เพียงใส่โค้ดในตะกร้า' : 'On orders over ฿200. Apply at checkout.'}
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate('/promotions')}
              className="px-5 py-2.5 rounded-xl bg-[#B7FF00] hover:bg-[#D4FF4F] text-[#10110F] font-display font-black text-xs uppercase tracking-wider transition-colors shrink-0 cursor-pointer"
            >
              {language === 'th' ? 'ดูโค้ดโปรโมชั่นทั้งหมด' : 'View All Deals'} ➔
            </button>
          </div>
        </div>
      </section>

      {/* 3. FEATURED SIGNATURE BURGERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#B7FF00] uppercase tracking-wider">
              <Flame className="w-4 h-4" />
              <span>THE MAIN EVENT</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-[#F4F4EC] mt-1">
              {t.categories.signature}
            </h2>
          </div>
          <button
            onClick={() => navigate('/menu')}
            className="text-xs font-mono font-bold text-[#B7FF00] hover:underline flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>{language === 'th' ? 'ดูเบอร์เกอร์ทั้งหมด' : 'Explore All Burgers'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {signatureBurgers.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. COMBO RECOMMENDATIONS */}
      {combos.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="rounded-3xl bg-[#1C1E19] border border-[#353830] p-6 sm:p-10 relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-7 space-y-4">
                <span className="street-badge bg-[#B7FF00] text-[#10110F] text-xs px-2.5 py-1 rounded font-black">
                  COMBO VALUE PACK
                </span>
                <h2 className="text-3xl sm:text-4xl font-heading font-black text-[#F4F4EC]">
                  {language === 'th' ? 'เดอะ ไนท์ คอมโบ (เซ็ตเดียวจบ)' : 'THE NIGHT COMBO (ALL-IN-ONE)'}
                </h2>
                <p className="text-sm text-[#9A9D91] leading-relaxed">
                  {language === 'th'
                    ? 'สลายความเหนื่อยล้าด้วยเซ็ตสุดคุ้ม: เลือกซิกเนเจอร์เบอร์เกอร์ที่คุณชอบ + มิดไนท์ฟรายส์ทอดกรอบ + โคล่าเย็นเฉียบ อิ่มคุ้ม ประหยัดกว่าแยกซื้อ!'
                    : 'The ultimate midnight hunger cure: Signature smashed burger + crispy seasoned fries + ice cold After Hours Cola. Big flavor, messy hands, better nights.'}
                </p>

                <div className="flex items-center gap-6 pt-2">
                  <div>
                    <span className="text-xs text-[#9A9D91] block font-mono">COMBO PRICE</span>
                    <span className="font-mono font-black text-3xl text-[#B7FF00]">฿299</span>
                    <span className="text-xs text-[#9A9D91] line-through ml-2">฿347</span>
                  </div>

                  <button
                    onClick={() => {
                      const comboItem = combos[0];
                      if (comboItem) openProductCustomizer(comboItem);
                    }}
                    className="px-6 py-3 rounded-xl bg-[#B7FF00] hover:bg-[#D4FF4F] text-[#10110F] font-display font-black text-sm transition-all shadow-[0_0_15px_rgba(183,255,0,0.3)] cursor-pointer"
                  >
                    {language === 'th' ? 'สั่งเซ็ตคอมโบนี้' : 'Order This Combo'}
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="rounded-2xl overflow-hidden aspect-4/3 bg-[#10110F] border border-[#262922]">
                  <img
                    src={combos[0].imageUrl}
                    alt="Night Combo"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* 5. BEST SELLERS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#B7FF00] uppercase tracking-wider">
              <span>🔥 NIGHT OWL FAVORITES</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-[#F4F4EC] mt-1">
              {language === 'th' ? 'เมนูยอดฮิตตลอดกาล' : 'Best-Selling Midnight Hits'}
            </h2>
          </div>
          <button
            onClick={() => navigate('/menu')}
            className="text-xs font-mono font-bold text-[#B7FF00] hover:underline cursor-pointer"
          >
            {t.nav.viewAllMenu}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. BRAND STORY & PHILOSOPHY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="border border-[#262922] rounded-3xl bg-[#141512] p-8 sm:p-12 relative overflow-hidden">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-mono font-bold text-[#B7FF00] uppercase tracking-wider">
              BRAND PHILOSOPHY
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-[#F4F4EC] leading-tight">
              “BAD DAY? GOOD BURGER. NICE NIGHT.”
            </h2>
            <p className="text-sm sm:text-base text-[#9A9D91] leading-relaxed">
              {t.about.manifesto}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 pt-8 border-t border-[#262922]">
            {t.about.pillars.map((p, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-[#1C1E19] border border-[#353830]">
                <div className="w-8 h-8 rounded-lg bg-[#B7FF00]/10 border border-[#B7FF00]/40 text-[#B7FF00] font-mono font-black text-xs flex items-center justify-center mb-3">
                  0{idx + 1}
                </div>
                <h4 className="font-display font-bold text-sm text-[#F4F4EC] mb-1">
                  {p.title}
                </h4>
                <p className="text-xs text-[#9A9D91] leading-relaxed">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CUSTOMER REVIEWS (DEMO DATA LABELLED) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#B7FF00] uppercase tracking-wider">
              <Star className="w-4 h-4 fill-[#B7FF00] text-[#B7FF00]" />
              <span>TESTIMONIALS (DEMONSTRATION DATA)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-[#F4F4EC] mt-1">
              {t.reviews.title}
            </h2>
          </div>
          <span className="text-xs font-mono text-[#9A9D91]">
            ⭐ 4.9/5 from 420+ Night Owls
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map(rev => (
            <div
              key={rev.id}
              className="p-6 rounded-2xl bg-[#1C1E19] border border-[#262922] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    {rev.avatarUrl ? (
                      <img
                        src={rev.avatarUrl}
                        alt={rev.customerName}
                        className="w-9 h-9 rounded-full object-cover border border-[#353830]"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-[#10110F] border border-[#353830] flex items-center justify-center font-bold text-xs text-[#B7FF00]">
                        {rev.customerName[0]}
                      </div>
                    )}
                    <div>
                      <div className="font-display font-bold text-sm text-[#F4F4EC]">
                        {rev.customerName}
                      </div>
                      <div className="text-[10px] font-mono text-[#B7FF00]">
                        {t.reviews.verifiedPurchase}
                      </div>
                    </div>
                  </div>

                  <div className="flex text-amber-400">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-[#9A9D91] leading-relaxed italic">
                  "{language === 'th' ? rev.commentTh : rev.commentEn}"
                </p>
              </div>

              {rev.productName && (
                <div className="mt-4 pt-3 border-t border-[#262922] text-[10px] font-mono text-[#D4FF4F]">
                  Order: {rev.productName}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 8. OPENING HOURS & LOCATION MAP INFO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl bg-[#1C1E19] border border-[#353830] p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-[#10110F] border border-[#353830] text-[#B7FF00]">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-display font-bold text-base text-[#F4F4EC]">
                  {language === 'th' ? 'เวลาเปิดให้บริการ' : 'Late Night Hours'}
                </h4>
                <p className="text-xs text-[#9A9D91] mt-1 font-mono">
                  {language === 'th' ? storeSettings.openingHoursTh : storeSettings.openingHoursEn}
                </p>
                <p className="text-[11px] text-[#B7FF00] mt-0.5">
                  Last order 02:30 AM
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-[#10110F] border border-[#353830] text-[#B7FF00]">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-display font-bold text-base text-[#F4F4EC]">
                  {language === 'th' ? 'ทำเลทองหล่อ' : 'Thonglor Flagship'}
                </h4>
                <p className="text-xs text-[#9A9D91] mt-1">
                  {storeSettings.address}
                </p>
                <p className="text-[11px] text-[#9A9D91] mt-0.5">
                  {storeSettings.city}
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <button
                onClick={() => navigate('/menu')}
                className="w-full py-4 rounded-xl bg-[#B7FF00] hover:bg-[#D4FF4F] text-[#10110F] font-display font-black text-sm flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(183,255,0,0.3)] cursor-pointer"
              >
                <span>{t.nav.orderNow}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

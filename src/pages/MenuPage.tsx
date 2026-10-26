import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { dataService } from '../services/dataService';
import { ProductCard } from '../components/customer/ProductCard';
import { CategoryId } from '../types';
import { Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export const MenuPage: React.FC = () => {
  const { language, t } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'price_asc' | 'price_desc' | 'newest'>('popular');

  const products = dataService.getProducts();
  const categories = dataService.getCategories();

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Category filter
      if (selectedCategory !== 'all' && product.categoryId !== selectedCategory) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchTh = product.nameTh.toLowerCase().includes(query) || product.descriptionTh.toLowerCase().includes(query);
        const matchEn = product.nameEn.toLowerCase().includes(query) || product.descriptionEn.toLowerCase().includes(query);
        if (!matchTh && !matchEn) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') {
        return a.basePrice - b.basePrice;
      }
      if (sortBy === 'price_desc') {
        return b.basePrice - a.basePrice;
      }
      if (sortBy === 'newest') {
        return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      }
      // 'popular'
      return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
    });
  }, [products, selectedCategory, searchQuery, sortBy]);

  const clearFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSortBy('popular');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#262922] pb-6">
        <div>
          <span className="text-xs font-mono font-bold text-[#B7FF00] uppercase tracking-wider">
            DIGITAL STREET MENU
          </span>
          <h1 className="text-3xl sm:text-4xl font-heading font-black text-[#F4F4EC] mt-1">
            {language === 'th' ? 'เมนูเบอร์เกอร์และของทานเล่น' : 'Midnight Menu & Smashed Burgers'}
          </h1>
          <p className="text-xs sm:text-sm text-[#9A9D91] mt-1">
            {language === 'th'
              ? 'เนื้อวัวคุณภาพคัดพิเศษ สแมชขอบกรอบ พร้อมท็อปปิ้งซอสสูตรลับ'
              : 'Crispy lacy edges, gooey cheddar, secret sauces, crafted fresh to order.'}
          </p>
        </div>

        <div className="text-xs font-mono text-[#9A9D91]">
          {filteredProducts.length} {t.menu.itemCount}
        </div>
      </div>

      {/* Search and Sorting Controls Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#9A9D91] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={t.menu.searchPlaceholder}
            className="w-full bg-[#1C1E19] border border-[#262922] focus:border-[#B7FF00] rounded-xl pl-10 pr-9 py-2.5 text-xs sm:text-sm text-[#F4F4EC] placeholder-[#9A9D91]/60 focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A9D91] hover:text-[#F4F4EC]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <ArrowUpDown className="w-4 h-4 text-[#9A9D91]" />
          <span className="text-xs text-[#9A9D91] font-mono hidden sm:inline">{t.menu.sortBy}:</span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="bg-[#1C1E19] border border-[#262922] focus:border-[#B7FF00] rounded-xl px-3 py-2 text-xs font-medium text-[#F4F4EC] focus:outline-none cursor-pointer"
          >
            <option value="popular">{t.menu.sortPopular}</option>
            <option value="price_asc">{t.menu.sortPriceAsc}</option>
            <option value="price_desc">{t.menu.sortPriceDesc}</option>
            <option value="newest">{t.menu.sortNewest}</option>
          </select>
        </div>

      </div>

      {/* Category Pills Slider / Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map(cat => {
          const isSelected = selectedCategory === cat.id;
          const catName = language === 'th' ? cat.nameTh : cat.nameEn;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-display font-bold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#B7FF00] text-[#10110F] shadow-[0_0_15px_rgba(183,255,0,0.3)]'
                  : 'bg-[#1C1E19] text-[#9A9D91] border border-[#262922] hover:text-[#F4F4EC] hover:border-[#353830]'
              }`}
            >
              {catName}
            </button>
          );
        })}
      </div>

      {/* Product Cards Grid */}
      {filteredProducts.length === 0 ? (
        <div className="p-12 text-center bg-[#1C1E19] border border-[#262922] rounded-3xl space-y-3">
          <div className="text-3xl">🔍</div>
          <h3 className="font-display font-bold text-lg text-[#F4F4EC]">
            {t.menu.noResults}
          </h3>
          <p className="text-xs text-[#9A9D91]">
            {language === 'th' ? 'ลองค้นหาด้วยคำอื่น หรือกดล้างตัวกรอง' : 'Try searching with different keywords or reset filters.'}
          </p>
          <button
            onClick={clearFilters}
            className="mt-2 px-4 py-2 rounded-xl bg-[#B7FF00] text-[#10110F] font-bold text-xs font-display hover:bg-[#D4FF4F] transition-colors"
          >
            {t.menu.clearFilters}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

    </div>
  );
};

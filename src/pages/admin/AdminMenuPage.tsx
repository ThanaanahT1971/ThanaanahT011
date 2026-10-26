import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { dataService } from '../../services/dataService';
import { Product, CategoryId } from '../../types';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Search, 
  SlidersHorizontal, 
  Sparkles,
  AlertCircle
} from 'lucide-react';

export const AdminMenuPage: React.FC = () => {
  const { language, t, showToast } = useApp();

  const [products, setProducts] = useState<Product[]>(() => dataService.getProducts());
  const categories = dataService.getCategories();
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State for Add / Edit
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form Fields
  const [nameTh, setNameTh] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [descTh, setDescTh] = useState('');
  const [descEn, setDescEn] = useState('');
  const [basePrice, setBasePrice] = useState(199);
  const [categoryId, setCategoryId] = useState<CategoryId>('signature');
  const [imageUrl, setImageUrl] = useState('');
  const [stockQuantity, setStockQuantity] = useState(40);
  const [isAvailable, setIsAvailable] = useState(true);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [isPlantBased, setIsPlantBased] = useState(false);

  const refreshProducts = () => {
    setProducts(dataService.getProducts());
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setNameTh('');
    setNameEn('');
    setDescTh('');
    setDescEn('');
    setBasePrice(199);
    setCategoryId('signature');
    setImageUrl('https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80');
    setStockQuantity(30);
    setIsAvailable(true);
    setIsBestSeller(false);
    setIsNew(true);
    setIsPlantBased(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setNameTh(product.nameTh);
    setNameEn(product.nameEn);
    setDescTh(product.descriptionTh);
    setDescEn(product.descriptionEn);
    setBasePrice(product.basePrice);
    setCategoryId(product.categoryId);
    setImageUrl(product.imageUrl);
    setStockQuantity(product.stockQuantity);
    setIsAvailable(product.isAvailable);
    setIsBestSeller(!!product.isBestSeller);
    setIsNew(!!product.isNew);
    setIsPlantBased(!!product.isPlantBased);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameTh.trim() || !nameEn.trim()) return;

    const targetProduct: Product = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      nameTh: nameTh.trim(),
      nameEn: nameEn.trim(),
      descriptionTh: descTh.trim(),
      descriptionEn: descEn.trim(),
      basePrice: Number(basePrice) || 0,
      categoryId,
      imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80',
      stockQuantity: Number(stockQuantity) || 0,
      lowStockThreshold: 10,
      isAvailable,
      isBestSeller,
      isNew,
      isPlantBased,
      customizationGroups: editingProduct?.customizationGroups || [],
      createdAt: editingProduct?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dataService.upsertProduct(targetProduct);
    refreshProducts();
    setIsModalOpen(false);
    showToast(language === 'th' ? 'บันทึกเมนูสำเร็จ' : 'Saved menu item', 'success');
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(t.admin.deleteConfirm + ` (${name})`)) {
      dataService.deleteProduct(id);
      refreshProducts();
      showToast(language === 'th' ? 'ลบเมนูเรียบร้อยแล้ว' : 'Deleted menu item', 'info');
    }
  };

  const handleToggleAvailability = (product: Product) => {
    const updated = { ...product, isAvailable: !product.isAvailable };
    dataService.upsertProduct(updated);
    refreshProducts();
  };

  const filtered = products.filter(p => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return p.nameTh.toLowerCase().includes(q) || p.nameEn.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-black text-[#F4F4EC]">
            {t.admin.menu}
          </h2>
          <p className="text-xs text-[#9A9D91]">
            {language === 'th' ? 'เพิ่ม แก้ไข ลบ และจัดการราคาเมนูอาหารทั้งหมด' : 'Full CRUD menu management, pricing, and availability'}
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-[#B7FF00] hover:bg-[#D4FF4F] text-[#10110F] font-display font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(183,255,0,0.3)] transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t.admin.addNewProduct}</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 text-[#9A9D91] absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder={t.menu.searchPlaceholder}
          className="w-full bg-[#1C1E19] border border-[#262922] focus:border-[#B7FF00] rounded-xl pl-9 pr-3 py-2 text-xs text-[#F4F4EC] focus:outline-none"
        />
      </div>

      {/* Products Table */}
      <div className="rounded-3xl bg-[#1C1E19] border border-[#262922] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#262922] text-[#9A9D91] font-mono bg-[#141512]">
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-4">{t.admin.category}</th>
                <th className="py-3 px-4">{t.admin.price}</th>
                <th className="py-3 px-4">{t.admin.stockQty}</th>
                <th className="py-3 px-4">Available</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262922]">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-[#10110F]/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.imageUrl}
                        alt={p.nameEn}
                        className="w-10 h-10 rounded-lg object-cover bg-[#10110F]"
                      />
                      <div>
                        <div className="font-bold text-[#F4F4EC]">{language === 'th' ? p.nameTh : p.nameEn}</div>
                        <div className="text-[10px] text-[#9A9D91]">{p.nameEn}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-[#D4FF4F] uppercase text-[11px]">
                    {p.categoryId}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-[#B7FF00] text-sm">
                    ฿{p.basePrice}
                  </td>
                  <td className="py-3 px-4 font-mono">
                    <span className={p.stockQuantity <= 10 ? 'text-red-400 font-bold' : 'text-[#F4F4EC]'}>
                      {p.stockQuantity}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleToggleAvailability(p)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold transition-colors cursor-pointer ${
                        p.isAvailable
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/40'
                          : 'bg-red-500/15 text-red-400 border border-red-500/40'
                      }`}
                    >
                      {p.isAvailable ? 'IN STOCK' : 'OUT OF STOCK'}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 rounded-lg bg-[#10110F] border border-[#353830] text-[#9A9D91] hover:text-[#B7FF00] transition-colors"
                        title={t.admin.editProduct}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.nameEn)}
                        className="p-1.5 rounded-lg bg-[#10110F] border border-[#353830] text-[#9A9D91] hover:text-red-400 transition-colors"
                        title={t.admin.deleteProduct}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#1C1E19] border border-[#353830] rounded-3xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-[#262922] pb-3">
              <h3 className="font-display font-black text-lg text-[#F4F4EC]">
                {editingProduct ? t.admin.editProduct : t.admin.addNewProduct}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-[#9A9D91] hover:text-[#F4F4EC]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#9A9D91] font-mono mb-1">{t.admin.productNameTh} *</label>
                  <input
                    type="text"
                    required
                    value={nameTh}
                    onChange={e => setNameTh(e.target.value)}
                    className="w-full bg-[#10110F] border border-[#262922] focus:border-[#B7FF00] rounded-xl px-3 py-2 text-[#F4F4EC] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#9A9D91] font-mono mb-1">{t.admin.productNameEn} *</label>
                  <input
                    type="text"
                    required
                    value={nameEn}
                    onChange={e => setNameEn(e.target.value)}
                    className="w-full bg-[#10110F] border border-[#262922] focus:border-[#B7FF00] rounded-xl px-3 py-2 text-[#F4F4EC] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#9A9D91] font-mono mb-1">{t.admin.price} (฿) *</label>
                  <input
                    type="number"
                    required
                    value={basePrice}
                    onChange={e => setBasePrice(Number(e.target.value))}
                    className="w-full bg-[#10110F] border border-[#262922] focus:border-[#B7FF00] rounded-xl px-3 py-2 text-[#F4F4EC] focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[#9A9D91] font-mono mb-1">{t.admin.category}</label>
                  <select
                    value={categoryId}
                    onChange={e => setCategoryId(e.target.value as any)}
                    className="w-full bg-[#10110F] border border-[#262922] focus:border-[#B7FF00] rounded-xl px-3 py-2 text-[#F4F4EC] focus:outline-none"
                  >
                    {categories.filter(c => c.id !== 'all').map(c => (
                      <option key={c.id} value={c.id}>{language === 'th' ? c.nameTh : c.nameEn}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[#9A9D91] font-mono mb-1">{t.admin.stockQty}</label>
                  <input
                    type="number"
                    value={stockQuantity}
                    onChange={e => setStockQuantity(Number(e.target.value))}
                    className="w-full bg-[#10110F] border border-[#262922] focus:border-[#B7FF00] rounded-xl px-3 py-2 text-[#F4F4EC] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#9A9D91] font-mono mb-1">Image URL</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  className="w-full bg-[#10110F] border border-[#262922] focus:border-[#B7FF00] rounded-xl px-3 py-2 text-[#F4F4EC] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#9A9D91] font-mono mb-1">Description (Thai)</label>
                <textarea
                  rows={2}
                  value={descTh}
                  onChange={e => setDescTh(e.target.value)}
                  className="w-full bg-[#10110F] border border-[#262922] focus:border-[#B7FF00] rounded-xl px-3 py-2 text-[#F4F4EC] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#9A9D91] font-mono mb-1">Description (English)</label>
                <textarea
                  rows={2}
                  value={descEn}
                  onChange={e => setDescEn(e.target.value)}
                  className="w-full bg-[#10110F] border border-[#262922] focus:border-[#B7FF00] rounded-xl px-3 py-2 text-[#F4F4EC] focus:outline-none"
                />
              </div>

              {/* Badges Toggles */}
              <div className="pt-2 flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAvailable}
                    onChange={e => setIsAvailable(e.target.checked)}
                    className="accent-[#B7FF00]"
                  />
                  <span>{t.admin.inStock}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isBestSeller}
                    onChange={e => setIsBestSeller(e.target.checked)}
                    className="accent-[#B7FF00]"
                  />
                  <span>Best Seller</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isNew}
                    onChange={e => setIsNew(e.target.checked)}
                    className="accent-[#B7FF00]"
                  />
                  <span>New</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPlantBased}
                    onChange={e => setIsPlantBased(e.target.checked)}
                    className="accent-[#B7FF00]"
                  />
                  <span>Plant-Based</span>
                </label>
              </div>

              <div className="pt-4 border-t border-[#262922] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-[#9A9D91]"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#B7FF00] hover:bg-[#D4FF4F] text-[#10110F] font-bold"
                >
                  {t.admin.saveChanges}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

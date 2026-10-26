import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { dataService } from '../../services/dataService';
import { Review } from '../../types';
import { Star, MessageSquareQuote, Plus, Trash2 } from 'lucide-react';

export const AdminReviewsPage: React.FC = () => {
  const { language, t, showToast } = useApp();
  const [reviews, setReviews] = useState<Review[]>(() => dataService.getReviews());

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [rating, setRating] = useState(5);
  const [commentTh, setCommentTh] = useState('');
  const [commentEn, setCommentEn] = useState('');
  const [productName, setProductName] = useState('NIGHT RIDER BURGER');

  const refreshReviews = () => {
    setReviews(dataService.getReviews());
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !commentTh.trim()) return;

    dataService.addReview({
      customerName: customerName.trim(),
      rating,
      commentTh: commentTh.trim(),
      commentEn: commentEn.trim() || commentTh.trim(),
      productName,
    });

    refreshReviews();
    setIsModalOpen(false);
    setCustomerName('');
    setCommentTh('');
    setCommentEn('');
    showToast(language === 'th' ? 'เพิ่มรีวิวเรียบร้อย' : 'Added review', 'success');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-black text-[#F4F4EC]">
            {t.admin.reviews}
          </h2>
          <p className="text-xs text-[#9A9D91]">
            {language === 'th' ? 'รีวิวจากลูกค้าสายดึก (ข้อมูลจำลองสำหรับการนำเสนอ)' : 'Demonstration customer reviews and feedback'}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#B7FF00] hover:bg-[#D4FF4F] text-[#10110F] font-display font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(183,255,0,0.3)] transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Demo Review</span>
        </button>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reviews.map(rev => (
          <div
            key={rev.id}
            className="p-5 rounded-3xl bg-[#1C1E19] border border-[#262922] flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#10110F] text-[#B7FF00] flex items-center justify-center font-bold text-xs">
                    {rev.customerName[0]}
                  </div>
                  <span className="font-display font-bold text-xs text-[#F4F4EC]">
                    {rev.customerName}
                  </span>
                </div>

                <div className="flex text-amber-400">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
              </div>

              <p className="text-xs text-[#9A9D91] italic leading-relaxed">
                "{language === 'th' ? rev.commentTh : rev.commentEn}"
              </p>
            </div>

            <div className="pt-2 border-t border-[#262922] flex items-center justify-between text-[11px] font-mono text-[#D4FF4F]">
              <span>{rev.productName || 'Order'}</span>
              <span className="text-[#9A9D91]">{new Date(rev.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#1C1E19] border border-[#353830] rounded-3xl w-full max-w-md p-6 space-y-4">
            <h3 className="font-display font-black text-lg text-[#F4F4EC]">
              Add Demo Review
            </h3>

            <form onSubmit={handleAddReview} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#9A9D91] font-mono mb-1">Customer Name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  placeholder="e.g. Maya L."
                  className="w-full bg-[#10110F] border border-[#262922] rounded-xl px-3 py-2 text-[#F4F4EC] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#9A9D91] font-mono mb-1">Rating (1-5)</label>
                <select
                  value={rating}
                  onChange={e => setRating(Number(e.target.value))}
                  className="w-full bg-[#10110F] border border-[#262922] rounded-xl px-3 py-2 text-[#F4F4EC]"
                >
                  <option value={5}>5 Stars (★★★★★)</option>
                  <option value={4}>4 Stars (★★★★☆)</option>
                  <option value={3}>3 Stars (★★★☆☆)</option>
                </select>
              </div>

              <div>
                <label className="block text-[#9A9D91] font-mono mb-1">Comment (Thai) *</label>
                <textarea
                  rows={2}
                  required
                  value={commentTh}
                  onChange={e => setCommentTh(e.target.value)}
                  className="w-full bg-[#10110F] border border-[#262922] rounded-xl px-3 py-2 text-[#F4F4EC]"
                />
              </div>

              <div>
                <label className="block text-[#9A9D91] font-mono mb-1">Comment (English)</label>
                <textarea
                  rows={2}
                  value={commentEn}
                  onChange={e => setCommentEn(e.target.value)}
                  className="w-full bg-[#10110F] border border-[#262922] rounded-xl px-3 py-2 text-[#F4F4EC]"
                />
              </div>

              <div className="pt-3 border-t border-[#262922] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-[#9A9D91]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#B7FF00] text-[#10110F] font-bold"
                >
                  Save Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import ProductEditModal from './ProductEditModal';

export default function AdminProducts({ onShowToast }) {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [editingProduct, setEditingProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      categoryFilter === 'all' || p.category?.includes(categoryFilter);
    const matchesSearch =
      !search.trim() ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.origin?.toLowerCase().includes(search.toLowerCase()) ||
      p.textureBadge?.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setEditingProduct(p);
    setIsModalOpen(true);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa "${name}" khỏi danh sách niêm yết?`)) {
      deleteProduct(id);
      if (onShowToast) onShowToast(`Đã xóa "${name}" thành công!`);
    }
  };

  const handleSaveProduct = (productData) => {
    if (productData.id) {
      updateProduct(productData.id, productData);
      if (onShowToast) onShowToast(`Đã cập nhật thông tin "${productData.name}"!`);
    } else {
      addProduct(productData);
      if (onShowToast) onShowToast(`Đã thêm mới "${productData.name}" vào danh sách!`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 font-serif">
            Quản Lý 13 Loại Gạo & Bảng Giá Niêm Yết
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Thêm mới, sửa thông tin chi tiết, chỉnh thang điểm hương vị hoặc xóa sản phẩm khỏi catalog.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-[#0d631b] hover:bg-[#094713] text-white text-sm font-bold shadow-xs flex items-center gap-2 cursor-pointer transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">add_circle</span>
          <span>Thêm Loại Gạo Mới</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên gạo, đặc tính, xuất xứ..."
            className="w-full bg-stone-50 border border-stone-300 rounded-xl pl-9 pr-4 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0d631b]"
          />
          <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-stone-400 text-[18px]">
            search
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'premium', label: 'Cao cấp' },
            { id: 'family', label: 'Gia đình' },
            { id: 'commercial', label: 'Quán ăn' },
            { id: 'glutinous', label: 'Nếp & Tấm' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
                categoryFilter === cat.id
                  ? 'bg-[#0d631b] text-white'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-stone-800">
            <thead className="bg-stone-100 text-xs text-stone-600 uppercase font-bold border-b border-stone-200">
              <tr>
                <th className="py-3.5 px-4">Ảnh & Tên Gạo</th>
                <th className="py-3.5 px-4">Đặc tính / Huy hiệu</th>
                <th className="py-3.5 px-4">Xuất xứ</th>
                <th className="py-3.5 px-4">Giá bán lẻ</th>
                <th className="py-3.5 px-4">Thang điểm (Dẻo-Thơm-Xốp)</th>
                <th className="py-3.5 px-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {filteredProducts.map((rice) => (
                <tr key={rice.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={rice.imageUrl}
                        alt={rice.name}
                        className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
                      />
                      <div>
                        <div className="font-bold text-stone-900">{rice.name}</div>
                        <div className="text-xs text-stone-500 line-clamp-1 max-w-xs">{rice.desc}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-xs">
                    <div className="space-y-1">
                      <span className="inline-block px-2 py-0.5 rounded bg-emerald-50 text-[#0d631b] font-bold border border-emerald-200">
                        {rice.textureBadge}
                      </span>
                      {rice.badge && (
                        <div className="text-[11px] text-amber-700 font-semibold">{rice.badge}</div>
                      )}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-xs text-stone-600 font-medium">
                    {rice.origin || 'ĐBSCL'}
                  </td>

                  <td className="py-3.5 px-4 font-extrabold text-[#0d631b] text-base">
                    {rice.price.toLocaleString('vi-VN')}đ <span className="text-xs font-normal text-stone-500">/kg</span>
                  </td>

                  <td className="py-3.5 px-4 text-xs text-stone-600">
                    <div className="flex items-center gap-2">
                      <span title="Độ dẻo" className="bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200">
                        🍚 {rice.texture?.softness || 4}/5
                      </span>
                      <span title="Hương thơm" className="bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200">
                        ✨ {rice.texture?.aroma || 4}/5
                      </span>
                      <span title="Độ xốp" className="bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200">
                        🍛 {rice.texture?.fluffiness || 2}/5
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(rice)}
                        className="p-1.5 rounded-lg text-stone-600 hover:text-[#0d631b] hover:bg-emerald-50 cursor-pointer transition-colors"
                        title="Chỉnh sửa chi tiết"
                      >
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(rice.id, rice.name)}
                        className="p-1.5 rounded-lg text-stone-600 hover:text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
                        title="Xóa loại gạo này"
                      >
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit/Add Modal */}
      <ProductEditModal
        isOpen={isModalOpen}
        product={editingProduct}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
      />
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Search, Package, Upload, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { Product } from "@/types";

const categories = ["running", "casual", "formal", "sports", "boots", "sandals"];

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    price: 0,
    description: "",
    sizes: [],
    category: "running",
    stock: 0,
    images: [],
    featured: false,
    trending: false,
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.success) setProducts(data.products);
    } catch {
      setProducts([
        { _id: "1", name: "Urban Runner", price: 149, description: "Running shoes", images: [], sizes: ["7", "8", "9"], category: "running", stock: 10, featured: true },
        { _id: "2", name: "Street Style", price: 129, description: "Casual shoes", images: [], sizes: ["7", "8", "9"], category: "casual", stock: 15, trending: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate sizes
    if (!formData.sizes || formData.sizes.length === 0) {
      toast.error("Please add at least one size");
      return;
    }
    
    try {
      const url = editingProduct ? `/api/products/${editingProduct._id}` : "/api/products";
      const method = editingProduct ? "PUT" : "POST";
      
      // Debug: Log what we're sending
      console.log("Sending product data:", formData);
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(editingProduct ? "Product updated!" : "Product created!");
        setShowModal(false);
        fetchProducts();
        resetForm();
      } else {
        toast.error(data.message || "Failed to save product");
        console.error("API Error:", data);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error("Submit error:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Product deleted!");
        fetchProducts();
      }
    } catch {
      toast.error("Failed to delete");
    }
  };

  const resetForm = () => {
    setFormData({ name: "", price: 0, description: "", sizes: [], category: "running", stock: 0, images: [], featured: false, trending: false });
    setEditingProduct(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const currentImages = formData.images || [];
    const remainingSlots = 6 - currentImages.length;
    if (remainingSlots <= 0) {
      toast.error("Maximum 6 images allowed");
      return;
    }

    const filesToProcess = Array.from(files).slice(0, remainingSlots);
    setUploading(true);

    const promises = filesToProcess.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises).then((base64Images) => {
      setFormData((prev) => ({ ...prev, images: [...(prev.images || []), ...base64Images] }));
      setUploading(false);
      toast.success(`${base64Images.length} image(s) uploaded`);
    });
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index),
    }));
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData(product);
    setShowModal(true);
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl font-medium hover:bg-gray-800"
        >
          <Plus className="w-5 h-5" /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products..."
          className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      {/* Products List/Table (Responsive) */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">Loading...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No products found</div>
        ) : (
          <>
            {/* Mobile Card List */}
            <div className="md:hidden divide-y">
              {filteredProducts.map((product) => (
                <div key={product._id} className="p-4">
                  <div className="flex items-center gap-3">
                    {product.images && product.images.length > 0 ? (
                      <img src={product.images[0]} alt={product.name} className="w-16 h-16 rounded-lg object-cover border" />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                        <span className="text-sm font-medium text-gray-900 whitespace-nowrap">RS {product.price}</span>
                      </div>
                      <div className="mt-1 flex items-center justify-between">
                        <span className="text-xs text-gray-600 capitalize">{product.category}</span>
                        <span className="text-xs text-gray-600">Stock: {product.stock}</span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {product.featured && <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">Featured</span>}
                        {product.trending && <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">Trending</span>}
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <button onClick={() => openEdit(product)} className="px-3 py-2 rounded-lg border text-sm hover:bg-gray-50">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(product._id!)} className="px-3 py-2 rounded-lg border text-sm text-red-600 hover:bg-red-50">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Product</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Category</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Price</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Stock</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Status</th>
                    <th className="text-right px-6 py-4 text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {product.images && product.images.length > 0 ? (
                            <img src={product.images[0]} alt={product.name} className="w-10 h-10 rounded-lg object-cover border" />
                          ) : (
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Package className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                          <span className="font-medium text-gray-900">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 capitalize">{product.category}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">RS {product.price}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{product.stock}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {product.featured && <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">Featured</span>}
                          {product.trending && <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Trending</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openEdit(product)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(product._id!)} className="p-2 hover:bg-red-50 rounded-lg text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-none sm:rounded-2xl p-4 sm:p-6 w-full max-w-lg h-[100vh] sm:h-auto sm:max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">{editingProduct ? "Edit Product" : "Add Product"}</h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-black focus:outline-none" required />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-black focus:outline-none" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                    <input type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })} className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-black focus:outline-none" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-black focus:outline-none">
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-black focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sizes <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="e.g. 7, 8, 9 or S, M, L"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const value = e.currentTarget.value.trim();
                          if (value && !(formData.sizes || []).includes(value)) {
                            setFormData({ ...formData, sizes: [...(formData.sizes || []), value] });
                            e.currentTarget.value = '';
                          }
                        }
                      }}
                      className="flex-1 px-4 py-2 rounded-xl border focus:ring-2 focus:ring-black focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                        const value = input.value.trim();
                        if (value && !(formData.sizes || []).includes(value)) {
                          setFormData({ ...formData, sizes: [...(formData.sizes || []), value] });
                          input.value = '';
                        }
                      }}
                      className="px-4 py-2 bg-gray-100 rounded-xl text-sm font-medium hover:bg-gray-200"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(formData.sizes || []).map((size, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-black text-white rounded-full text-sm">
                        {size}
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, sizes: (formData.sizes || []).filter((_, i) => i !== idx) })}
                          className="w-4 h-4 flex items-center justify-center hover:bg-gray-700 rounded-full"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Press Enter or click Add to add a size. Examples: 7, 7.5, 8, S, M, L, XL</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Images ({(formData.images || []).length}/6)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                    {(formData.images || []).map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border group">
                        <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    {(formData.images || []).length < 6 && (
                      <label className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={handleImageUpload}
                          disabled={uploading}
                        />
                        {uploading ? (
                          <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <Upload className="w-6 h-6 text-gray-400 mb-1" />
                            <span className="text-xs text-gray-400">Add</span>
                          </>
                        )}
                      </label>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">Upload at least 1 image. Max 6 images. Supported: JPG, PNG, WEBP.</p>
                </div>
                <div className="flex gap-4 flex-wrap">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} className="rounded" />
                    <span className="text-sm">Featured</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={formData.trending} onChange={(e) => setFormData({ ...formData, trending: e.target.checked })} className="rounded" />
                    <span className="text-sm">Trending</span>
                  </label>
                </div>
                <button type="submit" className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800">
                  {editingProduct ? "Update" : "Create"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

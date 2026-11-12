import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Plus,
  Trash2,
  Edit,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  Phone,
  MessageCircle,
  Truck,
  Database,
  RefreshCw,
  LogOut,
  X,
  Eye,
  Sliders,
  DollarSign,
  Palette,
  ExternalLink,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product, Category, ProductColor, Order } from '../types';
import { masterSuitColors, washingWearColors, mixCottonColors, pureCottonColors } from '../data/initialData';
import { SUPABASE_SQL_SCHEMA, getSupabaseConfig } from '../lib/supabase';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    categories,
    orders,
    settings,
    isAdminAuthenticated,
    loginAdmin,
    logoutAdmin,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory,
    updateOrderStatus,
    updateSettings,
    uploadImageFile,
    resetToDefaults,
  } = useStore();

  // Auth password input
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Active Dashboard Tab
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'orders' | 'images' | 'supabase'>('products');

  // Product Editing / Creation Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Form State for Product
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState(2450);
  const [prodOriginalPrice, setProdOriginalPrice] = useState(2950);
  const [prodCategory, setProdCategory] = useState('washing-wear');
  const [prodDescription, setProdDescription] = useState('');
  const [prodFabricType, setProdFabricType] = useState('Premium Wash & Wear');
  const [prodCutting, setProdCutting] = useState('4.25 Gaz (4.0m) Unstitched');
  const [prodSeason, setProdSeason] = useState<Product['season']>('All Seasons');
  const [prodBadge, setProdBadge] = useState<Product['badge']>('Premium Quality');
  const [prodCapryGuarantee, setProdCapryGuarantee] = useState(true);
  const [prodCapryGuaranteeText, setProdCapryGuaranteeText] = useState(settings.capryGuaranteeGlobalText);
  const [prodInStock, setProdInStock] = useState(true);
  const [prodIsFeatured, setProdIsFeatured] = useState(false);
  const [prodIsBestSeller, setProdIsBestSeller] = useState(false);
  const [prodIsNewArrival, setProdIsNewArrival] = useState(true);
  const [prodImages, setProdImages] = useState<string[]>([]);
  const [prodThumbnail, setProdThumbnail] = useState<string>('');
  const [prodColors, setProdColors] = useState<ProductColor[]>([
    { name: 'Navy Blue', hex: '#16233b', inStock: true },
    { name: 'Charcoal', hex: '#1d1f24', inStock: true },
  ]);

  // Color helper input
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#222222');

  // Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catImage, setCatImage] = useState('');

  // Settings State
  const [formSettings, setFormSettings] = useState(settings);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Image Upload helper
  const [isUploading, setIsUploading] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(password);
    if (success) {
      setAuthError('');
      setPassword('');
    } else {
      setAuthError('Incorrect Password. Hint: use "alhafiz786"');
    }
  };

  // Open modal for new product
  const handleOpenNewProduct = () => {
    setEditingProductId(null);
    setProdName('');
    setProdPrice(2500);
    setProdOriginalPrice(3000);
    setProdCategory(categories[0]?.slug || 'washing-wear');
    setProdDescription('Luxury men unstitched suit fabric with premium drape, colorfastness, and authentic Capry guarantee.');
    setProdFabricType('Premium Wash & Wear');
    setProdCutting('4.25 Gaz (4.0m) Unstitched');
    setProdSeason('All Seasons');
    setProdBadge('Premium Quality');
    setProdCapryGuarantee(true);
    setProdCapryGuaranteeText(settings.capryGuaranteeGlobalText);
    setProdInStock(true);
    setProdIsFeatured(false);
    setProdIsBestSeller(false);
    setProdIsNewArrival(true);
    setProdImages(['/src/assets/images/fabric_washing_wear_1794488410986.jpg']);
    setProdThumbnail('/src/assets/images/fabric_washing_wear_1794488410986.jpg');
    setProdColors([
      { name: 'Navy Blue', hex: '#16233b', inStock: true },
      { name: 'Charcoal Black', hex: '#1d1f24', inStock: true },
    ]);
    setIsProductModalOpen(true);
  };

  // Open modal for editing existing product
  const handleOpenEditProduct = (p: Product) => {
    setEditingProductId(p.id);
    setProdName(p.name);
    setProdPrice(p.price);
    setProdOriginalPrice(p.originalPrice || p.price + 500);
    setProdCategory(p.category);
    setProdDescription(p.description);
    setProdFabricType(p.fabricType);
    setProdCutting(p.cutting);
    setProdSeason(p.season);
    setProdBadge(p.badge);
    setProdCapryGuarantee(p.capryGuarantee);
    setProdCapryGuaranteeText(p.capryGuaranteeText || settings.capryGuaranteeGlobalText);
    setProdInStock(p.inStock);
    setProdIsFeatured(p.isFeatured);
    setProdIsBestSeller(p.isBestSeller);
    setProdIsNewArrival(p.isNewArrival);
    setProdImages(p.images || [p.thumbnail]);
    setProdThumbnail(p.thumbnail || p.images[0]);
    setProdColors(p.colors || []);
    setIsProductModalOpen(true);
  };

  // Save product (Add or Edit)
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) {
      alert('Product name is required.');
      return;
    }

    // Ensure price is within Rs. 1500 - 5000
    const clampedPrice = Math.max(1500, Math.min(5000, Number(prodPrice)));

    const productPayload = {
      name: prodName,
      slug: prodName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      category: prodCategory,
      price: clampedPrice,
      originalPrice: Number(prodOriginalPrice) || undefined,
      description: prodDescription,
      fabricType: prodFabricType,
      cutting: prodCutting,
      season: prodSeason,
      badge: prodBadge,
      capryGuarantee: prodCapryGuarantee,
      capryGuaranteeText: prodCapryGuaranteeText,
      inStock: prodInStock,
      isFeatured: prodIsFeatured,
      isBestSeller: prodIsBestSeller,
      isNewArrival: prodIsNewArrival,
      images: prodImages.length > 0 ? prodImages : ['/src/assets/images/fabric_washing_wear_1794488410986.jpg'],
      thumbnail: prodThumbnail || prodImages[0] || '/src/assets/images/fabric_washing_wear_1794488410986.jpg',
      colors: prodColors,
      rating: 5.0,
      reviewsCount: 12,
    };

    if (editingProductId) {
      updateProduct(editingProductId, productPayload);
    } else {
      addProduct(productPayload);
    }

    setIsProductModalOpen(false);
  };

  // Handle image upload from user's computer
  const handleComputerImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const uploadPromises = Array.from(files).map((file) => uploadImageFile(file));
      const newImageUrls = await Promise.all(uploadPromises);

      setProdImages((prev) => [...prev, ...newImageUrls]);
      if (!prodThumbnail && newImageUrls.length > 0) {
        setProdThumbnail(newImageUrls[0]);
      }
    } catch (err) {
      alert('Error uploading image file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Color addition
  const handleAddColor = () => {
    if (!newColorName.trim()) return;
    setProdColors([...prodColors, { name: newColorName.trim(), hex: newColorHex, inStock: true }]);
    setNewColorName('');
  };

  const handleRemoveColor = (index: number) => {
    setProdColors(prodColors.filter((_, i) => i !== index));
  };

  // Category save
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;
    const slug = catSlug.trim() || catName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    if (editingCategoryId) {
      updateCategory(editingCategoryId, { name: catName, slug, description: catDesc, image: catImage });
    } else {
      addCategory({ name: catName, slug, description: catDesc, image: catImage || '/src/assets/images/fabric_pure_cotton_1794488412254.jpg', featured: true });
    }
    setIsCategoryModalOpen(false);
  };

  // Settings Save
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formSettings);
    setSettingsSuccess(true);
    setTimeout(() => setSettingsSuccess(false), 3000);
  };

  // If not logged in, render PIN / Password barrier
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0b0e] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#111218] border border-[#262835] rounded-2xl shadow-2xl p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#181a24] border border-[#d4af37]/40 text-[#d4af37] mx-auto flex items-center justify-center shadow-lg">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[11px] uppercase tracking-widest text-[#d4af37] font-semibold">
              AL HAFIZ CLOTHS
            </span>
            <h1 className="text-2xl font-bold font-display text-white mt-1">
              Admin Control Center
            </h1>
            <p className="text-xs text-neutral-400 mt-2">
              Protected portal for inventory management, computer photo uploads, pricing, and customer orders.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Master Password / PIN"
                className="w-full bg-[#161720] border border-[#2b2d3b] rounded-lg px-4 py-3 text-sm text-white placeholder-neutral-500 text-center focus:outline-none focus:border-[#d4af37]"
                autoFocus
              />
              {authError && <p className="text-xs text-red-400 mt-2">{authError}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#d4af37] hover:bg-[#e4c04e] text-black font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-lg cursor-pointer"
            >
              Unlock Dashboard
            </button>
          </form>

          <div className="pt-4 border-t border-[#1e202a] text-[11px] text-neutral-400">
            Default Demo Master Key: <code className="text-[#d4af37] font-mono">alhafiz786</code>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0b0e] text-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-[#20222a] gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-widest text-[#d4af37]">
                SECURE STORE MANAGEMENT
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-white mt-1">
              AL HAFIZ CLOTHS Dashboard
            </h1>
            <p className="text-xs text-neutral-400 mt-0.5">
              Live Storefront Inventory &middot; WhatsApp Orders &middot; Computer Photo Uploads
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenNewProduct}
              className="px-4 py-2.5 bg-[#d4af37] hover:bg-[#e4c04e] text-black font-bold text-xs rounded-lg flex items-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>

            <button
              onClick={logoutAdmin}
              className="p-2.5 bg-[#171822] hover:bg-[#222432] border border-[#2b2d3c] text-neutral-300 hover:text-white rounded-lg transition-colors"
              title="Logout from Admin"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#20222a] pb-4 mb-8 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'products'
                ? 'bg-[#d4af37] text-black shadow'
                : 'bg-[#14151c] text-neutral-300 hover:text-white border border-[#22242e]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Product Inventory ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'bg-[#d4af37] text-black shadow'
                : 'bg-[#14151c] text-neutral-300 hover:text-white border border-[#22242e]'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Customer Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'categories'
                ? 'bg-[#d4af37] text-black shadow'
                : 'bg-[#14151c] text-neutral-300 hover:text-white border border-[#22242e]'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Categories ({categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('images')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'images'
                ? 'bg-[#d4af37] text-black shadow'
                : 'bg-[#14151c] text-neutral-300 hover:text-white border border-[#22242e]'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Image Manager</span>
          </button>

          <button
            onClick={() => setActiveTab('supabase')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'supabase'
                ? 'bg-[#d4af37] text-black shadow'
                : 'bg-[#14151c] text-neutral-300 hover:text-white border border-[#22242e]'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Store & Supabase Config</span>
          </button>
        </div>

        {/* TAB 1: PRODUCTS INVENTORY */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold font-display text-white">
                  All Unstitched Suits & Fabrics
                </h2>
                <p className="text-xs text-neutral-400">
                  Update prices (Rs. 1,500 – 5,000), upload new fabric photos from your computer, and toggle Capry Guarantee.
                </p>
              </div>

              <span className="text-xs text-[#d4af37] font-semibold">
                Total Listed: {products.length} Products
              </span>
            </div>

            <div className="bg-[#121319] border border-[#22242e] rounded-xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#171822] text-neutral-400 border-b border-[#242634] uppercase font-semibold">
                    <tr>
                      <th className="p-3.5">Image</th>
                      <th className="p-3.5">Product Title</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Price (PKR)</th>
                      <th className="p-3.5">Capry Guarantee</th>
                      <th className="p-3.5">Stock</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e202a]">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-[#161720] transition-colors">
                        <td className="p-3.5">
                          <img
                            src={p.thumbnail || p.images[0]}
                            alt={p.name}
                            className="w-12 h-12 object-cover rounded-lg bg-[#20222e]"
                            referrerPolicy="no-referrer"
                          />
                        </td>
                        <td className="p-3.5 font-bold text-white max-w-xs">
                          <div className="line-clamp-1">{p.name}</div>
                          <div className="text-[10px] text-neutral-400 font-normal">
                            {p.cutting} &middot; {p.colors.length} shades
                          </div>
                        </td>
                        <td className="p-3.5 uppercase text-neutral-300 font-semibold text-[11px]">
                          {p.category.replace('-', ' ')}
                        </td>
                        <td className="p-3.5 font-bold text-[#d4af37] tabular-nums">
                          Rs. {p.price.toLocaleString()}
                        </td>
                        <td className="p-3.5">
                          {p.capryGuarantee ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              Active
                            </span>
                          ) : (
                            <span className="text-[11px] text-neutral-500">None</span>
                          )}
                        </td>
                        <td className="p-3.5">
                          <button
                            onClick={() => updateProduct(p.id, { inStock: !p.inStock })}
                            className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                              p.inStock
                                ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                                : 'bg-red-950/60 text-red-400 border border-red-800/40'
                            }`}
                          >
                            {p.inStock ? 'In Stock' : 'Out of Stock'}
                          </button>
                        </td>
                        <td className="p-3.5 text-right space-x-2">
                          <button
                            onClick={() => handleOpenEditProduct(p)}
                            className="p-1.5 text-neutral-300 hover:text-[#d4af37] bg-[#1a1c26] rounded border border-[#2b2d3c] transition-colors"
                            title="Edit Product"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete ${p.name}?`)) {
                                deleteProduct(p.id);
                              }
                            }}
                            className="p-1.5 text-neutral-400 hover:text-red-400 bg-[#1a1c26] rounded border border-[#2b2d3c] transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold font-display text-white">
                  Customer Orders & WhatsApp Dispatch
                </h2>
                <p className="text-xs text-neutral-400">
                  Track customer addresses, order statuses, and launch 1-click WhatsApp customer contact.
                </p>
              </div>

              <span className="text-xs text-[#d4af37] font-semibold">
                Total: {orders.length} Orders
              </span>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-16 bg-[#121319] border border-[#22242e] rounded-xl">
                <Truck className="w-10 h-10 text-neutral-600 mx-auto mb-2" />
                <p className="text-sm text-neutral-400">No customer orders placed yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((o) => (
                  <div
                    key={o.id}
                    className="p-5 rounded-xl bg-[#121319] border border-[#22242e] space-y-4 hover:border-[#2f3240] transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#1e202a] gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold font-display text-white">{o.id}</span>
                          <span className="text-[11px] px-2 py-0.5 rounded bg-[#1b1c26] text-[#d4af37] border border-[#2b2d3c]">
                            {o.orderChannel}
                          </span>
                        </div>
                        <span className="text-[11px] text-neutral-400">
                          {new Date(o.createdAt).toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <select
                          value={o.status}
                          onChange={(e) => updateOrderStatus(o.id, e.target.value as Order['status'])}
                          className={`text-xs font-semibold px-3 py-1.5 rounded-lg border focus:outline-none ${
                            o.status === 'delivered'
                              ? 'bg-emerald-950/80 text-emerald-400 border-emerald-700/60'
                              : o.status === 'confirmed'
                              ? 'bg-blue-950/80 text-blue-400 border-blue-700/60'
                              : o.status === 'shipped'
                              ? 'bg-purple-950/80 text-purple-400 border-purple-700/60'
                              : 'bg-amber-950/80 text-amber-400 border-amber-700/60'
                          }`}
                        >
                          <option value="pending">Status: Pending</option>
                          <option value="confirmed">Status: Confirmed</option>
                          <option value="shipped">Status: Shipped</option>
                          <option value="delivered">Status: Delivered</option>
                          <option value="cancelled">Status: Cancelled</option>
                        </select>

                        <a
                          href={`https://wa.me/${o.whatsappNumber.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Chat on WhatsApp</span>
                        </a>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div>
                        <span className="text-neutral-500 uppercase block">Customer & Contact</span>
                        <div className="font-bold text-white text-sm mt-0.5">{o.customerName}</div>
                        <div className="text-neutral-300 font-mono mt-0.5">{o.whatsappNumber}</div>
                      </div>

                      <div>
                        <span className="text-neutral-500 uppercase block">Delivery Address</span>
                        <div className="text-white mt-0.5 font-medium">{o.address}</div>
                        <div className="text-[#d4af37] font-semibold mt-0.5">
                          {o.city} {o.city.toLowerCase() === 'karachi' && '(Free Delivery)'}
                        </div>
                        {o.notes && (
                          <div className="text-[11px] text-neutral-400 italic mt-1">
                            Note: {o.notes}
                          </div>
                        )}
                      </div>

                      <div className="p-3 bg-[#171822] rounded-lg border border-[#242634] space-y-1">
                        <span className="text-neutral-400 uppercase text-[10px] block font-semibold">
                          Financial Breakdown
                        </span>
                        <div className="flex justify-between text-neutral-300">
                          <span>Items Subtotal:</span>
                          <span className="tabular-nums">Rs. {o.subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-neutral-300">
                          <span>Delivery Fee:</span>
                          <span className="tabular-nums">Rs. {o.deliveryFee}</span>
                        </div>
                        <div className="pt-1 border-t border-[#2a2d3c] flex justify-between font-bold text-sm text-[#d4af37]">
                          <span>Grand Total:</span>
                          <span className="tabular-nums">Rs. {o.totalAmount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Ordered Items */}
                    <div className="pt-2 border-t border-[#1e202a]">
                      <span className="text-[11px] font-semibold text-neutral-400 block mb-2">
                        Ordered Fabric Items ({o.items.length}):
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {o.items.map((it, idx) => (
                          <div
                            key={idx}
                            className="p-2 rounded bg-[#171822] border border-[#22242f] flex items-center gap-3 text-xs"
                          >
                            <img
                              src={it.image}
                              alt={it.productName}
                              className="w-10 h-10 object-cover rounded bg-[#20222d]"
                              referrerPolicy="no-referrer"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="font-bold text-white truncate">{it.productName}</div>
                              <div className="text-[11px] text-neutral-400">
                                Color: {it.color} &middot; Qty: {it.quantity} &middot; Rs. {it.totalPrice.toLocaleString()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CATEGORIES */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold font-display text-white">
                  Product Categories
                </h2>
                <p className="text-xs text-neutral-400">
                  Manage standard collections (Washing Wear, Pure Cotton, Mix Cotton, etc.) or add new collections anytime.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingCategoryId(null);
                  setCatName('');
                  setCatSlug('');
                  setCatDesc('');
                  setCatImage('');
                  setIsCategoryModalOpen(true);
                }}
                className="px-4 py-2 bg-[#d4af37] text-black font-bold text-xs rounded-lg flex items-center gap-2 cursor-pointer hover:bg-[#e4c04e]"
              >
                <Plus className="w-4 h-4" />
                <span>New Category</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((c) => (
                <div
                  key={c.id}
                  className="p-5 rounded-xl bg-[#121319] border border-[#22242e] space-y-3 relative group"
                >
                  <div className="aspect-[16/9] rounded-lg overflow-hidden bg-[#181a24]">
                    <img
                      src={c.image || '/src/assets/images/fabric_washing_wear_1794488410986.jpg'}
                      alt={c.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-base text-white">{c.name}</h3>
                    <p className="text-xs text-[#d4af37] font-mono mt-0.5">slug: {c.slug}</p>
                    <p className="text-xs text-neutral-400 mt-1 line-clamp-2">{c.description}</p>
                  </div>

                  <div className="pt-3 border-t border-[#1e202a] flex items-center justify-between">
                    <button
                      onClick={() => {
                        setEditingCategoryId(c.id);
                        setCatName(c.name);
                        setCatSlug(c.slug);
                        setCatDesc(c.description);
                        setCatImage(c.image || '');
                        setIsCategoryModalOpen(true);
                      }}
                      className="text-xs font-semibold text-neutral-300 hover:text-[#d4af37] flex items-center gap-1"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Delete category "${c.name}"?`)) {
                          deleteCategory(c.id);
                        }
                      }}
                      className="text-xs font-semibold text-neutral-500 hover:text-red-400 flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: IMAGE MANAGER */}
        {activeTab === 'images' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold font-display text-white">
                Brand & Fabric Image Manager
              </h2>
              <p className="text-xs text-neutral-400">
                Upload your authentic fabric rolls, suit boxes, and color shade photos directly from your computer.
              </p>
            </div>

            {/* Direct File Upload Banner */}
            <div className="p-8 border-2 border-dashed border-[#2d303f] hover:border-[#d4af37] rounded-2xl bg-[#121319] text-center space-y-4 transition-colors">
              <div className="w-14 h-14 rounded-full bg-[#181a24] border border-[#d4af37]/40 text-[#d4af37] mx-auto flex items-center justify-center">
                <Upload className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-display font-bold text-white text-base">
                  Upload Fabric Pictures from Your Computer
                </h3>
                <p className="text-xs text-neutral-400 max-w-md mx-auto mt-1">
                  Supports multiple JPG, PNG, and WebP images. Uploaded images are permanently saved and ready to assign to suits and collections.
                </p>
              </div>

              <div>
                <label className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#d4af37] hover:bg-[#e4c04e] text-black font-bold text-xs uppercase tracking-wider cursor-pointer shadow-lg transition-all">
                  <Upload className="w-4 h-4" />
                  <span>Choose Images from Computer</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleComputerImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {isUploading && (
                <div className="text-xs text-[#d4af37] animate-pulse">
                  Uploading and processing high-resolution images...
                </div>
              )}
            </div>

            {/* Active Image Gallery */}
            <div>
              <h3 className="text-sm font-bold text-white mb-4">
                Active Catalog Imagery ({products.flatMap((p) => p.images).length} Shots Available)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {products.flatMap((p) => p.images).map((img, i) => (
                  <div
                    key={i}
                    className="relative aspect-square rounded-xl overflow-hidden bg-[#181a24] border border-[#242634] group"
                  >
                    <img
                      src={img}
                      alt="Catalog Fabric"
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center">
                      <span className="text-[10px] text-white break-all">Fabric Asset</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: STORE & SUPABASE CONFIG */}
        {activeTab === 'supabase' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Store Information Config */}
            <div className="lg:col-span-6 space-y-6 bg-[#121319] border border-[#22242e] rounded-xl p-6">
              <div>
                <h3 className="font-display font-bold text-white text-base">
                  Store & Delivery Settings
                </h3>
                <p className="text-xs text-neutral-400">
                  Update WhatsApp direct phone number, Karachi delivery policies, and Capry guarantee seals.
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    value={formSettings.brandName}
                    onChange={(e) => setFormSettings({ ...formSettings, brandName: e.target.value })}
                    className="w-full bg-[#181922] border border-[#2b2d3c] rounded-lg px-3.5 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    WhatsApp Order Phone Number (with Country Code)
                  </label>
                  <input
                    type="text"
                    value={formSettings.whatsappNumber}
                    onChange={(e) => setFormSettings({ ...formSettings, whatsappNumber: e.target.value })}
                    placeholder="923262444991"
                    className="w-full bg-[#181922] border border-[#2b2d3c] rounded-lg px-3.5 py-2 text-xs text-white"
                  />
                  <span className="text-[10px] text-neutral-500 mt-1 block">
                    Customer clicks will open https://wa.me/{formSettings.whatsappNumber}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-neutral-300 block mb-1">
                      Free Delivery City
                    </label>
                    <input
                      type="text"
                      value={formSettings.deliveryFreeCity}
                      onChange={(e) => setFormSettings({ ...formSettings, deliveryFreeCity: e.target.value })}
                      className="w-full bg-[#181922] border border-[#2b2d3c] rounded-lg px-3.5 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-300 block mb-1">
                      Other Cities Fee (PKR)
                    </label>
                    <input
                      type="number"
                      value={formSettings.standardDeliveryFee}
                      onChange={(e) => setFormSettings({ ...formSettings, standardDeliveryFee: Number(e.target.value) })}
                      className="w-full bg-[#181922] border border-[#2b2d3c] rounded-lg px-3.5 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Global "Capry Guarantee" Seal Description
                  </label>
                  <textarea
                    rows={2}
                    value={formSettings.capryGuaranteeGlobalText}
                    onChange={(e) => setFormSettings({ ...formSettings, capryGuaranteeGlobalText: e.target.value })}
                    className="w-full bg-[#181922] border border-[#2b2d3c] rounded-lg px-3.5 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Top Announcement Bar Message
                  </label>
                  <input
                    type="text"
                    value={formSettings.announcementText}
                    onChange={(e) => setFormSettings({ ...formSettings, announcementText: e.target.value })}
                    className="w-full bg-[#181922] border border-[#2b2d3c] rounded-lg px-3.5 py-2 text-xs text-white"
                  />
                </div>

                {settingsSuccess && (
                  <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-600/40 text-emerald-400 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Store settings updated successfully!</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#d4af37] text-black font-bold text-xs rounded-lg hover:bg-[#e4c04e] transition-colors cursor-pointer"
                  >
                    Save Store Settings
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Reset all catalog data and settings back to original defaults?')) {
                        resetToDefaults();
                      }
                    }}
                    className="text-xs text-neutral-500 hover:text-red-400"
                  >
                    Reset Defaults
                  </button>
                </div>
              </form>
            </div>

            {/* Supabase Cloud Connection & Schema */}
            <div className="lg:col-span-6 space-y-6 bg-[#121319] border border-[#22242e] rounded-xl p-6">
              <div>
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-display font-bold text-white text-base">
                    Supabase Cloud Sync
                  </h3>
                </div>
                <p className="text-xs text-neutral-400 mt-1">
                  Connect your live Supabase project to sync products, categories, orders, and Supabase Storage bucket.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Supabase Project URL
                  </label>
                  <input
                    type="text"
                    value={formSettings.supabaseUrl || ''}
                    onChange={(e) => setFormSettings({ ...formSettings, supabaseUrl: e.target.value })}
                    placeholder="https://xyzcompany.supabase.co"
                    className="w-full bg-[#181922] border border-[#2b2d3c] rounded-lg px-3.5 py-2 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Supabase Anon Public API Key
                  </label>
                  <input
                    type="password"
                    value={formSettings.supabaseAnonKey || ''}
                    onChange={(e) => setFormSettings({ ...formSettings, supabaseAnonKey: e.target.value })}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full bg-[#181922] border border-[#2b2d3c] rounded-lg px-3.5 py-2 text-xs text-white font-mono"
                  />
                </div>

                <div className="p-3 rounded-lg bg-[#181a24] border border-[#272938] text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Connection Status:</span>
                    <span className={formSettings.supabaseUrl && formSettings.supabaseAnonKey ? 'text-emerald-400 font-bold' : 'text-neutral-400'}>
                      {formSettings.supabaseUrl && formSettings.supabaseAnonKey ? 'Configured' : 'Hybrid Local Storage (Active)'}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white">
                      Supabase SQL Migration Code:
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
                        setCopiedSql(true);
                        setTimeout(() => setCopiedSql(false), 2000);
                      }}
                      className="text-xs text-[#d4af37] hover:underline"
                    >
                      {copiedSql ? 'Copied to Clipboard!' : 'Copy SQL'}
                    </button>
                  </div>
                  <pre className="p-3 bg-[#0a0b0f] border border-[#20222d] rounded-lg text-[10px] text-neutral-300 font-mono h-40 overflow-y-auto leading-relaxed">
                    {SUPABASE_SQL_SCHEMA}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* PRODUCT MODAL (ADD / EDIT) */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-3xl bg-[#111218] border border-[#262835] rounded-2xl shadow-2xl p-6 sm:p-8 text-white my-8">
            <button
              onClick={() => setIsProductModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-[#1a1b24]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6 pb-4 border-b border-[#22242e]">
              <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
                CATALOGUE MANAGEMENT
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-white mt-1">
                {editingProductId ? 'Edit Unstitched Suit' : 'Add New Unstitched Suit Fabric'}
              </h2>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    placeholder="e.g. Royal Giza Pure Cotton (Pristine White)"
                    className="w-full bg-[#181922] border border-[#2b2d3c] rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Category *
                  </label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value)}
                    className="w-full bg-[#181922] border border-[#2b2d3c] rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price System (Strictly between Rs. 1,500 – Rs. 5,000) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[#171822] border border-[#282a38]">
                <div>
                  <label className="text-xs font-bold text-[#d4af37] block mb-1">
                    Selling Price in PKR * (Rs. 1,500 – 5,000)
                  </label>
                  <input
                    type="number"
                    required
                    min={1500}
                    max={5000}
                    value={prodPrice}
                    onChange={(e) => setProdPrice(Number(e.target.value))}
                    className="w-full bg-[#111218] border border-[#2b2d3c] rounded-lg px-3.5 py-2 text-sm font-bold text-white tabular-nums"
                  />
                  <span className="text-[10px] text-neutral-400 mt-1 block">
                    All AL HAFIZ CLOTHS suits are strictly priced within Rs. 1,500 - 5,000.
                  </span>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Original Price (Optional strikethrough)
                  </label>
                  <input
                    type="number"
                    value={prodOriginalPrice}
                    onChange={(e) => setProdOriginalPrice(Number(e.target.value))}
                    className="w-full bg-[#111218] border border-[#2b2d3c] rounded-lg px-3.5 py-2 text-sm text-neutral-400 tabular-nums"
                  />
                </div>
              </div>

              {/* Fabric Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Fabric Type
                  </label>
                  <input
                    type="text"
                    value={prodFabricType}
                    onChange={(e) => setProdFabricType(e.target.value)}
                    placeholder="e.g. 100% Giza Pure Cotton"
                    className="w-full bg-[#181922] border border-[#2b2d3c] rounded-lg px-3.5 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Cutting Length
                  </label>
                  <input
                    type="text"
                    value={prodCutting}
                    onChange={(e) => setProdCutting(e.target.value)}
                    placeholder="4.25 Gaz (4.0m) Unstitched"
                    className="w-full bg-[#181922] border border-[#2b2d3c] rounded-lg px-3.5 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Quality Badge
                  </label>
                  <select
                    value={prodBadge}
                    onChange={(e) => setProdBadge(e.target.value as Product['badge'])}
                    className="w-full bg-[#181922] border border-[#2b2d3c] rounded-lg px-3.5 py-2 text-xs text-white"
                  >
                    <option value="Premium Quality">Premium Quality</option>
                    <option value="Best Fabric">Best Fabric</option>
                    <option value="Color Guaranteed">Color Guaranteed</option>
                    <option value="Premium Collection">Premium Collection</option>
                    <option value="Capry Guarantee">Capry Guarantee</option>
                    <option value="New Arrival">New Arrival</option>
                    <option value="Best Seller">Best Seller</option>
                  </select>
                </div>
              </div>

              {/* Capry Guarantee Toggle & Custom Description */}
              <div className="p-4 rounded-xl bg-[#161822] border border-[#282a38] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
                    <span className="text-xs font-bold text-white">
                      Include Capry Guarantee
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={prodCapryGuarantee}
                    onChange={(e) => setProdCapryGuarantee(e.target.checked)}
                    className="w-4 h-4 accent-[#d4af37] rounded"
                  />
                </div>
                {prodCapryGuarantee && (
                  <input
                    type="text"
                    value={prodCapryGuaranteeText}
                    onChange={(e) => setProdCapryGuaranteeText(e.target.value)}
                    placeholder="Capry Guarantee terms..."
                    className="w-full bg-[#101116] border border-[#2a2c3a] rounded-lg px-3 py-1.5 text-xs text-neutral-300"
                  />
                )}
              </div>

              {/* Computer Image Uploader */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white uppercase tracking-wider">
                    Product Images ({prodImages.length})
                  </label>
                  <label className="text-xs text-[#d4af37] hover:underline cursor-pointer flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload from Computer</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleComputerImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {prodImages.map((img, idx) => (
                    <div
                      key={idx}
                      className={`relative aspect-square rounded-lg overflow-hidden border ${
                        prodThumbnail === img ? 'ring-2 ring-[#d4af37] border-white' : 'border-[#292b38]'
                      }`}
                    >
                      <img
                        src={img}
                        alt="Product preview"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = prodImages.filter((_, i) => i !== idx);
                          setProdImages(updated);
                          if (prodThumbnail === img && updated.length > 0) {
                            setProdThumbnail(updated[0]);
                          }
                        }}
                        className="absolute top-1 right-1 p-1 bg-black/70 hover:bg-red-600 rounded text-white"
                        title="Delete image"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setProdThumbnail(img)}
                        className={`absolute bottom-0 inset-x-0 text-[9px] py-0.5 text-center font-bold ${
                          prodThumbnail === img ? 'bg-[#d4af37] text-black' : 'bg-black/80 text-white'
                        }`}
                      >
                        {prodThumbnail === img ? 'Thumbnail' : 'Make Thumb'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Color Management */}
              <div className="space-y-2 pt-2 border-t border-[#22242e]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-xs font-bold text-white uppercase tracking-wider block">
                    Available Shades ({prodColors.length})
                  </label>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setProdColors([...washingWearColors])}
                      className="text-[10px] bg-[#1a1b24] text-[#d4af37] px-2 py-0.5 rounded border border-[#2d3040] hover:bg-[#252734]"
                    >
                      Load 14 Washing Wear
                    </button>
                    <button
                      type="button"
                      onClick={() => setProdColors([...mixCottonColors])}
                      className="text-[10px] bg-[#1a1b24] text-[#d4af37] px-2 py-0.5 rounded border border-[#2d3040] hover:bg-[#252734]"
                    >
                      Load 15 Mix Cotton
                    </button>
                    <button
                      type="button"
                      onClick={() => setProdColors([...pureCottonColors])}
                      className="text-[10px] bg-[#1a1b24] text-[#d4af37] px-2 py-0.5 rounded border border-[#2d3040] hover:bg-[#252734]"
                    >
                      Load 16 Pure Cotton
                    </button>
                    <button
                      type="button"
                      onClick={() => setProdColors([...masterSuitColors])}
                      className="text-[10px] bg-[#d4af37]/15 text-[#d4af37] px-2 py-0.5 rounded border border-[#d4af37]/30 hover:bg-[#d4af37]/30 font-semibold"
                    >
                      All 25 Colors
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 max-h-36 overflow-y-auto p-1 bg-[#14151c] rounded-lg border border-[#232532]">
                  {prodColors.map((c, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1c1d28] border border-[#2d3040] text-xs"
                    >
                      <span className="w-3 h-3 rounded-full border border-white/30" style={{ backgroundColor: c.hex }} />
                      <span className="text-[11px] text-white">{c.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveColor(i)}
                        className="text-neutral-500 hover:text-red-400 ml-1"
                        title="Remove shade"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    value={newColorName}
                    onChange={(e) => setNewColorName(e.target.value)}
                    placeholder="New Shade Name (e.g. Royal Navy)"
                    className="bg-[#181922] border border-[#2b2d3c] rounded-lg px-3 py-1.5 text-xs text-white flex-1"
                  />
                  <input
                    type="color"
                    value={newColorHex}
                    onChange={(e) => setNewColorHex(e.target.value)}
                    className="w-8 h-8 rounded border border-[#2b2d3c] bg-transparent cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={handleAddColor}
                    className="px-3 py-1.5 bg-[#252734] hover:bg-[#323546] text-white text-xs font-semibold rounded-lg"
                  >
                    Add Shade
                  </button>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Product Description
                </label>
                <textarea
                  rows={3}
                  value={prodDescription}
                  onChange={(e) => setProdDescription(e.target.value)}
                  className="w-full bg-[#181922] border border-[#2b2d3c] rounded-lg px-3.5 py-2 text-xs text-white"
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodInStock}
                    onChange={(e) => setProdInStock(e.target.checked)}
                    className="w-4 h-4 accent-[#d4af37]"
                  />
                  <span>In Stock</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodIsFeatured}
                    onChange={(e) => setProdIsFeatured(e.target.checked)}
                    className="w-4 h-4 accent-[#d4af37]"
                  />
                  <span>Featured Product</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodIsBestSeller}
                    onChange={(e) => setProdIsBestSeller(e.target.checked)}
                    className="w-4 h-4 accent-[#d4af37]"
                  />
                  <span>Best Seller</span>
                </label>
              </div>

              <div className="pt-4 border-t border-[#22242e] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2.5 rounded-lg bg-[#181922] text-neutral-400 hover:text-white text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-[#d4af37] text-black font-bold text-xs hover:bg-[#e4c04e] shadow-lg cursor-pointer"
                >
                  Save & Publish Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CATEGORY MODAL */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-[#111218] border border-[#262835] rounded-2xl shadow-2xl p-6 text-white my-8">
            <button
              onClick={() => setIsCategoryModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold font-display text-white mb-4">
              {editingCategoryId ? 'Edit Category' : 'Create New Collection'}
            </h2>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="e.g. Winter Boski Suiting"
                  className="w-full bg-[#181922] border border-[#2b2d3c] rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  URL Slug (Optional)
                </label>
                <input
                  type="text"
                  value={catSlug}
                  onChange={(e) => setCatSlug(e.target.value)}
                  placeholder="winter-boski-suiting"
                  className="w-full bg-[#181922] border border-[#2b2d3c] rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  className="w-full bg-[#181922] border border-[#2b2d3c] rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Category Image
                </label>
                <label className="inline-flex items-center gap-2 px-3 py-2 bg-[#1b1d28] border border-[#2f3242] rounded-lg text-xs cursor-pointer text-[#d4af37]">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Image from Computer</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      if (e.target.files?.[0]) {
                        const url = await uploadImageFile(e.target.files[0]);
                        setCatImage(url);
                      }
                    }}
                    className="hidden"
                  />
                </label>
                {catImage && (
                  <div className="mt-2 w-20 h-20 rounded-lg overflow-hidden border border-[#2c2f40]">
                    <img src={catImage} alt="Category preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-[#20222d] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 bg-[#171822] text-xs text-neutral-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#d4af37] text-black font-bold text-xs rounded hover:bg-[#e4c04e]"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Category, CartItem, Order, StoreSettings, OrderItem } from '../types';
import { initialProducts, initialCategories, initialSettings } from '../data/initialData';

interface StoreContextType {
  products: Product[];
  categories: Category[];
  orders: Order[];
  cart: CartItem[];
  settings: StoreSettings;
  isCartOpen: boolean;
  isAdminAuthenticated: boolean;
  activeView: string;
  selectedProductId: string | null;
  selectedCategorySlug: string | null;
  searchQuery: string;
  
  // Navigation & View Actions
  setActiveView: (view: string) => void;
  openProductDetails: (productId: string) => void;
  openCategoryView: (slug: string) => void;
  setSearchQuery: (query: string) => void;
  setIsCartOpen: (open: boolean) => void;

  // Cart Operations
  addToCart: (product: Product, selectedColor: string, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;

  // WhatsApp Direct Order Generator
  generateWhatsAppLink: (details: {
    customerName?: string;
    productName: string;
    productPrice: number;
    productColor?: string;
    quantity: number;
    address?: string;
    city?: string;
    totalAmount?: number;
  }) => string;
  orderViaWhatsApp: (details: {
    customerName?: string;
    productName: string;
    productPrice: number;
    productColor?: string;
    quantity: number;
    address?: string;
    city?: string;
    totalAmount?: number;
  }) => void;

  // Order Submission
  createOrder: (orderData: {
    customerName: string;
    whatsappNumber: string;
    city: string;
    address: string;
    notes?: string;
    items: OrderItem[];
    subtotal: number;
    deliveryFee: number;
    totalAmount: number;
    orderChannel: 'WhatsApp' | 'Website COD';
  }) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;

  // Admin Management Actions
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => Category;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;
  uploadImageFile: (file: File) => Promise<string>;
  resetToDefaults: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'alhafiz_products_v3',
  CATEGORIES: 'alhafiz_categories_v3',
  ORDERS: 'alhafiz_orders_v1',
  CART: 'alhafiz_cart_v1',
  SETTINGS: 'alhafiz_settings_v3',
  ADMIN_AUTH: 'alhafiz_admin_auth_v1',
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load persistent products with robust defensive normalization
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((p) => ({
            ...p,
            colors: Array.isArray(p.colors) && p.colors.length > 0 ? p.colors : [],
            images: Array.isArray(p.images) && p.images.length > 0
              ? p.images
              : [p.thumbnail || '/src/assets/images/fabric_washing_wear_1794488410986.jpg'],
            thumbnail: p.thumbnail || (Array.isArray(p.images) && p.images[0]) || '/src/assets/images/fabric_washing_wear_1794488410986.jpg',
            price: typeof p.price === 'number' && !isNaN(p.price) ? p.price : 2500,
            cutting: p.cutting || '4.25 Gaz (4.0m) Unstitched',
            category: p.category || 'washing-wear',
          }));
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved products:', e);
    }
    return initialProducts;
  });

  // Load persistent categories
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse saved categories:', e);
    }
    return initialCategories;
  });

  // Load persistent orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse saved orders:', e);
    }
    return [];
  });

  // Cart with defensive validation
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((item) => item && item.product && item.product.id).map((item) => ({
            ...item,
            quantity: typeof item.quantity === 'number' && item.quantity > 0 ? item.quantity : 1,
            selectedColor: item.selectedColor || 'Default',
            product: {
              ...item.product,
              price: typeof item.product.price === 'number' ? item.product.price : 2500,
              thumbnail: item.product.thumbnail || '/src/assets/images/fabric_washing_wear_1794488410986.jpg',
              images: Array.isArray(item.product.images) && item.product.images.length > 0
                ? item.product.images
                : ['/src/assets/images/fabric_washing_wear_1794488410986.jpg'],
              colors: Array.isArray(item.product.colors) ? item.product.colors : [],
            },
          }));
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved cart:', e);
    }
    return [];
  });

  // Store Settings
  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) return { ...initialSettings, ...JSON.parse(saved) };
    } catch (e) {
      console.warn('Failed to parse saved settings:', e);
    }
    return initialSettings;
  });

  // Admin Auth
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
  });

  // UI Navigation View State
  const [activeView, setActiveView] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Sync to local storage on changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error('LocalStorage write error for products:', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.error('LocalStorage write error for categories:', e);
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error('LocalStorage write error for orders:', e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (e) {
      console.error('LocalStorage write error for cart:', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('LocalStorage write error for settings:', e);
    }
  }, [settings]);

  // Navigation handlers
  const openProductDetails = (productId: string) => {
    setSelectedProductId(productId);
    setActiveView('product-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openCategoryView = (slug: string) => {
    setSelectedCategorySlug(slug);
    setActiveView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart operations
  const addToCart = (product: Product, selectedColor: string, quantity = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item?.product?.id === product?.id && item?.selectedColor === selectedColor
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        return next;
      } else {
        const newItem: CartItem = {
          id: `${product.id}_${selectedColor}_${Date.now()}`,
          product,
          selectedColor,
          quantity,
        };
        return [...prev, newItem];
      }
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((acc, item) => acc + (item?.quantity || 0), 0);
  const cartSubtotal = cart.reduce(
    (acc, item) => acc + ((item?.product?.price || 0) * (item?.quantity || 1)),
    0
  );

  // WhatsApp Order Generator
  const generateWhatsAppLink = ({
    customerName = '',
    productName,
    productPrice,
    productColor = 'Standard Collection Color',
    quantity = 1,
    address = '',
    city = 'Karachi',
    totalAmount,
  }: {
    customerName?: string;
    productName: string;
    productPrice: number;
    productColor?: string;
    quantity: number;
    address?: string;
    city?: string;
    totalAmount?: number;
  }) => {
    const calculatedTotal = totalAmount ?? productPrice * quantity;
    const isKarachi = city.trim().toLowerCase().includes('karachi');
    const deliveryNote = isKarachi ? 'Free Karachi Delivery' : `Standard Delivery: Rs. ${settings.standardDeliveryFee}`;

    const message = `السلام علیکم! Assalam-o-Alaikum AL HAFIZ CLOTHS,

I would like to place an order for:

📋 *Order Details:*
• *Product Name:* ${productName}
• *Selected Color:* ${productColor}
• *Quantity:* ${quantity} Unstitched Suit(s)
• *Price per Suit:* Rs. ${productPrice.toLocaleString()}
• *Total Amount:* Rs. ${calculatedTotal.toLocaleString()} (${deliveryNote})

📍 *Customer Details:*
• *Customer Name:* ${customerName || '(Please confirm)'}
• *Delivery City:* ${city}
• *Complete Address:* ${address || '(Will provide)'}

Please confirm order availability and dispatch schedule. Thank you!`;

    const encoded = encodeURIComponent(message);
    return `https://wa.me/${settings.whatsappNumber}?text=${encoded}`;
  };

  const orderViaWhatsApp = (details: {
    customerName?: string;
    productName: string;
    productPrice: number;
    productColor?: string;
    quantity: number;
    address?: string;
    city?: string;
    totalAmount?: number;
  }) => {
    const link = generateWhatsAppLink(details);
    window.open(link, '_blank');
  };

  // Order creation
  const createOrder = (orderData: {
    customerName: string;
    whatsappNumber: string;
    city: string;
    address: string;
    notes?: string;
    items: OrderItem[];
    subtotal: number;
    deliveryFee: number;
    totalAmount: number;
    orderChannel: 'WhatsApp' | 'Website COD';
  }): Order => {
    const newOrder: Order = {
      id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      ...orderData,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  // Admin Actions
  const loginAdmin = (password: string) => {
    // Default master access password
    if (password === 'alhafiz786' || password === 'admin123' || password === 'hafiz') {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
  };

  const addProduct = (newProductData: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...newProductData,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const addCategory = (categoryData: Omit<Category, 'id'>) => {
    const newCat: Category = {
      ...categoryData,
      id: `cat-${Date.now()}`,
    };
    setCategories((prev) => [...prev, newCat]);
    return newCat;
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  // Upload image from computer: converts file to permanent base64 data URI and saves
  const uploadImageFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to read image file'));
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const resetToDefaults = () => {
    setProducts(initialProducts);
    setCategories(initialCategories);
    setSettings(initialSettings);
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        orders,
        cart,
        settings,
        isCartOpen,
        isAdminAuthenticated,
        activeView,
        selectedProductId,
        selectedCategorySlug,
        searchQuery,
        setActiveView,
        openProductDetails,
        openCategoryView,
        setSearchQuery,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        generateWhatsAppLink,
        orderViaWhatsApp,
        createOrder,
        updateOrderStatus,
        loginAdmin,
        logoutAdmin,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        updateSettings,
        uploadImageFile,
        resetToDefaults,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

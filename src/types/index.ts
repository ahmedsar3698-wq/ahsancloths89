export interface ProductColor {
  name: string;
  hex: string;
  inStock: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  originalPrice?: number;
  description: string;
  fabricType: string;
  cutting: string; // e.g. "4.25 Gaz (4.0m) Unstitched"
  season: 'All Seasons' | 'Summer' | 'Mid-Season' | 'Winter Festive';
  badge: 'Premium Quality' | 'Best Fabric' | 'Color Guaranteed' | 'Premium Collection' | 'Capry Guarantee' | 'New Arrival' | 'Best Seller';
  capryGuarantee: boolean;
  capryGuaranteeText: string;
  colors: ProductColor[];
  images: string[];
  thumbnail: string;
  inStock: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  rating: number;
  reviewsCount: number;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  featured?: boolean;
}

export interface CartItem {
  id: string;
  product: Product;
  selectedColor: string;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  color: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  image: string;
}

export interface Order {
  id: string;
  customerName: string;
  whatsappNumber: string;
  city: string;
  address: string;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  orderChannel: 'WhatsApp' | 'Website COD';
  createdAt: string;
}

export interface StoreSettings {
  brandName: string;
  tagline: string;
  whatsappNumber: string;
  whatsappDisplay: string;
  deliveryFreeCity: string;
  standardDeliveryFee: number;
  capryGuaranteeGlobalText: string;
  announcementText: string;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
}

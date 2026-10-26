export type Language = 'th' | 'en';

export type UserRole = 'customer' | 'admin' | 'staff' | 'guest';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  savedAddresses?: Address[];
  createdAt: string;
}

export interface Address {
  id: string;
  title: string;
  street: string;
  district: string;
  province: string;
  postalCode: string;
  instructions?: string;
  isDefault?: boolean;
}

export type CategoryId = 
  | 'all'
  | 'signature'
  | 'chicken'
  | 'plant-based'
  | 'sides'
  | 'drinks'
  | 'combos'
  | 'desserts';

export interface Category {
  id: CategoryId;
  nameTh: string;
  nameEn: string;
  displayOrder: number;
  isActive: boolean;
  iconName?: string;
}

export interface CustomizationOptionItem {
  id: string;
  nameTh: string;
  nameEn: string;
  price: number; // in Baht
  isDefault?: boolean;
}

export interface CustomizationGroup {
  id: string;
  titleTh: string;
  titleEn: string;
  required: boolean;
  type: 'radio' | 'checkbox';
  minSelections?: number;
  maxSelections?: number;
  options: CustomizationOptionItem[];
}

export interface Product {
  id: string;
  nameTh: string;
  nameEn: string;
  descriptionTh: string;
  descriptionEn: string;
  categoryId: CategoryId;
  basePrice: number;
  imageUrl: string;
  isAvailable: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNew?: boolean;
  isLimitedEdition?: boolean;
  isPlantBased?: boolean;
  stockQuantity: number;
  lowStockThreshold: number;
  customizationGroups?: CustomizationGroup[];
  createdAt: string;
  updatedAt: string;
}

export interface SelectedCustomization {
  groupId: string;
  groupTitle: string;
  selectedOptionIds: string[];
  selectedOptionNames: string[];
  extraCost: number;
}

export interface CartItem {
  cartItemId: string; // unique hash based on product + selections
  product: Product;
  quantity: number;
  unitPrice: number; // basePrice + extraCost
  totalPrice: number;
  selectedCustomizations: SelectedCustomization[];
  specialInstructions?: string;
}

export type FulfillmentMethod = 'pickup' | 'delivery';

export type PaymentMethod = 'promptpay' | 'cash_on_pickup' | 'cash_on_delivery';

export type PaymentStatus = 'pending' | 'paid' | 'refunded';

export type OrderStatus = 
  | 'received'
  | 'confirmed'
  | 'preparing'
  | 'ready_for_pickup'
  | 'out_for_delivery'
  | 'completed'
  | 'cancelled';

export interface OrderItemRecord {
  productId: string;
  nameTh: string;
  nameEn: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  customizationSummary: string[];
  specialInstructions?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  items: OrderItemRecord[];
  fulfillmentMethod: FulfillmentMethod;
  deliveryAddress?: {
    street: string;
    district: string;
    province: string;
    postalCode: string;
    instructions?: string;
  };
  pickupTime?: string;
  subtotal: number;
  discount: number;
  appliedPromoCode?: string;
  deliveryFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }[];
  specialInstructions?: string;
  estimatedPreparationMinutes: number;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Promotion {
  id: string;
  code: string;
  descriptionTh: string;
  descriptionEn: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number; // e.g. 10 for 10% or 50 for ฿50
  minimumSpend: number;
  maximumDiscount?: number;
  startAt: string;
  expiresAt: string;
  isActive: boolean;
  eligibleCategories?: CategoryId[];
  usageCount: number;
  usageLimit?: number;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  openingHoursTh: string;
  openingHoursEn: string;
  isOpen: boolean;
  pickupEnabled: boolean;
  deliveryEnabled: boolean;
  deliveryFee: number;
  minimumOrder: number;
  estimatedPreparationMinutes: number;
  acceptedPaymentMethods: PaymentMethod[];
  announcementTh: string;
  announcementEn: string;
  socialInstagram: string;
  socialFacebook: string;
  socialTiktok: string;
}

export interface Review {
  id: string;
  customerName: string;
  rating: number; // 1-5
  commentTh: string;
  commentEn: string;
  productId?: string;
  productName?: string;
  createdAt: string;
  isDemo: boolean;
  avatarUrl?: string;
}

export interface InventoryTransaction {
  id: string;
  productId: string;
  productName: string;
  changeAmount: number;
  reason: string;
  previousStock: number;
  newStock: number;
  createdAt: string;
  createdBy: string;
}

export interface AppNotification {
  id: string;
  titleTh: string;
  titleEn: string;
  messageTh: string;
  messageEn: string;
  type: 'order' | 'promo' | 'system';
  link?: string;
  isRead: boolean;
  createdAt: string;
}

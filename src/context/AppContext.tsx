import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  Language,
  User,
  Product,
  CartItem,
  SelectedCustomization,
  Promotion,
  StoreSettings,
  AppNotification,
  OrderItemRecord
} from '../types';
import { translations, getTranslation } from '../i18n/translations';
import { dataService } from '../services/dataService';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.th;
  currentUser: User;
  switchUser: (user: User) => void;
  
  // Navigation / Routing
  currentPath: string;
  navigate: (path: string) => void;
  routeParams: Record<string, string>;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity: number, customizations: SelectedCustomization[], specialInstructions?: string) => void;
  updateCartItemQuantity: (cartItemId: string, newQty: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  cartItemCount: number;
  cartSubtotal: number;
  cartDiscount: number;
  cartTotal: number;
  appliedPromo: Promotion | null;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;

  // Customization modal
  customizingProduct: Product | null;
  openProductCustomizer: (product: Product) => void;
  closeProductCustomizer: () => void;

  // Store Settings
  storeSettings: StoreSettings;
  reloadStoreSettings: () => void;

  // Notifications & Toasts
  notifications: AppNotification[];
  unreadNotificationCount: number;
  markNotificationsAsRead: () => void;
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  // Role Switcher Modal
  isRoleModalOpen: boolean;
  setIsRoleModalOpen: (open: boolean) => void;

  // Reorder helper
  reorderItems: (items: OrderItemRecord[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'nnb_cart_items_v1';
const PROMO_STORAGE_KEY = 'nnb_applied_promo_v1';
const LANG_STORAGE_KEY = 'nnb_lang_v1';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 1. Language
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    return saved === 'en' ? 'en' : 'th';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LANG_STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  };

  const t = useMemo(() => getTranslation(language), [language]);

  // 2. Current User
  const [currentUser, setCurrentUser] = useState<User>(() => dataService.getCurrentUser());

  const switchUser = (user: User) => {
    dataService.setCurrentUser(user);
    setCurrentUser(user);
    showToast(`${language === 'th' ? 'สลับบทบาทเป็น' : 'Switched role to'}: ${user.name}`, 'info');
  };

  // 3. Routing / Navigation
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      return path && path !== '' ? path : '/';
    }
    return '/';
  });

  const navigate = (path: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
    }
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Compute Route Params e.g. /track-order/:orderId or /menu/:productId
  const routeParams = useMemo(() => {
    const params: Record<string, string> = {};
    const pathParts = currentPath.split('/').filter(Boolean);
    if (pathParts[0] === 'order-confirmation' && pathParts[1]) {
      params.orderId = pathParts[1];
    } else if (pathParts[0] === 'track-order' && pathParts[1]) {
      params.orderId = pathParts[1];
    } else if (pathParts[0] === 'menu' && pathParts[1]) {
      params.productId = pathParts[1];
    }
    return params;
  }, [currentPath]);

  // 4. Store Settings
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => dataService.getStoreSettings());

  const reloadStoreSettings = () => {
    setStoreSettings(dataService.getStoreSettings());
  };

  // 5. Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [appliedPromo, setAppliedPromo] = useState<Promotion | null>(() => {
    try {
      const raw = localStorage.getItem(PROMO_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (appliedPromo) {
      localStorage.setItem(PROMO_STORAGE_KEY, JSON.stringify(appliedPromo));
    } else {
      localStorage.removeItem(PROMO_STORAGE_KEY);
    }
  }, [appliedPromo]);

  // Compute Cart Calculations
  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.totalPrice, 0);
  }, [cart]);

  const cartItemCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const cartDiscount = useMemo(() => {
    if (!appliedPromo) return 0;
    if (cartSubtotal < appliedPromo.minimumSpend) return 0;
    if (appliedPromo.discountType === 'percentage') {
      const val = (cartSubtotal * appliedPromo.discountValue) / 100;
      return appliedPromo.maximumDiscount ? Math.min(val, appliedPromo.maximumDiscount) : val;
    }
    return Math.min(appliedPromo.discountValue, cartSubtotal);
  }, [appliedPromo, cartSubtotal]);

  const cartTotal = useMemo(() => {
    return Math.max(0, cartSubtotal - cartDiscount);
  }, [cartSubtotal, cartDiscount]);

  // Hash generator for identical cart items
  const generateCartItemId = (productId: string, customizations: SelectedCustomization[], instructions?: string) => {
    const custKey = customizations
      .map(c => `${c.groupId}:${c.selectedOptionIds.sort().join(',')}`)
      .sort()
      .join('|');
    return `${productId}_${custKey}_${(instructions || '').trim().toLowerCase()}`;
  };

  const addToCart = (
    product: Product,
    quantity: number,
    customizations: SelectedCustomization[],
    specialInstructions?: string
  ) => {
    const extraCost = customizations.reduce((sum, c) => sum + c.extraCost, 0);
    const unitPrice = product.basePrice + extraCost;
    const cartItemId = generateCartItemId(product.id, customizations, specialInstructions);

    setCart(prev => {
      const existingIdx = prev.findIndex(item => item.cartItemId === cartItemId);
      if (existingIdx >= 0) {
        const next = [...prev];
        const newQty = next[existingIdx].quantity + quantity;
        next[existingIdx] = {
          ...next[existingIdx],
          quantity: newQty,
          totalPrice: unitPrice * newQty,
        };
        return next;
      } else {
        const newItem: CartItem = {
          cartItemId,
          product,
          quantity,
          unitPrice,
          totalPrice: unitPrice * quantity,
          selectedCustomizations: customizations,
          specialInstructions: specialInstructions?.trim() || undefined,
        };
        return [...prev, newItem];
      }
    });

    const prodName = language === 'th' ? product.nameTh : product.nameEn;
    showToast(t.productModal.addedSuccess.replace('{name}', prodName), 'success');
  };

  const updateCartItemQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev =>
      prev.map(item => {
        if (item.cartItemId === cartItemId) {
          return {
            ...item,
            quantity: newQty,
            totalPrice: item.unitPrice * newQty,
          };
        }
        return item;
      })
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
    showToast(language === 'th' ? 'ลบสินค้าออกจากตะกร้าแล้ว' : 'Removed item from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
    setAppliedPromo(null);
  };

  const applyPromoCode = (code: string): { success: boolean; message: string } => {
    const res = dataService.validatePromoCode(code, cartSubtotal);
    if (res.valid && res.promo) {
      setAppliedPromo(res.promo);
      showToast(t.cart.appliedCode, 'success');
      return { success: true, message: t.cart.appliedCode };
    } else {
      const msg = res.errorMsg || t.cart.invalidCode;
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    showToast(language === 'th' ? 'ยกเลิกโค้ดส่วนลดแล้ว' : 'Removed promo code', 'info');
  };

  // Reorder action
  const reorderItems = (items: OrderItemRecord[]) => {
    const allProducts = dataService.getProducts();
    let countAdded = 0;

    items.forEach(item => {
      const prod = allProducts.find(p => p.id === item.productId);
      if (prod && prod.isAvailable) {
        addToCart(prod, item.quantity, [], item.specialInstructions);
        countAdded++;
      }
    });

    if (countAdded > 0) {
      showToast(language === 'th' ? `เพิ่ม ${countAdded} เมนูลงในตะกร้าแล้ว` : `Added ${countAdded} items to cart`, 'success');
      setIsCartDrawerOpen(true);
    } else {
      showToast(language === 'th' ? 'สินค้าเดิมอาจหมดหรือไม่พร้อมจำหน่าย' : 'Items from this order are currently unavailable', 'error');
    }
  };

  // 6. Customization Modal
  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(null);

  const openProductCustomizer = (product: Product) => {
    setCustomizingProduct(product);
  };

  const closeProductCustomizer = () => {
    setCustomizingProduct(null);
  };

  // 7. Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // 8. Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>(() => dataService.getNotifications());

  const unreadNotificationCount = useMemo(() => {
    return notifications.filter(n => !n.isRead).length;
  }, [notifications]);

  const markNotificationsAsRead = () => {
    dataService.markAllNotificationsRead();
    setNotifications(dataService.getNotifications());
  };

  // 9. Role Modal
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  // Sync dataService changes
  useEffect(() => {
    const handleDataChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ key: string }>;
      const key = customEvent.detail?.key;
      if (key === 'orders' || key === 'all' || key === 'notifications') {
        setNotifications(dataService.getNotifications());
      }
      if (key === 'storeSettings' || key === 'all') {
        reloadStoreSettings();
      }
      if (key === 'currentUser' || key === 'all') {
        setCurrentUser(dataService.getCurrentUser());
      }
    };
    window.addEventListener('nnb_data_change', handleDataChange);
    return () => window.removeEventListener('nnb_data_change', handleDataChange);
  }, []);

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        currentUser,
        switchUser,
        currentPath,
        navigate,
        routeParams,
        cart,
        addToCart,
        updateCartItemQuantity,
        removeFromCart,
        clearCart,
        cartItemCount,
        cartSubtotal,
        cartDiscount,
        cartTotal,
        appliedPromo,
        applyPromoCode,
        removePromoCode,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        customizingProduct,
        openProductCustomizer,
        closeProductCustomizer,
        storeSettings,
        reloadStoreSettings,
        notifications,
        unreadNotificationCount,
        markNotificationsAsRead,
        toasts,
        showToast,
        removeToast,
        isRoleModalOpen,
        setIsRoleModalOpen,
        reorderItems,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

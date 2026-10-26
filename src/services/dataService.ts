import {
  Product,
  Category,
  Order,
  Promotion,
  StoreSettings,
  Review,
  InventoryTransaction,
  User,
  AppNotification
} from '../types';

const STORAGE_KEYS = {
  PRODUCTS: 'nnb_products_v1',
  CATEGORIES: 'nnb_categories_v1',
  ORDERS: 'nnb_orders_v1',
  PROMOTIONS: 'nnb_promotions_v1',
  STORE_SETTINGS: 'nnb_store_settings_v1',
  REVIEWS: 'nnb_reviews_v1',
  INVENTORY_LOGS: 'nnb_inventory_v1',
  USERS: 'nnb_users_v1',
  CURRENT_USER: 'nnb_current_user_v1',
  NOTIFICATIONS: 'nnb_notifications_v1',
};

// High-quality dark editorial Unsplash food photography
const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    nameTh: 'ไนท์ ไรเดอร์ (NIGHT RIDER)',
    nameEn: 'NIGHT RIDER BURGER',
    descriptionTh: 'ดับเบิ้ลเนื้อวัวสแมชฉ่ำ ๆ 2 ชิ้น เชดด้าชีสเยิ้ม หัวหอมผัดคาราเมลไลซ์ แตงกวาดองกรอบ และซอสสูตรลับไนท์ซิกเนเจอร์',
    descriptionEn: 'Double smashed beef patties, gooey melted cheddar, sweet caramelized onions, crunchy pickles, and our signature secret night sauce.',
    categoryId: 'signature',
    basePrice: 229,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80',
    isAvailable: true,
    isFeatured: true,
    isBestSeller: true,
    stockQuantity: 45,
    lowStockThreshold: 10,
    customizationGroups: [
      {
        id: 'patty',
        titleTh: 'เลือกจำนวนแพตตี้เนื้อ',
        titleEn: 'Patty Options',
        required: true,
        type: 'radio',
        options: [
          { id: 'patty-double', nameTh: 'ดับเบิ้ลเนื้อ 2 ชิ้น (สูตรต้นตำรับ)', nameEn: 'Double Beef Patties (Standard)', price: 0, isDefault: true },
          { id: 'patty-triple', nameTh: 'ทริปเปิ้ลเนื้อ 3 ชิ้น (จุใจ)', nameEn: 'Triple Patties (+฿60)', price: 60 },
          { id: 'patty-wagyu', nameTh: 'อัปเกรดเนื้อวากิวดับเบิ้ล', nameEn: 'Upgrade to Wagyu Blend (+฿80)', price: 80 },
        ]
      },
      {
        id: 'cheese',
        titleTh: 'ชีส',
        titleEn: 'Cheese Options',
        required: false,
        type: 'radio',
        options: [
          { id: 'cheese-std', nameTh: 'เชดด้าชีสคู่ (มาตรฐาน)', nameEn: 'Double Cheddar (Standard)', price: 0, isDefault: true },
          { id: 'cheese-extra', nameTh: 'เพิ่มเอ็กซ์ตร้าชีสเยิ้ม ๆ', nameEn: 'Extra Melted Cheddar (+฿25)', price: 25 },
          { id: 'cheese-swiss', nameTh: 'สวิสชีสหอมมัน', nameEn: 'Swiss Cheese (+฿30)', price: 30 },
          { id: 'cheese-none', nameTh: 'ไม่ใส่ชีส', nameEn: 'No Cheese', price: 0 },
        ]
      },
      {
        id: 'extras',
        titleTh: 'ท็อปปิ้งเสริมความสะใจ',
        titleEn: 'Add-on Toppings',
        required: false,
        type: 'checkbox',
        maxSelections: 4,
        options: [
          { id: 'ext-bacon', nameTh: 'เบคอนทอดกรอบสูตรเด็ด', nameEn: 'Crispy Smoked Bacon (+฿35)', price: 35 },
          { id: 'ext-egg', nameTh: 'ไข่ดาวเยิ้ม ๆ', nameEn: 'Sunny Fried Egg (+฿20)', price: 20 },
          { id: 'ext-jalapeno', nameTh: 'พริกดองจาลาปิโน่ตัดเลี่ยน', nameEn: 'Pickled Jalapeños (+฿15)', price: 15 },
          { id: 'ext-onions', nameTh: 'หอมทอดกรอบ', nameEn: 'Crispy Fried Onions (+฿15)', price: 15 },
        ]
      },
      {
        id: 'sauce',
        titleTh: 'เลือกระดับซอส',
        titleEn: 'Sauce Preference',
        required: true,
        type: 'radio',
        options: [
          { id: 'sauce-std', nameTh: 'ซิกเนเจอร์ไนท์ซอส (มาตรฐาน)', nameEn: 'Nice Night Secret Sauce (Standard)', price: 0, isDefault: true },
          { id: 'sauce-extra', nameTh: 'ใส่ซอสชุ่มฉ่ำพิเศษ', nameEn: 'Extra Heavy Sauce', price: 0 },
          { id: 'sauce-sriracha', nameTh: 'ศรีราชามาโยเผ็ดจัดจ้าน', nameEn: 'Spicy Sriracha Mayo', price: 0 },
          { id: 'sauce-side', nameTh: 'แยกซอสใส่ถ้วย', nameEn: 'Sauce on the side', price: 0 },
        ]
      }
    ],
    createdAt: '2026-10-01T12:00:00Z',
    updatedAt: '2026-10-25T19:00:00Z',
  },
  {
    id: 'prod-2',
    nameTh: 'กรีน ไลท์ (GREEN LIGHT)',
    nameEn: 'GREEN LIGHT BURGER',
    descriptionTh: 'เนื้อวัวสแมชชิ้นเดี่ยว ผักกาดคอสสดกรอบ หอมใหญ่ย่างหวานหอม เชดด้าชีส และเฮาส์ซอสกลมกล่อม',
    descriptionEn: 'Single smashed beef patty, fresh crispy cos lettuce, sweet grilled onions, melted cheddar cheese, and house savory sauce.',
    categoryId: 'signature',
    basePrice: 169,
    imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80',
    isAvailable: true,
    isFeatured: true,
    isBestSeller: false,
    stockQuantity: 38,
    lowStockThreshold: 10,
    customizationGroups: [
      {
        id: 'patty',
        titleTh: 'เนื้อแพตตี้',
        titleEn: 'Patty Options',
        required: true,
        type: 'radio',
        options: [
          { id: 'patty-single', nameTh: 'เนื้อสแมช 1 ชิ้น (มาตรฐาน)', nameEn: 'Single Beef Patty', price: 0, isDefault: true },
          { id: 'patty-upgrade-double', nameTh: 'เพิ่มเป็นดับเบิ้ลเนื้อ 2 ชิ้น', nameEn: 'Double Patty (+฿55)', price: 55 },
        ]
      },
      {
        id: 'extras',
        titleTh: 'ท็อปปิ้งเพิ่มเติม',
        titleEn: 'Extras',
        required: false,
        type: 'checkbox',
        options: [
          { id: 'ext-bacon', nameTh: 'เบคอนกรอบ', nameEn: 'Crispy Bacon (+฿35)', price: 35 },
          { id: 'ext-cheese', nameTh: 'เพิ่มชีส 1 แผ่น', nameEn: 'Extra Cheese (+฿20)', price: 20 },
        ]
      }
    ],
    createdAt: '2026-10-01T12:00:00Z',
    updatedAt: '2026-10-25T19:00:00Z',
  },
  {
    id: 'prod-3',
    nameTh: 'ดับเบิ้ล ทรับเบิ้ล (DOUBLE TROUBLE)',
    nameEn: 'DOUBLE TROUBLE BURGER',
    descriptionTh: 'ดับเบิ้ลเนื้อวัวสแมช ดับเบิ้ลชีสเยิ้ม ๆ หอมทอดกรุบกรอบ และซอสบาร์บีคิวรมควันเข้มข้นสะใจ',
    descriptionEn: 'Double beef patties, double melted cheddar, mountain of crispy fried onions, and bold smoky hickory BBQ sauce.',
    categoryId: 'signature',
    basePrice: 259,
    imageUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=1200&q=80',
    isAvailable: true,
    isFeatured: true,
    isBestSeller: true,
    stockQuantity: 28,
    lowStockThreshold: 8,
    customizationGroups: [
      {
        id: 'patty',
        titleTh: 'แพตตี้เนื้อ',
        titleEn: 'Patty Choice',
        required: true,
        type: 'radio',
        options: [
          { id: 'patty-std', nameTh: 'ดับเบิ้ลบีฟ (2 ชิ้น)', nameEn: 'Double Beef (Standard)', price: 0, isDefault: true },
          { id: 'patty-beast', nameTh: 'ทริปเปิ้ลบีฟ (3 ชิ้นจัดเต็ม)', nameEn: 'Triple Beef (+฿65)', price: 65 },
        ]
      },
      {
        id: 'extras',
        titleTh: 'ท็อปปิ้งพิเศษ',
        titleEn: 'Extras',
        required: false,
        type: 'checkbox',
        options: [
          { id: 'ext-bacon', nameTh: 'เบคอนกรอบคูณสอง', nameEn: 'Double Bacon (+฿45)', price: 45 },
          { id: 'ext-jalapeno', nameTh: 'พริกดองจาลาปิโน่', nameEn: 'Jalapeños (+฿15)', price: 15 },
        ]
      }
    ],
    createdAt: '2026-10-01T12:00:00Z',
    updatedAt: '2026-10-25T19:00:00Z',
  },
  {
    id: 'prod-4',
    nameTh: 'คริสปี้ อาฟเตอร์ ดาร์ก (CRISPY AFTER DARK)',
    nameEn: 'CRISPY AFTER DARK CHICKEN',
    descriptionTh: 'สะโพกไก่ทอดกรอบนอกฉ่ำใน สลัดโคลสลอว์สดใหม่ แตงกวาดอง และสไปซี่มาโยเผ็ดเปรี้ยวลงตัว',
    descriptionEn: 'Ultra-crispy fried chicken thigh, fresh crunchy cabbage slaw, pickles, and zesty spicy sriracha mayo.',
    categoryId: 'chicken',
    basePrice: 179,
    imageUrl: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=1200&q=80',
    isAvailable: true,
    isFeatured: true,
    isNew: true,
    stockQuantity: 32,
    lowStockThreshold: 10,
    customizationGroups: [
      {
        id: 'spice',
        titleTh: 'ระดับความเผ็ด',
        titleEn: 'Spiciness Level',
        required: true,
        type: 'radio',
        options: [
          { id: 'sp-med', nameTh: 'เผ็ดกำลังดี (Signature Spicy)', nameEn: 'Medium Spicy (Signature)', price: 0, isDefault: true },
          { id: 'sp-mild', nameTh: 'เผ็ดน้อย / มาโยไม่เผ็ด', nameEn: 'Mild (Non-spicy mayo)', price: 0 },
          { id: 'sp-hot', nameTh: 'เผ็ดร้อนสะใจคนนอนดึก', nameEn: 'Ghost Pepper Heat (+฿10)', price: 10 },
        ]
      },
      {
        id: 'cheese',
        titleTh: 'เพิ่มชีส',
        titleEn: 'Add Cheese',
        required: false,
        type: 'radio',
        options: [
          { id: 'ch-none', nameTh: 'ไม่มีชีส', nameEn: 'No Cheese', price: 0, isDefault: true },
          { id: 'ch-cheddar', nameTh: 'เพิ่มเชดด้าชีสแผ่น', nameEn: 'Melted Cheddar (+฿20)', price: 20 },
        ]
      }
    ],
    createdAt: '2026-10-05T12:00:00Z',
    updatedAt: '2026-10-25T19:00:00Z',
  },
  {
    id: 'prod-5',
    nameTh: 'เดอะ เวจจี้ ชิฟต์ (THE VEGGIE SHIFT)',
    nameEn: 'THE VEGGIE SHIFT BURGER',
    descriptionTh: 'แพตตี้จากพืช 100% สไตล์พรีเมียม สลัดผักกาดคอส มะเขือเทศฉ่ำ หอมใหญ่ และซอสสูตรแพลนต์เบส',
    descriptionEn: '100% plant-based grilled patty, crisp lettuce, juicy heirloom tomato, sweet onions, and plant-based umami sauce.',
    categoryId: 'plant-based',
    basePrice: 189,
    imageUrl: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&w=1200&q=80',
    isAvailable: true,
    isFeatured: false,
    isPlantBased: true,
    stockQuantity: 20,
    lowStockThreshold: 5,
    customizationGroups: [
      {
        id: 'bun',
        titleTh: 'ประเภทขนมปัง',
        titleEn: 'Bun Option',
        required: true,
        type: 'radio',
        options: [
          { id: 'bun-vegan', nameTh: 'ขนมปังเบอร์เกอร์วีแกน', nameEn: 'Vegan Brioche Bun', price: 0, isDefault: true },
          { id: 'bun-lettuce', nameTh: 'ห่อผักกาดแก้ว (Lettuce Wrap ไม่ใช้แป้ง)', nameEn: 'Lettuce Wrap (Low-Carb)', price: 0 },
        ]
      },
      {
        id: 'extras',
        titleTh: 'ท็อปปิ้งแพลนต์เบสเสริม',
        titleEn: 'Plant-based Extras',
        required: false,
        type: 'checkbox',
        options: [
          { id: 'ext-vegan-cheese', nameTh: 'เพิ่มชีสถั่วเหลืองแพลนต์เบส', nameEn: 'Plant-based Cheddar (+฿30)', price: 30 },
          { id: 'ext-mushrooms', nameTh: 'เห็ดย่างผัดหอมกรุ่น', nameEn: 'Sautéed Mushrooms (+฿25)', price: 25 },
        ]
      }
    ],
    createdAt: '2026-10-08T12:00:00Z',
    updatedAt: '2026-10-25T19:00:00Z',
  },
  {
    id: 'prod-6',
    nameTh: 'มิดไนท์ ฟรายส์ (MIDNIGHT FRIES)',
    nameEn: 'MIDNIGHT FRIES',
    descriptionTh: 'เฟรนช์ฟรายส์ตัดเส้นหนาพิเศษ ทอดร้อน ๆ กรอบนอกนุ่มใน คลุกเกลือทะเลและผงปรุงรสสูตรลับ',
    descriptionEn: 'Thick-cut skin-on fries, double-fried crispy on the outside, fluffy inside, tossed in sea salt & night blend herbs.',
    categoryId: 'sides',
    basePrice: 79,
    imageUrl: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=1200&q=80',
    isAvailable: true,
    isFeatured: false,
    stockQuantity: 60,
    lowStockThreshold: 15,
    customizationGroups: [
      {
        id: 'seasoning',
        titleTh: 'ผงคลุกปรุงรส',
        titleEn: 'Seasoning Blend',
        required: true,
        type: 'radio',
        options: [
          { id: 'sea-salt', nameTh: 'เกลือทะเลคลาสสิก (Sea Salt)', nameEn: 'Classic Sea Salt', price: 0, isDefault: true },
          { id: 'sea-spicy', nameTh: 'ปาปริก้าสไปซี่พริกคาเยนน์', nameEn: 'Spicy Paprika & Cayenne', price: 0 },
          { id: 'sea-sourcream', nameTh: 'ซาวครีมและหัวหอม', nameEn: 'Sour Cream & Onion', price: 0 },
        ]
      },
      {
        id: 'dip',
        titleTh: 'เลือกดิปปิ้งซอส (+฿15)',
        titleEn: 'Dipping Sauce (+฿15)',
        required: false,
        type: 'checkbox',
        options: [
          { id: 'dip-cheese', nameTh: 'วอร์มชีสซอสเข้มข้น', nameEn: 'Warm Melted Cheese Dip (+฿15)', price: 15 },
          { id: 'dip-truffle', nameTh: 'ทรัฟเฟิลมาโยหอมละมุน', nameEn: 'Truffle Mayo Dip (+฿20)', price: 20 },
        ]
      }
    ],
    createdAt: '2026-10-01T12:00:00Z',
    updatedAt: '2026-10-25T19:00:00Z',
  },
  {
    id: 'prod-7',
    nameTh: 'โหลดเด็ด ไนท์ ฟรายส์ (LOADED NIGHT FRIES)',
    nameEn: 'LOADED NIGHT FRIES',
    descriptionTh: 'เฟรนช์ฟรายส์จัดเต็ม ราดซอสชีสร้อน ๆ อุ่น ๆ โรยด้วยหอมทอดกรุบกรอบ และเบคอนบิตส์',
    descriptionEn: 'Golden fries piled high with warm melted cheese sauce, topped with crispy shallots, smoky bacon crumble, and chives.',
    categoryId: 'sides',
    basePrice: 119,
    imageUrl: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=1200&q=80',
    isAvailable: true,
    isFeatured: true,
    isBestSeller: true,
    stockQuantity: 40,
    lowStockThreshold: 10,
    createdAt: '2026-10-01T12:00:00Z',
    updatedAt: '2026-10-25T19:00:00Z',
  },
  {
    id: 'prod-8',
    nameTh: 'นีออน ริงส์ (NEON RINGS)',
    nameEn: 'NEON ONION RINGS',
    descriptionTh: 'หอมใหญ่ชิ้นโตชุบแป้งเบียร์ทอดกรอบสะท้านฟัน เสิร์ฟพร้อมซอสสไปซี่ดิปปิ้ง',
    descriptionEn: 'Crispy golden batter-fried jumbo onion rings served with our spicy night dip.',
    categoryId: 'sides',
    basePrice: 89,
    imageUrl: 'https://images.unsplash.com/photo-1639024471287-032f66ab7526?auto=format&fit=crop&w=1200&q=80',
    isAvailable: true,
    stockQuantity: 35,
    lowStockThreshold: 10,
    createdAt: '2026-10-01T12:00:00Z',
    updatedAt: '2026-10-25T19:00:00Z',
  },
  {
    id: 'prod-9',
    nameTh: 'อาฟเตอร์ อาวเวอร์ โคล่า (AFTER HOURS COLA)',
    nameEn: 'AFTER HOURS COLA',
    descriptionTh: 'น้ำอัดลมโคล่าเย็นฉ่ำ สดชื่นซ่าสะใจ ดับเลี่ยนมื้อดึกได้ดีเยี่ยม',
    descriptionEn: 'Ice-cold bubbly classic craft cola served in our signature Nice Night chilled cup.',
    categoryId: 'drinks',
    basePrice: 39,
    imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=1200&q=80',
    isAvailable: true,
    stockQuantity: 100,
    lowStockThreshold: 20,
    customizationGroups: [
      {
        id: 'sweetness',
        titleTh: 'ระดับความหวาน / สูตร',
        titleEn: 'Soda Option',
        required: true,
        type: 'radio',
        options: [
          { id: 'cola-std', nameTh: 'คลาสสิกโคล่า ปกติ', nameEn: 'Classic Cola', price: 0, isDefault: true },
          { id: 'cola-zero', nameTh: 'ซีโร่ ชูการ์ (Zero Sugar ไม่มีน้ำตาล)', nameEn: 'Zero Sugar Cola', price: 0 },
        ]
      }
    ],
    createdAt: '2026-10-01T12:00:00Z',
    updatedAt: '2026-10-25T19:00:00Z',
  },
  {
    id: 'prod-10',
    nameTh: 'ไลม์ ครัช (LIME CRUSH)',
    nameEn: 'LIME CRUSH SODA',
    descriptionTh: 'โซดาน้ำมะนาวคั้นสดผสมมินต์ เปรี้ยวอมหวาน สดชื่นตาสว่างสำหรับสายโต้รุ่ง',
    descriptionEn: 'Freshly crushed Persian limes with fizzy soda, cane syrup, and fragrant crushed mint.',
    categoryId: 'drinks',
    basePrice: 59,
    imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1200&q=80',
    isAvailable: true,
    isFeatured: true,
    isNew: true,
    stockQuantity: 50,
    lowStockThreshold: 10,
    createdAt: '2026-10-10T12:00:00Z',
    updatedAt: '2026-10-25T19:00:00Z',
  },
  {
    id: 'prod-11',
    nameTh: 'เดอะ ไนท์ คอมโบ (THE NIGHT COMBO)',
    nameEn: 'THE NIGHT COMBO (BURGER + FRIES + DRINK)',
    descriptionTh: 'เซ็ตจัดเต็มรอบดึก: ซิกเนเจอร์เบอร์เกอร์ + มิดไนท์ฟรายส์กรอบ + เครื่องดื่มโคล่าเย็นฉ่ำ คุ้มสะใจ',
    descriptionEn: 'The full midnight experience: Any signature burger of choice + Midnight Fries + After Hours Cola.',
    categoryId: 'combos',
    basePrice: 299,
    imageUrl: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=1200&q=80',
    isAvailable: true,
    isFeatured: true,
    isBestSeller: true,
    stockQuantity: 30,
    lowStockThreshold: 5,
    customizationGroups: [
      {
        id: 'combo-burger',
        titleTh: 'เลือกเบอร์เกอร์ในเซ็ต',
        titleEn: 'Choose Your Burger',
        required: true,
        type: 'radio',
        options: [
          { id: 'cb-nightrider', nameTh: 'ไนท์ ไรเดอร์ (Night Rider Double)', nameEn: 'Night Rider Double Beef', price: 0, isDefault: true },
          { id: 'cb-crispy', nameTh: 'คริสปี้ อาฟเตอร์ ดาร์ก (ไก่กรอบ)', nameEn: 'Crispy Chicken', price: 0 },
          { id: 'cb-trouble', nameTh: 'ดับเบิ้ล ทรับเบิ้ล (บาร์บีคิวชีสเยิ้ม)', nameEn: 'Double Trouble BBQ (+฿30)', price: 30 },
        ]
      },
      {
        id: 'combo-drink',
        titleTh: 'เลือกเครื่องดื่ม',
        titleEn: 'Choose Your Drink',
        required: true,
        type: 'radio',
        options: [
          { id: 'cd-cola', nameTh: 'อาฟเตอร์ อาวเวอร์ โคล่า', nameEn: 'After Hours Cola', price: 0, isDefault: true },
          { id: 'cd-zero', nameTh: 'โคล่า ซีโร่ ชูการ์', nameEn: 'Cola Zero Sugar', price: 0 },
          { id: 'cd-lime', nameTh: 'ไลม์ ครัช โซดาเปรี้ยวซ่า', nameEn: 'Lime Crush Soda (+฿15)', price: 15 },
        ]
      },
      {
        id: 'combo-fries',
        titleTh: 'อัปเกรดฟรายส์',
        titleEn: 'Fries Upgrade',
        required: false,
        type: 'radio',
        options: [
          { id: 'cf-regular', nameTh: 'มิดไนท์ฟรายส์ปกติ (เกลือทะเล)', nameEn: 'Regular Midnight Fries', price: 0, isDefault: true },
          { id: 'cf-loaded', nameTh: 'อัปเกรดเป็น โหลดเด็ดชีสฟรายส์', nameEn: 'Upgrade to Loaded Cheese Fries (+฿35)', price: 35 },
          { id: 'cf-rings', nameTh: 'เปลี่ยนเป็น นีออนริงส์ (หอมทอด)', nameEn: 'Swap for Neon Onion Rings (+฿15)', price: 15 },
        ]
      }
    ],
    createdAt: '2026-10-01T12:00:00Z',
    updatedAt: '2026-10-25T19:00:00Z',
  },
  {
    id: 'prod-12',
    nameTh: 'ช็อกโก แครช (CHOCO CRASH)',
    nameEn: 'CHOCO CRASH DESSERT',
    descriptionTh: 'บราวนี่ดาร์กช็อกโกแลตฟัดจ์เยิ้ม ๆ เสิร์ฟอุ่น ๆ โรยครัมเบิ้ลโกโก้และซอสช็อกโกแลตเข้มข้น',
    descriptionEn: 'Warm decadent double dark chocolate fudge cake topped with cocoa crunch crumble & warm chocolate drizzle.',
    categoryId: 'desserts',
    basePrice: 69,
    imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1200&q=80',
    isAvailable: true,
    isFeatured: false,
    stockQuantity: 25,
    lowStockThreshold: 5,
    createdAt: '2026-10-01T12:00:00Z',
    updatedAt: '2026-10-25T19:00:00Z',
  }
];

const INITIAL_CATEGORIES: Category[] = [
  { id: 'all', nameTh: 'ทั้งหมด', nameEn: 'All Items', displayOrder: 1, isActive: true },
  { id: 'signature', nameTh: 'ซิกเนเจอร์เบอร์เกอร์', nameEn: 'Signature Burgers', displayOrder: 2, isActive: true },
  { id: 'chicken', nameTh: 'เบอร์เกอร์ไก่กรอบ', nameEn: 'Chicken Burgers', displayOrder: 3, isActive: true },
  { id: 'plant-based', nameTh: 'แพลนต์เบส', nameEn: 'Plant-Based Options', displayOrder: 4, isActive: true },
  { id: 'sides', nameTh: 'ของทานเล่น', nameEn: 'Sides', displayOrder: 5, isActive: true },
  { id: 'drinks', nameTh: 'เครื่องดื่ม', nameEn: 'Drinks', displayOrder: 6, isActive: true },
  { id: 'combos', nameTh: 'เซ็ตสุดคุ้ม', nameEn: 'Combos', displayOrder: 7, isActive: true },
  { id: 'desserts', nameTh: 'ของหวาน', nameEn: 'Desserts', displayOrder: 8, isActive: true },
];

const INITIAL_PROMOTIONS: Promotion[] = [
  {
    id: 'promo-1',
    code: 'NIGHT10',
    descriptionTh: 'ลด 10% สำหรับทุกเมนู เมื่อสั่งซื้อขั้นต่ำ ฿200',
    descriptionEn: '10% off all items on orders over ฿200',
    discountType: 'percentage',
    discountValue: 10,
    minimumSpend: 200,
    maximumDiscount: 100,
    startAt: '2026-10-01T00:00:00Z',
    expiresAt: '2026-12-31T23:59:59Z',
    isActive: true,
    usageCount: 42,
  },
  {
    id: 'promo-2',
    code: 'COMBO50',
    descriptionTh: 'ลดทันที ฿50 เมื่อสั่งซื้อเซ็ตคอมโบหรือยอดรวมขั้นต่ำ ฿300',
    descriptionEn: '฿50 discount on orders over ฿300',
    discountType: 'fixed',
    discountValue: 50,
    minimumSpend: 300,
    startAt: '2026-10-01T00:00:00Z',
    expiresAt: '2026-12-31T23:59:59Z',
    isActive: true,
    usageCount: 29,
  },
  {
    id: 'promo-3',
    code: 'FIRSTBITE',
    descriptionTh: 'ส่วนลดพิเศษ ฿40 ต้อนรับเพื่อนใหม่รอบดึก สั่งขั้นต่ำ ฿150',
    descriptionEn: '฿40 off your late night order, min spend ฿150',
    discountType: 'fixed',
    discountValue: 40,
    minimumSpend: 150,
    startAt: '2026-10-01T00:00:00Z',
    expiresAt: '2026-11-30T23:59:59Z',
    isActive: true,
    usageCount: 15,
  }
];

const INITIAL_STORE_SETTINGS: StoreSettings = {
  storeName: 'NICE NIGHT BURGER',
  tagline: 'BAD DAY? GOOD BURGER. NICE NIGHT.',
  phone: '02-999-8888',
  email: 'hello@nicenightburger.demo',
  address: '789 ซอยทองหล่อ 13 สุขุมวิท 55 แขวงคลองตันเหนือ เขตวัฒนา',
  city: 'กรุงเทพมหานคร 10110',
  openingHoursTh: 'เปิดทุกวัน: 17:00 - 03:00 น.',
  openingHoursEn: 'Every day: 17:00 - 03:00 (Late Night)',
  isOpen: true,
  pickupEnabled: true,
  deliveryEnabled: true,
  deliveryFee: 40,
  minimumOrder: 100,
  estimatedPreparationMinutes: 20,
  acceptedPaymentMethods: ['promptpay', 'cash_on_pickup', 'cash_on_delivery'],
  announcementTh: '⚡ ดีลรอบดึก! ใส่โค้ด NIGHT10 ลดทันที 10% จัดส่งร้อน ๆ ถึงตี 3',
  announcementEn: '⚡ Midnight Deal! Use code NIGHT10 for 10% off. Sizzling hot delivery til 3 AM',
  socialInstagram: '@nicenightburger',
  socialFacebook: 'NiceNightBurgerTH',
  socialTiktok: '@nicenightburger',
};

const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    customerName: 'Ploy S.',
    rating: 5,
    commentTh: 'ไนท์ ไรเดอร์ สแมชเบอร์เกอร์อร่อยที่สุดในทองหล่อ ขอบเนื้อกรอบเกรียม หอมมันชีสเยิ้ม สั่งตอนตี 1 มาส่งร้อน ๆ เลย!',
    commentEn: 'Night Rider smashed burger is simply the best in Thonglor. Crispy lacy edges, super juicy, came blazing hot at 1 AM!',
    productName: 'NIGHT RIDER BURGER',
    createdAt: '2026-10-24T01:45:00Z',
    isDemo: true,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'rev-2',
    customerName: 'Krit W.',
    rating: 5,
    commentTh: 'โหลดเด็ดฟรายส์ชีสคือตายไปเลย ชีสเยิ้มสะใจ หอมทอดกรอบมาก แก้แฮงค์ได้ดีมาก คุ้มราคาครับ',
    commentEn: 'The loaded night fries are insane. Rich cheese sauce and crispy shallots. Best cure after a long night.',
    productName: 'LOADED NIGHT FRIES',
    createdAt: '2026-10-23T23:20:00Z',
    isDemo: true,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'rev-3',
    customerName: 'Arturo M.',
    rating: 5,
    commentTh: 'ไก่ทอด Crispy After Dark กรอบสะท้านฟัน ซอสเผ็ดกำลังดี ชอบคอนเซปต์แบรนด์มาก เท่ โดนใจสายสตรีท',
    commentEn: 'Crispy After Dark chicken is so tender yet mega crispy. Love the streetwear neon vibe and late night service!',
    productName: 'CRISPY AFTER DARK CHICKEN',
    createdAt: '2026-10-22T02:10:00Z',
    isDemo: true,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  }
];

const INITIAL_USERS: User[] = [
  {
    id: 'user-demo-customer',
    name: 'Ploy Sukhumvit (Demo Customer)',
    email: 'ploy.customer@demo.com',
    phone: '0812345678',
    role: 'customer',
    savedAddresses: [
      {
        id: 'addr-1',
        title: 'คอนโดทองหล่อ (Home)',
        street: '88/142 คอนโด The Reserve ทองหล่อ ซอย 2',
        district: 'คลองตันเหนือ, วัฒนา',
        province: 'กรุงเทพมหานคร',
        postalCode: '10110',
        instructions: 'ฝากไว้ที่ล็อบบี้ กดลิฟต์ชั้น 14',
        isDefault: true,
      },
      {
        id: 'addr-2',
        title: 'ออฟฟิศเอกมัย (Office)',
        street: 'อาคาร Park Avenue เอกมัย ซอย 12',
        district: 'พระโขนงเหนือ, วัฒนา',
        province: 'กรุงเทพมหานคร',
        postalCode: '10110',
        instructions: 'โทรแจ้งเมื่อถึงหน้าตึก',
      }
    ],
    createdAt: '2026-10-01T10:00:00Z',
  },
  {
    id: 'user-demo-admin',
    name: 'Chef Mark (Store Manager & Admin)',
    email: 'mark.admin@nicenight.demo',
    phone: '0898889999',
    role: 'admin',
    createdAt: '2026-09-01T10:00:00Z',
  },
  {
    id: 'user-demo-staff',
    name: 'Dew Kitchen (Staff & Expediter)',
    email: 'dew.staff@nicenight.demo',
    phone: '0871112222',
    role: 'staff',
    createdAt: '2026-09-15T10:00:00Z',
  }
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-8491',
    orderNumber: 'NNB-8491',
    customerId: 'user-demo-customer',
    customerName: 'Ploy Sukhumvit',
    customerPhone: '0812345678',
    customerEmail: 'ploy.customer@demo.com',
    items: [
      {
        productId: 'prod-1',
        nameTh: 'ไนท์ ไรเดอร์ (NIGHT RIDER)',
        nameEn: 'NIGHT RIDER BURGER',
        quantity: 1,
        unitPrice: 229,
        totalPrice: 229,
        customizationSummary: ['ดับเบิ้ลเนื้อ 2 ชิ้น', 'เชดด้าชีสคู่', 'ซอสซิกเนเจอร์'],
      },
      {
        productId: 'prod-7',
        nameTh: 'โหลดเด็ด ไนท์ ฟรายส์',
        nameEn: 'LOADED NIGHT FRIES',
        quantity: 1,
        unitPrice: 119,
        totalPrice: 119,
        customizationSummary: ['ราดชีสและหอมทอด'],
      },
      {
        productId: 'prod-9',
        nameTh: 'อาฟเตอร์ อาวเวอร์ โคล่า',
        nameEn: 'AFTER HOURS COLA',
        quantity: 1,
        unitPrice: 39,
        totalPrice: 39,
        customizationSummary: ['ซีโร่ ชูการ์'],
      }
    ],
    fulfillmentMethod: 'delivery',
    deliveryAddress: {
      street: '88/142 คอนโด The Reserve ทองหล่อ ซอย 2',
      district: 'คลองตันเหนือ, วัฒนา',
      province: 'กรุงเทพมหานคร',
      postalCode: '10110',
      instructions: 'ฝากไว้ที่โต๊ะรับของชั้น G',
    },
    subtotal: 387,
    discount: 38.7,
    appliedPromoCode: 'NIGHT10',
    deliveryFee: 40,
    total: 388.3,
    paymentMethod: 'promptpay',
    paymentStatus: 'paid',
    orderStatus: 'preparing',
    statusHistory: [
      { status: 'received', timestamp: '2026-10-25T18:40:00Z', note: 'Customer ordered via web' },
      { status: 'confirmed', timestamp: '2026-10-25T18:42:00Z', note: 'Kitchen accepted' },
      { status: 'preparing', timestamp: '2026-10-25T18:45:00Z', note: 'Patties sizzling on grill' },
    ],
    estimatedPreparationMinutes: 20,
    createdAt: '2026-10-25T18:40:00Z',
    updatedAt: '2026-10-25T18:45:00Z',
  },
  {
    id: 'ord-8490',
    orderNumber: 'NNB-8490',
    customerId: 'cust-anon-1',
    customerName: 'Krit W.',
    customerPhone: '0891234567',
    items: [
      {
        productId: 'prod-11',
        nameTh: 'เดอะ ไนท์ คอมโบ',
        nameEn: 'THE NIGHT COMBO',
        quantity: 1,
        unitPrice: 299,
        totalPrice: 299,
        customizationSummary: ['Night Rider Burger', 'Regular Fries', 'Cola'],
      }
    ],
    fulfillmentMethod: 'pickup',
    pickupTime: '19:00',
    subtotal: 299,
    discount: 50,
    appliedPromoCode: 'COMBO50',
    deliveryFee: 0,
    total: 249,
    paymentMethod: 'cash_on_pickup',
    paymentStatus: 'paid',
    orderStatus: 'completed',
    statusHistory: [
      { status: 'received', timestamp: '2026-10-25T17:30:00Z' },
      { status: 'confirmed', timestamp: '2026-10-25T17:31:00Z' },
      { status: 'preparing', timestamp: '2026-10-25T17:33:00Z' },
      { status: 'ready_for_pickup', timestamp: '2026-10-25T17:50:00Z' },
      { status: 'completed', timestamp: '2026-10-25T18:05:00Z' },
    ],
    estimatedPreparationMinutes: 20,
    createdAt: '2026-10-25T17:30:00Z',
    updatedAt: '2026-10-25T18:05:00Z',
  }
];

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    titleTh: 'ออเดอร์ #NNB-8491 กำลังปรุงในครัว',
    titleEn: 'Order #NNB-8491 is Sizzling',
    messageTh: 'เชฟกำลังสแมชเนื้อบนเตาร้อน ๆ อดใจรอนิดเดียวครับ!',
    messageEn: 'Chef is smashing the patties on the hot grill right now!',
    type: 'order',
    link: '/track-order/ord-8491',
    isRead: false,
    createdAt: '2026-10-25T18:45:00Z',
  },
  {
    id: 'notif-2',
    titleTh: 'ยินดีต้อนรับสู่ Nice Night Burger!',
    titleEn: 'Welcome to Nice Night Burger!',
    messageTh: 'ใช้โค้ด FIRSTBITE รับส่วนลด ฿40 มื้อดึกนี้',
    messageEn: 'Use code FIRSTBITE for ฿40 off your midnight feast',
    type: 'promo',
    link: '/promotions',
    isRead: false,
    createdAt: '2026-10-25T18:00:00Z',
  }
];

class DataService {
  private dispatchChange(key: string) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('nnb_data_change', { detail: { key } }));
    }
  }

  // --- Products ---
  getProducts(): Product[] {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!raw) {
      this.saveProducts(INITIAL_PRODUCTS);
      return INITIAL_PRODUCTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_PRODUCTS;
    }
  }

  getProductById(id: string): Product | undefined {
    return this.getProducts().find(p => p.id === id);
  }

  saveProducts(products: Product[]): void {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    this.dispatchChange('products');
  }

  upsertProduct(product: Product): void {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === product.id);
    if (index >= 0) {
      products[index] = { ...product, updatedAt: new Date().toISOString() };
    } else {
      products.unshift({ ...product, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    this.saveProducts(products);
  }

  deleteProduct(id: string): void {
    const products = this.getProducts().filter(p => p.id !== id);
    this.saveProducts(products);
  }

  // --- Categories ---
  getCategories(): Category[] {
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
      return INITIAL_CATEGORIES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_CATEGORIES;
    }
  }

  // --- Orders ---
  getOrders(): Order[] {
    const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (!raw) {
      this.saveOrders(INITIAL_ORDERS);
      return INITIAL_ORDERS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_ORDERS;
    }
  }

  getOrderById(id: string): Order | undefined {
    return this.getOrders().find(o => o.id === id || o.orderNumber === id);
  }

  saveOrders(orders: Order[]): void {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    this.dispatchChange('orders');
  }

  createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'statusHistory'>): Order {
    const currentOrders = this.getOrders();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `NNB-${randomSuffix}`;
    const id = `ord-${Date.now()}`;
    const now = new Date().toISOString();

    const newOrder: Order = {
      ...orderData,
      id,
      orderNumber,
      createdAt: now,
      updatedAt: now,
      statusHistory: [
        {
          status: 'received',
          timestamp: now,
          note: 'Customer placed order via website (Demo)'
        }
      ]
    };

    // Safely deduct stock for ordered items
    const products = this.getProducts();
    newOrder.items.forEach(item => {
      const prod = products.find(p => p.id === item.productId);
      if (prod && prod.stockQuantity !== undefined) {
        prod.stockQuantity = Math.max(0, prod.stockQuantity - item.quantity);
        if (prod.stockQuantity === 0) {
          prod.isAvailable = false;
        }
      }
    });
    this.saveProducts(products);

    currentOrders.unshift(newOrder);
    this.saveOrders(currentOrders);

    // Create in-app notification
    this.addNotification({
      titleTh: `ออเดอร์ใหม่ #${orderNumber} ถูกสร้างแล้ว`,
      titleEn: `New order #${orderNumber} created`,
      messageTh: `ยอดชำระ ฿${newOrder.total.toLocaleString()} - พร้อมติดตามสถานะครัว`,
      messageEn: `Total ฿${newOrder.total.toLocaleString()} - Ready to track status`,
      type: 'order',
      link: `/track-order/${id}`,
    });

    return newOrder;
  }

  updateOrderStatus(orderId: string, status: Order['orderStatus'], cancellationReason?: string): Order | undefined {
    const orders = this.getOrders();
    const orderIndex = orders.findIndex(o => o.id === orderId || o.orderNumber === orderId);
    if (orderIndex === -1) return undefined;

    const order = orders[orderIndex];
    const now = new Date().toISOString();

    order.orderStatus = status;
    order.updatedAt = now;
    if (cancellationReason) {
      order.cancellationReason = cancellationReason;
    }

    order.statusHistory.push({
      status,
      timestamp: now,
      note: cancellationReason || `Status updated to ${status}`
    });

    if (status === 'completed' && order.paymentMethod !== 'promptpay') {
      order.paymentStatus = 'paid';
    }

    orders[orderIndex] = order;
    this.saveOrders(orders);

    this.addNotification({
      titleTh: `ออเดอร์ #${order.orderNumber}: ${status}`,
      titleEn: `Order #${order.orderNumber}: ${status}`,
      messageTh: `สถานะอัปเดตเป็น: ${status}`,
      messageEn: `Status updated to: ${status}`,
      type: 'order',
      link: `/track-order/${order.id}`,
    });

    return order;
  }

  // --- Promotions ---
  getPromotions(): Promotion[] {
    const raw = localStorage.getItem(STORAGE_KEYS.PROMOTIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PROMOTIONS, JSON.stringify(INITIAL_PROMOTIONS));
      return INITIAL_PROMOTIONS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_PROMOTIONS;
    }
  }

  savePromotions(promotions: Promotion[]): void {
    localStorage.setItem(STORAGE_KEYS.PROMOTIONS, JSON.stringify(promotions));
    this.dispatchChange('promotions');
  }

  validatePromoCode(code: string, subtotal: number): { valid: boolean; discountAmount: number; errorMsg?: string; promo?: Promotion } {
    const cleanCode = code.trim().toUpperCase();
    const promotions = this.getPromotions();
    const promo = promotions.find(p => p.code.toUpperCase() === cleanCode && p.isActive);

    if (!promo) {
      return { valid: false, discountAmount: 0, errorMsg: 'Promo code not found or expired' };
    }

    const now = new Date();
    if (new Date(promo.expiresAt) < now) {
      return { valid: false, discountAmount: 0, errorMsg: 'Promo code has expired' };
    }

    if (subtotal < promo.minimumSpend) {
      return {
        valid: false,
        discountAmount: 0,
        errorMsg: `Minimum spend of ฿${promo.minimumSpend} required`
      };
    }

    let discount = 0;
    if (promo.discountType === 'percentage') {
      discount = (subtotal * promo.discountValue) / 100;
      if (promo.maximumDiscount && discount > promo.maximumDiscount) {
        discount = promo.maximumDiscount;
      }
    } else {
      discount = promo.discountValue;
    }

    return {
      valid: true,
      discountAmount: Math.min(discount, subtotal),
      promo
    };
  }

  // --- Store Settings ---
  getStoreSettings(): StoreSettings {
    const raw = localStorage.getItem(STORAGE_KEYS.STORE_SETTINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.STORE_SETTINGS, JSON.stringify(INITIAL_STORE_SETTINGS));
      return INITIAL_STORE_SETTINGS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_STORE_SETTINGS;
    }
  }

  saveStoreSettings(settings: StoreSettings): void {
    localStorage.setItem(STORAGE_KEYS.STORE_SETTINGS, JSON.stringify(settings));
    this.dispatchChange('storeSettings');
  }

  // --- Reviews ---
  getReviews(): Review[] {
    const raw = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS));
      return INITIAL_REVIEWS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_REVIEWS;
    }
  }

  addReview(review: Omit<Review, 'id' | 'createdAt' | 'isDemo'>): Review {
    const reviews = this.getReviews();
    const newReview: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isDemo: true,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    };
    reviews.unshift(newReview);
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
    this.dispatchChange('reviews');
    return newReview;
  }

  // --- Users & Current Role ---
  getUsers(): User[] {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_USERS;
    }
  }

  getCurrentUser(): User {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!raw) {
      const defaultUser = INITIAL_USERS[0];
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(defaultUser));
      return defaultUser;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_USERS[0];
    }
  }

  setCurrentUser(user: User): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    this.dispatchChange('currentUser');
  }

  // --- Notifications ---
  getNotifications(): AppNotification[] {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
      return INITIAL_NOTIFICATIONS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  }

  addNotification(notif: Omit<AppNotification, 'id' | 'isRead' | 'createdAt'>): void {
    const list = this.getNotifications();
    list.unshift({
      ...notif,
      id: `notif-${Date.now()}`,
      isRead: false,
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
    this.dispatchChange('notifications');
  }

  markAllNotificationsRead(): void {
    const list = this.getNotifications().map(n => ({ ...n, isRead: true }));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
    this.dispatchChange('notifications');
  }

  // --- Demo Reset ---
  resetAllDemoData(): void {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
    localStorage.setItem(STORAGE_KEYS.PROMOTIONS, JSON.stringify(INITIAL_PROMOTIONS));
    localStorage.setItem(STORAGE_KEYS.STORE_SETTINGS, JSON.stringify(INITIAL_STORE_SETTINGS));
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS));
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(INITIAL_USERS[0]));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    this.dispatchChange('all');
  }
}

export const dataService = new DataService();

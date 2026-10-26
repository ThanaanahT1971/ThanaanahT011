# 🍔 NICE NIGHT BURGER

> **“BAD DAY? GOOD BURGER. NICE NIGHT.”**  
> *“เบื่อวันแย่ ๆ ก็ให้เบอร์เกอร์ดี ๆ เยียวยา”*

Official responsive ordering web application and restaurant management system for **Nice Night Burger** — a fictional late-night smashed burger joint located in Thonglor, Sukhumvit 55, Bangkok.

---

## ⚡ Brand & Visual Identity

- **Colors:**
  - Neon Green: `#B7FF00` (accent CTAs, badges, prices)
  - Electric Lime: `#D4FF4F`
  - Midnight Black: `#10110F`
  - Charcoal: `#1C1E19` / `#262922`
  - Off-White: `#F4F4EC`
  - Muted Gray: `#9A9D91`
  - Error Red: `#FF4D4D`
- **Aesthetic:** Gen Z streetwear, underground neon signage, editorial typography (Space Grotesk & Kanit for Thai fallback), subtle stickers, and high-contrast night vibe.

---

## 🌟 Core Features

### 1. Customer Storefront
- **Street Hero:** Bold typography, 3 AM closing badges, large featured burger showcase with price tag.
- **Digital Menu (`/menu`):** 8 categories (Signature Burgers, Chicken, Plant-Based, Sides, Drinks, Combos, Desserts) with live search, sorting (popularity, price, newest), and out-of-stock handling.
- **Product Customization Modal:** Smashed beef patty upgrades (Triple, Wagyu), cheese varieties (Double Cheddar, Swiss), add-on extras (Crispy Smoked Bacon, Sunny Fried Egg, Jalapeños), sauce preferences, and special requests with real-time price calculation.
- **Shopping Cart Drawer (`/cart`):** Add, remove, quantity adjustments, custom option tags, subtotal, delivery fee, and discount calculations.
- **Coupon System (`/promotions`):** Working codes `NIGHT10` (10% off), `COMBO50` (฿50 off combos), `FIRSTBITE` (฿40 off first order).
- **Checkout & Fulfillment (`/checkout`):**
  - **Pickup:** Customer name, 10-digit Thai phone number, pickup time slot, order notes.
  - **Delivery:** Bangkok delivery address, sub-district, district, rider instructions, delivery fee calculation.
  - **Payments:** Interactive **PromptPay QR Code Simulator** (with demo watermark) and Cash on Delivery / Cash on Pickup.
- **Order Tracking (`/track-order/:orderId`):** Real-time 5-stage kitchen progress tracker (*Received ➔ Confirmed ➔ Preparing ➔ Ready/Dispatched ➔ Completed*). Includes an interactive **"Simulate Next Kitchen Step"** tool directly on the tracking view.
- **Customer Account (`/account`):** User profile, saved delivery addresses manager, and order history with **1-Click Reorder**.
- **About (`/about`) & Contact (`/contact`):** Brand manifesto, food standards, Thonglor store map, and interactive contact message form.

### 2. Administrative Command Center (`/admin`)
- **Dashboard Overview:** Real-time KPI cards (Sales today, Orders today, Pending confirmation, In-kitchen queue, Low-stock alerts), Peak late-night hourly chart, and recent orders stream.
- **Order Management (`/admin/orders`):** Filter by status, search by customer/order number, advance kitchen statuses, record payments, and cancel orders with reason dialog.
- **Menu Management (`/admin/menu`):** Full CRUD for products, prices, categories, images, and in-stock toggles.
- **Inventory Management (`/admin/inventory`):** Live stock counts, low-stock threshold alerts, and instant + / - adjustments.
- **Promotion Management (`/admin/promotions`):** Create and toggle coupons, discount percentages, fixed Baht, and minimum spend rules.
- **Store Settings (`/admin/settings`):** Global store open/closed switch, delivery and pickup toggles, delivery fee, average prep time, announcement text, and **"Reset All Demo Data"** factory reset.
- **Customer Reviews (`/admin/reviews`):** Demo customer reviews stream with ratings.

### 3. Demo Role Switcher
Easily switch between identities via the top bar or role modal:
- **Customer:** Ploy Sukhumvit (`user-demo-customer`)
- **Admin / Store Manager:** Chef Mark (`user-demo-admin`)
- **Kitchen Staff:** Dew Kitchen (`user-demo-staff`)
- **Guest Diner:** Quick checkout without an account

---

## 🛠 Tech Stack

- **Framework:** React 19 + TypeScript
- **Bundler:** Vite
- **Styling:** Tailwind CSS v4 with custom neon and charcoal theme tokens
- **Icons:** Lucide React
- **Confetti:** Canvas-Confetti
- **State & Data Layer:** Reactive LocalStorage service with event-driven cross-tab updates (`nnb_data_change`)

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build for production
npm run build

# Run TypeScript linter
npm run lint
```

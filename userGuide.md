# Reblium Studio User Guide

## Website Information

**Purpose:** Create and manage avatar projects with a comprehensive credit-based system for purchasing items and exporting assets.

**Access:** Login required via Manus authentication

---

## Powered by Manus

Reblium Studio is built on cutting-edge web technologies providing a seamless and powerful user experience. The frontend leverages **React 19** with **TypeScript** for type-safe development and **Tailwind CSS 4** for modern styling. The backend is powered by **Express 4** with **tRPC 11** for end-to-end type safety, connected to a **MySQL/TiDB** database via **Drizzle ORM**. Authentication is handled through **Manus OAuth** for secure user management. **Deployment:** Auto-scaling infrastructure with global CDN ensures fast loading times and reliable performance worldwide.

---

## Using Your Website

### Managing Avatar Projects

Navigate to "My Avatars" in the sidebar to view your avatar collection and templates. Your saved projects appear at the top with automatically assigned thumbnails. Hover over any project card to reveal the actions menu (three dots icon) offering Edit/Open, Duplicate, Export, Share, and Delete options. Click "Create new" to start a project—a random template thumbnail is automatically assigned. Below your projects, browse template avatars to quickly start with pre-made designs.

### User Profile Settings

Click your name or profile picture at the bottom of the sidebar to open the dropdown menu. Select "Settings" to access your user profile dialog with three tabs: Profile (update name, email, bio, and view credentials), Security (change password and delete account option), and Support (send support requests to the team).

### Browsing the Store

Visit the "Store" page to purchase items for your avatars. Browse five categories using the tabs: Clothing, Hair, Face, Accessories, and Animations. Each item shows its name, description, and credit price. Click "Buy" to purchase an item using your credit balance. Purchased items are added to your inventory for use in avatar projects.

### Download History

The "History" page displays all your exported avatar assets. Each entry shows the asset name with file format, credit cost, and download date with timestamp. Click "Download" on any item to re-download a previously exported asset at no additional cost.

### Using Credit Packs

Access the "Credits" page to view your current balance and purchase credit packs. Choose from five pack sizes: 10, 50, 100, 500, or 1000 credits. Click "Purchase" on any pack to complete the transaction. Your new balance appears immediately in the header. View complete transaction history below the purchase section showing all credits earned and spent with color-coded amounts. Scroll down to the Invoices section to see your purchase history with payment details and download invoice buttons for each transaction.

---

## Managing Your Website

### Dashboard Overview

The Dashboard panel shows real-time statistics including total projects, credit balance, and published avatars. Monitor user activity and engagement through the analytics section when your site is published.

### Database Management

Access the Database panel to view and manage all data tables including projects, store items, credit transactions, and user purchases. Use the built-in CRUD interface to add, edit, or remove records. Connection details are available in the bottom-left settings with SSL enabled by default.

### Settings Configuration

Open Settings to customize your website. In the General sub-panel, update the website name and logo using VITE_APP_TITLE and VITE_APP_LOGO variables. The Domains section allows you to modify the auto-generated domain prefix or bind custom domains. The Secrets panel lets you view, edit, or delete existing environment variables safely.



### Download History

The "History" page lists all exported assets with format and credit cost. Click "Download" to re-download—the system verifies your credit balance first. If insufficient credits, you'll see a prompt to purchase credit packs. When downloading, select a license type (Personal, Commercial, or Indie Game) matching your intended use. The license is recorded in your License Manager.

### License Management

The "Licenses" page explains three license types: Personal License (hobby use only), Commercial License (VR projects, TV commercials, freelancers with unlimited revenue), and Indie Game License (game studios exceeding $200K annual revenue). Review the Terms & Conditions and EULA links for legal details. Your active licenses appear below, acquired when downloading avatars.

### Branding

The Reblium logo appears in the sidebar header. To update the logo, open Management UI → Settings → General and change the "Website Logo" field to your custom logo URL.



---

## Next Steps

Talk to Manus AI anytime to request changes or add features. Start by creating your first avatar project and exploring the template gallery to see what's possible with Reblium Studio.

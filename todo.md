# Reblium Studio TODO

## Authentication & User Management
- [x] User profile management (view/edit profile)
- [x] Change password functionality
- [x] User credentials display

## Credit System
- [x] Credit balance display in header
- [x] Credit pack purchase system (10, 50, 100, 500, 1000 credits)
- [x] Credit transaction history
- [x] Credit deduction on asset export

## Avatar Project Management
- [x] Projects page with avatar grid view
- [x] Create new avatar project
- [x] Edit/delete avatar projects
- [x] Publish/unpublish avatar status
- [x] Avatar thumbnail display

## Template Gallery
- [x] Template avatars page
- [x] Browse template avatars
- [x] Use template to create new project

## Store System
- [x] Store page with item categories
- [x] Browse clothing items
- [x] Browse hair items
- [x] Browse face items
- [x] Browse accessories items
- [x] Browse animation items
- [x] Purchase items with credits
- [x] Add purchased items to avatar projects

## Download History
- [x] Download history page
- [x] List all exported assets
- [x] Show credit cost per download
- [x] Re-download previous exports

## Invoicing System
- [x] Invoice history page
- [x] Generate invoices for credit purchases
- [x] Download invoice as PDF
- [x] Invoice details (date, amount, payment method)

## License Manager
- [x] License manager page
- [x] View active licenses
- [x] Manage license keys
- [x] License expiration tracking

## UI/UX
- [x] Dark theme implementation matching screenshot
- [x] Sidebar navigation (General, Projects, Store, Templates, History, Credits)
- [x] Top header with logo, credit balance, profile picture
- [x] Responsive grid layout for avatars
- [x] Loading states and error handling
- [x] Toast notifications for user actions

## UI Improvements
- [x] Merge Projects and Templates into single "My Avatars" page
- [x] Display templates below saved projects on same page
- [x] Update sidebar navigation to reflect merged page
- [x] Update routing to remove separate Templates route

## Data & Feature Updates
- [x] Add placeholder download history data with asset names and dates
- [x] Add re-download functionality to History page
- [x] Merge invoice functionality into Credits page
- [x] Add transaction history with dummy data to Credits page
- [x] Add invoice download buttons to Credits page
- [x] Remove separate Invoices page
- [x] Update navigation to remove Invoices menu item

## New Features
- [x] Auto-assign template thumbnails to new avatar projects
- [x] Randomly assign template thumbnails to existing projects
- [x] Update logo to Reblium branding
- [x] Create user profile settings dialog
- [x] Add change username functionality
- [x] Add change password functionality
- [x] Add update bio field
- [x] Add delete account option
- [x] Add support request feature

## License Enhancements
- [x] Add three license types to Licenses page (Personal, Commercial, Indie Game)
- [x] Add license type explanations and usage descriptions
- [x] Add link to Terms & Conditions
- [x] Add link to EULA (End User License Agreement)
- [x] Update license status when user downloads with specific license type

## My Projects Enhancements
- [x] Add hover actions menu to avatar project cards
- [x] Implement Edit/Open action
- [x] Implement Delete action
- [x] Implement Duplicate action
- [x] Implement Export action
- [x] Implement Share action

## History Download Enhancements
- [x] Add credit verification before download
- [x] Show credit top-up prompt if insufficient credits
- [x] Add license selection dialog on download
- [x] Allow user to choose Personal, Commercial, or Indie Game license
- [x] Update license records in database when download completes

## Store UI Enhancements
- [x] Double the size of Store category tabs
- [x] Double the font size of category tab labels (Clothing, Hair, Face, Accessories, Animations)

## Branding Update
- [x] Replace sidebar logo with Reblium logo image

## Login Page Branding
- [x] Copy new logo image to public folder
- [x] Replace login page logo with new image

## Avatar Card Hover Enhancement
- [x] Show actions menu on hover over avatar cards
- [x] Keep three-dot menu button visible at all times

## Store Packs Category
- [x] Add Packs category to Store
- [x] Create Fantasy Pack item
- [x] Create Sci-Fi Pack item
- [x] Create Medieval Pack item
- [x] Create Armor Pack item
- [x] Create Fashion Pack item
- [x] Create Halloween Pack item
- [x] Update Store UI to display Packs tab

## Store Updates
- [x] Remove Halloween Pack from database
- [x] Set Packs as default tab in Store

## Pack Layout Enhancement
- [x] Change pack grid to stacked layout (one per row)
- [x] Make packs wider to use full screen estate
- [x] Increase pack card height for better visibility

## Store Pack Updates
- [x] Remove Medieval Pack from database
- [x] Remove Armor Pack from database
- [x] Move Starters Pack to top of pack list
- [x] Fix thumbnail URLs to match actual image filenames

## Recent Updates
- [x] Remove Fashion Pack from database
- [x] Add What's New banner to General page
- [x] Use Starters Pack image as splash screen in banner
- [x] Rename General to Home in navigation

## Title Update
- [x] Change title from "Reblium Studio Dashboard" to "Reblium Studio 2"

## Tutorials Feature
- [x] Create Tutorials page with video embeds
- [x] Add Tutorials to navigation menu
- [x] Add Tutorials shortcut to Quick Actions on Home page

## Artists Feature
- [x] Create Artists page component
- [x] Feature Andre Ferwerda as resident artist
- [x] Add Artists category to Store navigation
- [x] Add Andre Ferwerda's clothing items to database


## Pricing Model Implementation (Dual-License System)
- [ ] Update database schema for dual-license pricing (Personal €5 / Commercial €20)
- [ ] Create license selection modal component
- [ ] Update Store product cards to show "Choose License" button
- [ ] Create payment confirmation screen
- [ ] Create purchase success screen
- [ ] Add Licenses management page
- [ ] Update export flow to validate licenses
- [ ] Add upgrade option (Personal → Commercial)
- [ ] Create bundle/pack pricing system
- [ ] Add license badge to owned assets


## Pricing Model Update - Convert to Credits
- [x] Update schema: personalPrice and commercialPrice in credits (not Euro cents)
- [x] Update LicenseModal to show credit prices
- [x] Update Store UI to display credit costs
- [x] Update purchase logic to use credits directly

## Clothing Thumbnails
- [x] Generate 11 professional clothing thumbnail images
- [x] Update database with thumbnail URLs for all clothing items


## Hair, Face, Accessories Thumbnails
- [x] Generate Hair thumbnail images
- [x] Generate Face thumbnail images
- [x] Generate Accessories thumbnail images
- [x] Update database with all thumbnail URLs


## Artists Showcase Feature
- [x] Create Artists showcase page with multiple artist profiles
- [x] Add artist detail pages with assets gallery
- [x] Add Artists showcase to navigation menu
- [x] Link artist profiles to their store assets


### Store Cleanup
- [x] Remove Artists section/tab from Store page
- [x] Add Artists link to left sidebar navigation


## Artists Page Fixes
- [x] Add DashboardLayout to Artists page
- [x] Fix Andre Ferwerda image display
- [x] Verify sidebar navigation appears

- [x] Update André Ferwerda profile picture


## Credit Bundle Discounts
- [x] Add 20% discount to 1000 credit bundle
- [x] Add 15% discount to 500 credit bundle
- [x] Add 10% discount to 100 credit bundle
- [x] Display discount pricing in Credits page


## Template Avatar Replacement
- [ ] Crop individual portrait photos from provided tiles
- [ ] Upload cropped photos to S3
- [ ] Update template avatars with new realistic photos


## My Projects Avatar Replacement
- [x] Replace cartoon avatars in My Projects with realistic photos


## Template Avatar Names
- [x] Replace template avatar names with random names


## Avatar Picture Updates
- [x] Replace Marcus and Zara pictures with selected photos


## User Project Avatar Updates
- [x] Replace nn and Danylo project pictures with selected photos


## Thumbnail Display Fix
- [x] Remove black bars from avatar thumbnails by adjusting CSS object-fit and object-position


## Store Button Labels
- [x] Change all "Choose License" buttons to "Buy" in Store page


## Hair Section Store Update
- [x] Replace all Hair section items with 25 new groom asset images


## Face Section Categories
- [x] Add Fantasy and Human subcategories to Face section


## Artists Section Update
- [x] Replace Luna Chen with Kristina Nedeljkovic with new photo and bio


## Software Update Feature
- [x] Add software versions table and tRPC procedures
- [x] Create Updates page with version history and download
- [x] Add Updates menu to navbar with notification badge


## Software Versions
- [x] Add 4 different versions (Beta and Final builds) to database


## Navbar Menu Update
- [x] Remove History menu item and keep Updates


## Login Screen Update
- [x] Add Chinese social login placeholders and Reblium logo


## SDK Tab in Updates
- [x] Add SDKs table and tRPC procedures
- [x] Create SDK tab in Updates page with Unity and Unreal downloads


## Updates Page Styling
- [x] Style Software Updates and SDKs tab titles with larger fonts and baby blue color


## Blender SDK
- [x] Add Blender SDK with Coming Soon label


## Home Page Poll
- [x] Create polls table and tRPC procedures
- [x] Add poll component to Home page with voting functionality


## Poll Multiple Votes
- [x] Allow multiple votes per user in community poll


## SDK Reordering
- [x] Reorder SDKs: Unity first, Unreal second, Blender last


## Store Packs Layout
- [x] Fix Packs thumbnails width to not exceed tab horizontal bar


## Shopping Cart Feature
- [x] Create shopping cart table and tRPC procedures
- [x] Add shopping cart context and hooks for state management
- [x] Update Store page to add items to cart
- [x] Create Shopping Cart page with checkout
- [x] Add cart icon to navbar with badge


## Remove Artists Section
- [x] Remove Artists menu items from navbar
- [x] Remove Artists routes from App.tsx


## Store Category Highlight Color
- [x] Update Store category tab highlight to baby blue


## Updates Page Tab Styling
- [x] Update Updates page tabs to match Store category tab styling


## Store Tab Background Color
- [x] Change Store category tab highlight background from grey to baby blue


## SDK Logos
- [x] Add SDK software logos to Updates page


## Language Support
- [x] Set up i18n infrastructure with language context
- [x] Create translation files for Simplified Chinese and English
- [x] Add language switcher component to navbar/header
- [x] Translate all page content to Chinese
- [x] Translate all UI components to Chinese
- [x] Test language switching functionality
- [x] Verify all translations are complete and accurate


## Fixed USD Pricing System
- [x] Update database schema to store fixed prices ($5 personal, $25 commercial)
- [x] Update tRPC procedures for store items and cart with fixed pricing
- [x] Update Store UI to display prices in USD instead of credits
- [x] Update LicenseModal to show USD prices
- [x] Update Shopping Cart to calculate USD totals
- [x] Update checkout flow to use fixed pricing
- [x] Remove credit-based pricing from all components
- [x] Test purchase flow with fixed pricing


## Product Detail Page
- [x] Update database schema to store poly count and texture specifications
- [x] Add texture types (normalmap, albedo, roughness, etc.) to storeItems
- [x] Add file format information (TGA, PNG, etc.) to storeItems
- [x] Create ProductDetail page component
- [x] Add product detail route to App.tsx
- [x] Add click handler to navigate to product detail page
- [x] Display poly count on product detail page
- [x] Display texture types and specifications
- [x] Display file format information
- [x] Test product detail page navigation and display


## Store and Product Detail Improvements
- [x] Remove View Details button from store product cards
- [x] Make product thumbnail clickable to navigate to product detail
- [x] Add multiple image fields to database schema (image2, image3, image4)
- [x] Create image carousel component for product detail page
- [x] Integrate carousel into product detail page
- [x] Set default poly counts: Clothing 10K-25K, Face 10K, Accessories 5K-10K
- [x] Update database with default poly counts per category
- [x] Test thumbnail click navigation
- [x] Test carousel functionality


## Animation Removal
- [x] Remove hover scale animation from store product cards
- [x] Remove transition animations from carousel images
- [x] Remove color transition effects from product names
- [x] Test animations removed


## Dual Currency and Credits Removal
- [x] Remove Credits section from home page
- [x] Remove Credits navigation menu item
- [x] Update database schema to add CNY pricing fields
- [x] Set default CNY prices (1 USD = 7.2 CNY conversion)
- [x] Update Store page to display dual currency (CNY / USD)
- [x] Update ProductDetail page to show CNY and USD prices
- [x] Update Shopping Cart to display totals in both currencies
- [x] Update checkout flow for fiat currency payments
- [x] Test dual currency display and calculations
- [x] Verify Credits page is no longer accessible


## LicenseModal Price Display Update
- [x] Update LicenseModal to display USD and CNY prices
- [x] Remove credit amounts from license selection cards
- [x] Update button labels to show actual prices
- [x] Test LicenseModal pricing display


## Public Mockup Mode (No Login Required)
- [x] Remove auth guards from all routes
- [x] Update DashboardLayout to work without authentication
- [x] Make user profile optional in header
- [x] Remove or bypass OAuth login flow
- [x] Create mock/demo user for display purposes
- [x] Test all pages accessible without login


## My Collection (User Purchases)
- [x] Create purchases table in database schema
- [x] Add tRPC procedure to fetch user's purchased assets
- [x] Create MyCollection page component
- [x] Add My Collection route to App.tsx
- [x] Add My Collection navigation item to sidebar menu
- [x] Display purchased assets with license type and purchase date
- [x] Add download/access functionality for purchased assets
- [x] Test My Collection page with mock purchases


## Navigation Menu Reordering
- [x] Move My Collection below My Avatars in navigation menu


## Feature Request List
- [x] Create database schema for feature requests and votes
- [x] Add tRPC procedures for creating requests and voting
- [x] Create FeatureRequests page component
- [x] Add FeatureRequests route to App.tsx
- [x] Add Feature Requests navigation item
- [x] Implement request submission form with title, subject, description
- [x] Implement upvote/downvote voting system
- [x] Track votes by IP/session for anonymous users
- [x] Sort requests by vote count
- [x] Test feature requests and voting functionality


## Feature Request Form Updates
- [x] Add user name field to database schema
- [x] Convert subject to category dropdown with predefined options
- [x] Update tRPC procedures to accept user name and category
- [x] Update form UI with user name input and category dropdown
- [x] Update feature request display to show user name and category
- [x] Test updated form with new fields
- [x] Move Feature Requests to bottom of navigation menu


## Feature Request Edit & Delete
- [x] Add userId field to feature requests table
- [x] Add tRPC update procedure for editing requests
- [x] Add tRPC delete procedure for removing requests
- [x] Add edit and delete buttons visible only to creator
- [x] Create edit modal for updating request details
- [x] Implement delete confirmation dialog
- [x] Test edit and delete functionality


## FAQ Section
- [x] Create FAQ page component with developer and artist sections
- [x] Add FAQ route to App.tsx
- [x] Add FAQ navigation item to sidebar
- [x] Write developer FAQ content (SDK, game creation, integration)
- [x] Write character artist FAQ content (asset selling, ecosystem benefits)
- [x] Add translations for FAQ in Chinese and English
- [x] Test FAQ page and verify all content displays correctly


## Remove Licenses Page
- [x] Remove Licenses menu item from navigation
- [x] Remove Licenses route from App.tsx
- [x] Enhance license details in My Collection
- [x] Test My Collection displays license info clearly

## Legal Pages & Artist Feature
- [ ] Create Terms & Conditions page
- [ ] Create Privacy Policy page
- [ ] Create Cookies Policy page
- [ ] Add legal pages to footer navigation
- [ ] Create Become a Resident Artist modal/dialog
- [ ] Add Become a Resident Artist button to Store page
- [ ] Add translations for legal pages and artist feature
- [ ] Test all pages and artist feature functionality

## License Upgrade Feature
- [x] Add license upgrade tRPC procedure
- [x] Create license upgrade modal component
- [x] Integrate license switcher buttons with upgrade flow
- [x] Calculate upgrade price difference ($5 → $25 = $20 difference)
- [x] Display upgrade confirmation with price
- [x] Process upgrade payment and update database
- [x] Test license upgrade from Personal to Commercial

## Restore Missing Store Categories
- [x] Add Packs category items to Store
- [x] Add Faces category items to Store
- [x] Verify all categories display correctly in Store UI
- [x] Test category filtering and navigation

## Content Review & Curation System
- [x] Create Publishing Tool page for artists to submit content
- [x] Create Admin Review Queue page for content curation
- [x] Add database schema for content submissions and reviews
- [x] Implement tRPC procedures for submission and review workflows
- [x] Add Publishing Tool and Review Queue to navbar
- [x] Add routes for Publishing Tool and Review Queue pages
- [x] Test content submission workflow
- [x] Test content review and approval workflow
- [x] Test revision required and rejection workflows

## Kanban-Style Asset Review Board
- [x] Create Kanban board component with drag-and-drop functionality
- [x] Create Kanban review page for organizing assets by status
- [x] Add asset cards with preview and quick action buttons
- [x] Implement status column headers (Pending, Approved, Revision Required, Rejected)
- [x] Test drag-and-drop between columns
- [x] Test asset filtering and search

## Asset Management System
- [x] Create asset management page with table/grid view options
- [x] Add filtering by category, status, artist, and date range
- [x] Implement sorting by name, date, price, and popularity
- [x] Add search functionality for quick asset lookup
- [x] Implement bulk actions (publish, unpublish, feature, archive)
- [x] Create asset details modal with editing capabilities
- [x] Add asset preview and metadata display
- [x] Implement asset organization (tags, collections, categories)
- [x] Test asset management workflows

## Navbar Reorganization
- [x] Move Publishing Tool to bottom section of navbar
- [x] Move Asset Management to bottom section of navbar
- [x] Keep admin tools (Review Queue, Kanban Board) in bottom section
- [x] Test navbar layout with new structure

## Asset Management Kanban View
- [ ] Add view toggle button (Table/Kanban) to Asset Management
- [ ] Implement Kanban board view for assets with status columns
- [ ] Persist view preference in localStorage
- [ ] Test switching between table and Kanban views

## Kanban Board Drag-and-Drop Fix
- [x] Add status update mutation when dragging assets between columns
- [x] Implement optimistic UI updates during drag operations
- [x] Persist status changes to database
- [x] Test drag-and-drop updates across all status columns

## Kanban Board Database Images
- [ ] Update submissions to use store item thumbnailUrl from database
- [ ] Map asset categories to store items for image references
- [ ] Test Kanban board displays correct placeholder images

## Merge Kanban with Asset Management
- [x] Combine Kanban and Asset Management into single unified page
- [x] Add view toggle buttons (Table/Grid/Kanban)
- [x] Share data source between all three views
- [x] Remove separate Kanban Board page from navbar
- [x] Test data consistency across all view modes

## Publishing Tool Layout Reorganization
- [x] Move file upload modules to right sidebar
- [x] Create two-column layout (form on left, uploads on right)
- [x] Improve visual hierarchy and UX
- [x] Test new layout responsiveness

## Publishing Tool Right Sidebar Reorganization
- [x] Move Quality Standards above Files section
- [x] Move Submit button below Recommended Specs
- [x] Remove Files heading
- [x] Test new layout arrangement

## Asset Submission Date Sorting
- [x] Add submissionDate field to asset interface
- [x] Add submissionDate to all mock assets
- [x] Add submission date sorting option to dropdown
- [x] Test sorting by submission date

## Asset Thumbnail Portrait Orientation
- [x] Update Grid view thumbnails to portrait orientation with aspect ratio preservation
- [x] Update Kanban view thumbnails to portrait orientation with aspect ratio preservation
- [x] Reduce bottom margin in Kanban view for better spacing
- [x] Update product detail modal image to portrait orientation
- [x] Test all views display portrait images correctly

## Table View Submission Date Column
- [x] Add submission date column to Asset Management table view
- [x] Display submission date in formatted date string (YYYY-MM-DD)
- [ ] Make submission date column sortable
- [x] Test table view displays submission date correctly

## Kanban Card Button Removal
- [x] Remove View button from Kanban cards
- [x] Remove Review button from Kanban cards
- [x] Reduce card margin/padding to use freed-up space
- [x] Test Kanban view displays cards with improved spacing

## Kanban & View Naming Updates
- [x] Rename Kanban "Revision Required" column to "Review"
- [x] Rename Grid view to "Gallery" view
- [x] Update view toggle buttons to show Table/Gallery/Kanban
- [x] Test all view names display correctly

## Kanban Published Status Column
- [x] Add "published" status to asset status enum
- [x] Create Published column in Kanban board
- [x] Reorder Kanban columns: Pending Review > In Review > Approved > Rejected > Published
- [x] Rename "Review" column to "In Review"
- [x] Add published status badge to assets
- [x] Test drag-and-drop to Published column
- [x] Test all column ordering and visibility

## Kanban Card Comments/Notes Feature
- [x] Add notes field to KanbanCard interface
- [x] Add notes field to mock asset data
- [x] Create modal/dialog for adding/editing notes when card is clicked
- [x] Display notes on card hover with tooltip or overlay
- [x] Store notes in component state
- [x] Test adding notes to cards
- [x] Test notes display on hover
- [x] Test notes persist when switching views

## Remove Review Queue Page
- [x] Delete ReviewQueue.tsx page file
- [x] Remove Review Queue route from App.tsx
- [x] Remove Review Queue navigation link from DashboardLayout sidebar
- [x] Test sidebar and navigation work correctly

## Update Background Colors to Match Grey Theme
- [x] Update Publishing Tool page background from dark blue to grey
- [x] Update Asset Management page background from dark blue to grey
- [x] Verify colors match other pages (Store, MyCollection, etc.)
- [x] Test all pages display consistently with grey theme

## Restrict Asset File Format to FBX Only
- [x] Update file upload input to accept only .fbx files
- [x] Update file validation to reject non-FBX files
- [x] Update UI text to show "FBX only" instead of multiple formats
- [x] Test file upload rejects non-FBX files

## Reorder Sidebar Navigation
- [x] Move Publishing Tool and Asset Management to lower position in sidebar
- [x] Keep top menu items (Home, My Avatars, My Collection, Store, Cart, etc.)
- [x] Move Publishing Tool and Asset Management to bottom menu section
- [x] Test sidebar navigation displays in correct order

## Publishing Tool Upload Modules Enhancement
- [x] Add texture upload module with file input
- [x] Add screenshot upload module with file input
- [x] Reduce size of all upload modules (asset, thumbnail, texture, screenshot)
- [x] Update upload module styling for compact display
- [x] Add file type validation for texture and screenshot uploads
- [x] Test all upload modules display correctly and accept correct file types

## Artists Section & Andre Ferwerda
- [x] Add Artists link to sidebar navigation
- [x] Create/update Artists page with Andre Ferwerda as sole resident artist
- [x] Use Andre's LinkedIn profile image for his artist profile
- [x] Update ArtistDetail page to show only Andre Ferwerda's work
- [x] Update all store items in database to show Andre Ferwerda as artist
- [x] Make artist name visible on store product cards
- [x] Add route for /artists page in App.tsx
- [x] Test all changes display correctly

## Fantasy & Sci-Fi Store Themes
- [x] Extract CyborgandRobotic.zip (Sci-Fi theme assets - 19 images)
- [x] Extract Warrior,knightandsentinel.zip (Fantasy theme assets - 19 images)
- [x] Review and catalog all extracted images
- [x] Upload all 38 images to S3 CDN
- [x] Add Fantasy and Sci-Fi categories to database schema
- [x] Seed store items with uploaded images for both themes
- [x] Update Store UI to include Fantasy and Sci-Fi theme tabs
- [x] Add translations for Fantasy and Sci-Fi (English + Chinese)
- [x] Update store router to include new categories
- [x] Test Fantasy tab displays 19 warrior/knight items
- [x] Test Sci-Fi tab displays 19 cyborg/robotic items

## Set Fantasy as Default Store Tab
- [x] Change default Store tab from current default to Fantasy
- [x] Test Store opens with Fantasy tab selected

## Rename Reblium to Genji
- [x] Find all Reblium references in source files
- [x] Replace all "Reblium" with "Genji" in frontend code
- [x] Replace all "Reblium" with "Genji" in server code
- [x] Update VITE_APP_TITLE to "Genji"
- [x] Test all pages display "Genji" instead of "Reblium"## Remove Community Voting & Add Blog
- [x] Remove community voting from Home page
- [x] Create Blog page with article list
- [x] Add press release as first blog article
- [x] Replace Feature Requests nav with Blog nav
- [x] Test blog page and article view Test Blog page displays press release correctly

## Invert and Replace Logo
- [x] Invert logo colors (black to white)
- [x] Upload inverted logo to S3
- [x] Replace all logo references in DashboardLayout and const.ts
- [x] Test logo displays correctly on dark background

## Home Page Cleanup & Article Integration
- [x] Remove Total Projects and Published stats cards from Home
- [x] Remove Recent Projects section from Home
- [x] Add press release article section to Home page
- [x] Remove Blog from sidebar navigation
- [x] Remove Blog route from App.tsx

## Restore Blog & Home Article Thumbnail
- [x] Restore Blog link in sidebar navigation
- [x] Restore Blog route in App.tsx
- [x] Update Home page: show press release as thumbnail card with description
- [x] Home 'Read more' navigates to Blog page with article expanded
- [x] Update Blog page to support opening with article pre-expanded via URL param

## Rotating Banner Carousel
- [x] Create rotating carousel component for Home page top banner
- [x] Add Store promotion slide (Starters Pack - current banner)
- [x] Add Blog press release slide
- [x] Auto-rotate slides with interval timer
- [x] Add navigation dots/indicators
- [x] Each slide links to its respective page (Store or Blog article)

## My Avatars Cleanup
- [x] Remove Template Avatars placeholder section from My Avatars page

## Press Release Image Update
- [x] Upload Unity logo to S3 and replace press release cover image in Home and Blog

## Chinese Translation
- [x] Review current language system and translation files
- [x] Add Chinese translations for Home page (carousel, quick actions, latest news)
- [x] Add Chinese translations for Blog page (full article content)
- [x] Add Chinese translations for all other pages with hardcoded English text
- [x] Test language switching across all pages
- [x] Fix infinite update loop in Blog article detail view

## Store Clothing Replacement
- [x] Upload 3 Scifi Male images to S3
- [x] Remove all existing clothing items from database
- [x] Add Scifi Male 1 item with 3 carousel images
- [x] Test Store clothing tab shows only Scifi Male 1

## Fantasy Male 1 Store Item
- [x] Upload 3 Fantasy Male 1 images to S3
- [x] Insert Fantasy Male 1 into Store database (clothing category)
- [x] Verify item appears in Store Clothing tab with image carousel

## Female Warrior 1 Store Item
- [x] Upload 3 Female Warrior 1 images to S3
- [x] Insert Female Warrior 1 into Store database (clothing category)
- [x] Verify item appears in Store Clothing tab

## Scifi Female 1 Store Item
- [x] Upload 3 Scifi Female 1 images to S3
- [x] Insert Scifi Female 1 into Store database (clothing category)
- [x] Verify item appears in Store Clothing tab

## Scifi Male 1 Cover Image Fix
- [x] Update thumbnailUrl to use front view image (image(178).png)

## Dark/Light Theme Switcher
- [x] Set default theme to light mode
- [x] Add theme toggle button (Sun/Moon icon) next to language switcher in DashboardLayout
- [x] Ensure light mode CSS variables are properly defined in index.css
- [x] Test theme switching persists across page navigation

## Logo Update
- [x] Upload spiral logo to S3
- [x] Replace logo in expanded sidebar state
- [x] Replace logo in collapsed sidebar state
- [x] Apply CSS invert filter for dark mode

## Landing Page (Pre-login)
- [x] Create Landing.tsx with masonry gallery + minimal icon sidebar + embedded login card
- [x] Use existing store clothing images as gallery content (dynamic via tRPC)
- [x] Minimized icon-only sidebar with logo and nav icons
- [x] Login card floats inside gallery (Google/Microsoft/Apple + existing account login)
- [x] Route unauthenticated users to Landing, authenticated users to Dashboard
- [x] Ensure smooth transition after login redirects to dashboard
- [x] Fix duplicate Sun/Moon import error in DashboardLayout

## Landing Page Sidebar Icons Fix
- [x] Match Landing page sidebar icons exactly to DashboardLayout nav items and icons

## Landing Page Logo Fix
- [x] Use exact same logo CDN URL from DashboardLayout in Landing page sidebar

## Gallery Tile Interactions
- [x] Add zoom-on-hover effect to each gallery tile
- [x] Add click-to-expand (2x size) with smooth transition
- [x] Click again to collapse back to normal size

## Full Simplified Chinese Translation
- [x] Wire t() calls across all pages: MyAvatars, FAQ, Tutorials, ShoppingCart, Updates, NotFound, Artists, ArtistDetail, Credits, History, Invoices, Projects, Templates, Licenses, FeatureRequests, KanbanReview, ProductDetail, Store, MyCollection
- [x] Add all missing English translation keys (common, history, invoices, templates, projects, product, artists, kanban, credits, avatars, store, licenses, collection)
- [x] Add all corresponding Chinese translation keys
- [x] Replace GENJI headline with 亘吉 in Chinese hero section
- [x] Replace all "Genji" brand name occurrences in Chinese translations with 亘吉

## Default Language
- [x] Set Chinese (zh) as the default language at startup in LanguageContext

## Store Item Chinese Translations
- [x] Add nameCn and descriptionCn columns to storeItems schema
- [x] Run DB migration (pnpm db:push)
- [x] Populate Chinese translations for all store items in the database
- [x] Update tRPC store procedures to return nameCn/descriptionCn
- [x] Update Store page to display Chinese names/categories when language is zh
- [x] Update ProductDetail page to display Chinese name/description when language is zh
- [x] Translate category filter tab labels in Store page

## Store Category Label Fix
- [x] Fix category filter tabs to show Chinese labels when language is zh
- [x] Fix item badge on cards to show Chinese category label when language is zh

## Header / Nav Fixes
- [x] Remove "Genji Studio" text from top-left header
- [x] Fix store category filter tabs to show Chinese labels
- [x] Fix store item card badges to show Chinese category labels

## Artists Sidebar Navigation
- [x] Add Artists item to sidebar menu (visible before sign-in)
- [x] Ensure Artists route is registered in App.tsx inside DashboardLayout

## Landing Sidebar Consistency (Pre-login)
- [x] Add "artists" as an ActiveView in Landing.tsx so Artists content renders inside the Landing shell
- [x] Extract Artists page content into a LandingArtistsPanel component
- [x] Remove href navigation for Artists - use panel switching instead

## Artists Page Fixes
- [x] Fix dark gradient card in Artists.tsx to use light theme (bg-card border-border)
- [x] Fix missing translation keys: artists.title, artists.subtitle, artists.collection, artists.collectionDesc in LanguageContext

## Legal Pages Content Update
- [x] Extract and update Terms & Conditions page with content from Terms&condition.docx
- [x] Extract and update Privacy Policy page with content from privacystatement.docx

## Legal Pages Rewrite (Exact Document Content)
- [x] Rewrite TermsAndConditions.tsx using exact bilingual text from the document (no translation)
- [x] Rewrite PrivacyPolicy.tsx using exact bilingual text from the document (English = translation of Chinese source)

## Legal Pages & Footer (from documents)
- [x] Generate PrivacyPolicy.tsx with exact bilingual content from privacystatement.docx
- [x] TermsAndConditions.tsx already generated with exact bilingual content
- [x] Remove Cookie Policy link from footer

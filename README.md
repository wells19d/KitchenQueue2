# KitchenQueue

**KitchenQueue** is a comprehensive mobile application designed for families to share and streamline meal planning, grocery shopping, and kitchen inventory management. The app is built with React Native, leveraging Redux and Redux-Saga for state management, Firebase for authentication and Firestore for real-time database syncing. It uses a custom-built UI library (`KQ-UI`) for performance-focused, brand-consistent components.

---

## Core Features

### MVP Stage 1 (Free Version)

1. **User Management**

   - Firebase Authentication is used to securely manage user sign-up and login.

2. **Profile Management**

   - Users can create and manage their profiles, including personal information and settings.
   - Profiles are an extension of the user and are tied to a shared account.

3. **Account Management**

   - A primary account owner manages the account, which connects to all shared data including Shopping, Cupboard, and Recipes.
   - Each account can support up to 4 users/profiles.
   - Each account is limited to one shared Shopping list/cart, one Cupboard, and one Recipe Box.

4. **Shopping (List / Cart)**

   - A single Shopping (List / Cart) is shared across the account.
   - Users can add, edit, and move items between the List and the Cart.
   - Real-time updates are synced via Firestore across all connected users.
   - A “Checkout” action moves all Cart items into the Cupboard inventory.

5. **Cupboard Inventory Management**
   - A single Cupboard is shared across the account.
   - Users can track inventory across multiple storage types (e.g., pantry, fridge, freezer).
   - Item quantities are updated as users add, consume, or use ingredients via recipes.

---

### MVP Stage 2 (Free Version)

1. **Recipe Box**

   - Users can create and manage their own recipes.
   - Recipes check against the Cupboard to flag missing ingredients.
   - Missing items can be added directly to the Shopping list.
   - When a recipe is marked as "made," it deducts used ingredients from the Cupboard.

2. **Favorite Items**

   - Users can create and store frequently used or purchased items for quick access when building Shopping lists.

3. **Dark Mode (Theme)**
   - Users can select between light, dark, or auto theme.

---

### Future Enhancements (Subscription-Based Features)

1. **UPC Scanning**

   - Scan barcodes to quickly add items to Shopping or Cupboard inventories.

2. **Recipe Searching**

   - Search online recipes and save them to your personal Recipe Box.

3. **Community Recipe Box**

   - Shared recipe library with community-contributed meals.
   - Users can browse, favorite, and add recipes to their box.

4. **Meal Planning**

   - Plan meals by day, week, or month.
   - Automatically generate shopping lists for missing ingredients.

5. **Nutritional Information**
   - Analyze and display nutritional facts for recipes.
   - Help users make informed dietary choices.

---

### Long-Term Vision

1. **Enhanced Inventory Management (AI)**

   - Use the camera and AI to batch-scan and add items to the app.

2. **Advanced Meal Planning and Suggestions (AI)**

   - Suggest meals based on dietary preferences, inventory, and store deals.
   - Minimize food waste and maximize cost efficiency.

3. **Voice Integration**

   - Add items or query the system via Alexa, Google Assistant, or Siri.
   - Hands-free inventory checks and recipe suggestions.

4. **Nutrition Tracking and Health Insights**

   - Sync with wearables and health apps.
   - Provide tailored nutrition advice based on user goals.

5. **Grocery Delivery Integration**

   - Order items directly from Shopping lists via partnered delivery services.
   - Compare prices across stores for savings.

6. **Budget Management**

   - Track spending and generate budget-friendly meal suggestions.
   - Visualize trends and saving opportunities.

7. **Recipe Scaling and Conversion**
   - Adjust recipes for desired servings.
   - Support unit conversions between metric and imperial systems.

---

## Technology Stack

- **React Native**: Cross-platform mobile development.
- **Redux + Redux-Saga**: Scalable state and side-effect management.
- **Firebase**: Authentication and Firestore real-time database.
- **FlashList**: High-performance rendering of dynamic lists.
- **Custom UI Library (KQ-UI)**: Optimized, modular component system for future library extraction.

---

## License

This project's copyright is currently pending.

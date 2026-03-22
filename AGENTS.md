# AI Usage Log — M4: Shopping Cart

## Session: Week 8 Lab (March 21, 2026)

### AGENTS.md Setup
- What: Created and customized `AGENTS.md` in the project root to match my actual Buckeye Marketplace project structure.
- What I changed from the provided template:
  - Updated frontend and backend ports to match my local environment
  - Documented my real folder structure (`src/components`, `src/context`, `src/reducers`, `src/types`)
  - Added current cart state conventions and action names
  - Clarified that my cart UI is implemented as a sidebar
- Result: AI-generated code matched my project structure and import paths more closely.

### Cart Reducer + Types (Part 2)
- Generated with help from: Claude, ChatGPT, GitHub Copilot
- Files involved:
  - `src/types/cart.ts`
  - `src/reducers/cartReducer.ts`
- Review issues I fixed:
  - Matched payload shapes to the `CartAction` discriminated union
  - Verified immutable updates for all reducer cases
  - Ensured `ADD_TO_CART` increments quantity for existing items
  - Ensured `UPDATE_QUANTITY` removes items when quantity is less than 1
- Monday concepts verified:
  - discriminated unions
  - pure reducer design
  - immutable state updates with spread syntax

### Cart Context (Part 3)
- Generated with help from: Claude, ChatGPT, GitHub Copilot
- Files involved:
  - `src/context/CartContext.tsx`
  - `src/main.tsx`
- Modifications I made:
  - Wrapped the app with `CartProvider` in `main.tsx`
  - Added derived values `cartItemCount` and `cartTotal`
  - Kept compatibility with the existing `useCart` import pattern used in the project
- Review issues I fixed:
  - Corrected import/export mismatch between `useCartContext` and `useCart`
  - Verified provider integration so cart state is available across the app

### Cart Components (Part 4)
- Generated with help from: Claude, ChatGPT, GitHub Copilot
- Files involved:
  - `src/components/ProductCard.tsx`
  - `src/components/AddToCartButton.tsx`
  - `src/components/CartSidebar/CartSidebar.tsx`
- What I built:
  - Added an `AddToCartButton` component
  - Added temporary `"Added!"` feedback after clicking
  - Connected cart badge updates in the header
  - Implemented sidebar cart display with quantity controls
  - Implemented remove item and clear cart actions
- Review issues I fixed:
  - Corrected import paths
  - Added `type="button"` on UI buttons where needed
  - Restored CSS styling after splitting out the button into a separate component
  - Replaced repeated cart total calculation with the derived `cartTotal` value from context

### Checkout Form (Part 5)
- Generated with help from: Claude, ChatGPT, GitHub Copilot
- File involved:
  - `src/components/CheckoutForm.tsx`
- What I built:
  - Controlled form inputs for checkout
  - Field validation on blur
  - Touched tracking
  - Submit handling with `preventDefault`
  - Processing state during simulated submission
  - Success message after submission
  - Cart clearing after successful order placement
- Wednesday concepts verified:
  - controlled components
  - onBlur validation
  - touched tracking
  - form submission handling
- Review issues I fixed:
  - Matched `CLEAR_CART` dispatch to reducer action type
  - Confirmed submit flow clears the cart and shows the empty cart state

## What I built today
- Cart item, state, and action types
- Cart reducer with add, remove, update, clear, and toggle actions
- Cart context with derived values
- Add-to-cart button component with feedback state
- Cart badge in the header
- Cart sidebar with quantity controls and item removal
- Checkout form with validation and success flow

## Reflection
AI was helpful for generating the first draft of reducer, context, and form logic, but the output still required review and correction. The most important work I did myself was:
- checking type compatibility
- fixing project-specific import paths
- matching the code to my existing folder structure
- verifying the behavior against class requirements
- testing the full cart flow in the browser
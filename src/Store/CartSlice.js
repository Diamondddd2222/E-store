import { createSlice } from "@reduxjs/toolkit";

// ✅ Helper function to recalculate totals
const recalc = (state) => {
  state.totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
  state.totalAmount = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  state.subTotal = state.totalAmount;
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [], // Array of { id, title, price, image, quantity }
    totalQuantity: 0,
    totalAmount: 0,
    subTotal: 0,
  },

  reducers: {
    setCart(state, action) {
      state.items = action.payload || [];
      recalc(state);
    },

    addToCart: (state, action) => {
      const item = action.payload;
      const existingItem = state.items.find((i) => i.id === item.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...item, quantity: 1 });
      }

      recalc(state);
    },

    removeFromCart: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((i) => i.id !== id);
      recalc(state);
    },

    increaseQuantity: (state, action) => {
      const id = action.payload;
      const existingItem = state.items.find((i) => i.id === id);

      if (existingItem) {
        existingItem.quantity += 1;
        recalc(state);
      }
    },

    decreaseQuantity: (state, action) => {
      const id = action.payload;
      const existingItem = state.items.find((i) => i.id === id);

      if (existingItem) {
        if (existingItem.quantity > 1) {
          existingItem.quantity -= 1;
        } else {
          // Remove item if quantity becomes 0
          state.items = state.items.filter((i) => i.id !== id);
        }
        recalc(state);
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
      state.subTotal = 0;
    },
  },
});

export const {
  setCart,
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;

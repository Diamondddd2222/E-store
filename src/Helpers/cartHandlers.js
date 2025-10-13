// src/helpers/cartHandlers.js
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

/**
 * Save cart state for a specific user (uid).
 * Accepts uid and the full cart state (items, subtotal, totalAmount).
 */
export const saveUserCart = async (uid, cartState) => {
  if (!uid) return;
  // merge: true ensures we don't wipe other fields accidentally
  await setDoc(
    doc(db, "carts", uid),
    {
      items: cartState.items || [],
      subTotal: cartState.subTotal || 0,      // ✅ FIXED
      totalQuantity: cartState.totalQuantity || 0, // ✅ FIXED
      updatedAt: Date.now(),
    },
    { merge: true }
  );
};

/**
 * Load a saved cart for a specific user uid.
 * Returns the saved object { items, subtotal, totalAmount, updatedAt } or null.
 */
export const loadUserCart = async (uid) => {
  if (!uid) return null;
  const docRef = doc(db, "carts", uid);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  return snap.data();
};

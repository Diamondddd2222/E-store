import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const DisplayProducts = () => {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");

  // ✅ Get current user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  // ✅ Fetch user's products
  useEffect(() => {
    const fetchProducts = async () => {
      if (!user) return;
      try {
        const q = query(collection(db, "itemImages"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const productList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productList);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, [user]);

  // ✅ Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await deleteDoc(doc(db, "itemImages", id));
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting:", err);
    }
  };

  // ✅ Start edit
  const handleEdit = (product) => {
    setEditingId(product.id);
    setEditedTitle(product.title);
  };

  // ✅ Save edit
  const handleSaveEdit = async (id) => {
    if (!editedTitle.trim()) return alert("Title required");
    try {
      await updateDoc(doc(db, "itemImages", id), { title: editedTitle });
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, title: editedTitle } : p))
      );
      setEditingId(null);
    } catch (err) {
      console.error("Error updating:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Your Products</h2>

      {products.length === 0 ? (
        <p>No uploads yet.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px",
          }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                borderRadius: "10px",
                textAlign: "center",
                background: "#fff",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              {product.images && product.images[0] && (
                <img
                  src={
                    typeof product.images[0] === "string"
                      ? product.images[0]
                      : product.images[0].imageUrl
                  }
                  alt={product.title}
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              )}

              {editingId === product.id ? (
                <>
                  <input
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    style={{ width: "100%", marginTop: "10px" }}
                  />
                  <button onClick={() => handleSaveEdit(product.id)}>Save</button>
                  <button onClick={() => setEditingId(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <h3>{product.title}</h3>
                  <button onClick={() => handleEdit(product)}>Edit</button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    style={{ backgroundColor: "red", color: "#fff" }}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DisplayProducts;

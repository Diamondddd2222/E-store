import { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./Home/Home";
import "./App.css";
import ProductDetails from "./ProductDetails/ProductDetails";
import ProductCart from "./ProductCart/ProductCart";
import CheckoutPage from "./CheckoutPage/CheckoutPage";
import Signup from "./Signup/Signup";
import Login from "./Login/Login";
import ForgetPassword from "./ForgetPassword/ForgetPassword";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "./Store/UserSlice";
import { clearCart } from "./Store/CartSlice";
import { doc, setDoc, getDoc} from 'firebase/firestore'
import { db } from "./firebase";

function App() {
  console.log("✅ App.jsx loaded");

  const [categories, setCategories] = useState([]);
   const dispatch = useDispatch();

  useEffect(() => {
    console.log("✅ useEffect for onAuthStateChanged mounted");
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
       console.log("Auth listener fired:", firebaseUser);
     if (firebaseUser) {
        try {
          // ✅ Fetch user data from Firestore
          const userRef = doc(db, "users", firebaseUser.uid);
          const userSnap = await getDoc(userRef);
          console.log('users info', userSnap)
          let name = null;
          if (userSnap.exists()) {
            name = userSnap.data().name || null;
          }

          // ✅ Store everything in Redux
          dispatch(
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: name,
            })
          );

          console.log("✅ User set with name:", name);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        dispatch(clearUser());
        dispatch(clearCart());
      }
    });

    return () => unsub();
  }, [dispatch]);

  useEffect(() => {
    fetch("https://fakestoreapi.com/products/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home categories={categories} />} />
      <Route path="/product/:id" element={<ProductDetails/>}/>
      <Route path="/ProductCart" element= {<ProductCart/>}/>
      <Route path="/CheckoutPage" element={<CheckoutPage/>}/>
      <Route path="/Signup" element={<Signup/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/ForgetPassword" element={<ForgetPassword/>}/>
    </Routes>
  );
}

export default App;

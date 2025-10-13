import React, { useRef, useEffect } from 'react'
import { IoSearchSharp } from "react-icons/io5";
import { BsCart4 } from "react-icons/bs";
import { TfiCheckBox } from "react-icons/tfi";
import { FaRegUser } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { setCart, decreaseQuantity, addToCart, removeFromCart } from '../Store/CartSlice';
import { useNavigate } from 'react-router-dom';
import { MdDelete } from "react-icons/md";
import logo from '../asset/logo.png'
import { saveUserCart, loadUserCart } from '../Helpers/cartHandlers';
import './ProductCart.css'

const ProductCart = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const {totalQuantity, items, subTotal} = useSelector((state) => state.cart);
    const user = useSelector((state) => state.user); // { uid, email }
    const timer = useRef(null);

    const goToCheckout =() => {
        navigate('/CheckoutPage')
    }

    useEffect(() => {
        const load = async () => {
          if (!user?.uid) return;
          const data = await loadUserCart(user.uid);
          if (data) {
            dispatch(setCart(data.items || []));
          } else {
            dispatch(setCart([]));
          }
        };
        load();
    }, [user?.uid, dispatch]);

   // Auto-save cart to Firestore (debounced)
useEffect(() => {
  if (!user?.uid) {
    console.warn("No user UID — cart not saved");
    return;
  }

  // ✅ Make sure items is always an array
  const safeItems = Array.isArray(items) ? items : [];

  // Clear any previous timer
  console.log("✅ Attempting to save cart for:", user.uid);
  console.log("🛒 Cart Data:", { items, subTotal, totalQuantity });
  clearTimeout(timer.current);

  timer.current = setTimeout(() => {
    saveUserCart(user.uid, {
      items: safeItems,
      subTotal: subTotal || 0,
      totalQuantity: totalQuantity || 0,
    })
      .then(() => {
        console.log("✅ Cart saved for UID:", user.uid);
      })
      .catch((err) => {
        console.error("❌ Error saving cart:", err);
      });
  }, 700);

  return () => clearTimeout(timer.current);
}, [items, subTotal, totalQuantity, user?.uid]);


    return (
        <>
         <div className="navbar-container">
            <div className="navbar-wrapper">
                <div className="brand-logo">
                <img src={logo} alt="logo" className='logo-image' />
                <h1 className='logo-text'>E-Store</h1>
                </div>

                <div className="input-bar">
                <input className='input-col' type="text" placeholder='Search for products, brands and more...' />
                <div className="icon-search-div">
                    <IoSearchSharp className='search-icon' />
                </div>
                </div>

                <div className="user-col">
                <div className="cart-icon-div" >
                    <BsCart4 className='cart-icon' />
                    <div className="number-items">
                    <p className="number-text">{totalQuantity}</p>
                    </div>
                </div>

                <div className="user-icon-div">
                    <FaRegUser className='user-icon' />
                </div>

                <div className="texts-col">
                    <p className="welcome-text">Welcome!</p>
                    <div className="sign-register">
                    <p className="sign-in">Sign in</p>
                    <p className="register-text">Register</p>
                    </div>
                </div>
                </div>
            </div>
        </div>

        <div className="over-all">
            <div className="cart-items-container">
                <h2 className="cart-items-text">Shopping Cart</h2>
                <div className="cart-items-box">
                    {items.length === 0 ? (
                        <p className="empty-cart-text">Your cart is empty</p>
                    ) : (
                        <div className="orders-conatiner">
                        <table className="cart-table" border="4" cellPadding="0" cellSpacing="0">
                            <thead className='cart-table-head'>
                            <tr>
                                <th>Product</th>
                                <th>Price ($)</th>
                                <th>Quantity</th>
                                <th>Total</th>
                                <th>Actions</th>
                            </tr>
                            </thead>

                            <tbody className='cart-table-body'>
                            {items.map((item) => (
                                <tr key={item.id}>
                                <div className="img-tit">
                                    <img src={item.image} alt={item.title} className='cart-item-image' />
                                    <p className="title">{item.title}</p>
                                </div>

                                <td>${item.price}</td>
                                <td>
                                    <div className="btn-containers">
                                    <button className='minus-btn' onClick={() => dispatch(decreaseQuantity(item.id))}>-</button>
                                    <span style={{ margin: "0 10px" }}>{item.quantity}</span>
                                    <button className='minus-btn' onClick={() => dispatch(addToCart(item))}>+</button>
                                    </div>
                                </td>
                                <td>{(item.price * item.quantity).toFixed(2)}</td>
                                <td>
                                    <MdDelete onClick={() => dispatch(removeFromCart(item.id))} />
                                </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        <div className="order-summary">
                            <p className="order-text">Order Summary</p>
                            <div className="input-voucher-container">
                            <input type="text" placeholder='Dicounter voucher'className='input-discount' />
                            <div className="apply-text">
                                <p className="apply">Apply</p>
                            </div>
                            </div>

                            <div className="sub-total">
                            <p className="sub-total-text">Sub Total</p>
                            <p className="sub-Total-amount">${subTotal || 0}</p>
                            </div>

                            <div className="total">
                            <p className="sub-total-text">Total</p>
                            <p className="sub-Total-amount">${subTotal || 0}</p>
                            </div>

                            <div className="warrantee">
                            <TfiCheckBox className='checked-icon' />
                            <p className="text-warranteee">
                                <strong>90 days Limited Warranty</strong> against <br/>manufacturer's defects
                            </p>
                            </div>

                            <div className="btn-contain-vertual">
                                <div className="checkout-button">
                                <button className="checkout" onClick={ goToCheckout}>Checkout Now</button>
                                </div>
                            </div>
                        </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
        </>
    )
}

export default ProductCart;

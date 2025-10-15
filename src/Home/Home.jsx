import React, { useState, useEffect, useRef } from 'react';
import './Home.css';
import { IoSearchSharp } from "react-icons/io5";
import { BsCart4 } from "react-icons/bs";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { BsGrid3X3Gap } from "react-icons/bs";
import { RxHamburgerMenu } from "react-icons/rx";
import { useNavigate } from 'react-router-dom';
import logo from '../asset/logo.png';
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, fetchProductsByCategory, setCategory } from '../Store/ProductSlice';
import { setCart, decreaseQuantity, addToCart, removeFromCart } from '../Store/CartSlice';
import { saveUserCart, loadUserCart } from '../Helpers/cartHandlers';
import { clearUser } from '../Store/UserSlice';

const Home = ({ categories }) => {
  const [open, setOpen] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalFilters, setTotalFilters] = useState(0);
  const [displayProducts, setDisplayProducts] = useState('products');
  const dispatch = useDispatch();
  const { items, loading, error, currentCategory, allItems } = useSelector((state) => state.products);
  const cartState = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user); // ✅ uid and email live here
    // Add a check to ensure user is not undefined before accessing uid
  if (user) {
    console.log('userId', user.uid);
  } else {
    console.log('User is not defined yet');
  }

  const navigate = useNavigate();
 const {totalQuantity, items: cartItems, subTotal} = useSelector((state) => state.cart);
   
    const timer = useRef(null);

  const [search, setSearch] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);

  const handleChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    const result = (allItems || []).filter((item) =>
      item.title.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredItems(result);
    setDisplayProducts("search");
  };


const handleAddToCart = async (product) => {
  console.log('home-dispatch-product', product)
  dispatch(addToCart(product));

  if (!user?.uid) {
    console.log("❌ No user UID — cart not saved");
    return;
  }

  await saveUserCart(user.uid, {
    items: cartState.items,
    subtotal: cartState.subTotal,
    totalQuantity: cartState.totalQuantity,
  });

  console.log("✅ Cart saved for:", user.uid);
};

const handleLogout = () => {
  dispatch(clearUser())
}

  const shoppingCartPage = () => {
    navigate('/ProductCart');
  };

  const signupPagePage = () => {
    navigate('/Signup');
  };

  const goToDetails = (id) => {
    navigate(`/Product/${id}`);
  };

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    setTotalProducts(allItems?.length);
    setTotalFilters(items?.length);
  }, [allItems, items]);

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
    const safeItems = Array.isArray(cartItems) ? cartItems : [];
  
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
    <div className="home-container">

      <div className="navbar-container">
        <div className="navbar-wrapper">
          <div className="brand-logo">
            <img src={logo} alt="logo" className='logo-image' />
            <h1 className='logo-text'>E-Store</h1>
          </div>

          <div className="input-bar">
            <input
              onChange={handleChange}
              className='input-col'
              type="text"
              placeholder='Search for products, brands and more...'
            />
            <div className="icon-search-div">
              <IoSearchSharp className='search-icon' />
            </div>
          </div>


 {/**start */}
          <div className="user-col">
            <div className="cart-icon-div" onClick={shoppingCartPage}>
              <BsCart4 className='cart-icon' />
              <div className="number-items">
                <p className="number-text">{totalQuantity}</p>
              </div>
            </div>

            <div className="user-icon-div">
              <FaRegUser className='user-icon' />
            </div>

            <div className="texts-col">
              {
                user.uid ? (
                  <div className='logout-container'>
                  <p className="user-email">{user.name}</p>
                  <button className="logout" onClick={handleLogout}>Logout</button>
                  </div>
                ) : (
                  <>
                      <p className="welcome-text">Welcome!</p><div className="sign-register">
                      <p className="sign-in" onClick={signupPagePage}>Sign in</p>
                      <p className="register-text">Register</p>
                    </div>
                    </>
                )
              }
              
            </div>
          </div>
          {/**end */}
        </div>
      </div>

      <div className='category-product-container'>
        <h3 className="category-container-text">Category products</h3>
        <div className="links">
          <ul>
            <li>Home /</li>
            <li>Best Category /</li>
            <li>Great article /</li>
          </ul>
        </div>
      </div>

      <div className="main-product-container">

        <div className="side-product-bar">
          <div className="product-type-container">
            <div className="product-text-div">
              <p className="product-type-text">Product type</p>
              <MdOutlineKeyboardArrowDown
                className='down-arrow-product-type'
                onClick={() => setOpen(!open)}
              />
            </div>

            <div className="type-drop-down">
              <div className={`slide-container ${open ? "open" : ""}`}>
                <div className="search-product-type">
                  <input type="text" placeholder='Search' className="search-product-type-input" />
                  <div className="search-pro-icon">
                    <IoSearchSharp className='search-product-type-icon' />
                  </div>
                </div>

                <div className="cat-div">
                  {categories.map((cat) => (
                    <ul key={cat}>
                      <li
                        className='category-link'
                        value={cat}
                        onClick={() => {
                          dispatch(setCategory(cat));
                          dispatch(fetchProductsByCategory(cat));
                          setDisplayProducts('category');
                        }}
                      >
                        {cat}
                      </li>
                    </ul>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className="products-display-container">
          {loading && <p>Loading products...</p>}

          {displayProducts === "search" ? (
            <div className="products-wrapper">
              <p className="no-of-items">
                {filteredItems.length} results found
              </p>

              {filteredItems.length > 0 ? (
                filteredItems.map((product) => (
                  <div className="single-product" key={product.id}>
                    <div className="first-column">
                      <div className="image-description-col">
                        <div className="image-col">
                          <img src={product.image} alt={product.title} className='product-image' />
                        </div>
                        <div className="description-col">
                          <p className="product-title">{product.title}</p>
                          <p className="rating-no">
                            <strong className='rating'>Ratings:</strong> {product.rating.rate}/10
                          </p>
                          <p className="description">{product.description}</p>
                        </div>
                      </div>
                      <div className="pricing">
                        <p className="product-price">${product.price}</p>
                        <p className="free-shipping-text">Free shipping</p>
                        <div className="buttons">
                          <button className="details-button" onClick={() => goToDetails(product.id)}>Details</button>
                          <button className="add-to-cart-button" onClick={() => handleAddToCart(product)}>Add to cart</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <h2>No results found</h2>
              )}
            </div>
          ) : displayProducts === 'products' ? (
            <div className="products-wrapper">
              <div className="latest-container">
                <p className='no-of-items'>{totalProducts} products found</p>
                <div className="sec">
                  <div className="latest-item-col">
                    <p className="latest-text">Latest items</p>
                    <MdOutlineKeyboardArrowDown className='latest-text-icon' />
                  </div>

                  <div className="col-icons">
                    <div className="hamburger-col">
                      <RxHamburgerMenu className='hamburger-icon' />
                    </div>
                    <div className="grid-col">
                      <BsGrid3X3Gap className='grid-icon' />
                    </div>
                  </div>
                </div>
              </div>

              {(allItems || []).map((product) => (
                <div className="single-product" key={product.id}>
                  <div className="first-column">
                    <div className="image-description-col">
                      <div className="image-col">
                        <img src={product.image} alt={product.title} className='product-image' />
                      </div>
                      <div className="description-col">
                        <p className="product-title">{product.title}</p>
                        <p className="rating-no">
                          <strong className='rating'>Ratings:</strong> {product.rating.rate}/10
                        </p>
                        <p className="description">{product.description}</p>
                      </div>
                    </div>

                    <div className="pricing">
                      <p className="product-price">${product.price}</p>
                      <p className="free-shipping-text">Free shipping</p>
                      <div className="buttons">
                        <button className="details-button" onClick={() => goToDetails(product.id)}>Details</button>
                        <button className="add-to-cart-button" onClick={() => handleAddToCart(product)}>Add to cart</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="products-wrapper">
              <div className="latest-container">
                <p className='no-of-items'>{totalFilters} products found</p>
                <div className="sec">
                  <div className="latest-item-col">
                    <p className="latest-text">Latest items</p>
                    <MdOutlineKeyboardArrowDown className='latest-text-icon' />
                  </div>

                  <div className="col-icons">
                    <div className="hamburger-col">
                      <RxHamburgerMenu className='hamburger-icon' />
                    </div>
                    <div className="grid-col">
                      <BsGrid3X3Gap className='grid-icon' />
                    </div>
                  </div>
                </div>
              </div>

              {(currentCategory ? items : allItems).map((product) => (
                <div className="single-product" key={product.id}>
                  <div className="first-column">
                    <div className="image-description-col">
                      <div className="image-col">
                        <img src={product.image} alt={product.title} className='product-image' />
                      </div>
                      <div className="description-col">
                        <p className="product-title">{product.title}</p>
                        <p className="rating-no">
                          <strong className='rating'>Ratings:</strong> {product.rating.rate}/10
                        </p>
                        <p className="description">{product.description}</p>
                      </div>
                    </div>

                    <div className="pricing">
                      <p className="product-price">${product.price}</p>
                      <p className="free-shipping-text">Free shipping</p>
                      <div className="buttons">
                        <button className="details-button" onClick={() => goToDetails(product.id)}>Details</button>
                        <button className="add-to-cart-button" onClick={() => handleAddToCart(product)}>Add to cart</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Home;

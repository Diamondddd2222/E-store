import React from 'react'
import { IoSearchSharp } from "react-icons/io5";
import { BsCart4 } from "react-icons/bs";
import { FaRegUser } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../Store/CartSlice';
import logo from '../asset/logo.png'
import './ProductDetaills.css'

const ProductDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { allItems } = useSelector((state) => state.products);
    const {totalQuantity} = useSelector((state) => state.cart);
    console.log("All items from store:", allItems);
    const product = allItems.find((item) => item.id === parseInt(id));
    console.log("Product Details:", product);

    const handleAddToCart = (product) => {
        // Dispatch action to add product to cart
        dispatch(addToCart(product))
        console.log('Product added to cart!', product);
         
      };

      const shoppingCartPage = () => {
        navigate('/ProductCart');
      }

  return (
    <div>
          {/* Navbar */}
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
                      <p className="welcome-text">Welcome!</p>
                      <div className="sign-register">
                        <p className="sign-in">Sign in</p>
                        <p className="register-text">Register</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Category Breadcrumb */}
      <div className='category-product-container'>
        <h3 className="category-container-text">Product Details</h3>
        <div className="links">
          <ul>
            <li>Home /</li>
            <li>Best Category /</li>
            <li>Great article /</li>
          </ul>
        </div>
      </div>

      {/* Product Details Section */}
        <div className="product-details-container">
            {product ? (
                <div className="product-details-card">
                    <img src={product.image} alt={product.title} className='product-details-image' />
                    <div className="product-details-info">
                        <h2 className="product-details-title">{product.title}</h2>
                        <p className="product-details-category"><strong>Category:</strong> {product.category}</p>
                        <p className="product-details-price"><strong>Price:</strong> ${product.price}</p>
                        <p className="product-details-rating"><strong>Rating:</strong> {product.rating.rate} ({product.rating.count} reviews)</p>
                        <p className="product-details-description">{product.description}</p>
                         <div className="counter-button">
                          <button className="add-to-cart-details-button" onClick={()=> handleAddToCart(product)} >Add to Cart</button>    
                        </div>
                        <button className="back-button" onClick={() => navigate(-1)}>Back to Products</button>
                       
                    </div>
                </div>
            ) : (
                <p>Loading product details...</p>
            )}
        </div>




    </div>
  )
}

export default ProductDetails

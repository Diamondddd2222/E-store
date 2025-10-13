import React from 'react'
import { IoSearchSharp } from "react-icons/io5";
import { BsCart4 } from "react-icons/bs";
import { TfiCheckBox } from "react-icons/tfi";
import { FaRegUser } from "react-icons/fa";
import { FaCcVisa } from "react-icons/fa";
import { IoCheckmark } from "react-icons/io5";
import { SiVisa } from "react-icons/si";
import { useSelector, useDispatch } from "react-redux";
import { decreaseQuantity, addToCart, removeFromCart } from '../Store/CartSlice';
import { useNavigate } from 'react-router-dom';
import { MdDelete } from "react-icons/md";
import { useState } from 'react';
import logo from '../asset/logo.png'
import './CheckoutPage.css'


const CheckoutPage = () => {
         const navigate = useNavigate()
         const dispatch = useDispatch();
         const {totalQuantity, items, subTotal} = useSelector((state) => state.cart);
         const [activeCard, setActiveCard] = useState ('d-bcards')

         const setToVcards = () => {
            console.log('setting to vcards')
            setActiveCard('vcards')
         }
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

                     <div className="double-sides">
                        <div className="first-one">
                             <div className="payment-container">
                                <h3 className="payment-details-text">Payment Details</h3>
                                <p className="payment-despcription">Complete your purchase by providing your payment details</p>
                             </div>

                             <div className="input-group">
                              <label htmlFor="email" className="input-label">Email Address</label>
                               <input 
                                 type="email" 
                                 id="email" 
                                 name="email" 
                                 className="input-field" 
                                 placeholder="Enter your email"
                                 required 
                                />
                              </div>

                              <div className="cards-payment">
                                <h3 className="select-payment-text">Select Payment Method</h3>
                                <div className="the-cards">
                                <div 
                                className={activeCard === 'd-bcards' ? 'first-card-active' : 'first-card'}
                                onClick={() => setActiveCard('d-bcards')}
                                >                                   
                                <FaCcVisa className='visa-first-icon' />
                                <div className="typings">
                                <p className="type-cards">Debit/Credit Cards</p>
                                <IoCheckmark 
                                className={activeCard === 'd-bcards' ? 'active-style' : 'idle-style'} 
                                />
                               </div>
                            </div>

                            <div 
                             className={activeCard === 'vcards' ? 'second-card-active' : 'second-card'}
                             onClick={setToVcards}
                             >                                   
                             <FaCcVisa className='visa-first-icon' />
                             <div className="typings">
                             <p className="type-cards">Virtual Account</p>
                             <IoCheckmark 
                             className={activeCard === 'vcards' ? 'active-style' : 'idle-style'} 
                             />
                             </div>
                            </div>

                            </div>
                            </div>
                              
                              <div className="card-details-container">
                                <p className="card-details-text">Card Details</p>
                                <input 
                                 type='text'
                                 className="input-field-card" 
                                 placeholder="Enter card details"
                                 required 
                                />
                              </div>

                              <div className="visa-container">
                                <div className="visa-number">
                                   <p className="v-number">8889 2934 4887 9947</p>                    
                                   <SiVisa className='v-icon'/>
                                </div>

                                <div className="two">
                                    <div className="date-con">
                                       <p className="date">03/25</p>
                                    </div>
                                    
                                    <div className="hash-con">
                                        <p className="hash">***</p>
                                    </div>   
                                </div>   
                              </div>

                              <div className="subTotal-container">
                                 <p className="subTotal-text">Subtotal</p>
                                 <p className="subtotal-amount">${subTotal}</p>
                              </div>

                              <div className="total-container">
                                 <p className="subTotal-text">Total</p>
                                 <p className="total-amount">${subTotal}</p>
                              </div>


                              <div className="chk-btn">
                                <button className="btn-payment">Make Payment</button>
                              </div>
                              

                        </div>

                        <div className="second-one">
                             <div className="product-ifo-container">
                                <div className="first-info">
                                  <h3 className="product-infotext">
                                    Product Information & Review
                                  </h3>

                                  <p className="info-desp">
                                    By completing your order, you agree to accept our <a href="">Privacy</a> and <a href="">Policy</a>
                                  </p>
                                </div>

                                <div className="btn-info-q">
                                    <button className="btn-q">{totalQuantity} items</button>
                                </div>
                             </div>

                             
                                {items.slice(0, 2).map((item, index) => (
                                <div key={index} className="item-card">
                                    <div className="first-item-chk">
                                      <img src={item.image} alt={item.title} className='cart-item-image' />
                                      <h3 className='checkout-title'>{item.title}</h3>
                                    </div>

                                    <div className="btn-checkout">
                                        <button className="checking-out">Details</button>
                                    </div>
                                        
                                </div>
                                ))}
                                <div className="line">
                                </div> 
 
                             
                        </div>








                     </div>
         
         </>
                  
                    

  )
}

export default CheckoutPage
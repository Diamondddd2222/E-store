import React from 'react'
import { FaPlus } from "react-icons/fa6";
import './CreateProduct.css'

const CreateProduct = () => {
  return (
    <div className="main-create-container">
        <div className="bounce-container">
           <div className="bounce">E-Store</div>
        </div>
          {/* new section */}
        <div className="create-side">
         <div className="create-side-wrapper">
            <div className="three-identity">
                <p className="cancel-text">Cancel</p>
                <p className="New-advert-text">New Advert</p>
                <p className="clear-text">Clear</p>
            </div>

            {/*Inputs */}
            <div className="inputs-container-wrapper">
               <div className="inputs-containers">
                <input type="text" placeholder='Title*' className='input-title-createpage'/>
              </div>

              <div className="inputs-containers">
                <input type="text" placeholder='Category*' className='input-title-createpage'/>
              </div>
            </div>

            {/*add section */}
            <div className="adding-image">
                <div className="adding-image-icon">
                  <FaPlus className='added-icon' />
                </div>
            </div>
         </div>
        </div>
    </div>
     
  )
}

export default CreateProduct
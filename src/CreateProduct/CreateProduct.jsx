import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { IoIosArrowDown } from "react-icons/io";
import { FaPlus } from "react-icons/fa6";
import NigeriaList from '../NigeriaList/NigeriaList';
import './CreateProduct.css';

const CreateProduct = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [region, setRegion] = useState('');
  const [displayNaijaPage, setDisplayNaijaPage] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [userState, setUserState] = useState('');
  const navigate = useNavigate();

  // ✅ Handle multiple file selections
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      setFiles((prev) => [...prev, ...selectedFiles]);
    }
  };

  // ✅ Handle State selection from NigeriaList
  const handleStateChange = (stateValue) => {
    setUserState(stateValue);
    console.log("User selected:", stateValue);
  };

  // ✅ Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Title is required');
      return;
    }

    if (files.length === 0) {
      alert('At least one image is required');
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      alert('You must be logged in to create a product.');
      return;
    }

    setUploading(true);
    try {
      const uploadedImages = [];

      // ✅ Upload to Cloudinary instead of Firebase Storage
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'e_store_uploads'); // your preset
        formData.append('cloud_name', 'duhfo9iiq'); // your cloud name

        const res = await fetch(`https://api.cloudinary.com/v1_1/duhfo9iiq/image/upload`, {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        console.log('Uploaded:', data);

        if (data.secure_url) {
          uploadedImages.push(data.secure_url);
        }
      }

      // ✅ Save product info + image URLs to Firestore
      await addDoc(collection(db, 'itemImages'), {
        userId: user.uid,
        title,
        category,
        region: userState,
        images: uploadedImages,
        createdAt: serverTimestamp(),
      });

      alert('Product created successfully!');
      setTitle('');
      setCategory('');
      setFiles([]);
      setUserState('');
      navigate('/DisplayProducts');
    } catch (err) {
      console.error('Error uploading:', err);
      alert('Error uploading: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="main-create-container">
      

      <div className="create-side">
        <div className="create-side-wrapper">
          <div className="three-identity">
            <p className="cancel-text">Cancel</p>
            <p className="New-advert-text">New Advert</p>
            <p className="clear-text">Clear</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="inputs-container-wrapper">
              <div className="inputs-containers">
                <input
                  type="text"
                  placeholder="Title*"
                  value={title}
                  className="input-title-createpage"
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="inputs-containers">
                <input
                  type="text"
                  placeholder="Category*"
                  value={category}
                  className="input-title-createpage"
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>

              <div className="inputs-containers">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="input-title-createpage"
                />
              </div>
            </div>

            {/* Image preview */}
            {files && files.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
                {files.map((file, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    style={{
                      width: '100px',
                      height: '100px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      border: '1px solid #ccc',
                    }}
                  />
                ))}
              </div>
            )}

            <div className="adding-image">
              <p className="images-ttext">Images</p>
              <div className="adding-image-icon">
                <FaPlus className="added-icon" />
              </div>
              <div className="first-pic-text">
                <p className="first-pic-honor">
                  First picture is the title <br />
                  Grab & drag photo to change order
                </p>
              </div>
              <div className="amount-pic-text">
                <p className="amount-pic-honor">
                  Supported formats are .jpg and .png <br /> Each picture must not exceed 5Mb
                </p>
              </div>
            </div>

            {/* Region */}
            <div className="inputs-containers-region">
              <input
                type="text"
                placeholder={userState ? userState : 'Region'}
                value={userState}
                className="input-title-createpage"
                readOnly
              />
              <IoIosArrowDown
                className="arrow-region"
                onClick={() => setDisplayNaijaPage((prev) => !prev)}
              />
            </div>
            {displayNaijaPage ? <NigeriaList onStateSelect={handleStateChange} /> : ''}

            <div className="description-note">
              <textarea name="" id="" className="text-area-cont" placeholder="Describe your product..." />
            </div>

            <button type="submit" disabled={uploading} className="create-btn">
              {uploading ? 'Uploading...' : 'Create'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;

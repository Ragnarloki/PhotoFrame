import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEdit, FaProductHunt, FaInfoCircle, FaDollarSign, FaImage } from "react-icons/fa";
import { getProductById, updateProduct } from "../api"; // API functions
import UploadLoader from "./UploadLoader"; // Loading Component

const EditProduct = () => {
  const { id } = useParams(); // Get product ID from URL
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ 
    name: "", 
    description: "", 
    price: "", 
    image: null 
  });
  
  const [imagePreview, setImagePreview] = useState(null);
  const [loadingState, setLoadingState] = useState({ loading: false, message: "" });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const product = await getProductById(id);
        setFormData({ 
          name: product?.name || "", 
          description: product?.description || "", 
          price: product?.price || "", 
          image: null // Keep image null initially
        });
        setImagePreview(product?.imageUrl || ""); // Show previous image if available
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      setFormData({ ...formData, image: file });

      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingState({ loading: true, message: "Updating product, please wait..." });

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    if (formData.image) data.append("image", formData.image);

    try {
      await updateProduct(id, data);
      navigate("/products"); // Redirect to products page after update
    } catch (error) {
      console.error("Error updating product:", error);
    } finally {
      setLoadingState({ loading: false, message: "" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6 relative">
      {loadingState.loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md z-50 flex items-center justify-center">
          <UploadLoader loadingState={loadingState} />
        </div>
      )}

      <motion.form
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white backdrop-blur-md bg-opacity-80 shadow-2xl rounded-3xl p-8 border border-gray-300"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-indigo-600 flex items-center justify-center">
          <FaEdit className="mr-3 text-indigo-500" /> Edit Product
        </h2>

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
          <div className="relative">
            <FaProductHunt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none shadow-sm"
            />
          </div>
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <div className="relative">
            <FaInfoCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="3"
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none shadow-sm"
            />
          </div>
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
          <div className="relative">
            <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none shadow-sm"
            />
          </div>
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
          <div className="relative flex items-center">
            <FaImage className="absolute left-3 text-gray-400" />
            <input 
              type="file" 
              onChange={handleFileChange} 
              className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none shadow-sm" 
            />
          </div>
          {imagePreview && (
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="mt-3 w-32 h-32 object-cover rounded-lg border" 
            />
          )}
        </div>

        <button 
          type="submit" 
          className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-bold"
        >
          Update Product
        </button>
      </motion.form>
    </div>
  );
};

export default EditProduct;

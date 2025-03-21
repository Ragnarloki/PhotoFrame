import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FaUpload, FaProductHunt, FaInfoCircle, FaDollarSign, FaImage } from "react-icons/fa";

const ProductForm = () => {
  const [formData, setFormData] = useState({ name: "", description: "", price: "", image: null });
  const [imagePreview, setImagePreview] = useState(null);
  const controls = useAnimation();
  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) controls.start("visible");
  }, [controls, inView]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });

    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.description || !formData.price || !formData.image) {
      alert("Please fill all the fields before submitting!");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("image", formData.image);

    try {
      await axios.post("https://photoframe-1.onrender.com/api/products/upload", data);
      alert("Product uploaded successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error uploading product:", error);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <motion.form
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={formVariants}
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white backdrop-blur-md bg-opacity-80 shadow-2xl rounded-3xl p-8 border border-gray-300"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-indigo-600 flex items-center justify-center">
          <FaUpload className="mr-3 text-indigo-500" /> Add a New Product
        </h2>

        {/* Product Name */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
          <div className="relative">
            <FaProductHunt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="name"
              placeholder="Enter product name"
              onChange={handleChange}
              required
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none shadow-sm"
            />
          </div>
        </div>

        {/* Description */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <div className="relative">
            <FaInfoCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <textarea
              name="description"
              placeholder="Enter product description"
              onChange={handleChange}
              required
              rows="3"
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none shadow-sm"
            />
          </div>
        </div>

        {/* Price */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
          <div className="relative">
            <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="number"
              name="price"
              placeholder="Enter product price"
              onChange={handleChange}
              required
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none shadow-sm"
            />
          </div>
        </div>

        {/* File Input */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
          <div className="relative flex items-center">
            <FaImage className="absolute left-3 text-gray-400" />
            <input
              type="file"
              onChange={handleFileChange}
              required
              className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none shadow-sm"
            />
          </div>
          {imagePreview && (
            <div className="mt-4 flex justify-center">
              <img src={imagePreview} alt="Preview" className="w-40 h-40 object-cover rounded-lg border border-gray-300 shadow-sm" />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-lg font-bold hover:from-indigo-600 hover:to-purple-700 shadow-lg transform hover:scale-105 transition-all duration-300"
        >
          Upload Product
        </button>
      </motion.form>
    </div>
  );
};

export default ProductForm;

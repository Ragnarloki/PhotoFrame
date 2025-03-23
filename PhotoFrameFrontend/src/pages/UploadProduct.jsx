import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FaUpload, FaProductHunt, FaInfoCircle, FaDollarSign, FaImage, FaSpinner } from "react-icons/fa";
import { uploadProduct } from "../api";
import UploadLoader from "./UploadLoader"; // Import Loading Component

const ProductForm = () => {
  const [formData, setFormData] = useState({ name: "", description: "", price: "", image: null });
  const [imagePreview, setImagePreview] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const controls = useAnimation();
  const [ref, inView] = useInView();

  // Loading State as a JSON Object
  const [loadingState, setLoadingState] = useState({
    loading: false,
    message: "",
  });

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
      setAlertMessage("Please fill all the fields before submitting!");
      setShowAlert(true);
      return;
    }

    // Start Loading
    setLoadingState({
      loading: true,
      message: "Uploading your product, please wait...",
    });

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("image", formData.image);

    try {
      await uploadProduct(data);
      setAlertMessage("Product uploaded successfully!");
      setShowAlert(true);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error uploading product:", error);
      setAlertMessage("Failed to upload product. Please try again.");
      setShowAlert(true);
    } finally {
      // Stop Loading
      setLoadingState({
        loading: false,
        message: "",
      });
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6 relative">
      {/* Loading Overlay */}
      {loadingState.loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md z-50 flex items-center justify-center">
          <UploadLoader loadingState={loadingState} />
        </div>
      )}

      {/* Custom Alert Modal */}
      {showAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-6 rounded-lg shadow-lg max-w-sm text-center"
          >
            <p className="text-lg font-semibold text-gray-800 mb-4">{alertMessage}</p>
            <button
              onClick={() => setShowAlert(false)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
            >
              OK
            </button>
          </motion.div>
        </div>
      )}

      {/* Product Form */}
      <motion.form
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={formVariants}
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white backdrop-blur-md bg-opacity-80 shadow-2xl rounded-3xl p-8 border border-gray-300 relative"
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
            <input type="file" onChange={handleFileChange} required className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none shadow-sm" />
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-bold">Upload Product</button>
      </motion.form>
    </div>
  );
};

export default ProductForm;

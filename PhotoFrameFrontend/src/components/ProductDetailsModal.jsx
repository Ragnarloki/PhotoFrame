import React, { useState } from "react";
import { FaTimes, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function ProductDetailsModal({ product, closeModal }) {
  const [activeTab, setActiveTab] = useState("details");

  // Function to generate star ratings
  const generateStars = (rating) => {
    const stars = [];
    const adjustedRating = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0 && adjustedRating < 5;

    for (let i = 0; i < adjustedRating; i++) {
      stars.push(<FaStar key={i} className="text-yellow-400 text-lg" />);
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400 text-lg" />);
    }

    while (stars.length < 5) {
      stars.push(<FaRegStar key={stars.length} className="text-gray-400 text-lg" />);
    }

    return stars;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-xl w-[95%] md:w-[60%] lg:w-[50%] h-[80vh] overflow-auto relative">
        
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-700 dark:text-gray-300 hover:text-red-600 transition duration-300 text-2xl"
        >
          <FaTimes />
        </button>

        {/* Product Image */}
        <div className="w-full h-64 overflow-hidden rounded-lg shadow-md">
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover rounded-lg" />
        </div>

        {/* Product Info */}
        <div className="mt-5">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{product.name}</h2>
          
          {/* Stock Availability */}
          <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
            product.stock > 0 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
          }`}>
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </span>

          {/* Price & Rating */}
          <div className="flex justify-between items-center mt-3">
            <p className="text-2xl font-semibold text-purple-600">₹{product.price}</p>
            <div className="flex items-center">
              {generateStars(4.5)} {/* Static rating for now */}
              <span className="ml-2 text-sm text-gray-600">(4.5 / 5)</span>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mt-6 border-b border-gray-300 dark:border-gray-700 flex">
            <button
              className={`px-4 py-2 text-sm font-semibold ${
                activeTab === "details" ? "border-b-2 border-purple-600 text-purple-600" : "text-gray-600"
              } transition duration-300`}
              onClick={() => setActiveTab("details")}
            >
              Details
            </button>
            <button
              className={`px-4 py-2 text-sm font-semibold ${
                activeTab === "reviews" ? "border-b-2 border-purple-600 text-purple-600" : "text-gray-600"
              } transition duration-300`}
              onClick={() => setActiveTab("reviews")}
            >
              Reviews
            </button>
          </div>

          {/* Tab Content */}
          <div className="mt-4">
            {activeTab === "details" ? (
              <div>
                <p className="text-gray-600 dark:text-gray-300">{product.description}</p>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mt-4">Why Choose This Product?</h3>
                <ul className="list-disc ml-6 text-gray-700 dark:text-gray-300 space-y-2">
                  <li>✅ Premium-quality material with long durability</li>
                  <li>✅ Fast & free delivery within 3-5 business days</li>
                  <li>✅ 1-year warranty on manufacturing defects</li>
                  <li>✅ 24/7 customer support available</li>
                  <li>✅ Easy returns and replacements</li>
                  <li>✅ Online payment via Razorpay for secure transactions</li>
                </ul>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-300 italic">"Amazing product! Highly recommended." - <b>Rahul</b></p>
                <p className="text-gray-600 dark:text-gray-300 italic">"Great value for money!" - <b>Priya</b></p>
                <p className="text-gray-600 dark:text-gray-300 italic">"Fast delivery and high quality." - <b>Vikram</b></p>
              </div>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="flex justify-between mt-6">
            <button
              className="px-5 py-2 bg-gray-300 dark:bg-gray-700 dark:text-white rounded-lg hover:bg-gray-400 transition duration-300 shadow-md"
              onClick={closeModal}
            >
              Close
            </button>
            <Link
              to="/buy-now"
              state={{ product }}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-700 text-white text-sm font-bold hover:shadow-lg transition duration-300"
            >
              Buy Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

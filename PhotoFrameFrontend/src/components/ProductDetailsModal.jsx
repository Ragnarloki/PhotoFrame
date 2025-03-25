import React, { useState } from "react";
import { FaTimes, FaStar, FaStarHalfAlt, FaRegStar, FaHeart, FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function ProductDetailsModal({ product, closeModal }) {
  const [activeTab, setActiveTab] = useState("details");
 
  const generateStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-400 text-lg" />);
    }

    if (hasHalfStar && stars.length < 5) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400 text-lg" />);
    }

    while (stars.length < 5) {
      stars.push(<FaRegStar key={`empty-${stars.length}`} className="text-gray-400 text-lg" />);
    }

    return stars;
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop with blur */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={closeModal}
      />
      
      {/* Modal Content */}
      <div className="relative z-[10000] bg-white dark:bg-gray-900 p-6 rounded-xl shadow-2xl w-[95%] md:w-[80%] lg:w-[70%] xl:w-[60%] max-h-[90vh] overflow-auto">
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-700 dark:text-gray-300 hover:text-red-600 transition duration-300 text-2xl z-10"
        >
          <FaTimes />
        </button>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Product Image */}
          <div className="w-full md:w-1/2 h-64 md:h-96 overflow-hidden rounded-xl shadow-lg">
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-full h-full object-cover rounded-xl"
            />
          </div>

          {/* Product Info */}
          <div className="w-full md:w-1/2 mt-5 md:mt-0">
           
            
            {/* Stock and Badges */}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                product.stock > 0 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
              }`}>
                {product.stock > 0 ? "In Stock" : "Out of Stock"}
              </span>
              
              {product.discountPercentage > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {product.discountPercentage}% OFF
                </span>
              )}
            </div>

            {/* Price & Rating */}
            <div className="flex justify-between items-center mt-4">
              <div>
                {product.originalPrice && (
                  <span className="text-sm text-gray-500 dark:text-gray-400 line-through mr-2">
                    ₹{product.originalPrice}
                  </span>
                )}
                <span className="text-2xl font-semibold text-purple-600 dark:text-purple-400">
                  ₹{product.price}
                </span>
                {product.youSave && (
                  <span className="block text-xs text-green-600 dark:text-green-400">
                    You save: ₹{product.youSave}
                  </span>
                )}
              </div>
              <div className="flex items-center">
                {generateStars(product.rating || 4.5)}
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">({product.rating || 4.5} / 5)</span>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="mt-6 border-b border-gray-300 dark:border-gray-700 flex">
              <button
                className={`px-4 py-2 text-sm font-semibold ${
                  activeTab === "details" 
                    ? "border-b-2 border-purple-600 text-purple-600 dark:text-purple-400" 
                    : "text-gray-600 dark:text-gray-400"
                } transition duration-300`}
                onClick={() => setActiveTab("details")}
              >
                Details
              </button>
              <button
                className={`px-4 py-2 text-sm font-semibold ${
                  activeTab === "reviews" 
                    ? "border-b-2 border-purple-600 text-purple-600 dark:text-purple-400" 
                    : "text-gray-600 dark:text-gray-400"
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
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mt-4">
                    Product Features
                  </h3>
                  <ul className="mt-2 space-y-2">
                    {product.features?.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 mr-2 mt-1">✓</span>
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="space-y-4">
                  {product.reviews?.length > 0 ? (
                    product.reviews.map((review, index) => (
                      <div key={index} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          {generateStars(review.rating)}
                          <span className="ml-2 font-medium">{review.author}</span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300">"{review.comment}"</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600 dark:text-gray-300">No reviews yet.</p>
                  )}
                </div>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="flex justify-between mt-6 gap-4">
              <button
                className="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-700 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-300 flex items-center justify-center gap-2"
                onClick={closeModal}
              >
                <FaTimes />
                Close
              </button>
              <Link
                to="/buy-now"
                state={{ product }}
                className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-700 text-white hover:shadow-lg transition duration-300 flex items-center justify-center gap-2"
              >
                <FaShoppingCart />
                Buy Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
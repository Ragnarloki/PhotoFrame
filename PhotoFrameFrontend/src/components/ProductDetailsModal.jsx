import React from "react";
import { FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function ProductDetailsModal({ product, closeModal }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-xl w-[90%] md:w-[60%] lg:w-[50%] h-[80vh] overflow-auto relative">
        
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
          <p className="text-gray-600 dark:text-gray-300 mt-2">{product.description}</p>

          {/* Price */}
          <p className="text-2xl font-semibold text-purple-600 mt-4">₹{product.price}</p>

          {/* Extra Features */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Why Choose This Product?</h3>
            <ul className="list-disc ml-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>✅ Premium-quality material with long durability</li>
              <li>✅ Fast & free delivery within 3-5 business days</li>
              <li>✅ 1-year warranty on manufacturing defects</li>
              <li>✅ 24/7 customer support available</li>
              <li>✅ Easy returns and replacements</li>
              <li>✅ Online payment via Razorpay for secure transactions</li>
            </ul>
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

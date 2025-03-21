import React, { useState } from "react";
import { Link, Links, useLocation, useNavigate } from "react-router-dom";

export default function BuyNow() {
  const location = useLocation();
  const navigate = useNavigate();

  // Handle missing product data gracefully
  const product = location.state?.product || {
    name: "Unknown Product",
    price: "N/A",
    imageUrl: "/placeholder.png",
  };

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    paymentMethod: "COD",
  });

  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setOrderPlaced(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        {/* Back Button */}
        <Link to={"/"}
          className="text-gray-600 dark:text-gray-300 hover:text-blue-500 mb-4"
        >
          ← Back
        </Link>

        {/* Order Confirmation */}
        {orderPlaced ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-green-600">🎉 Order Placed!</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Your order has been successfully placed.
            </p>
            <Link to={"/"}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            {/* Product Info */}
            <div className="flex items-center space-x-4">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div>
                <h2 className="text-xl font-semibold">{product.name}</h2>
                <p className="text-lg font-bold text-blue-600">₹{product.price}</p>
              </div>
            </div>

            {/* Checkout Form */}
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300">
                  Shipping Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:text-white"
                  required
                ></textarea>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300">
                  Payment Method
                </label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:text-white"
                >
                  <option value="COD">Cash on Delivery</option>
                  <option value="Online">Online Payment</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg hover:shadow-lg transition"
              >
                Place Order
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

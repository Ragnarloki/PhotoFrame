import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { GlobalContext } from "./context/GlobalContext";

export default function BuyNow() {
  const location = useLocation();
  const navigate = useNavigate();
  const {user, setUser } = useContext(GlobalContext);

  const localuser = JSON.parse(localStorage.getItem("user")) || null;

  const product = location.state?.product || {
    name: "Unknown Product",
    price: 0,
    imageUrl: "/placeholder.png",
  };

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOrder = async (method) => {
    if (!localuser) {
      alert("Please log in to place an order");
      return;
    }

    const orderData = {
      userId: localuser.id,
      productName: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
      paymentMethod: method,
      status: "Pending",
    };

    try {
      const response = await axios.post("https://photoframe-1.onrender.com/api/orders", orderData);
      if (response.status === 201) {
        setPaymentMethod(method);
        setOrderPlaced(true);
      }
    } catch (error) {
      console.log(orderData)
      console.log(user)
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <button onClick={() => navigate("/")} className="text-gray-600 hover:text-blue-500 mb-4">
          ← Back
        </button>
        {orderPlaced ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-green-600">🎉 Order Placed Successfully!</h2>
            <p className="text-gray-600 mt-2">
              Your order for <span className="font-semibold">{product.name}</span> has been placed using{" "}
              <span className="font-semibold">{paymentMethod}</span>.
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center space-x-4">
              <img src={product.imageUrl} alt={product.name} className="w-24 h-24 object-cover rounded-lg" />
              <div>
                <h2 className="text-xl font-semibold">{product.name}</h2>
                <p className="text-lg font-bold text-blue-600">₹{product.price}</p>
              </div>
            </div>
            <form className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-300"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-300"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600">Shipping Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-300"
                  required
                ></textarea>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => handleOrder("Online Payment")}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Pay Online
                </button>
                <button
                  type="button"
                  onClick={() => handleOrder("Cash on Delivery")}
                  className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-700"
                >
                  Cash on Delivery
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

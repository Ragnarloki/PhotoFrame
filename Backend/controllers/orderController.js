const Order = require("../models/Order");

// 📌 Create Order
const createOrder = async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json({ message: "Order placed successfully!", order: newOrder });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ message: "Failed to place order. Please try again.", error });
  }
};

// 📌 Get All Orders (Admin Panel)
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error });
  }
};

module.exports = { createOrder, getOrders };

const Razorpay = require("razorpay");
const Order = require("../models/Orders");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

// Create Order
exports.createOrder = async (req, res) => {
  try {
    const { name, phone, address, product, paymentMethod } = req.body;
    const newOrder = new Order({ name, phone, address, product, paymentMethod });

    if (paymentMethod === "Online") {
      const options = {
        amount: product.price * 100, // Convert INR to paise
        currency: "INR",
        receipt: `order_${Date.now()}`,
      };
      const razorpayOrder = await razorpay.orders.create(options);

      newOrder.razorpay_order_id = razorpayOrder.id;
      await newOrder.save();

      res.json({ success: true, order_id: razorpayOrder.id, amount: options.amount });
    } else {
      await newOrder.save();
      res.json({ success: true, message: "Order placed successfully!" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating order", error });
  }
};

// Verify Payment
exports.verifyPayment = async (req, res) => {
  try {
    const { order_id, transactionId } = req.body;

    const order = await Order.findOne({ razorpay_order_id: order_id });
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.paymentStatus = "Paid";
    order.transactionId = transactionId;
    await order.save();

    res.json({ success: true, message: "Payment successful!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Payment verification failed", error });
  }
};

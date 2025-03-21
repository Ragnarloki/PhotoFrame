require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');

// const orderRoute = require("./routes/orderRoute");
// const errorHandler = require("./middleware/errorMiddleware");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/orders", require("./routes/orderRoutes"));


// app.use("/api", orderRoutes);
// app.use(errorHandler);

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));

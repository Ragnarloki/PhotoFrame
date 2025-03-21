const express = require('express');
const multer = require('multer');
const { storage } = require('../config/cloudinaryConfig');
const Product = require('../models/Product');

const router = express.Router();
const upload = multer({ storage });

router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const imageUrl = req.file.path;
    const newProduct = new Product({ name, imageUrl, description, price });
    await newProduct.save();
    res.json({ message: 'Product Added', product: newProduct });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

module.exports = router;

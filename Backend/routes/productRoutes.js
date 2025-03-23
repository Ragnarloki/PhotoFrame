const express = require('express');
const multer = require('multer');
const { storage } = require('../config/cloudinaryConfig');
const Product = require('../models/Product');

const router = express.Router();
const upload = multer({ storage });

// Upload a new product
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

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Edit (Update) a product
router.put('/edit/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, description, price } = req.body;
    let updatedData = { name, description, price };

    if (req.file) {
      updatedData.imageUrl = req.file.path; // Update image if new one is uploaded
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product Updated', product: updatedProduct });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a product
router.delete('/delete/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product Deleted', product: deletedProduct });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
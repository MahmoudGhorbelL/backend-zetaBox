const express = require('express');
const router = express.Router();
const Produit = require('../models/produit.js');
const Facture = require('../models/facture');

// Route to calculate and get total price
router.get('/totalPrice', async (req, res) => {
  try {
    const produits = await Produit.find();

    const totalPrice = calculateTotalPrice(produits);
    const TVAPrice = calculateTVAPrice(produits);
    const MontantNet = calculateMontantNet(produits);

    res.json({ totalPrice, TVAPrice, MontantNet });
  } catch (error) {
    console.error('Error calculating total price:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to create product
router.post('/', async (req, res) => {
  try {
    const { produitRef, produitDes, produitQte, produitPU, produitTVA, produitTot, produitNet, reference } = req.body;

    // Check if all required fields are provided
    if (!produitRef || !produitDes || !produitQte || !produitPU || !produitTVA || !produitTot  || !reference) {
      return res.status(400).send('Missing required fields');
    }

    const existingProduit = await Produit.findOne({ produitRef });
    if (existingProduit) {
      return res.status(400).json({ success: false, message: 'Product already exists' });
    }

    // Create a new Produit instance with the provided data
    const newProduit = new Produit(req.body);
    const savedProduit = await newProduit.save();
    // Now update the corresponding facture with the newly created product
    // await Facture.findByIdAndUpdate(
    //   reference,
    //   { $addToSet: { produits: savedProduit._id } },
    //   { new: true }
    // );
    // Respond with a success message and the saved product
    res.status(201).json(savedProduit);
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error adding product:', error);
    // Respond with an appropriate error message
    res.status(500).json({ success: false, message: 'Failed to add product' });
  }
});




router.get('/:reference', async (req, res) => {
  try {
    const produits = await Produit.find({ reference: req.params.reference });
    if (!produits || produits.length === 0) {
      return res.status(404).json({ message: "No products found with this reference" });
    }
    res.status(200).json(produits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// Function to calculate total price
const calculateTotalPrice = (items) => {
  try {
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error('Invalid input for calculateTotalPrice');
    }

    return items.reduce((sum, produit) => {
      const tot = produit.produitQte * produit.produitPU;
      return sum + tot;
    }, 0);
  } catch (error) {
    console.error('Error in calculateTotalPrice:', error);
    return 0; // or handle it according to your use case
  }
};

// Function to calculate TVA price
const calculateTVAPrice = (items) => {
  try {
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error('Invalid input for calculateTVAPrice');
    }

    return items.reduce((sum, produit) => {
      const tva = (produit.produitTVA / 100) * (produit.produitQte * produit.produitPU);
      return sum + tva;
    }, 0);
  } catch (error) {
    console.error('Error in calculateTVAPrice:', error);
    return 0; // or handle it according to your use case
  }
};

// Function to calculate montantNet (calculateTotalPrice + calculateTVAPrice)
const calculateMontantNet = (items) => {
  try {
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error('Invalid input for calculateMontantNet');
    }

    const total = calculateTotalPrice(items);
    const tva = calculateTVAPrice(items);

    return total + tva;
  } catch (error) {
    console.error('Error in calculateMontantNet:', error);
    return 0;
  }
};

module.exports = router;

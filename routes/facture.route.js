const express = require('express');
const router = express.Router();
const Facture = require('../models/facture');

// List all factures
router.get('/', async (req, res) => {
  try {
    const factures = await Facture.find({}, null, { sort: { '_id': -1 } }).populate("reference").exec();
    res.status(200).json(factures);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Define a new route handler to get a facture by its reference
router.get('/:reference', async (req, res) => {
  const reference = req.params.reference;

  try {
    // Find the facture by its reference
    const facture = await Facture.findOne({ reference });
    
    // Check if facture with the given reference exists
    if (!facture) {
      return res.status(404).json({ message: 'Facture not found' });
    }

    res.status(200).json(facture);
  } catch (error) {
    console.error('Error getting facture:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// List factures with pagination
// router.get('/productspage/', async (req, res) => {
//   const page = req.query.page || 1;
//   const pagesize = req.query.pagesize || 5;
//   const offset = (page - 1) * pagesize;
//   try {
//     const factures = await Facture.find({}, null, { sort: { '_id': -1 } })
//       .skip(offset)
//       .limit(pagesize)
//       .populate("factureID").exec();
    
//     res.status(200).json(factures);
//   } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
// });

// // Total number of facture records
// router.get('/nombreTot/', async (req, res) => {
//   try {
//     const factures = await Facture.find().exec();
//     res.status(200).json({ tot: factures.length });
//   } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
// });

// List factures with filters
router.get('/filtres/', async (req, res) => {
  const filtre = req.query.filtre || "";
  const page = req.query.page || 1;
  const limit = req.query.limit || 5;
  const offset = (page - 1) * limit;
  try {
    const factures = await Facture.find({ reference: { $regex: filtre, $options: "i" } }, null, { sort: { '_id': -1 } })
      .skip(offset)
      .limit(limit)
      .populate("reference").exec();

    const facturesNb = await Facture.find({ reference: { $regex: filtre, $options: "i" } }).exec();

    res.status(200).json({ factures: factures, longueur: facturesNb.length });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Create a new facture
router.post('/', async (req, res) => {
  const newFacture = new Facture(req.body);
  try {
    const response = await newFacture.save();
    const facture = await Facture.findById(response._id).populate("reference").exec();
    res.status(200).json(facture);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Retrieve a single facture
router.get('/:factureId', async (req, res) => {
  try {
    const facture = await Facture.findById(req.params.factureId);
    res.status(200).json(facture);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Update a facture
router.put('/:factureId', async (req, res) => {
  try {
    const updatedFacture = await Facture.findByIdAndUpdate(
      req.params.factureId,
      { $set: req.body },
      { new: true }
    );
    const facture = await Facture.findById(updatedFacture._id).populate("reference").exec();
    res.status(200).json(facture);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Delete a facture
router.delete('/:factureId', async (req, res) => {
  const id = req.params.factureId;
  try {
    await Facture.findByIdAndDelete(id);
    res.status(200).json({ message: "facture deleted successfully." });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

module.exports = router;

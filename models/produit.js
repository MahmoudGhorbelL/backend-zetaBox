const mongoose = require('mongoose')
const facture = require('./facture');
const produitSchema = new mongoose.Schema({

    produitRef: {
        type: String,
        required: true,
        unique: true,
    },

    produitDes: {
        type: String,
        required: true,
    },

    produitQte: {
        type: Number,
        required: true,
    },

    produitPU: {
        type: Number,
        required: true,
    },

    produitTVA: {
        type: String,
        required: true,
    },

    produitTot: {
        type: Number,
        required: true,
    },

    produitNet: {
        type: Number,
        required: false,
    },
    reference: {
        type: String,
        ref: () => facture,
        required: true,
    }
}
);
module.exports = mongoose.model('Produit', produitSchema)
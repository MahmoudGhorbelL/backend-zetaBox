const mongoose = require('mongoose')
const user = require('./user');
const produit = require('./produit');
const factureSchema = new mongoose.Schema({

    nomFacture: {
        type: String,
        required: true,
    },

    reference: {
        type: String,
        required: true,
        unique: true
    },

    raison: {
        type: String,
        required: true,
    },

    matricule: {
        type: String,
        required: true,
    },

    adresse: {
        type: String,
        required: true,
    },

    dateCF: {
        type: Date,
        default: Date.now(),
        required: true,
    },
    dateEF: {
        type: Date,
        default: Date.now(),
        required: true,
    },
    note: {
        type: String,
        required: false,
    },
    infoEnt: {
        type: String,
        required: true,
    },
    Banque: {
        type: String,
        required: true,
    },
    IBAN: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        ref: user,
        required: true,
    },
    produits: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: produit ,
        required: true,
    }],
},
);
module.exports = mongoose.model('Facture', factureSchema)

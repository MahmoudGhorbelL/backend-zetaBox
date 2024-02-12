const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const userSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true,
        unique: true
    },

    mdp: {
        type: String,
        required: true,
    },
    

    prenom: {
        type: String,
        required: true,
    },

    nom: {
        type: String,
        required: true,
    },

    pays: {
        type: String,
        required: true,
    },

    telephone: {
        type: Number,
        required: true,
    },

    isActive: {
        type: Boolean,
        default: true,
        required: false
    },

    avatar: {

        type: String,

        required: false

    },


},
);
module.exports = mongoose.model('User', userSchema)

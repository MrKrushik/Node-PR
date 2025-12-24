const mongoose = require('mongoose');

const antiqueSchema = mongoose.Schema({
    antique_name: {
        type: String,
        required: true,
    },
    antique_age: {
        type: String,
        required: true
    },
    antique_price: {
        type: Number,
        required: true,
    },
    antique_category: {
        type: String,
        required: true
    },
    antique_image: {
        type: String,
        required: true
    }
});

const antique = mongoose.model("antique", antiqueSchema, "antiques");

module.exports = antique;
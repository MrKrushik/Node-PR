const mongoose = require("mongoose");

const heroSchema = mongoose.Schema({
    hero_name: {
        type: String,
        required: true
    },
    freedom_birth_date: {
        type: Date,
        required: true
    },
    freedom_death_date: {
        type: Date,
        required: true
    },
    hero_gender: {
        type: String,
        required: true
    },
    hero_image: {
        type: String,
    },
    hero_role: {
        type: String,
        required: true
    },
    hero_quote: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Hero", heroSchema);

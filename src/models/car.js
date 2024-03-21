const mongoose = require('mongoose');

const carSchema = mongoose.Schema({
    brand: { type: String },
    model: { type: String },
    year: { type: String },
});

module.exports = mongoose.model('Car', carSchema)

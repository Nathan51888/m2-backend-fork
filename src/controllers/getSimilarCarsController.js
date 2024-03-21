const mongoose = require('mongoose');
const Car = require('../models/car.js');

async function getSimilarCars(req, res) {
    const brand = req.query.brand;

    const queryResult = await findCarByBrand(brand);

    res.send(queryResult);
}

async function findCarByBrand(brand) {
    await mongoose.connect('mongodb://localhost:27017/test');

    const search = new RegExp(brand, 'i');
    const foundCars = await Car.find({$or: [{brand: search}]});

    mongoose.connection.close();

    return foundCars;
}

module.exports = getSimilarCars;

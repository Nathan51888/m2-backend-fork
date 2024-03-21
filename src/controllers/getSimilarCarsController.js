async function getSimilarCars(req, res) {
    const brand = req.query.brand;

    res.send({ test: `${brand}` });
}

module.exports = getSimilarCars;

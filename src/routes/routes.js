// ROUTER INIT
const express = require('express');
const router = express.Router();

// MULTER => FILES HANDLER
const multer = require('multer');
const upload = multer({dest: 'tempImages/'}); // Multer Shadow files location => Go to controller.js l-29 for details

// CONTROLLERS IMPORTS
const analyseCarImage = require('../controllers/controller');
const getSimilarCars = require('../controllers/getSimilarCarsController');

// ROUTES
router.get('/', (req, res) => res.send('server is up'));
router.post('/analyse-car-image', upload.single('car-image'), (req, res) => analyseCarImage(req, res));
router.get('/get-similar-cars-instock', (req, res) => getSimilarCars(req, res));

// EXPORT ROUTER
module.exports = router;

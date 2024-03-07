// ROUTER INIT
const express = require('express');
const router = express.Router();

// MULTER => FILES HANDLER
const multer = require('multer');
const upload = multer({dest: 'temp/'});

// CONTROLLERS IMPORTS
const analyseCarImage = require('../controllers/controller');

// ROUTES
router.get('/', (req, res) => res.send('server is up'));
router.post('/analyse-car-image', upload.single('car-image'), (req, res) => analyseCarImage(req, res));

// EXPORT ROUTER
module.exports = router;

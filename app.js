// IMPORTS
const express = require('express');
const cors = require('cors');

// APP INIT
const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// EXPORT APP
module.exports = app;

// IMPORTS
const app = require('./app');
const router = require('./src/routes/routes');

// DOTENV IMPORTS
require('dotenv').config();
const PORT = process.env.PORT || 3000;

// ROUTES IMPORT
app.use('/', router);

// SERVER UP
app.listen(PORT, () => console.log(`Server is up at:\nhttp://localhost:${PORT}`));

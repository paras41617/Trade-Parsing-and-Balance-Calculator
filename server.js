const express = require('express');
const connectDB = require('./config/database');
const routes = require('./routes');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Connect to Database
connectDB();

// Routes
app.use('', routes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

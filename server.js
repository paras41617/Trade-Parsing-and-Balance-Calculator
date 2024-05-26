const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;

// Database configuration
const MONGO_DETAILS = process.env.DATABASE_URL;
mongoose.connect(MONGO_DETAILS)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Failed to connect to MongoDB:', err));

// Trade Schema
const tradeSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  utcTime: { type: Date, required: true },
  operation: { type: String, enum: ['Buy', 'Sell'], required: true },
  baseCoin: { type: String, required: true },
  quoteCoin: { type: String, required: true },
  amount: { type: Number, required: true },
  price: { type: Number, required: true },
});

const Trade = mongoose.model('Trade', tradeSchema);

app.use(express.json());

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

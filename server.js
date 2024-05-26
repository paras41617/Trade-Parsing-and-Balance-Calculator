const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');

const multer = require('multer');
const csvParser = require('csv-parser');
const stream = require('stream');

// Multer setup for in-memory file upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

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

// Route to handle file upload and parsing
app.post('/upload-csv', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }

    const fileBuffer = req.file.buffer;
    const trades = [];

    const readStream = new stream.Readable({
      read() {
        this.push(fileBuffer);
        this.push(null);
      },
    });

    readStream
      .pipe(csvParser())
      .on('data', (row) => {
        const [baseCoin, quoteCoin] = row['Market'].split('/');
        trades.push({
          userId: row['User_ID'],
          utcTime: new Date(row['UTC_Time']),
          operation: row['Operation'],
          baseCoin,
          quoteCoin,
          amount: parseFloat(row['Buy/Sell Amount']),
          price: parseFloat(row['Price']),
        });
      })
      .on('end', async () => {
        try {
          await Trade.insertMany(trades);
          res.status(200).send('File processed and data stored successfully');
        } catch (error) {
          console.error('Error inserting trades:', error);
          res.status(500).send('Error processing file');
        }
      });
  } catch (error) {
    console.error('Error handling file upload:', error);
    res.status(500).send('Error processing file');
  }
});

// Route to get balance
app.post('/balance', async (req, res) => {
  const { userId, timestamp } = req.body;

  if (!userId || !timestamp) {
    return res.status(400).send('User ID and timestamp are required');
  }

  const date = new Date(timestamp);

  try {
    const trades = await Trade.find({ userId, utcTime: { $lte: date } });

    const balances = trades.reduce((acc, trade) => {
      const { baseCoin, operation, amount } = trade;
      if (!acc[baseCoin]) {
        acc[baseCoin] = 0;
      }
      if (operation === 'Buy') {
        acc[baseCoin] += amount;
      } else if (operation === 'Sell') {
        acc[baseCoin] -= amount;
      }
      return acc;
    }, {});

    res.status(200).json(balances);
  } catch (error) {
    console.error('Error retrieving balance:', error);
    res.status(500).send('Error retrieving balance');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

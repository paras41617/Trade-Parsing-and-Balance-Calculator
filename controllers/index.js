const Trade = require('../models/tradeModel');
const { parseCSV } = require('../services/csvService');

const tradeController = {
  uploadCSV: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const fileBuffer = req.file.buffer;
      const trades = await parseCSV(fileBuffer);

      await Trade.insertMany(trades);
      res.status(200).json({ message: 'File processed and data stored successfully' });
    } catch (error) {
      console.error('Error handling file upload:', error);
      res.status(500).json({ error: 'Error processing file' });
    }
  },

  getBalance: async (req, res) => {
    const { userId, timestamp } = req.body;

    if (!userId || !timestamp) {
      return res.status(400).json({ error: 'User ID and timestamp are required' });
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
      res.status(500).json({ error: 'Error retrieving balance' });
    }
  }
};

module.exports = tradeController;

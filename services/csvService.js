const csvParser = require('csv-parser');
const stream = require('stream');

const parseCSV = (fileBuffer) => {
  return new Promise((resolve, reject) => {
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
      .on('end', () => {
        resolve(trades);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

module.exports = { parseCSV };

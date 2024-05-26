
# Trade Parsing and Balance Calculator

A backend server for uploading data related to trade in the csv format and calculating balance according to timestamp.

API 1 (/upload-csv) : 

Takes csv file and uploads the data to the database after parsing it.

API 2 (/balance) : 

Returns the asset-wise balance of the account at any given timestamp. 


## Tech Stack

**Server:** Node, Express

**Database:** MongoDB


## Run Locally

Clone the project

```bash
  git clone https://github.com/paras41617/Trade-Parsing-and-Balance-Calculator
```

Go to the project directory

```bash
  cd Trade-Parsing-and-Balance-Calculator
```

Install dependencies

```bash
  npm install
```

Create a .env file in the root of the project and add the mongodb URI.

```bash
  DATABASE_URL=
```

Start the server

```bash
  node server.js
```


## Deployment

The deployed link for the backend sever : 
```
https://trade-parsing-and-balance-calculator.vercel.app
```


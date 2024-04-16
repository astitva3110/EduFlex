// app.js
const { Client } = require('pg');
require('dotenv').config();

let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;

const client = new Client({
  host: PGHOST,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: true
  
});

client.connect()
.then(() => console.log('Connected to PostgreSQL database'))
.catch(err => console.error('Error connecting to PostgreSQL database:', err));
module.exports=client;

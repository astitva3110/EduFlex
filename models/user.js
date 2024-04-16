
const client = require('../util/database');

async function createTable() {
  try {
    const Query = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        otp INTEGER,
        verify BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
     const query='DROP TABLE IF EXISTS users CASCADE;'
    // Execute the SQL query to create the table
    await client.query(Query);
    console.log('Table created successfully');
  } catch (err) {
    console.error('Error creating table:', err);
  } 
}

createTable();

module.exports=createTable;
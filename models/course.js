const client = require('../util/database');

async function createTable() {
  try {
   
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS course (
        id SERIAL PRIMARY KEY,
        course_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      )
    `;

    const query='DROP TABLE IF EXISTS course CASCADE';
    await client.query(createTableQuery);
    console.log('Table created successfully');
  } catch (err) {
    console.error('Error creating table:', err);
  } 
}


createTable();

module.exports=createTable;

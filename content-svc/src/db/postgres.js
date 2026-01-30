const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

const initDb = async () => {
  const queryText = `
    CREATE TABLE IF NOT EXISTS tracks (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255),
      artist VARCHAR(255),
      duration FLOAT,
      file_path VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await pool.query(queryText);
    console.log('PostgreSQL table "tracks" is ready.');
  } catch (err) {
    console.error('Error creating PostgreSQL table:', err);
  }
};

module.exports = { pool, initDb };

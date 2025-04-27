const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('autotipper.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS creators (
      user_id INTEGER PRIMARY KEY,
      wallet_address TEXT NOT NULL
    )
  `);
});

module.exports = db;
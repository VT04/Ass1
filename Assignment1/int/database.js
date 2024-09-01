const sqlite3 = require('sqlite3').verbose();

const database = new sqlite3.Database('mydatabase.db');

database.serialize(() => {
    database.run(`
    CREATE TABLE IF NOT EXISTS User (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT NOT NULL,
      password TEXT NOT NULL
    )
  `);

    database.run(`
    CREATE TABLE IF NOT EXISTS Video (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      filename TEXT NOT NULL,
      filepath TEXT NOT NULL,
      mimetype TEXT NOT NULL,
      size INTEGER NOT NULL,
      duration INTEGER NOT NULL,
      uploadDate TEXT DEFAULT CURRENT_TIMESTAMP,
      author INTEGER NOT NULL,
      thumbnail TEXT, 
      codec TEXT,
      FOREIGN KEY (author) REFERENCES User(id)
    )
  `);
});

module.exports = database;
import sqlite3 from "sqlite3";
sqlite3.verbose();

function createDb() {
  const db = new sqlite3.Database("./dataBase/dataBase.db");

  db.serialize(() => {
    db.run(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT,
        login TEXT,
        password TEXT,
        admin INTEGER,
        cookie TEXT,
        avatar TEXT
      )`
    );
  });

  db.close((err) => {
    if (err) {
      console.error("Error closing the database", err);
    } else {
      console.log("Database closed");
    }
  });
}

createDb();

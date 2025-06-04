const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./ptar.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS galeria (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tipo TEXT,
    archivo TEXT,
    fecha TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS datos_interesantes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT,
    contenido TEXT,
    imagen TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS anuncios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT,
    mensaje TEXT,
    imagen TEXT
  )`);
});

module.exports = db;

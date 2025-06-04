const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../db');

// Configurar almacenamiento con multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads');
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// Subir archivo
router.post('/', upload.single('archivo'), (req, res) => {
  const { tipo } = req.body;
  const archivo = req.file?.filename;
  const fecha = new Date().toISOString();

  if (!archivo || !tipo) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  db.run(`INSERT INTO galeria (tipo, archivo, fecha) VALUES (?, ?, ?)`,
    [tipo, archivo, fecha],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, tipo, archivo, fecha });
    });
});

// Obtener todos
router.get('/', (req, res) => {
  db.all(`SELECT * FROM galeria ORDER BY id DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Eliminar
router.delete('/:id', (req, res) => {
  db.get(`SELECT archivo FROM galeria WHERE id = ?`, [req.params.id], (err, row) => {
    if (err || !row) return res.status(404).json({ error: 'No encontrado' });

    const ruta = path.join(__dirname, '../public/uploads', row.archivo);
    fs.unlink(ruta, (err) => {
      if (err && err.code !== 'ENOENT') return res.status(500).json({ error: 'Error al eliminar archivo físico' });

      db.run(`DELETE FROM galeria WHERE id = ?`, [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
      });
    });
  });
});

module.exports = router;


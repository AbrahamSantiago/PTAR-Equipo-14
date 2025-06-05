const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');

// Configuración para archivos
const storage = multer.diskStorage({
  destination: 'public/uploads',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Crear nuevo anuncio
router.post('/', upload.single('imagen'), (req, res) => {
  const { titulo, mensaje } = req.body;
  const imagen = req.file ? req.file.filename : null;

  if (!titulo || !mensaje) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  db.run(`INSERT INTO anuncios (titulo, mensaje, imagen) VALUES (?, ?, ?)`,
    [titulo, mensaje, imagen],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, titulo, mensaje, imagen });
    });
});

// Obtener todos los anuncios
router.get('/', (req, res) => {
  db.all(`SELECT * FROM anuncios ORDER BY id DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Eliminar anuncio por ID
router.delete('/:id', (req, res) => {
  db.run(`DELETE FROM anuncios WHERE id = ?`, [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

module.exports = router;
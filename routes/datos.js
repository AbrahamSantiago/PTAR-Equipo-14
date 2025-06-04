const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');

// Configuración de almacenamiento para imagen opcional
const storage = multer.diskStorage({
  destination: 'public/uploads',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Crear nuevo dato interesante
router.post('/', upload.single('imagen'), (req, res) => {
  const { titulo, contenido } = req.body;
  const imagen = req.file ? req.file.filename : null;

  if (!titulo || !contenido) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  db.run(`INSERT INTO datos_interesantes (titulo, contenido, imagen) VALUES (?, ?, ?)`,
    [titulo, contenido, imagen],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, titulo, contenido, imagen });
    });
});

// Obtener todos los datos interesantes
router.get('/', (req, res) => {
  db.all(`SELECT * FROM datos_interesantes ORDER BY id DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Eliminar dato interesante por ID
router.delete('/:id', (req, res) => {
  db.run(`DELETE FROM datos_interesantes WHERE id = ?`, [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

module.exports = router;
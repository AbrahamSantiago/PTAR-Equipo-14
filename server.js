const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const galeriaRoutes = require('./routes/galeria');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.use('/api/galeria', galeriaRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

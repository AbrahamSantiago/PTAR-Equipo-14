
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = 3000;
app.use(cors());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//Para Galeria


const METADATA_FILE = path.join(__dirname, 'metadata.json');
let metadata = [];
if (fs.existsSync(METADATA_FILE)) {
  const data = fs.readFileSync(METADATA_FILE, 'utf-8');
  metadata = JSON.parse(data);
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    const timestamp = Date.now();
    cb(null, `${baseName}-${timestamp}${ext}`);
  }
});
const upload = multer({ storage: storage });
function saveMetadata() {
  fs.writeFileSync(METADATA_FILE, JSON.stringify(metadata, null, 2));
}
app.post('/upload', upload.single('archivo'), (req, res) => {
  const { titulo, descripcion } = req.body;
  const archivo = req.file.filename;
  if (!archivo) {
    return res.status(400).json({ error: 'No se subió archivo' });
  }
  const nuevoElemento = { archivo, titulo, descripcion };
  metadata.push(nuevoElemento);
  saveMetadata();

  res.json({ message: 'Archivo subido correctamente', archivo });
});
app.get('/files', (req, res) => {
  res.json(metadata);
});
app.delete('/delete/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', filename);

  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Error al eliminar archivo' });
    }

    metadata = metadata.filter(item => item.archivo !== filename);
    saveMetadata();

    res.json({ message: 'Archivo eliminado' });
  });
});


// Para datos


const datosPath = path.join(__dirname, 'datos.json');
// Cargar datos interesantes
let datos = [];
if (fs.existsSync(datosPath)) {
  const data = fs.readFileSync(datosPath, 'utf-8');
  datos = JSON.parse(data);
}
// Subir datos interesantes
app.post('/agregar-dato', upload.single('imagenDato'), (req, res) => {
  const { titulo, contenido } = req.body;
  const imagen = req.file ? req.file.filename : null;

  const nuevoDato = { titulo, contenido, imagen };
  datos.push(nuevoDato);

  fs.writeFileSync(datosPath, JSON.stringify(datos, null, 2));

  res.json({ message: 'Dato agregado correctamente' });
});
// Obtener datos interesantes
app.get('/datos', (req, res) => {
  res.json(datos);
});
// Eliminar dato interesante
app.delete('/eliminar-dato/:titulo', (req, res) => {
  const { titulo } = req.params;
  datos = datos.filter(dato => dato.titulo !== titulo);
  fs.writeFileSync(datosPath, JSON.stringify(datos, null, 2));
  res.json({ message: 'Dato eliminado' });
});


//Para Usuarios


const usuariosPath = path.join(__dirname, 'usuarios.json');
// Cargar usuarios existentes
let usuarios = [];
if (fs.existsSync(usuariosPath)) {
  const data = fs.readFileSync(usuariosPath, 'utf-8');
  usuarios = JSON.parse(data);
}
// Agregar usuario
app.post('/agregar-usuario', (req, res) => {
  const { nombre, password, tipoUsuario } = req.body;
  if (!nombre || !password || !tipoUsuario) {
    return res.status(400).json({ error: 'Datos incompletos' });
  }
  usuarios.push({ nombre, password, tipoUsuario });
  fs.writeFileSync(usuariosPath, JSON.stringify(usuarios, null, 2));
  res.json({ message: 'Usuario agregado correctamente' });
});

// Obtener usuarios
app.get('/usuarios', (req, res) => {
  res.json(usuarios); // Incluyendo nombre, password, tipoUsuario
});
// Eliminar usuario
app.delete('/eliminar-usuario/:nombre', (req, res) => {
  const { nombre } = req.params;
  usuarios = usuarios.filter(u => u.nombre !== nombre);
  fs.writeFileSync(usuariosPath, JSON.stringify(usuarios, null, 2));
  res.json({ message: 'Usuario eliminado' });
});
// Enviar usuarios con contraseña
app.get('/usuarios', (req, res) => {
  // ¡Ahora sí enviamos la contraseña para que el admin la vea!
  res.json(usuarios);
});


//Para Anuncios


// Archivo donde se guardan los anuncios
const anunciosPath = path.join(__dirname, 'anuncios.json');
// Leer anuncios si el archivo existe
let anuncios = [];
if (fs.existsSync(anunciosPath)) {
  const data = fs.readFileSync(anunciosPath, 'utf-8');
  anuncios = JSON.parse(data);
}
// Ruta para agregar un anuncio
app.post('/agregar-anuncio', upload.single('imagenAnuncio'), (req, res) => {
  const { titulo, mensaje } = req.body;
  const imagen = req.file ? req.file.filename : null;
  const nuevoAnuncio = { titulo, mensaje, imagen };
  anuncios.push(nuevoAnuncio);
  fs.writeFileSync(anunciosPath, JSON.stringify(anuncios, null, 2));
  res.json({ message: 'Anuncio agregado correctamente' });
});
// Ruta para obtener todos los anuncios
app.get('/anuncios', (req, res) => {
  res.json(anuncios);
});
// Ruta para eliminar un anuncio
app.delete('/eliminar-anuncio/:titulo', (req, res) => {
  const { titulo } = req.params;
  anuncios = anuncios.filter(anuncio => anuncio.titulo !== titulo);
  fs.writeFileSync(anunciosPath, JSON.stringify(anuncios, null, 2));
  res.json({ message: 'Anuncio eliminado' });
});


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

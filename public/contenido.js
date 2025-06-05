const galeriaForm = document.getElementById('galeriaForm');
const archivoInput = document.getElementById('archivo');
const tituloInput = document.getElementById('titulo');
const galeriaImagenes = document.getElementById('galeriaImagenes');
const galeriaVideos = document.getElementById('galeriaVideos');

document.addEventListener('DOMContentLoaded', cargarGaleria);

galeriaForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const titulo = tituloInput.value;
  const archivo = archivoInput.files[0];

  if (!archivo || !titulo) {
    return alert('Completa el formulario.');
  }

  const formData = new FormData();
  formData.append('archivo', archivo);
  formData.append('titulo', titulo);

  const res = await fetch('/upload', {
    method: 'POST',
    body: formData
  });

  if (res.ok) {
    alert('Archivo subido correctamente');
    galeriaForm.reset();
    cargarGaleria();
  } else {
    alert('Error al subir');
  }
});

async function cargarGaleria() {
  galeriaImagenes.innerHTML = '';
  galeriaVideos.innerHTML = '';

  const res = await fetch('/files');
  const archivos = await res.json();

  archivos.forEach(({ archivo, titulo }) => {
    agregarElementoGaleria(archivo, titulo);
  });
}

function agregarElementoGaleria(archivo, titulo) {
  const contenedor = document.createElement('div');
  contenedor.className = 'galeria-item';
  const ruta = `/uploads/${archivo}`;
  const extension = archivo.split('.').pop().toLowerCase();
  let elemento;

  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
    elemento = document.createElement('img');
    elemento.src = ruta;
    elemento.alt = archivo;
    galeriaImagenes.appendChild(contenedor);
  } else if (['mp4', 'webm', 'ogg'].includes(extension)) {
    elemento = document.createElement('video');
    elemento.src = ruta;
    elemento.controls = true;
    galeriaVideos.appendChild(contenedor);
  }

  const info = document.createElement('div');
  info.innerHTML = `<strong>${titulo}</strong>`;

  contenedor.appendChild(elemento);
  contenedor.appendChild(info);

  const btnEliminar = document.createElement('button');
  btnEliminar.textContent = 'Eliminar';
  btnEliminar.onclick = async () => {
    const res = await fetch(`/delete/${archivo}`, { method: 'DELETE' });
    if (res.ok) {
      alert('Archivo eliminado');
      contenedor.remove();
    } else {
      alert('Error al eliminar archivo');
    }
  };
  contenedor.appendChild(btnEliminar);
}
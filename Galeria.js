const galeriaForm = document.getElementById('galeriaForm');
const archivoInput = document.getElementById('archivo');
const tipoInput = document.getElementById('tipo');
const galeriaImagenes = document.getElementById('galeriaImagenes');
const galeriaVideos = document.getElementById('galeriaVideos');

document.addEventListener('DOMContentLoaded', cargarGaleria);

galeriaForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const tipo = tipoInput.value;
  const archivo = archivoInput.files[0];

  if (!archivo || !tipo) return alert('Completa el formulario.');

  const formData = new FormData();
  formData.append('archivo', archivo);
  formData.append('tipo', tipo);

  const res = await fetch('/api/galeria', {
    method: 'POST',
    body: formData
  });

  const data = await res.json();
  if (res.ok) {
    agregarElementoGaleria(data);
    galeriaForm.reset();
  } else {
    alert('Error al subir: ' + data.error);
  }
});

async function cargarGaleria() {
  const res = await fetch('/api/galeria');
  const recursos = await res.json();
  recursos.forEach(agregarElementoGaleria);
}

function agregarElementoGaleria({ id, tipo, archivo }) {
  const contenedor = document.createElement('div');
  contenedor.className = 'galeria-item';
  const ruta = `/uploads/${archivo}`;
  let elemento;

  if (tipo === 'imagen') {
    elemento = document.createElement('img');
    elemento.src = ruta;
    elemento.alt = archivo;
  } else if (tipo === 'video') {
    elemento = document.createElement('video');
    elemento.src = ruta;
    elemento.controls = true;
  }

  const btn = document.createElement('button');
  btn.textContent = 'Eliminar';
  btn.onclick = async () => {
    const res = await fetch(`/api/galeria/${id}`, { method: 'DELETE' });
    if (res.ok) contenedor.remove();
    else alert('Error al eliminar');
  };

  contenedor.appendChild(elemento);
  contenedor.appendChild(btn);

  if (tipo === 'imagen') galeriaImagenes.appendChild(contenedor);
  else galeriaVideos.appendChild(contenedor);
}

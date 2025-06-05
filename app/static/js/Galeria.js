document.addEventListener('DOMContentLoaded', cargarGaleria);

async function cargarGaleria() {
  const imagenesContenedor = document.getElementById('imagenes');
  const videosContenedor = document.getElementById('videos');

  imagenesContenedor.innerHTML = '';
  videosContenedor.innerHTML = '';

  const res = await fetch('/files');
  const archivos = await res.json();

  archivos.forEach(({ archivo, titulo }) => {
    const extension = archivo.split('.').pop().toLowerCase();
    const ruta = `/uploads/${archivo}`;
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
      const img = document.createElement('img');
      img.src = ruta;
      img.alt = titulo;
      img.onclick = () => abrirModal('img', ruta, titulo);
      imagenesContenedor.appendChild(img);
    } else if (['mp4', 'webm', 'ogg'].includes(extension)) {
      const video = document.createElement('video');
      video.src = ruta;
      video.controls = true;
      video.muted = true;
      video.onclick = () => abrirModal('video', ruta);
      videosContenedor.appendChild(video);
    }
  });
}
function moverCarrusel(id, direccion) {
  const carrusel = document.getElementById(id);
  const scrollAmount = 300 * direccion; // Ajusta el ancho de movimiento
  carrusel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
}

// Modal Functions
function abrirModal(tipo, src, titulo = '') {
  const modal = document.getElementById('modal');
  const modalContenido = document.getElementById('modal-contenido');
  
  modalContenido.innerHTML = ''; // Limpiar

  if (tipo === 'img') {
    const img = document.createElement('img');
    img.src = src;
    img.alt = titulo;
    modalContenido.appendChild(img);
  } else if (tipo === 'video') {
    const video = document.createElement('video');
    video.src = src;
    video.controls = true;
    video.autoplay = true;
    modalContenido.appendChild(video);
  }

  modal.style.display = 'flex'; // Mostrar modal
}

function cerrarModal() {
  const modal = document.getElementById('modal');
  modal.style.display = 'none'; // Ocultar modal
}
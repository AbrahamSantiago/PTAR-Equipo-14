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
      imagenesContenedor.appendChild(img);
    } else if (['mp4', 'webm', 'ogg'].includes(extension)) {
      const video = document.createElement('video');
      video.src = ruta;
      video.controls = true;
      video.muted = true;
      videosContenedor.appendChild(video);
    }
  });
}

function moverCarrusel(id, direccion) {
  const carrusel = document.getElementById(id);
  const scrollAmount = 420 * direccion; // Ajusta el ancho de movimiento
  carrusel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
}

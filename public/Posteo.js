let currentSlideAnuncios = 0;

async function cargarAnuncios() {
  try {
    const response = await fetch('/anuncios'); // Ruta al endpoint donde sirves los anuncios
    const anuncios = await response.json();
    const carousel = document.getElementById('anunciosCarouselInner');

    carousel.innerHTML = '';

    anuncios.forEach((anuncio) => {
      const slide = document.createElement('div');
      slide.className = 'anuncio-slide';

      slide.innerHTML = `
        <h3>${anuncio.titulo}</h3>
        <p>${anuncio.contenido}</p>
      `;

      carousel.appendChild(slide);
    });
  } catch (error) {
    console.error('Error al cargar anuncios:', error);
  }
}

function moverCarruselAnuncios(direction) {
  const carousel = document.getElementById('anunciosCarouselInner');
  const slides = carousel.querySelectorAll('.anuncio-slide');
  const totalSlides = slides.length;

  currentSlideAnuncios += direction;

  if (currentSlideAnuncios >= totalSlides) {
    currentSlideAnuncios = 0;
  } else if (currentSlideAnuncios < 0) {
    currentSlideAnuncios = totalSlides - 1;
  }

  const offset = -currentSlideAnuncios * (slides[0].offsetWidth + 20); // 20px de gap
  carousel.style.transform = `translateX(${offset}px)`;
}

document.addEventListener('DOMContentLoaded', () => {
  cargarAnuncios();
});
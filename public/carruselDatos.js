let currentSlideDatos = 0;

async function cargarDatosInteresantes() {
  try {
    const response = await fetch('/datos');
    const datos = await response.json();
    const carousel = document.getElementById('datosCarouselInner');

    carousel.innerHTML = '';

    datos.forEach((dato) => {
      const slide = document.createElement('div');
      slide.className = 'slide';

       // Solo agregar imagen si existe
      if (dato.imagen) {
        const img = document.createElement('img');
        img.src = `/uploads/${dato.imagen}`;
        img.alt = dato.titulo;
        slide.appendChild(img);
      }

      const img = document.createElement('img');
      img.src = `/uploads/${dato.imagen}`;
      img.alt = dato.titulo;

      const caption = document.createElement('div');
      caption.className = 'caption';
      caption.innerHTML = `
        <h3>${dato.titulo}</h3>
        <p class="description">${dato.contenido}</p>
      `;

      slide.appendChild(img);
      slide.appendChild(caption);

      carousel.appendChild(slide);
    });
  } catch (error) {
    console.error('Error al cargar los datos interesantes:', error);
  }
}

function moveSlideDatos(direction) {
  const carousel = document.getElementById('datosCarouselInner');
  const slides = carousel.querySelectorAll('.slide');
  const totalSlides = slides.length;

  currentSlideDatos += direction;

  if (currentSlideDatos >= totalSlides) {
    currentSlideDatos = 0;
  } else if (currentSlideDatos < 0) {
    currentSlideDatos = totalSlides - 1;
  }

  const offset = -currentSlideDatos * 100;
  carousel.style.transform = `translateX(${offset}%)`;
}

document.addEventListener('DOMContentLoaded', () => {
  cargarDatosInteresantes();
});
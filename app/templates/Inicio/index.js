document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('mouseover', () => {
      link.classList.add('hover-color');
    });
    link.addEventListener('mouseout', () => {
      link.classList.remove('hover-color');
    });
  });
});
document.addEventListener('DOMContentLoaded', () => {
  const imageModal = document.getElementById('imageModal');
  imageModal.addEventListener('show.bs.modal', event => {
    const thumb = event.relatedTarget;                              // miniatura que disparó
    const src   = thumb.getAttribute('data-bs-image');              // ruta real
    const alt   = thumb.getAttribute('alt') || '';
    const modalImg = imageModal.querySelector('#modalImage');
    modalImg.src = src;
    modalImg.alt = alt;
  });
});
//////////////// CARRUSEL
// Datos iniciales de ejemplo con enlaces


// Obtener datos del carrusel desde localStorage
        let carouselData = JSON.parse(localStorage.getItem('carouselData')) || [
            {
                id: 1,
                url: "https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
                link: "https://es.wikipedia.org/wiki/Monta%C3%B1a",
                title: "Montañas Verdes",
                description: "Las montañas verdes ofrecen paisajes impresionantes con su exuberante vegetación y vistas panorámicas. Ideal para senderismo, camping y fotografía de naturaleza. La región cuenta con rutas para todos los niveles de experiencia."
            },
            {
                id: 2,
                url: "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
                link: "https://es.wikipedia.org/wiki/Lago",
                title: "Atardecer en el Lago",
                description: "Disfruta de atardeceres inolvidables en este lago cristalino. Perfecto para actividades acuáticas como kayak, natación y pesca. El lago también ofrece áreas de picnic y observación de aves para toda la familia."
            },
            {
                id: 3,
                url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
                link: "https://es.wikipedia.org/wiki/Bosque",
                title: "Bosque Montañoso",
                description: "Explora este bosque montañoso lleno de vida silvestre y senderos naturales. Con más de 50 km de rutas marcadas, es un paraíso para excursionistas y amantes de la naturaleza. La diversidad de flora y fauna es impresionante."
            }
        ];

        // Elementos del DOM
        const carouselInner = document.getElementById('carousel-inner');
        const indicatorsContainer = document.getElementById('indicators');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');

        // Variables para el carrusel
        let currentIndex = 0;
        let interval;

        // Inicializar el carrusel
        function initCarousel() {
            carouselInner.innerHTML = '';
            indicatorsContainer.innerHTML = '';
            
            carouselData.forEach((item, index) => {
                // Crear elemento del carrusel
                const carouselItem = document.createElement('div');
                carouselItem.className = 'carousel-item';
                if (index === 0) carouselItem.classList.add('active');
                
                carouselItem.innerHTML = `
                    <img src="${item.url}" alt="${item.title}" class="carousel-img">
                    <div class="carousel-caption">
                        <h3>${item.title}</h3>
                        <p>${item.link ? 'Haz clic para ver detalles' : 'Sin enlace asociado'}</p>
                    </div>
                `;
                
                // Agregar evento de clic para abrir enlace
                carouselItem.addEventListener('click', () => {
                    if (item.link) {
                        window.open(item.link, '_blank');
                    }
                });
                
                carouselInner.appendChild(carouselItem);
                
                // Crear indicadores
                const indicator = document.createElement('div');
                indicator.className = 'indicator';
                if (index === 0) indicator.classList.add('active');
                indicator.dataset.index = index;
                
                indicator.addEventListener('click', () => {
                    currentIndex = index;
                    updateCarousel();
                });
                
                indicatorsContainer.appendChild(indicator);
            });
            
            // Iniciar rotación automática
            startCarousel();
        }

        // Actualizar carrusel
        function updateCarousel() {
            const items = document.querySelectorAll('.carousel-item');
            const indicators = document.querySelectorAll('.indicator');
            
            // Ocultar todos los items
            items.forEach(item => item.classList.remove('active'));
            indicators.forEach(indicator => indicator.classList.remove('active'));
            
            // Mostrar item actual
            items[currentIndex].classList.add('active');
            indicators[currentIndex].classList.add('active');
            
            // Actualizar posición
            carouselInner.style.transform = `translateX(-${currentIndex * 100}%)`;
        }

        // Iniciar rotación automática
        function startCarousel() {
            clearInterval(interval);
            interval = setInterval(() => {
                currentIndex = (currentIndex + 1) % carouselData.length;
                updateCarousel();
            }, 5000);
        }

        // Eventos de navegación
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + carouselData.length) % carouselData.length;
            updateCarousel();
            startCarousel();
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % carouselData.length;
            updateCarousel();
            startCarousel();
        });

        // Inicializar el carrusel al cargar la página
        document.addEventListener('DOMContentLoaded', initCarousel);
    
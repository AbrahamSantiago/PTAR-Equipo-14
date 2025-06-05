// app/static/js/index.js

document.addEventListener('DOMContentLoaded', function() {
    // Código existente para el header
    window.addEventListener("scroll", function () {
        var header = document.querySelector("header");
        header.classList.toggle("fixed-top", window.scrollY > 0);
    });

    // Código para el hover del navbar
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.classList.add('hover-color');
        });
        
        link.addEventListener('mouseleave', function() {
            this.classList.remove('hover-color');
        });
    });

    // CÓDIGO DEL CARRUSEL
    const carouselInner = document.getElementById('carousel-inner');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const indicators = document.querySelectorAll('.indicator');
    
    // Verificar que los elementos existen
    if (!carouselInner) {
        console.warn('Carrusel no encontrado - posiblemente no hay imágenes');
        return;
    }
    
    if (!prevBtn || !nextBtn) {
        console.warn('Botones del carrusel no encontrados');
        return;
    }

    const carouselItems = document.querySelectorAll('.carousel-item');
    let currentIndex = 0;
    const totalItems = carouselItems.length;

    if (totalItems === 0) {
        console.warn('No hay elementos en el carrusel');
        return;
    }

    // Función para mostrar slide específico
    function showSlide(index) {
        // Asegurar que el índice esté dentro del rango
        if (index >= totalItems) {
            currentIndex = 0;
        } else if (index < 0) {
            currentIndex = totalItems - 1;
        } else {
            currentIndex = index;
        }

        // Mover el carrusel
        const translateX = -currentIndex * 100;
        carouselInner.style.transform = `translateX(${translateX}%)`;

        // Actualizar clases active
        carouselItems.forEach((item, i) => {
            item.classList.toggle('active', i === currentIndex);
        });

        // Actualizar indicadores
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === currentIndex);
        });
    }

    // Función para ir al siguiente slide
    function nextSlide() {
        showSlide(currentIndex + 1);
    }

    // Función para ir al slide anterior
    function prevSlide() {
        showSlide(currentIndex - 1);
    }

    // Event listeners para botones
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Event listeners para indicadores
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showSlide(index);
        });
    });

    // Event listeners para clicks en las imágenes
    carouselItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            const link = this.dataset.link;
            if (link && link.trim() !== '' && link !== 'null') {
                console.log(`Abriendo enlace: ${link}`);
                window.open(link, '_blank');
            } else {
                console.log(`Imagen ${index + 1}: Sin enlace asociado`);
            }
        });
        
        // Cambiar cursor si hay enlace
        const hasLink = item.dataset.link && item.dataset.link.trim() !== '' && item.dataset.link !== 'null';
        item.style.cursor = hasLink ? 'pointer' : 'default';
    });

    // Auto-play del carrusel (opcional)
    let autoPlayInterval;
    
    function startAutoPlay() {
        autoPlayInterval = setInterval(() => {
            nextSlide();
        }, 5000); // Cambia cada 5 segundos
    }

    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
        }
    }

    // Iniciar auto-play
    startAutoPlay();

    // Pausar auto-play cuando el mouse está sobre el carrusel
    const carousel = document.querySelector('.carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', stopAutoPlay);
        carousel.addEventListener('mouseleave', startAutoPlay);
    }

    // Controles de teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });

    // Soporte para gestos táctiles (móvil)
    let touchStartX = 0;
    let touchEndX = 0;

    if (carousel) {
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
    }

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide(); // Swipe izquierda = siguiente
            } else {
                prevSlide(); // Swipe derecha = anterior
            }
        }
    }

    // Inicializar el carrusel
    showSlide(0);

    console.log(`Carrusel inicializado con ${totalItems} elementos`);
});
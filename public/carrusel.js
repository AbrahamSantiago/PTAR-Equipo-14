let currentSlide = 0;

function moveSlide(direction) {
  const carousel = document.getElementById('carouselInner');
  const slides = carousel.querySelectorAll('.slide');
  const totalSlides = slides.length;

  currentSlide += direction;

  if (currentSlide >= totalSlides) {
    currentSlide = 0;
  } else if (currentSlide < 0) {
    currentSlide = totalSlides - 1;
  }

  const offset = -currentSlide * 100;
  carousel.style.transform = `translateX(${offset}%)`;
}
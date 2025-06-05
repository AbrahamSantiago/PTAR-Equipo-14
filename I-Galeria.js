function moverCarrusel(id, direccion) {
  const carrusel = document.getElementById(id);
  const anchoElemento = carrusel.querySelector('img, iframe').offsetWidth + 20;
  carrusel.scrollBy({
    left: direccion * anchoElemento,
    behavior: 'smooth'
  });
}
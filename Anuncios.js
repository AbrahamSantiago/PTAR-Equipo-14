const anuncioForm = document.getElementById('anuncioForm');
const contenedor = document.getElementById('contenedorAnuncios');

anuncioForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const titulo = document.getElementById('tituloAnuncio').value.trim();
  const mensaje = document.getElementById('mensajeAnuncio').value.trim();
  const imagenInput = document.getElementById('imagenAnuncio');
  const archivo = imagenInput.files[0];

  if (!titulo || !mensaje) return;

  const tarjeta = document.createElement('div');
  tarjeta.className = 'tarjeta-dato';

  const h3 = document.createElement('h3');
  h3.textContent = titulo;

  const p = document.createElement('p');
  p.textContent = mensaje;

  const btn = document.createElement('button');
  btn.textContent = "Eliminar";
  btn.onclick = () => tarjeta.remove();

  tarjeta.appendChild(h3);
  tarjeta.appendChild(p);
  tarjeta.appendChild(btn);

  if (archivo && archivo.type.startsWith('image')) {
    const img = document.createElement('img');
    img.src = URL.createObjectURL(archivo);
    tarjeta.appendChild(img);
  }

  contenedor.appendChild(tarjeta);
  anuncioForm.reset();
});
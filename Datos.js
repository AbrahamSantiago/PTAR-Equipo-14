const datoForm = document.getElementById('datoForm');
const contenedor = document.getElementById('contenedorDatos');

datoForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const titulo = document.getElementById('titulo').value.trim();
  const contenido = document.getElementById('contenido').value.trim();
  const imagenInput = document.getElementById('imagenDato');
  const archivo = imagenInput.files[0];

  if (!titulo || !contenido) return;

  const tarjeta = document.createElement('div');
  tarjeta.className = 'tarjeta-dato';

  const h3 = document.createElement('h3');
  h3.textContent = titulo;

  const p = document.createElement('p');
  p.textContent = contenido;

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
  datoForm.reset();
});

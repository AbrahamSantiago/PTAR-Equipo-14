const anuncioForm = document.getElementById('anuncioForm');
const contenedor = document.getElementById('contenedorAnuncios');

anuncioForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const titulo = document.getElementById('tituloAnuncio').value.trim();
  const mensaje = document.getElementById('mensajeAnuncio').value.trim();
  const imagenInput = document.getElementById('imagenAnuncio');
  const archivo = imagenInput.files[0];

  if (!titulo || !mensaje) return;

  const formData = new FormData();
  formData.append('titulo', titulo);
  formData.append('mensaje', mensaje);
  if (archivo) formData.append('imagenAnuncio', archivo);

  const res = await fetch('/agregar-anuncio', {
    method: 'POST',
    body: formData
  });

  if (res.ok) {
    alert('Anuncio agregado correctamente');
    anuncioForm.reset();
    cargarAnuncios();
  } else {
    alert('Error al agregar anuncio');
  }
});

async function cargarAnuncios() {
  contenedor.innerHTML = '';

  const res = await fetch('/anuncios');
  const anuncios = await res.json();

  anuncios.forEach(anuncio => {
    const tarjeta = document.createElement('div');
    tarjeta.className = 'tarjeta-dato';

    const h3 = document.createElement('h3');
    h3.textContent = anuncio.titulo;

    const p = document.createElement('p');
    p.textContent = anuncio.mensaje;

    const btn = document.createElement('button');
    btn.textContent = "Eliminar";
    btn.onclick = async () => {
      await fetch(`/eliminar-anuncio/${encodeURIComponent(anuncio.titulo)}`, {
        method: 'DELETE'
      });
      cargarAnuncios();
    };

    tarjeta.appendChild(h3);
    tarjeta.appendChild(p);
    tarjeta.appendChild(btn);

    if (anuncio.imagen) {
      const img = document.createElement('img');
      img.src = `/uploads/${anuncio.imagen}`;
      tarjeta.appendChild(img);
    }

    contenedor.appendChild(tarjeta);
  });
}

document.addEventListener('DOMContentLoaded', cargarAnuncios);
const datoForm = document.getElementById('datoForm');
const contenedor = document.getElementById('contenedorDatos');

datoForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const titulo = document.getElementById('titulo').value.trim();
  const contenido = document.getElementById('contenido').value.trim();
  const imagenInput = document.getElementById('imagenDato');
  const archivo = imagenInput.files[0];

  if (!titulo || !contenido) return;

  const formData = new FormData();
  formData.append('titulo', titulo);
  formData.append('contenido', contenido);
  if (archivo) formData.append('imagenDato', archivo);

  const res = await fetch('/agregar-dato', {
    method: 'POST',
    body: formData
  });

  if (res.ok) {
    alert('Dato agregado correctamente');
    datoForm.reset();
    cargarDatos();
  }
});

async function cargarDatos() {
  contenedor.innerHTML = '';

  const res = await fetch('/datos');
  const datos = await res.json();

  datos.forEach(dato => {
    const tarjeta = document.createElement('div');
    tarjeta.className = 'tarjeta-dato';

    const h3 = document.createElement('h3');
    h3.textContent = dato.titulo;

    const p = document.createElement('p');
    p.textContent = dato.contenido;

    const btn = document.createElement('button');
    btn.textContent = "Eliminar";
    btn.onclick = async () => {
      await fetch(`/eliminar-dato/${encodeURIComponent(dato.titulo)}`, {
        method: 'DELETE'
      });
      cargarDatos();
    };

    tarjeta.appendChild(h3);
    tarjeta.appendChild(p);
    tarjeta.appendChild(btn);

    if (dato.imagen) {
      const img = document.createElement('img');
      img.src = `/uploads/${dato.imagen}`;
      tarjeta.appendChild(img);
    }

    contenedor.appendChild(tarjeta);
  });
}

// Cargar datos al iniciar
document.addEventListener('DOMContentLoaded', cargarDatos);


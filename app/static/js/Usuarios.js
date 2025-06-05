const usuarioForm = document.getElementById('usuarioForm');
const usuariosContainer = document.getElementById('usuariosContainer');
const tipoLogueado = localStorage.getItem('tipoUsuario');

usuarioForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();
  const password = document.getElementById('password').value.trim();
  const tipoUsuario = document.getElementById('tipoUsuario').value;

  if (!nombre || !password || !tipoUsuario) {
    alert('Completa todos los campos.');
    return;
  }

  const usuario = { nombre, password, tipoUsuario };

  const res = await fetch('/agregar-usuario', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(usuario)
  });

  if (res.ok) {
    alert('Usuario agregado correctamente');
    usuarioForm.reset();
    cargarUsuarios();
  } else {
    alert('Error al agregar usuario');
  }
});

async function cargarUsuarios() {
  usuariosContainer.innerHTML = '';

  const res = await fetch('/usuarios');
  const usuarios = await res.json();

  usuarios.forEach(usuario => {
    const div = document.createElement('div');
    div.className = 'usuario';

    div.innerHTML = `
      <strong>Nombre:</strong> ${usuario.nombre}<br>
      <strong>Tipo:</strong> ${usuario.tipoUsuario}<br>
      ${tipoLogueado === 'Administrador' ? `<strong>Contraseña:</strong> ${usuario.password}<br>` : ''}
    `;

    // 🔒 Solo Admin e Ingeniero pueden eliminar, pero Ingeniero solo a Estudiantes
    const puedeEliminar = (
      (tipoLogueado === 'Administrador' && usuario.tipoUsuario !== 'Administrador') ||
      (tipoLogueado === 'Ingeniero' && usuario.tipoUsuario === 'Estudiante')
    );

    if (puedeEliminar) {
      const btnEliminar = document.createElement('button');
      btnEliminar.textContent = "Eliminar";
      btnEliminar.onclick = async () => {
        await fetch(`/eliminar-usuario/${encodeURIComponent(usuario.nombre)}`, { method: 'DELETE' });
        cargarUsuarios();
      };
      div.appendChild(btnEliminar);
    }

    usuariosContainer.appendChild(div);
  });
}

document.addEventListener('DOMContentLoaded', cargarUsuarios);
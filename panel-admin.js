document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.getElementById('logout-btn');
  const totalReclamos = document.getElementById('total-reclamos');
  const reclamosPendientes = document.getElementById('reclamos-pendientes');
  const reclamosResueltos = document.getElementById('reclamos-resueltos');
  const tablaUsuarios = document.querySelector('#tabla-usuarios tbody');
  const formCategoria = document.getElementById('form-categoria');
  const listaCategorias = document.getElementById('lista-categorias');

  // ✅ Verificar login de administrador
  const user = JSON.parse(localStorage.getItem('loggedUser'));
  if (!user || user.role !== 'admin') {
    window.location.href = 'login.html';
    return;
  }

  // 🔐 Cerrar sesión
  logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('loggedUser');
    showNotification('Sesión cerrada correctamente.', 'info');
    setTimeout(() => window.location.href = 'index.html', 1000);
  });

  // 📊 Cargar reportes
  function cargarReportes() {
    const reclamos = JSON.parse(localStorage.getItem('reclamos') || '[]');
    totalReclamos.textContent = reclamos.length;
    reclamosPendientes.textContent = reclamos.filter(r => r.estado !== 'Resuelto' && r.estado !== 'Cerrado').length;
    reclamosResueltos.textContent = reclamos.filter(r => r.estado === 'Resuelto' || r.estado === 'Cerrado').length;

    // 📈 Gráfico de tipos de problemas
    const tipos = ['bache', 'alumbrado', 'limpieza', 'otro'];
    const counts = tipos.map(t => reclamos.filter(r => r.tipo === t).length);

    const ctx = document.getElementById('grafico').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Baches', 'Alumbrado', 'Limpieza', 'Otros'],
        datasets: [{
          label: 'Reclamos por tipo',
          data: counts,
          backgroundColor: ['#ff6b6b', '#feca57', '#1dd1a1', '#54a0ff']
        }]
      },
      options: { responsive: true, plugins: { legend: { display: false } } }
    });
  }

  // 👤 Cargar usuarios
  function cargarUsuarios() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    tablaUsuarios.innerHTML = '';

    users.forEach((u, index) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${u.nombre || '(sin nombre)'}</td>
        <td>${u.email}</td>
        <td>${u.role}</td>
        <td><button class="btn-eliminar" data-index="${index}">Eliminar</button></td>
      `;
      tablaUsuarios.appendChild(tr);
    });

    document.querySelectorAll('.btn-eliminar').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = e.target.getAttribute('data-index');
        eliminarUsuario(index);
      });
    });
  }

  function eliminarUsuario(index) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    users.splice(index, 1);
    localStorage.setItem('users', JSON.stringify(users));
    showNotification('Usuario eliminado correctamente.', 'success');
    cargarUsuarios();
  }

  // 📝 Categorías
  function cargarCategorias() {
    const categorias = JSON.parse(localStorage.getItem('categorias') || '["bache","alumbrado","limpieza","otro"]');
    listaCategorias.innerHTML = '';
    categorias.forEach((c, i) => {
      const li = document.createElement('li');
      li.textContent = c;
      const btn = document.createElement('button');
      btn.textContent = '❌';
      btn.addEventListener('click', () => eliminarCategoria(i));
      li.appendChild(btn);
      listaCategorias.appendChild(li);
    });
  }

  formCategoria.addEventListener('submit', (e) => {
    e.preventDefault();
    const nueva = document.getElementById('nueva-categoria').value.trim();
    if (!nueva) return;

    const categorias = JSON.parse(localStorage.getItem('categorias') || '[]');
    categorias.push(nueva);
    localStorage.setItem('categorias', JSON.stringify(categorias));

    showNotification(`Categoría "${nueva}" agregada.`, 'success');
    formCategoria.reset();
    cargarCategorias();
  });

  function eliminarCategoria(index) {
    const categorias = JSON.parse(localStorage.getItem('categorias') || '[]');
    categorias.splice(index, 1);
    localStorage.setItem('categorias', JSON.stringify(categorias));
    showNotification('Categoría eliminada.', 'info');
    cargarCategorias();
  }

  // Inicializar
  cargarReportes();
  cargarUsuarios();
  cargarCategorias();
});

// 🔔 Notificaciones
function showNotification(message, type = 'info') {
  const container = document.getElementById('notification-container');
  const notif = document.createElement('div');
  notif.className = `notification ${type}`;
  notif.textContent = message;
  container.appendChild(notif);

  setTimeout(() => {
    notif.classList.add('hide');
    setTimeout(() => notif.remove(), 300);
  }, 2500);
}

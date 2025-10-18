document.addEventListener('DOMContentLoaded', () => {
  const filtroTipo = document.getElementById('filtro-tipo');
  const tablaReclamos = document.querySelector('#tabla-reclamos tbody');
  const logoutBtn = document.getElementById('logout-btn');

  // ✅ Verificar login de autoridad
  const user = JSON.parse(localStorage.getItem('loggedUser'));
  if (!user || user.role !== 'autoridad') {
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

  // 📥 Cargar reclamos
  function cargarReclamos() {
    const reclamos = JSON.parse(localStorage.getItem('reclamos') || '[]');
    const filtro = filtroTipo.value;

    tablaReclamos.innerHTML = '';

    reclamos
      .filter(r => filtro === 'todos' || r.tipo === filtro)
      .forEach((r, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${r.tipo}</td>
          <td>${r.descripcion}</td>
          <td>${r.ubicacion}</td>
          <td>${r.estado}</td>
          <td>${r.fecha}</td>
          <td>
            <select data-index="${index}" class="cambiar-estado">
              <option value="Recibido" ${r.estado === 'Recibido' ? 'selected' : ''}>Recibido</option>
              <option value="En proceso" ${r.estado === 'En proceso' ? 'selected' : ''}>En proceso</option>
              <option value="Resuelto" ${r.estado === 'Resuelto' ? 'selected' : ''}>Resuelto</option>
              <option value="Cerrado" ${r.estado === 'Cerrado' ? 'selected' : ''}>Cerrado</option>
            </select>
          </td>
        `;
        tablaReclamos.appendChild(tr);
      });

    // Agregar eventos a los selectores de estado
    document.querySelectorAll('.cambiar-estado').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const index = e.target.getAttribute('data-index');
        actualizarEstado(index, e.target.value);
      });
    });
  }

  // 🔄 Actualizar estado del reclamo
  function actualizarEstado(index, nuevoEstado) {
    const reclamos = JSON.parse(localStorage.getItem('reclamos') || '[]');
    if (!reclamos[index]) return;

    reclamos[index].estado = nuevoEstado;
    localStorage.setItem('reclamos', JSON.stringify(reclamos));
    showNotification(`Estado actualizado a: ${nuevoEstado}`, 'success');
    cargarReclamos();
  }

  filtroTipo.addEventListener('change', cargarReclamos);
  cargarReclamos();
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

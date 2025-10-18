document.addEventListener('DOMContentLoaded', () => {
  const formReclamo = document.getElementById('form-reclamo');
  const tablaHistorial = document.querySelector('#tabla-historial tbody');
  const logoutBtn = document.getElementById('logout-btn');

  // ✅ Verificar si el usuario está logueado
  const user = JSON.parse(localStorage.getItem('loggedUser'));
  if (!user || user.role !== 'ciudadano') {
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

  // 📌 Guardar reclamo
  formReclamo.addEventListener('submit', (e) => {
    e.preventDefault();
    const tipo = document.getElementById('tipo').value;
    const descripcion = document.getElementById('descripcion').value.trim();
    const ubicacion = document.getElementById('ubicacion').value.trim();
    const imagenInput = document.getElementById('imagen');

    if (!tipo || !descripcion || !ubicacion) {
      showNotification('Por favor completa todos los campos obligatorios.', 'error');
      return;
    }

    // 📷 Si hay imagen, convertir a URL local (base64 simulada)
    let imagenURL = '';
    if (imagenInput.files.length > 0) {
      const file = imagenInput.files[0];
      imagenURL = URL.createObjectURL(file);
    }

    const nuevoReclamo = {
      tipo,
      descripcion,
      ubicacion,
      imagen: imagenURL,
      estado: 'Recibido',
      fecha: new Date().toLocaleString()
    };

    // Guardar en localStorage
    const reclamos = JSON.parse(localStorage.getItem('reclamos') || '[]');
    reclamos.push({ ...nuevoReclamo, user: user.email });
    localStorage.setItem('reclamos', JSON.stringify(reclamos));

    showNotification('✅ Reclamo enviado correctamente.', 'success');
    formReclamo.reset();
    cargarHistorial();
  });

  // 📝 Cargar historial del usuario
    function cargarHistorial() {
    const reclamos = JSON.parse(localStorage.getItem('reclamos') || '[]');
    const misReclamos = reclamos.filter(r => r.user === user.email);

    tablaHistorial.innerHTML = '';
    misReclamos.forEach(r => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${r.tipo}</td>
        <td>${r.descripcion}</td>
        <td>${r.estado}</td>
        <td>${r.fecha}</td>
      `;
      tablaHistorial.appendChild(tr);
    });
  }

  cargarHistorial();
});

// 🔔 Notificaciones reutilizables
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

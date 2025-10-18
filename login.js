// ✅ Esperar a que cargue todo el contenido
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const role = document.getElementById('role').value;

    if (!email || !password || !role) {
      showNotification('Por favor, completa todos los campos.', 'error');
      return;
    }

    try {
      const res = await fetch('php/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ email, password, role })
      });

      const data = await res.json();

      if (data.success) {
        showNotification(`✅ Bienvenido ${role.toUpperCase()}`, 'success');
        localStorage.setItem('loggedUser', JSON.stringify({ email, role }));

        setTimeout(() => {
          if (role === 'ciudadano') {
            window.location.href = 'panel-ciudadano.html';
          } else if (role === 'autoridad') {
            window.location.href = 'panel-autoridad.html';
          } else {
            window.location.href = 'panel-admin.html';
          }
        }, 1200);
      } else {
        showNotification('❌ ' + data.message, 'error');
      }
    } catch (err) {
      console.error(err);
      showNotification('⚠️ Error de conexión con el servidor.', 'error');
    }
  });
});

// ✅ Función para mostrar notificaciones
function showNotification(message, type = 'info') {
  const container = document.getElementById('notification-container');
  
  if (!container) {
    console.warn('⚠️ No se encontró el contenedor de notificaciones (#notification-container)');
    return;
  }

  const notif = document.createElement('div');
  notif.className = `notification ${type}`;
  notif.textContent = message;
  container.appendChild(notif);

  setTimeout(() => {
    notif.classList.add('hide');
    setTimeout(() => notif.remove(), 300);
  }, 2500);
}

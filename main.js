// main.js — se usará luego para funciones de login y roles
console.log("Sistema Ciudadano iniciado...");
// =====================
// Simulación de usuarios
// =====================
const users = [
  { username: "juan", password: "1234", role: "ciudadano" },
  { username: "maria", password: "1234", role: "autoridad" },
  { username: "admin", password: "admin", role: "admin" }
];

// =====================
// Manejador de Login
// =====================
const loginForm = document.getElementById('loginForm');
const loginMessage = document.getElementById('loginMessage');

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const role = document.getElementById('role').value;

    const foundUser = users.find(u => u.username === username && u.password === password && u.role === role);

    if (foundUser) {
      loginMessage.textContent = "✅ Acceso exitoso";
      loginMessage.style.color = "green";

      // Guardar sesión en localStorage
      localStorage.setItem('loggedUser', JSON.stringify(foundUser));

      // Redireccionar según el rol
      setTimeout(() => {
        if (role === "ciudadano") window.location.href = "ciudadano.html";
        if (role === "autoridad") window.location.href = "autoridad.html";
        if (role === "admin") window.location.href = "admin.html";
      }, 1000);

    } else {
      loginMessage.textContent = "❌ Usuario, contraseña o rol incorrecto";
      loginMessage.style.color = "red";
    }
  });
}

// =====================
// Función de Logout (para usar en paneles)
// =====================
function logout() {
  localStorage.removeItem('loggedUser');
  window.location.href = "login.html";
}
// =========================
// Función global de notificación
// =========================
function showNotification(message, type = 'info') {
  const container = document.getElementById('notification-container');
  const notif = document.createElement('div');
  notif.className = `notification ${type}`;
  notif.textContent = message;
  container.appendChild(notif);

  // Eliminar después de 4s
  setTimeout(() => {
    notif.remove();
  }, 4000);
}
// =========================
// Simulación de correo
// =========================
function enviarCorreoSimulado(usuario, asunto, mensaje) {
  let bandejas = JSON.parse(localStorage.getItem('bandejasCorreo')) || {};

  if (!bandejas[usuario]) {
    bandejas[usuario] = [];
  }

  bandejas[usuario].push({
    asunto,
    mensaje,
    fecha: new Date().toLocaleString()
  });

  localStorage.setItem('bandejasCorreo', JSON.stringify(bandejas));
}

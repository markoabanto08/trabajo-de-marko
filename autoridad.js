// ==========================
// Verificar sesión activa
// ==========================
const currentUser = JSON.parse(localStorage.getItem('loggedUser'));
if (!currentUser || currentUser.role !== 'autoridad') {
  window.location.href = 'login.html';
}

// ==========================
// Elementos DOM
// ==========================
const tablaBody = document.querySelector('#tablaAutoridad tbody');
const totalReclamosEl = document.getElementById('totalReclamos');
const enProcesoEl = document.getElementById('enProceso');
const resueltosEl = document.getElementById('resueltos');
const pendientesEl = document.getElementById('pendientes');

// ==========================
// Datos
// ==========================
let reclamos = JSON.parse(localStorage.getItem('reclamos')) || [];

// ==========================
// Cambiar estado del reclamo
// ==========================
function cambiarEstado(id) {
  const index = reclamos.findIndex(r => r.id === id);
  if (index !== -1) {
    const reclamo = reclamos[index];
    const estadoActual = reclamo.estado;
    let nuevoEstado = estadoActual;

    if (estadoActual === 'Recibido') nuevoEstado = 'En proceso';
    else if (estadoActual === 'En proceso') nuevoEstado = 'Resuelto';
    else if (estadoActual === 'Resuelto') nuevoEstado = 'Cerrado';

    reclamo.estado = nuevoEstado;
    reclamos[index] = reclamo;
    localStorage.setItem('reclamos', JSON.stringify(reclamos));

    // ✅ Notificación interna para autoridad
    showNotification(`Estado cambiado a: ${nuevoEstado}`, 'info');

    // ✅ Simular correo al ciudadano
    enviarCorreoSimulado(
      reclamo.user,
      `Actualización de reclamo #${reclamo.id}`,
      `Tu reclamo sobre ${reclamo.tipo} ha pasado a estado: ${nuevoEstado}`
    );

    renderTabla();
    actualizarIndicadores();
  }
}

// ==========================
// Renderizar tabla
// ==========================
function renderTabla() {
  tablaBody.innerHTML = '';
  reclamos.forEach(r => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${r.tipo}</td>
      <td>${r.prioridad}</td>
      <td>${r.descripcion}</td>
      <td>${r.user}</td>
      <td>${r.estado}</td>
      <td>
        ${r.estado !== 'Cerrado' ? 
          `<button class="estado-btn" onclick="cambiarEstado(${r.id})">Cambiar estado</button>` : 
          `<span>✅ Cerrado</span>`}
      </td>
    `;
    tablaBody.appendChild(row);
  });
}

// ==========================
// Indicadores
// ==========================
function actualizarIndicadores() {
  totalReclamosEl.textContent = reclamos.length;
  enProcesoEl.textContent = reclamos.filter(r => r.estado === 'En proceso').length;
  resueltosEl.textContent = reclamos.filter(r => r.estado === 'Resuelto').length;
  pendientesEl.textContent = reclamos.filter(r => r.estado === 'Recibido').length;
}

// ==========================
// Inicialización
// ==========================
renderTabla();
actualizarIndicadores();

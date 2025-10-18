// ==========================
// Verificar sesión activa
// ==========================
const currentUser = JSON.parse(localStorage.getItem('loggedUser'));
if (!currentUser || currentUser.role !== 'ciudadano') {
  window.location.href = 'login.html';
}

// ==========================
// Referencias a elementos
// ==========================
const reclamoForm = document.getElementById('reclamoForm');
const tablaBody = document.querySelector('#tablaReclamos tbody');

// Cargar reclamos existentes
let reclamos = JSON.parse(localStorage.getItem('reclamos')) || [];

// ==========================
// Guardar nuevo reclamo
// ==========================
reclamoForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const tipo = document.getElementById('tipo').value;
  const prioridad = document.getElementById('prioridad').value;
  const descripcion = document.getElementById('descripcion').value;
  const ubicacion = document.getElementById('ubicacion').value;
  const imagenInput = document.getElementById('imagen');

  let imagenURL = '';
  if (imagenInput.files && imagenInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      imagenURL = e.target.result;
      guardarReclamo(tipo, prioridad, descripcion, ubicacion, imagenURL);
    };
    reader.readAsDataURL(imagenInput.files[0]);
  } else {
    guardarReclamo(tipo, prioridad, descripcion, ubicacion, imagenURL);
  }

  reclamoForm.reset();
});

// ==========================
// Función para guardar reclamo
// ==========================
function guardarReclamo(tipo, prioridad, descripcion, ubicacion, imagenURL) {
  const nuevoReclamo = {
    id: Date.now(),
    user: currentUser.username,
    tipo,
    prioridad,
    descripcion,
    ubicacion,
    imagen: imagenURL,
    estado: 'Recibido',
    fecha: new Date().toLocaleString()
  };

  reclamos.push(nuevoReclamo);
  localStorage.setItem('reclamos', JSON.stringify(reclamos));
  renderTabla();
}

// ==========================
// Renderizar tabla de reclamos
// ==========================
function renderTabla() {
  tablaBody.innerHTML = '';
  const misReclamos = reclamos.filter(r => r.user === currentUser.username);
  misReclamos.forEach(r => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${r.tipo}</td>
      <td>${r.prioridad}</td>
      <td>${r.descripcion}</td>
      <td>${r.estado}</td>
      <td>${r.fecha}</td>
    `;
    tablaBody.appendChild(row);
  });
}

// Inicializar tabla al cargar
renderTabla();

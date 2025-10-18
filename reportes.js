// Datos simulados (pueden venir de un backend real)
const datosReclamos = [
  { tipo: 'Baches', ubicacion: 'Centro', estado: 'resuelto' },
  { tipo: 'Alumbrado', ubicacion: 'Norte', estado: 'pendiente' },
  { tipo: 'Limpieza', ubicacion: 'Sur', estado: 'resuelto' },
  { tipo: 'Baches', ubicacion: 'Centro', estado: 'pendiente' },
  { tipo: 'Otros', ubicacion: 'Este', estado: 'resuelto' },
  { tipo: 'Alumbrado', ubicacion: 'Centro', estado: 'resuelto' },
];

// === 1. Resumen ===
const total = datosReclamos.length;
const atendidos = datosReclamos.filter(r => r.estado === 'resuelto').length;
const pendientes = total - atendidos;

document.getElementById('total-reclamos').textContent = total;
document.getElementById('reclamos-atendidos').textContent = atendidos;
document.getElementById('reclamos-pendientes').textContent = pendientes;

// === 2. Gráfico por tipo ===
const tipos = {};
datosReclamos.forEach(r => {
  tipos[r.tipo] = (tipos[r.tipo] || 0) + 1;
});

new Chart(document.getElementById('graficoTipo'), {
  type: 'pie',
  data: {
    labels: Object.keys(tipos),
    datasets: [{
      data: Object.values(tipos),
      backgroundColor: ['#4caf50', '#2196f3', '#ff9800', '#9c27b0'],
    }]
  }
});

// === 3. Gráfico por ubicación ===
const ubicaciones = {};
datosReclamos.forEach(r => {
  ubicaciones[r.ubicacion] = (ubicaciones[r.ubicacion] || 0) + 1;
});

new Chart(document.getElementById('graficoUbicacion'), {
  type: 'bar',
  data: {
    labels: Object.keys(ubicaciones),
    datasets: [{
      label: 'Reclamos',
      data: Object.values(ubicaciones),
      backgroundColor: '#2196f3',
    }]
  }
});

// === 4. Ranking de problemas más frecuentes ===
const ranking = Object.entries(tipos).sort((a, b) => b[1] - a[1]);
const rankingBody = document.getElementById('tabla-ranking-body');
ranking.forEach(([tipo, cantidad], i) => {
  const fila = document.createElement('tr');
  fila.innerHTML = `
    <td>${i + 1}</td>
    <td>${tipo}</td>
    <td>${cantidad}</td>
  `;
  rankingBody.appendChild(fila);
});

// === 5. Exportar a CSV ===
document.getElementById('btnExportarCSV').addEventListener('click', () => {
  let csv = 'Tipo,Ubicación,Estado\n';
  datosReclamos.forEach(r => {
    csv += `${r.tipo},${r.ubicacion},${r.estado}\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'reclamos_reportes.csv';
  a.click();
});

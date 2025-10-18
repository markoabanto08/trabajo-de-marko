const form = document.getElementById('formReclamo');
const mensaje = document.getElementById('mensaje');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  const res = await fetch('php/registrar_reclamo.php', {
    method: 'POST',
    body: formData
  });

  const data = await res.json();
  mensaje.textContent = data.message;
  mensaje.style.color = data.success ? 'green' : 'red';

  if (data.success) {
    form.reset();
  }
});

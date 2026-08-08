// assets/js/register.js
document.getElementById('registerForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const passwordConfirm = document.getElementById('passwordConfirm').value;
  const errorDiv = document.getElementById('registerError');
  errorDiv.classList.add('hidden');

  if (password !== passwordConfirm) {
    errorDiv.textContent = 'Las contraseñas no coinciden';
    errorDiv.classList.remove('hidden');
    return;
  }

  try {
    await pb.collection('users').create({ email, password, passwordConfirm });
    await pb.collection('users').authWithPassword(email, password);
    window.location.href = '{{ "/" | relative_url }}';
  } catch (error) {
    errorDiv.textContent = error.message || 'Error al registrar';
    errorDiv.classList.remove('hidden');
  }
});
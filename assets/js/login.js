// assets/js/login.js
document.getElementById('loginForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const errorDiv = document.getElementById('loginError');
  errorDiv.classList.add('hidden');

  try {
    await pb.collection('users').authWithPassword(email, password);
    window.location.href = '{{ "/restaurant-basic" | relative_url }}';
  } catch (error) {
    errorDiv.textContent = error.message || 'Credenciales incorrectas';
    errorDiv.classList.remove('hidden');
  }
});
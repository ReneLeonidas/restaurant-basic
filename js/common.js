// js/common.js
const PB_URL = 'https://pocketbase.peruano365.org.pe';  // Cambia por tu URL de PocketBase

// Inicializar PocketBase
const pb = new PocketBase(PB_URL);

// Función para verificar autenticación
function checkAuth() {
    if (!pb.authStore.isValid) {
        // Redirigir al login si no está autenticado
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Obtener el usuario actual
function getCurrentUser() {
    return pb.authStore.model;
}

// Cerrar sesión
function logout() {
    pb.authStore.clear();
    window.location.href = 'login.html';
}

// Exponer funciones globalmente
window.pb = pb;
window.checkAuth = checkAuth;
window.getCurrentUser = getCurrentUser;
window.logout = logout;
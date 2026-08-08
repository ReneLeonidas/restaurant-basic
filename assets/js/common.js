// assets/js/common.js
const PB_URL = 'http://127.0.0.1:8090'; // Cambiar según entorno
const pb = new PocketBase(PB_URL);

function checkAuth() {
    if (!pb.authStore.isValid) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

function getCurrentUser() {
    return pb.authStore.model;
}

function logout() {
    pb.authStore.clear();
    window.location.href = 'login.html';
}

function updateUserBadge() {
    const user = getCurrentUser();
    const span = document.getElementById('userEmailText');
    if (span && user) {
        span.textContent = user.email;
    }
}

window.pb = pb;
window.checkAuth = checkAuth;
window.getCurrentUser = getCurrentUser;
window.logout = logout;
window.updateUserBadge = updateUserBadge;
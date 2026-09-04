function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userType');
    window.location.href = 'login.html';
}
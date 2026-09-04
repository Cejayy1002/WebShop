function LogoutBtn() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userType');
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('userType');
    window.location.replace('login.html');
}

window.LogoutBtn = LogoutBtn;

const logoutBtn = document.getElementById('logoutBtn');

if (logoutBtn) {
    logoutBtn.addEventListener('click', function (event) {
        event.preventDefault();
        LogoutBtn();
    });
}
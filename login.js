const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const message = document.getElementById('message');
const errorMessage = document.getElementById('errorMessage');

loginForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const email = usernameInput.value;
    const password = passwordInput.value;

    // ADMIN LOGIN
    if (email === 'admin@gmail.com' && password === 'admin123') {

        localStorage.setItem('currentUser', email);
        localStorage.setItem('userType', 'admin');

        message.textContent = 'Admin login successful!';

        setTimeout(function() {
            window.location.href = 'home.html';
        }, 500);

        return;
    }

    // NORMAL USER LOGIN
    const accounts = JSON.parse(localStorage.getItem('accounts')) || [];

    const account = accounts.find(function(account) {
        return account.email === email &&
        account.password === password;
    });

    if (account) {

        localStorage.setItem('currentUser', account.email);
        localStorage.setItem('userType', 'user');

        message.textContent = 'Login successful!';

        setTimeout(function() {
            window.location.href = 'home.html';
        }, 500);

    } else {

        errorMessage.textContent = 'Invalid email or password.';

    }
});
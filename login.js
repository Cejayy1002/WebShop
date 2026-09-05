const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const message = document.getElementById('message');
const errorMessage = document.getElementById('errorMessage');

document.querySelectorAll('.password-toggle').forEach(function (button) {
    button.addEventListener('click', function () {
        const input = document.getElementById(button.dataset.target);
        const visible = input.type === 'text';
        input.type = visible ? 'password' : 'text';
        button.innerHTML = `<i class="bx ${visible ? 'bx-show' : 'bx-hide'}"></i>`;
        button.setAttribute('aria-label', visible ? 'Show password' : 'Hide password');
    });
});

loginForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const email = usernameInput.value.trim().toLowerCase();
    const password = passwordInput.value;
    message.textContent = '';
    errorMessage.textContent = '';

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

    const accounts = JSON.parse(localStorage.getItem('accounts')) || [];

    const account = accounts.find(function(account) {
        return account.email.toLowerCase() === email &&
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
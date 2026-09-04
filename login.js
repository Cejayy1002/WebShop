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

loginForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = usernameInput.value.trim().toLowerCase();
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

    if (window.location.protocol !== 'file:') {
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const result = await response.json();
            if (!response.ok) {
                errorMessage.textContent = result.error || 'Invalid email or password.';
                return;
            }
            localStorage.setItem('currentUser', result.email);
            localStorage.setItem('userType', 'user');
            message.textContent = 'Login successful!';
            setTimeout(function() { window.location.href = 'home.html'; }, 500);
        } catch {
            errorMessage.textContent = 'Cannot reach the Personal Vault server. Start server.js and try again.';
            return;
        }
        return;
    }

    // Offline fallback for direct file access.
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
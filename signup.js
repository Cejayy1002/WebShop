const signupForm = document.getElementById('signupForm');

document.querySelectorAll('.password-toggle').forEach(function (button) {
    button.addEventListener('click', function () {
        const input = document.getElementById(button.dataset.target);
        const visible = input.type === 'text';
        input.type = visible ? 'password' : 'text';
        button.innerHTML = `<i class="bx ${visible ? 'bx-show' : 'bx-hide'}"></i>`;
        button.setAttribute('aria-label', visible ? 'Show password' : 'Hide password');
    });
});

signupForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('newEmail').value.trim().toLowerCase();
    const password = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const message = document.getElementById('message');

    // Check if passwords match
    if (password !== confirmPassword) {
        message.textContent = 'Passwords do not match.';
        return;
    }

    if (window.location.protocol !== 'file:') {
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const result = await response.json();
            if (!response.ok) {
                message.textContent = result.error || 'Unable to create the account.';
                return;
            }
        } catch {
            message.textContent = 'Cannot reach the Personal Vault server. Start server.js and try again.';
            return;
        }
        message.textContent = 'Account created successfully!';
        setTimeout(function() { window.location.href = 'login.html'; }, 1000);
        return;
    }

    // Offline fallback for direct file access.
    let accounts = JSON.parse(localStorage.getItem('accounts')) || [];

    // Prevent someone from creating the admin email
    if (email === 'admin@gmail.com') {
        message.textContent = 'This email cannot be registered.';
        return;
    }

    // Check if email already exists
    const existingAccount = accounts.find(function(account) {
        return account.email === email;
    });

    if (existingAccount) {
        message.textContent = 'This email is already registered.';
        return;
    }

    // Create account
    const newAccount = {
        email: email,
        password: password
    };

    accounts.push(newAccount);

    // Save account
    localStorage.setItem('accounts', JSON.stringify(accounts));

    message.textContent = 'Account created successfully!';

    // Return to login
    setTimeout(function() {
        window.location.href = 'login.html';
    }, 1000);
});
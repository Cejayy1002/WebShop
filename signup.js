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

signupForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('newEmail').value.trim().toLowerCase();
    const password = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const message = document.getElementById('message');
    const errorMessage = document.getElementById('errorMessage');
    message.textContent = '';
    errorMessage.textContent = '';

    if (!firstName || !lastName) {
        errorMessage.textContent = 'Please enter your first and last name.';
        return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        errorMessage.textContent = 'Passwords do not match.';
        return;
    }

    let accounts = JSON.parse(localStorage.getItem('accounts')) || [];

    // Prevent someone from creating the admin email
    if (email === 'admin@gmail.com') {
        errorMessage.textContent = 'This email cannot be registered.';
        return;
    }

    // Check if email already exists
    const existingAccount = accounts.find(function(account) {
        return account.email === email;
    });

    if (existingAccount) {
        errorMessage.textContent = 'This email is already registered.';
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
    const profiles = JSON.parse(localStorage.getItem('userProfiles') || '{}');
    profiles[email] = {
        firstName: firstName,
        lastName: lastName,
        image: ''
    };
    localStorage.setItem('userProfiles', JSON.stringify(profiles));

    message.textContent = 'Account created successfully!';

    // Return to login
    setTimeout(function() {
        window.location.href = 'login.html';
    }, 1000);
});
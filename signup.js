const signupForm = document.getElementById('signupForm');

signupForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('newEmail').value;
    const password = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const message = document.getElementById('signupMessage');

    // Check if passwords match
    if (password !== confirmPassword) {
        message.textContent = 'Passwords do not match.';
        return;
    }

    // Get existing accounts
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
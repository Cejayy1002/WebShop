const settingsForm = document.getElementById('settingsForm');
const settingsMessage = document.getElementById('settingsMessage');

const savedSavings = JSON.parse(localStorage.getItem('savings') || 'null');
if (savedSavings) {
    document.getElementById('adminName').value = savedSavings.adminName || '';
    document.getElementById('adminEmail').value = savedSavings.adminEmail || 0;
    document.getElementById('storeName').value = savedSavings.storeName || 0;
    document.getElementById('newPassword').value = savedSavings.savingsNote || '';
    document.getElementById('confirmPassword').value = savedSavings.deadline || '';
    document.getElementById('orderNotifications').checked = savedSavings.orderNotifications !== false;
    document.getElementById('stockNotifications').checked = savedSavings.stockNotifications === true;
}

settingsForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    localStorage.setItem('savings', JSON.stringify({
        adminName: document.getElementById('adminName').value,
        adminEmail: document.getElementById('adminEmail').value,
        storeName: document.getElementById('storeName').value,
        savingsNote: newPassword,
        deadline: confirmPassword,
        orderNotifications: document.getElementById('orderNotifications').checked,
        stockNotifications: document.getElementById('stockNotifications').checked
    }));

    settingsMessage.textContent = 'Savings saved.';
    settingsMessage.className = 'settings-success';
});

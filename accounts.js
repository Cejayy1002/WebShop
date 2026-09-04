const socialAccountsList = document.getElementById('socialAccountsList');
const socialAccountFormPanel = document.getElementById('socialAccountFormPanel');
const socialAccountForm = document.getElementById('socialAccountForm');
const accountEditIndex = document.getElementById('accountEditIndex');
const accountFormTitle = document.getElementById('accountFormTitle');
const accountFormDescription = document.getElementById('accountFormDescription');
const accountSubmitButton = document.getElementById('accountSubmitButton');
const cancelEditButton = document.getElementById('cancelEditButton');

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function safeUrl(value) {
    try {
        const url = new URL(value);
        return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
    } catch {
        return '';
    }
}

function accountDetailsMarkup(account) {
    const websiteUrl = safeUrl(account.url);
    return `<div class="account-extra" hidden>
        <span>Username: ${escapeHtml(account.handle)}</span>
        <span>Password: <b>••••••••</b></span>
        ${websiteUrl ? `<a href="${escapeHtml(websiteUrl)}" target="_blank" rel="noopener">Open website</a>` : ''}
    </div>`;
}

function loadSocialAccounts() {
    const accounts = JSON.parse(localStorage.getItem('passwordAccounts')) || [];
    document.getElementById('accountTotal').textContent = accounts.length;
    document.getElementById('usernameTotal').textContent = accounts.length;
    document.getElementById('passwordTotal').textContent = accounts.length;
    socialAccountsList.innerHTML = accounts.length
        ? accounts.map((account, index) => {
            const logoUrl = safeUrl(account.logo);
            const logo = logoUrl
                ? `<img class="account-logo" src="${escapeHtml(logoUrl)}" alt="" data-fallback="${escapeHtml(account.platform)}">`
                : `<span class="account-logo account-logo-fallback">${escapeHtml((account.platform || '?').charAt(0).toUpperCase())}</span>`;
            return `<div class="account-row${account.favorite ? ' is-favorite' : ''}">
                ${logo}
                <div class="account-details"><strong>${escapeHtml(account.platform)}${account.favorite ? ' <span class="favorite-mark" aria-label="Favorite">★</span>' : ''}</strong><span>${escapeHtml(account.handle)}</span>${accountDetailsMarkup(account)}</div>
                <div class="account-actions"><span class="account-password"><span class="masked-password" data-index="${index}">••••••••</span><button class="icon-button reveal-password" data-index="${index}" type="button" aria-label="Show password"><i class="bx bx-show"></i></button></span><span class="account-action-status" role="status"></span><button class="account-menu-toggle" data-index="${index}" type="button" aria-label="Account actions" aria-expanded="false"><i class="bx bx-dots-vertical-rounded"></i></button><div class="account-menu" data-index="${index}" hidden>
                    <button type="button" data-action="favorite">${account.favorite ? 'Remove from favorites' : 'Add to favorites'}</button>
                    <button type="button" data-action="details">View details</button>
                    <button type="button" data-action="copy-username">Copy username</button>
                    <button type="button" data-action="copy-password">Copy password</button>
                    <button type="button" data-action="edit">Edit</button>
                    <button type="button" class="danger-action" data-action="delete">Delete</button>
                </div>
            </div>`;
        }).join('')
        : '<p class="empty-state">No accounts saved yet.</p>';

    socialAccountsList.querySelectorAll('.account-logo[data-fallback]').forEach(function (image) {
        image.addEventListener('error', function () {
            const fallback = document.createElement('span');
            fallback.className = 'account-logo account-logo-fallback';
            fallback.textContent = image.dataset.fallback.charAt(0).toUpperCase();
            image.replaceWith(fallback);
        }, { once: true });
    });
}

function resetAccountForm() {
    socialAccountForm.reset();
    accountEditIndex.value = '';
    accountFormTitle.textContent = 'Add an account';
    accountFormDescription.textContent = 'Save a service, username, and password.';
    accountSubmitButton.textContent = 'Save account';
    cancelEditButton.hidden = true;
    document.getElementById('accountPassword').type = 'password';
    document.querySelector('.password-toggle').innerHTML = '<i class="bx bx-show"></i>';
    document.querySelector('.password-toggle').setAttribute('aria-label', 'Show password');
    socialAccountFormPanel.hidden = true;
}

document.getElementById('addSocialButton').addEventListener('click', function () {
    if (accountEditIndex.value !== '') {
        resetAccountForm();
        return;
    }
    socialAccountFormPanel.hidden = !socialAccountFormPanel.hidden;
});

socialAccountForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const accounts = JSON.parse(localStorage.getItem('passwordAccounts')) || [];
    const existingAccount = accountEditIndex.value === '' ? null : accounts[Number(accountEditIndex.value)];
    const account = {
        platform: document.getElementById('socialPlatform').value.trim(),
        handle: document.getElementById('socialHandle').value.trim(),
        password: document.getElementById('accountPassword').value,
        url: document.getElementById('accountUrl').value.trim(),
        logo: document.getElementById('accountLogo').value.trim(),
        favorite: existingAccount ? existingAccount.favorite === true : false
    };
    if (accountEditIndex.value === '') {
        accounts.push(account);
    } else {
        accounts[Number(accountEditIndex.value)] = account;
    }
    localStorage.setItem('passwordAccounts', JSON.stringify(accounts));
    resetAccountForm();
    loadSocialAccounts();
});

socialAccountsList.addEventListener('click', function (event) {
    const button = event.target.closest('button');
    if (!button) return;
    const accounts = JSON.parse(localStorage.getItem('passwordAccounts')) || [];
    const indexedElement = button.dataset.index ? button : button.closest('.account-menu');
    const index = Number(indexedElement.dataset.index);
    const account = accounts[index];
    if (!account) return;
    if (button.classList.contains('account-menu-toggle')) {
        event.stopPropagation();
        const menu = button.nextElementSibling;
        socialAccountsList.querySelectorAll('.account-menu').forEach(function (item) {
            if (item !== menu) item.hidden = true;
        });
        menu.hidden = !menu.hidden;
        button.setAttribute('aria-expanded', String(!menu.hidden));
        return;
    }
    const action = button.dataset.action;
    if (action === 'delete') {
        if (confirm(`Delete the ${account.platform} account?`)) {
            accounts.splice(index, 1);
            localStorage.setItem('passwordAccounts', JSON.stringify(accounts));
            if (accountEditIndex.value === String(index)) {
                resetAccountForm();
            }
            loadSocialAccounts();
        }
        return;
    }
    if (action === 'favorite') {
        account.favorite = account.favorite !== true;
        localStorage.setItem('passwordAccounts', JSON.stringify(accounts));
        loadSocialAccounts();
        return;
    }
    if (action === 'details') {
        const details = button.closest('.account-row').querySelector('.account-extra');
        details.hidden = !details.hidden;
        button.textContent = details.hidden ? 'View details' : 'Hide details';
        return;
    }
    if (action === 'copy-username' || action === 'copy-password') {
        const value = action === 'copy-username' ? account.handle : account.password;
        copyToClipboard(value, button.closest('.account-row'));
        return;
    }
    if (action === 'edit') {
        document.getElementById('socialPlatform').value = account.platform || '';
        document.getElementById('socialHandle').value = account.handle || '';
        document.getElementById('accountPassword').value = account.password || '';
        document.getElementById('accountUrl').value = account.url || '';
        document.getElementById('accountLogo').value = account.logo || '';
        accountEditIndex.value = String(index);
        accountFormTitle.textContent = 'Edit account';
        accountFormDescription.textContent = 'Update the saved service details.';
        accountSubmitButton.textContent = 'Update account';
        cancelEditButton.hidden = false;
        socialAccountFormPanel.hidden = false;
        socialAccountFormPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
    }
    if (!button.classList.contains('reveal-password')) return;
    const password = button.parentElement.querySelector('.masked-password');
    const isVisible = button.dataset.visible === 'true';
    password.textContent = isVisible ? '••••••••' : account.password;
    button.innerHTML = isVisible ? '<i class="bx bx-show"></i>' : '<i class="bx bx-hide"></i>';
    button.dataset.visible = String(!isVisible);
    button.setAttribute('aria-label', isVisible ? 'Show password' : 'Hide password');
});

async function copyToClipboard(value, row) {
    try {
        await navigator.clipboard.writeText(value);
    } catch (error) {
        const input = document.createElement('textarea');
        input.value = value;
        input.setAttribute('readonly', '');
        input.style.position = 'fixed';
        input.style.opacity = '0';
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        input.remove();
    }
    const status = row.querySelector('.account-action-status');
    status.textContent = 'Copied';
    setTimeout(function () {
        status.textContent = '';
    }, 1500);
}

cancelEditButton.addEventListener('click', resetAccountForm);

document.addEventListener('click', function (event) {
    if (!(event.target instanceof Element) || !event.target.closest('.account-actions')) {
        socialAccountsList.querySelectorAll('.account-menu').forEach(function (menu) {
            menu.hidden = true;
        });
    }
});

document.querySelectorAll('.password-toggle').forEach(function (button) {
    button.addEventListener('click', function () {
        const input = document.getElementById(button.dataset.target);
        const isVisible = input.type === 'text';
        input.type = isVisible ? 'password' : 'text';
        button.innerHTML = isVisible ? '<i class="bx bx-show"></i>' : '<i class="bx bx-hide"></i>';
        button.setAttribute('aria-label', isVisible ? 'Show password' : 'Hide password');
    });
});

loadSocialAccounts();

const repositoryFormPanel = document.getElementById('repositoryFormPanel');
const repositoryForm = document.getElementById('repositoryForm');
const repositoryList = document.getElementById('repositoryList');
const repositoryCount = document.getElementById('repositoryCount');
const repositoryMessage = document.getElementById('repositoryMessage');

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        }[character];
    });
}

function loadRepositories() {
    const repositories = JSON.parse(localStorage.getItem('githubRepositories') || '[]');
    repositoryCount.textContent = `${repositories.length} repositor${repositories.length === 1 ? 'y' : 'ies'}`;
    repositoryList.innerHTML = repositories.length ? repositories.map(function (repository, index) {
        return `<div class="data-row"><strong><i class="bx bxl-github"></i> ${escapeHtml(repository.name)}</strong><a class="text-button" href="${escapeHtml(repository.url)}" target="_blank" rel="noopener noreferrer">Open repository</a><button class="text-button" type="button" data-delete-repository="${index}">Delete</button></div>`;
    }).join('') : '<p class="empty-state">No repositories saved yet.</p>';
}

document.getElementById('showRepositoryForm').addEventListener('click', function () {
    repositoryFormPanel.hidden = !repositoryFormPanel.hidden;
});

repositoryForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const url = document.getElementById('repositoryUrl').value.trim();
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname !== 'github.com' && parsedUrl.hostname !== 'www.github.com') {
        repositoryMessage.textContent = 'Please enter a valid github.com repository link.';
        return;
    }

    const repositories = JSON.parse(localStorage.getItem('githubRepositories') || '[]');
    repositories.push({
        name: document.getElementById('repositoryName').value.trim(),
        url
    });
    localStorage.setItem('githubRepositories', JSON.stringify(repositories));
    repositoryForm.reset();
    repositoryMessage.textContent = '';
    repositoryFormPanel.hidden = true;
    loadRepositories();
});

repositoryList.addEventListener('click', function (event) {
    const deleteButton = event.target.closest('[data-delete-repository]');
    if (!deleteButton) {
        return;
    }

    const repositories = JSON.parse(localStorage.getItem('githubRepositories') || '[]');
    repositories.splice(Number(deleteButton.dataset.deleteRepository), 1);
    localStorage.setItem('githubRepositories', JSON.stringify(repositories));
    loadRepositories();
});

loadRepositories();

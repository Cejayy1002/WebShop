const productFormPanel = document.getElementById('productFormPanel');
const productForm = document.getElementById('productForm');
const productList = document.getElementById('productList');
const productCount = document.getElementById('productCount');
const fileInput = document.getElementById('productFile');

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

function loadFiles() {
    const files = JSON.parse(localStorage.getItem('importantFiles')) || [];
    productCount.textContent = `${files.length} file${files.length === 1 ? '' : 's'}`;
    productList.innerHTML = files.length ? files.map(function (file) {
        const label = file.name || 'Unnamed file';
        const details = [file.type, file.size].filter(Boolean).join(' - ');
        const download = file.data
            ? `<a class="text-button" href="${file.data}" download="${escapeHtml(label)}">Download</a>`
            : '';
        return `<div class="data-row"><strong>${escapeHtml(label)}</strong><span>${escapeHtml(details || 'Saved file')}</span>${download}</div>`;
    }).join('') : '<p class="empty-state">No files saved yet.</p>';
}

document.getElementById('showProductForm').addEventListener('click', function () {
    productFormPanel.hidden = !productFormPanel.hidden;
});

productForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const selectedFile = fileInput.files[0];
    if (!selectedFile) {
        return;
    }

    const reader = new FileReader();
    reader.addEventListener('load', function () {
        const files = JSON.parse(localStorage.getItem('importantFiles')) || [];
        const customName = document.getElementById('productName').value.trim();
        files.push({
            name: customName || selectedFile.name,
            type: selectedFile.type || 'Unknown type',
            size: `${Math.ceil(selectedFile.size / 1024)} KB`,
            data: reader.result
        });

        try {
            localStorage.setItem('importantFiles', JSON.stringify(files));
        } catch (error) {
            document.getElementById('productMessage').textContent = 'This file is too large to save in browser storage.';
            return;
        }

        productForm.reset();
        productFormPanel.hidden = true;
        document.getElementById('productMessage').textContent = '';
        loadFiles();
    });
    reader.readAsDataURL(selectedFile);
});

loadFiles();

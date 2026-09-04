const personalInfoForm = document.getElementById('personalInfoForm');
const personalInfoMessage = document.getElementById('personalInfoMessage');
const notesList = document.getElementById('notesList');
const notesCount = document.getElementById('notesCount');

function loadNotes() {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    notesCount.textContent = `${notes.length} note${notes.length === 1 ? '' : 's'}`;
    notesList.innerHTML = notes.length
        ? notes.map((note, index) => `<div class="data-row note-row"><div><strong>${escapeHtml(note.title)}</strong><span>${escapeHtml(note.category || 'General')}</span></div><div class="note-actions"><button class="text-button" type="button" data-action="open" data-index="${index}">Open</button><button class="text-button" type="button" data-action="edit" data-index="${index}">Edit</button><button class="text-button delete-button" type="button" data-action="delete" data-index="${index}">Delete</button></div></div><p class="note-preview" data-note-content="${index}" hidden>${escapeHtml(note.content)}</p>`).join('')
        : '<p class="empty-state">No notes yet.</p>';
}

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
        return {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'}[character];
    });
}

notesList.addEventListener('click', function (event) {
    const button = event.target.closest('[data-action]');
    if (!button) {
        return;
    }

    const index = Number(button.dataset.index);
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const note = notes[index];
    if (!note) {
        return;
    }

    if (button.dataset.action === 'open') {
        const preview = notesList.querySelector(`[data-note-content="${index}"]`);
        preview.hidden = !preview.hidden;
        button.textContent = preview.hidden ? 'Open' : 'Close';
    } else if (button.dataset.action === 'edit') {
        document.getElementById('fullName').value = note.title;
        document.getElementById('personalEmail').value = note.category || '';
        document.getElementById('aboutMe').value = note.content;
        personalInfoForm.dataset.editIndex = index;
        personalInfoForm.querySelector('button[type="submit"]').innerHTML = '<i class="bx bx-save"></i> Update note';
        personalInfoMessage.textContent = 'Editing note.';
        window.scrollTo({top: 0, behavior: 'smooth'});
    } else if (button.dataset.action === 'delete') {
        notes.splice(index, 1);
        localStorage.setItem('notes', JSON.stringify(notes));
        loadNotes();
    }
});

personalInfoForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const note = {
        title: document.getElementById('fullName').value.trim(),
        category: document.getElementById('personalEmail').value.trim(),
        content: document.getElementById('aboutMe').value.trim()
    };
    const editIndex = personalInfoForm.dataset.editIndex;
    if (editIndex !== undefined) {
        notes[Number(editIndex)] = note;
        delete personalInfoForm.dataset.editIndex;
        personalInfoForm.querySelector('button[type="submit"]').innerHTML = '<i class="bx bx-save"></i> Save note';
    } else {
        notes.push(note);
    }
    localStorage.setItem('notes', JSON.stringify(notes));
    personalInfoForm.reset();
    loadNotes();
    personalInfoMessage.textContent = 'Note saved.';
    personalInfoMessage.className = 'settings-success';
});

loadNotes();

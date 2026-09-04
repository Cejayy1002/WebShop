const personalInfoForm = document.getElementById('personalInfoForm');
const personalInfoMessage = document.getElementById('personalInfoMessage');
const notesList = document.getElementById('notesList');
const notesCount = document.getElementById('notesCount');

function loadNotes() {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    notesCount.textContent = `${notes.length} note${notes.length === 1 ? '' : 's'}`;
    notesList.innerHTML = notes.length
        ? notes.map(note => `<div class="data-row"><strong>${note.title}</strong><span>${note.category || 'General'}</span></div><p class="note-preview">${note.content}</p>`).join('')
        : '<p class="empty-state">No notes yet.</p>';
}

personalInfoForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.push({
        title: document.getElementById('fullName').value.trim(),
        category: document.getElementById('personalEmail').value.trim(),
        content: document.getElementById('aboutMe').value.trim()
    });
    localStorage.setItem('notes', JSON.stringify(notes));
    personalInfoForm.reset();
    loadNotes();
    personalInfoMessage.textContent = 'Note saved.';
    personalInfoMessage.className = 'settings-success';
});

loadNotes();

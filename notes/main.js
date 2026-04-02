const notesKey = 'notes';
const saveDelay = 1000;

let lastSave = 0;
let saveRequested = false;

let notes = getNotes();
/*
notes: Note[]
Note: { name: string, id: number, text: string }
*/

function getNotes() {
    const stored = localStorage.getItem(notesKey);
    if (stored) {
        try {
            return JSON.parse(stored);
        }
        catch (parsingError) {
            alert('Gespeicherte Notizen konnten nicht ausgewertet werden: ' + parsingError);
        }
    }
    return [];
}

function saveNotes() {
    let now = Date.now();

    if (now > lastSave + saveDelay) {
        localStorage.setItem(notesKey, JSON.stringify(notes));

        saveRequested = false;
        lastSave = now;
    }
    else if(!saveRequested) {
        saveRequested = true;
        setTimeout(saveNotes, saveDelay);
    }
}

function createNote() {
    const id = Date.now();
    notes.push({
        name: '',
        text: '',
        id,
    });
    saveNotes();
    return id;
}

function deleteNote(noteId) {
    notes = notes.filter(note => note.id !== noteId);
    saveNotes();
}

function getDashboardView() {
    const htmlList = notes.map(note =>
        `<li class="notes-list__item"><button onclick="renderPage(getNoteView(${note.id}))"><h3>${x(note.name) || 'Unbenannt'}</h3><p>${x(note.text.slice(0, 100))}${note.text.length > 100 ? '...' : ''}</p></li></button>`
    ).join('');

    return `${htmlList ? '<ul class="notes-list">' + htmlList + '</ul>' : '<p class="notes-info">Noch keine Notizen</p>'}<div class="note-create-cta"><button onclick="handleNoteCreateRequest()">Neue Notiz</button></div>`;
}

function handleNoteCreateRequest() {
    const newNoteId = createNote();

    renderPage(getNoteView(newNoteId));
}

function getNoteView(noteId) {
    const index = notes.findIndex(note => note.id === noteId);

    if (index === -1) {
        return '<p class="notes-info">Notiz nicht gefunden</p><button onclick="renderPage(getDashboardView())">Zurück zur Übersicht</button>'
    }

    const note = notes[index];

    return `<div class="note-option-cta">
    <button onclick="renderPage(getDashboardView())">Zurück</button><button onclick="handleNoteDeleteRequest(${noteId})">Löschen</button>
    </div>
    <div class="note-form">
    <input type="text" value="${note.name}" id="n-name" oninput="handleNameInput(event, ${index})" autocomplete="off" placeholder="Unbenannt" />
    <textarea id="n-text" oninput="handleTextInput(event, ${index})" placeholder="Text eingeben">${note.text}</textarea>
    </div>`;
}

function handleNoteDeleteRequest(noteId) {
    const index = notes.findIndex(note => note.id === noteId);

    if (index === -1) {
        renderPage(getDashboardView());
        return;
    }

    if (window.confirm('Soll diese Notiz gelöscht werden?')) {
        deleteNote(noteId);
        renderPage(getDashboardView());
    }
}

function handleNameInput(event, noteIndex) {
    notes[noteIndex].name = event.target.value;

    saveNotes();
}

function handleTextInput(event, noteIndex) {
    notes[noteIndex].text = event.target.value;

    saveNotes();
}

function renderPage(html) {
    $('#app').innerHTML = html;
}

(function init() {

    renderPage(getDashboardView());

})();

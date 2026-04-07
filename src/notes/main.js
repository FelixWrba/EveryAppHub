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
    else if (!saveRequested) {
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

    return `${htmlList ? '<ul class="notes-list">' + htmlList + '</ul>' : '<p class="notes-info notes-empty-message">Noch keine Notizen</p>'}<div class="note-create-cta"><button onclick="handleNoteCreateRequest()">Neue Notiz</button></div>`;
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
    <button onclick="renderPage(getDashboardView())">Zurück</button>
    <button onclick="handleNoteDeleteRequest(${noteId})">Löschen</button>
    <button onclick="renderPage(getShareView(${noteId}))">Teilen</button>
    <button onclick="handleNotePrintRequest(${noteId})">Drucken</button>
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

function handleNotePrintRequest(noteId) {
    renderPage(getPrintView(noteId));

    window.print();
}

function getPrintView(noteId) {
    const index = notes.findIndex(note => note.id === noteId);
    if (index === -1) {
        renderPage(getDashboardView());
        return;
    }
    const { name, text } = notes[index];

    return `<div onclick="renderPage(getNoteView(${noteId}))" class="print-view">
    <h2>${name || 'Unbenannte Notiz'}</h2><div>${text}</div>
    </div>`;
}

function getShareView(noteId) {
    const index = notes.findIndex(note => note.id === noteId);
    if (index === -1) {
        renderPage(getDashboardView());
        return;
    }
    const note = { id: notes[index].id, name: notes[index].name || 'Unbenannt', text: notes[index].text || 'Kein Inhalt' };
    const link = encodeURI(`${document.location.origin}/notes/?n=${note.name}&t=${note.text}`);
    let qrCodeImage = null;

    try {
        const qrCode = qrcode(0, 'L');
        qrCode.addData(link);
        qrCode.make();
        qrCodeImage = qrCode.createImgTag();
    }
    catch(error) {
        console.error(error);
    }

    return `<button onclick="renderPage(getNoteView(${noteId}))">Zurück</button>
    ${navigator.share ? `<button onclick="shareLink('${link}')">Teilen</button>` : ''}
    ${navigator.clipboard ? `<button onclick="copyLink('${link}')">Link kopieren</button>` : ''}
    <p id="share-info" class="notes-info"></p>
    <div class="note-share-view">
    ${qrCodeImage ? qrCodeImage : '<p class="notes-info">QR-Code konnte nicht erstellt werden.</p>'}
    <h2>${note.name}</h2>
    <a href="${link}" target="_blank" rel="noopener noreferrer">${link}</a>
    </div>`;
}

async function shareLink(link) {
    try {
        await navigator.share({ url: link });
    }
    catch (shareError) {
        console.error(shareError);
        $('#share-info').innerText = shareError;
    }
}

async function copyLink(link) {
    if (navigator.clipboard) {
        try {
            await navigator.clipboard.writeText(link);
        }
        catch (writeError) {
            console.error(writeError);
            $('#share-info').innerText = writeError;
        }
    }
}

function handleShareRequest() {
    const params = new URLSearchParams(document.location.search);
    const name = params.get('n');
    const text = params.get('t');

    if (!name || !text) {
        return;
    }

    const id = Date.now();
    notes.push({ id, name: 'Share: ' + name, text });
    saveNotes();

    renderPage(getNoteView(id));
    window.history.pushState({}, document.title, window.location.pathname);
}

function renderPage(html) {
    $('#app').innerHTML = html;
}

(function init() {

    renderPage(getDashboardView());

    handleShareRequest();

})();

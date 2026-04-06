// handle import modal
const importModal = $('#import-modal');
$('#import-open-btn').addEventListener('click', () => importModal.showModal());
$('#import-close-btn').addEventListener('click', () => importModal.close());

// handle file import
$('#import-file-btn').addEventListener('click', () => {
    const file = $('#import-picker').files[0];
    if (!file) {
        $('#import-error').innerText = 'Fehler: Keine Datei ausgewählt.';
        return;
    }
    const fileReader = new FileReader();

    fileReader.readAsText(file);

    fileReader.onload = event => {
        const fileContents = event.target.result;
        try {
            const fileJSON = JSON.parse(fileContents);

            for (const item of Object.keys(fileJSON)) {
                if (window.confirm(`Soll ${item} importiert werden?`)) {
                    localStorage.setItem(item, fileJSON[item]);
                }
            }

            importModal.close();
        } catch (error) {
            console.error(error);
            $('#import-error').innerText = 'Fehler: Datei muss gültiges JSON beinhalten.';
        }
    };
})

// handle userdata downloading
$('#export-btn').addEventListener('click', () => {
    const fileName = 'apphub-userdata-' + Intl.DateTimeFormat().format() + '.json';
    const fileData = JSON.stringify({ ...localStorage });

    const dataLink = document.createElement('a');
    dataLink.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(fileData));
    dataLink.setAttribute('download', fileName);
    dataLink.style.visibility = 'hidden';

    document.body.appendChild(dataLink);
    dataLink.click();
    document.body.removeChild(dataLink);
});

// handle userdata deletion
$('#reset-btn').addEventListener('click', () => {
    if (!window.confirm('Alle Nutzerdaten von AppHub auf diesem Gerät löschen?')) return;
    if (!window.confirm('Sicher? Diese Aktion ist irreversibel.')) return;
    if (!window.confirm('Durch das Bestätigen dieser Meldung werden alle Nutzerdaten von diesem Endgerät entfernt. Diese können nicht mehr wiederhergestellt werden.')) return;

    localStorage.clear();
});

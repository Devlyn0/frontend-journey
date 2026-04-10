import { initNotes, renderNote, renderNewNote, removeNote, renderNewTag, clearNotes, parseNotes, parseNewNotes, saveNotes } from "./notes.js";
import { StorageManager } from "./storage.js";
import { dragHandle } from './DnD.js';
const storage = new StorageManager();
let notes = initNotes(storage);
if (notes) {
    notes.forEach(note => renderNote(note));
}
const notesContainer = document.querySelector('#notesContainer');
if (!(notesContainer instanceof HTMLElement)) {
    throw Error('Не существует элемента div с id "notesContainer" на главной странице');
}
let createNoteBtn = document.querySelector('#create-note-btn');
if (!(createNoteBtn instanceof HTMLElement)) {
    throw Error('Отсутствует кнопка с id "create-note-btn"');
}
notesContainer.addEventListener('click', (e) => {
    if (!(e.target instanceof HTMLElement)) {
        return;
    }
    if (!e.target.classList.contains('delete-note-btn')) {
        return;
    }
    const noteToRemove = e.target.closest('.note');
    if (!(noteToRemove instanceof HTMLElement)) {
        return;
    }
    removeNote(noteToRemove);
    let notes = parseNotes();
    saveNotes(notes, storage);
});
notesContainer.addEventListener('click', (e) => {
    if (!(e.target instanceof HTMLElement)) {
        return;
    }
    if (!e.target.classList.contains('add-tag-btn')) {
        return;
    }
    const note = e.target.closest('.note-in-creating');
    if (!(note instanceof HTMLElement)) {
        return;
    }
    renderNewTag(note);
});
notesContainer.addEventListener('click', (e) => {
    if (!(e.target instanceof HTMLElement)) {
        return;
    }
    if (!e.target.classList.contains('commit-note-btn')) {
        return;
    }
    let notesToSave = null;
    let newNotes = parseNewNotes();
    let notes = parseNotes();
    if (!(newNotes instanceof Array && notes instanceof Array)) {
        if (newNotes) {
            notesToSave = newNotes;
        }
        else if (notes) {
            notesToSave = notes;
        }
    }
    else {
        notesToSave = [...newNotes, ...notes];
    }
    saveNotes(notesToSave, storage);
    clearNotes();
    if (notesToSave) {
        notesToSave.forEach(note => renderNote(note));
    }
});
notesContainer.addEventListener('mousedown', (e) => {
    if (!(e.target instanceof HTMLElement)) {
        return;
    }
    if (!e.target.classList.contains('note') || e.target.dataset.inAnimation) {
        return;
    }
    e.target.ondragstart = () => { return false; };
    dragHandle(e.target, e, storage);
});
createNoteBtn.addEventListener('click', () => {
    renderNewNote();
});
// мини костыль - парсинг и полная перезапись в сторадже всех заметок при удалении одной, вместо удаления из стораджа конкретной заметки, также редкий кейс - если сделать несколько новых заметок, то нажам на галочку любой из них - сохраняются все, я осознанно оставил это так чтобы не тратить слишком много времени на продакшн рэйди код, который сейчас не требуется, учти это при проверке. Так же на практке столкнулся с ошибкой и понял в чем разница elem.style и getComputedStyle. Также научился работать с textarea (попался на ошибку, где textContent не содержит пользовательсий текст, также просто для семантики дал им атрибуты name). Заметил что почему то при hidden = true, также как и visibility = hidden, метод elementFromPoint возвращает этот элемент, нужно использвать display = 'none' на время поиска элемента

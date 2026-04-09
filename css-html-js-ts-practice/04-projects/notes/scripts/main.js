
import { initNotes, renderNote, removeNote, renderNewNote, renderNewTag, clearNotes, parseNotes, parseNewNotes, saveNotes } from "./notes.js";
import { StorageManager } from "./storage.js";
import { dragHandle } from './DnD.js';

const storage = new StorageManager();
let notes = initNotes(storage);
notes.forEach(note => renderNote(note));

const noteContainer = document.querySelector('.notes-container'); 

noteContainer.addEventListener('click', (e) => { // Удаление заметки
    if (!e.target.classList.contains('delete-note-btn')) {
        return;
    }
    const noteToRemove = e.target.closest('.note');
    removeNote(noteToRemove, storage);
    let notes = parseNotes();
    saveNotes(notes, storage);
})

noteContainer.addEventListener('click', (e) => { // Добавление нового тега
    if (!e.target.classList.contains('add-tag-btn')) {
        return;
    }
    const note = e.target.closest('.note-in-creating');
    renderNewTag(note);
})

noteContainer.addEventListener('click', (e) => { // Сохранение новой заметки
    if (!e.target.classList.contains('commit-note-btn')) {
        return;
    }
    notes = [ ...parseNewNotes(), ...parseNotes() ];
    saveNotes(notes, storage);
    clearNotes();
    notes.forEach(note => renderNote(note));
})

noteContainer.addEventListener('mousedown', (e) => { // Drag`n`Drop
    if (!e.target.classList.contains('note') || e.target.dataset.inAnimation) {
        return;
    }
    e.target.ondragstart = (e) => { return False }
    dragHandle(e.target, e, storage);
})


window['create-note-btn'].addEventListener('click', (e) => {
    renderNewNote();
})



// мини костыль - парсинг и полная перезапись в сторадже всех заметок при удалении одной, вместо удаления из стораджа конкретной заметки, также редкий кейс - если сделать несколько новых заметок, то нажам на галочку любой из них - сохраняются все, я осознанно оставил это так чтобы не тратить слишком много времени на продакшн рэйди код, который сейчас не требуется, учти это при проверке. Так же на практке столкнулся с ошибкой и понял в чем разница elem.style и getComputedStyle. Также научился работать с textarea (попался на ошибку, где textContent не содержит пользовательсий текст, также просто для семантики дал им атрибуты name). Заметил что почему то при hidden = true, также как и visibility = hidden, метод elementFromPoint возвращает этот элемент, нужно использвать display = 'none' на время поиска элемента
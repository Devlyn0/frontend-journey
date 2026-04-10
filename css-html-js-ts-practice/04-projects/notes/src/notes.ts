import { StorageManager } from "./storage";


const notesContainer = document.querySelector('#notesContainer'); 

if (!(notesContainer instanceof HTMLElement)) {
    throw Error('Не существует элемента div с id "notesContainer" на главной странице');
}
const defaultNotes = [
    {
        text: 'Сделать пет-проект с заметками для практики базы JS, HTML и CSS перед переходом на фреймворки и TS',
        tags: ['JS', 'CSS', 'Переход во fullstack'],
    },
    {
        text: 'Выучить прототипы и классы в JnpxS, разобраться с this и контекстом',
        tags: ['JS', 'Прототипы', 'this'],
    },
    {
        text: 'Настроить ESLint и Prettier в проекте для автоматического форматирования',
        tags: ['Tooling', 'ESLint', 'Prettier'],
    },
    {
        text: 'Изучить Event Loop, микротаски и макротаски, понять как работают Promise',
        tags: ['JS', 'EventLoop', 'Promise', 'Асинхронность'],
    },
]

interface Note {
    text: string;
    tags: string[] | null;
}


function createNote(text: string, tags: string[] | null): Note {
    return {
        text: text,
        tags: tags,
    }   
}

// function isNote(obj: object): obj is Note {
//     return 'text' in obj && 'tags' in obj;
// }

/* <div class="note">
    <button class="delete-note-btn"></button>
    <p class="note-text">Сделать пет-проект с заметками для практики базы JS, HTML и CSS перед переходом на фреймворки и TS</p>
    <div class="tags-container">
        <span class="note-tag">#JS</span>
        <span class="note-tag">#CSS</span>
        <span class="note-tag">#Переход во fullstack</span>
    </div>
</div> */

function renderNote(note: Note) {

    let noteElem = document.createElement('div');
    noteElem.classList.add('note');

    let delBtn = document.createElement('button');
    delBtn.classList.add('delete-note-btn');
    noteElem.appendChild(delBtn);

    let noteText = document.createElement('p');
    noteText.classList.add('note-text');
    noteText.textContent = note.text;
    noteElem.appendChild(noteText);

    let tagsContainer = null;
    if (note.tags !== null) {
        tagsContainer = document.createElement('div');
        tagsContainer.classList.add('tags-container');
        for (let tag of note.tags) {
            let tagElem = document.createElement('span')
            tagElem.textContent = '#'+tag;
            tagElem.dataset.tag = tag;
            tagsContainer.appendChild(tagElem); 
        }
    }

    if (tagsContainer !== null) {
        noteElem.appendChild(tagsContainer);
    }

    notesContainer!.appendChild(noteElem);
    
}

function initNotes(storage: StorageManager): Note[] | null  {
    let userNotes = storage.get<Note>('notes', defaultNotes);
    let notes = []

    if (!(userNotes instanceof Array)){
        return null;
    }

    for (let note of userNotes) {
        notes.push(createNote(note.text, note.tags))
    }

    return notes
}

// Пайплайн удаления заметки: парсим все оставшиеся заметки, сохраняем, в main.js обновляем массив заметок

//  <div class="note">
//     <button class="delete-note-btn"></button>
//     <p class="note-text">Сделать пет-проект с заметками для практики базы JS, HTML и CSS перед переходом на фреймворки и TS</p>
//     <div class="tags-container">
//         <span class="note-tag">#JS</span>
//         <span class="note-tag">#CSS</span>
//         <span class="note-tag">#Переход во fullstack</span>
//     </div>
//  </div> 

function parseNotes(): Note[] | null {
    const userNotes = notesContainer!.querySelectorAll('.note');

    if (userNotes.length === 0) {
        return null
    }

    let parsedNotes = []
    
    for (let note of userNotes) {
        let text = note.querySelector('.note-text')?.textContent;
        if(!text) {
            continue;
        }
        let tagsValues = null;

        let tagsContainer = note.querySelector('.tags-container') as HTMLElement | null;
        if (!tagsContainer) {
            continue
        }

        tagsValues = [];
        let tags = tagsContainer.children; 
        for (let tag of tags) {
            if (tag instanceof HTMLElement) {
                let tagValue = tag.dataset.tag;
                if (!tagValue) {
                    continue
                }
                tagsValues.push(tagValue);
            }
        }
            
        parsedNotes.push(createNote(text, tagsValues))
    }

    return parsedNotes;
}

function saveNotes(notes: Note[] | null, storage: StorageManager) {
    storage.set<Note[]>('notes', notes);
}


//    <div class="note note-in-creating">
//        <button class="commit-note-btn"></button>
//        <button class="add-tag-btn"></button>
//        <textarea class="note-text">*Текст новой заметки*</textarea>
//        <div class="tags-container">
//            <textarea class="note-tag" data-tag ="">#</textarea>
//        </div>
//    </div>                 

function renderNewNote() {  // newNote - заметка, создающаяся при нажатии кнопки "Добавить заметку"
    let newNote = document.createElement('div');
    newNote.classList.add('note-in-creating');

    let commitBtn = document.createElement('button');
    commitBtn.classList.add('commit-note-btn');

    let addTagBtn = document.createElement('button');
    addTagBtn.classList.add('add-tag-btn');

    let noteText = document.createElement('textarea');
    noteText.classList.add('note-text');
    noteText.name = 'note-text';
    noteText.value = '*Текст новой заметки*';

    let tagsContainer = document.createElement('div')
    tagsContainer.classList.add('tags-container');
    
    let noteTag = document.createElement('textarea');
    noteTag.classList.add('note-tag')
    noteTag.name = "1";
    noteTag.value = '#Тег заметки';

    tagsContainer.appendChild(noteTag);

    newNote.appendChild(commitBtn);
    newNote.appendChild(addTagBtn);
    newNote.appendChild(noteText);
    newNote.appendChild(tagsContainer);

    notesContainer!.prepend(newNote);
}

function parseNewNotes() { // newNote - заметка, создающаяся при нажатии кнопки "Добавить заметку"
    let newNotes = notesContainer!.querySelectorAll('.note-in-creating');

    if (newNotes.length === 0) {
        return null
    }

    let parsedNotes = []

    for (let note of newNotes) {
        let noteTextElement = note.querySelector('.note-text') as HTMLTextAreaElement;
        let text = noteTextElement.value;

        if (text === '*Текст новой заметки*') {
            continue;
        }

        let tagsContainer = note.querySelector('.tags-container') 
        if (!tagsContainer) {
            continue
        }

        let tagsArray = [];
        let tags = tagsContainer.children;

        for (let tag of tags) {
            if (!(tag instanceof HTMLTextAreaElement)) {
                continue;
            }
            let tagText = tag.value;
            if (tagText === '#' || tagText === '' || tagText === '#Тег заметки') {
                continue
            }
            tagsArray.push(tagText.replace('#', ''));
            console.log(tagText)
        }
        

        parsedNotes.push(createNote(text, tagsArray))
    }

    return parsedNotes;
}

function removeNote(note: HTMLElement) {
    note.remove();
}

function clearNotes() {
    notesContainer!.replaceChildren();
}
function renderNewTag(note: HTMLElement) {

    const addTagBtn = note.querySelector('.add-tag-btn');
    if (!(addTagBtn instanceof HTMLElement)) {
        throw Error('Отсутсвует кнопка добавления нового тега на новой заметке')
    }

    let style = addTagBtn.getBoundingClientRect();
    addTagBtn.style.left = String(style.left + 150 + 'px');

    const tagsContainer = note.querySelector('.tags-container');
    if (!(tagsContainer instanceof HTMLElement)) {
        throw Error('Отсутствует элемент .tags-container в новой заметке')
    }

    const lastTag = tagsContainer.lastElementChild;
    if (!(lastTag instanceof HTMLTextAreaElement)) {
        throw Error('Ошибка в блоке тегов новой заметки')
    }

    let newTag = document.createElement('textarea');
    newTag.classList.add('note-tag');
    newTag.value = '#';
    newTag.name = String(parseInt(lastTag.name) + 1);
    tagsContainer.appendChild(newTag);
}

export { initNotes, renderNote, renderNewNote, renderNewTag, parseNotes, parseNewNotes, clearNotes, saveNotes, removeNote };

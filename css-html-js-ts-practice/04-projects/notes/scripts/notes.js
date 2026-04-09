
const defaultNotes = [
    {
        text: 'Сделать пет-проект с заметками для практики базы JS, HTML и CSS перед переходом на фреймворки и TS',
        tags: ['JS', 'CSS', 'Переход во fullstack'],
    },
    {
        text: 'Выучить прототипы и классы в JS, разобраться с this и контекстом',
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

class Note {
    constructor(text, tags, order) {
        this.text = text;
        this.tags = tags;
    }
}

/* <div class="note">
    <button class="delete-note-btn"></button>
    <p class="note-text">Сделать пет-проект с заметками для практики базы JS, HTML и CSS перед переходом на фреймворки и TS</p>
    <div class="tags-container">
        <span class="note-tag">#JS</span>
        <span class="note-tag">#CSS</span>
        <span class="note-tag">#Переход во fullstack</span>
    </div>
</div> */

function renderNote(note) {

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

    notesContainer.appendChild(noteElem);
    
}

function initNotes(storage) {
    let userNotes = storage.get('notes', defaultNotes);
    let notes = []

    for (let note of userNotes) {
        notes.push(new Note(note.text, note.tags))
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

function parseNotes() {
    const userNotes = notesContainer.querySelectorAll('.note');

    if (userNotes.length === 0) {
        return null
    }

    let parsedNotes = []
    
    for (let note of userNotes) {
        let text = note.querySelector('.note-text').textContent;
        let tagsArray = null;

        let tagsContainer = note.querySelector('.tags-container') 
        if (tagsContainer != undefined) {
            tagsArray = [];
            let tags = tagsContainer.children;
            for (let tag of tags) {
                tagsArray.push(tag.dataset.tag);
            }
        }

        parsedNotes.push(new Note(text, tagsArray))
    }

    return parsedNotes;
}

function saveNotes(notes, storage) {
    storage.set('notes', notes);
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
    noteTag.name = 1;
    noteTag.value = '#Тег заметки';

    tagsContainer.appendChild(noteTag);

    newNote.appendChild(commitBtn);
    newNote.appendChild(addTagBtn);
    newNote.appendChild(noteText);
    newNote.appendChild(tagsContainer);

    notesContainer.prepend(newNote);
}

function parseNewNotes() { // newNote - заметка, создающаяся при нажатии кнопки "Добавить заметку"
    let newNotes = notesContainer.querySelectorAll('.note-in-creating');

    if (newNotes.length === 0) {
        return null
    }

    let parsedNotes = []

    for (let note of newNotes) {
        let text = note.querySelector('.note-text').value;

        if (text === '*Текст новой заметки*') {
            continue;
        }

        let tagsContainer = note.querySelector('.tags-container') 

        let tagsArray = [];
        let tags = tagsContainer.children;

        for (let tag of tags) {
            let tagText = tag.value;
            if (tagText === '#' || tagText === '' || tagText === '#Тег заметки') {
                continue
            }
            tagsArray.push(tagText.replace('#', ''));
            console.log(tagText)
        }
        

        parsedNotes.push(new Note(text, tagsArray))
    }

    return parsedNotes;
}

function clearNotes() {
    notesContainer.replaceChildren();
}

function removeNote(note, storage) {
    note.remove();
}

function renderNewTag(note) {
    const addTagBtn = note.querySelector('.add-tag-btn');
    let style = getComputedStyle(addTagBtn);
    addTagBtn.style.left = parseInt((style.left).match(/\d+/)[0]) + 150 +'px';

    const tagsContainer = note.querySelector('.tags-container');
    const lastTag = tagsContainer.lastElementChild;

    let newTag = document.createElement('textarea');
    newTag.classList.add('note-tag');
    newTag.value = '#';
    newTag.name = parseInt(lastTag.name) + 1;
    tagsContainer.appendChild(newTag);
}

export {initNotes, renderNote, removeNote, renderNewNote, renderNewTag, parseNotes, parseNewNotes, clearNotes, saveNotes};

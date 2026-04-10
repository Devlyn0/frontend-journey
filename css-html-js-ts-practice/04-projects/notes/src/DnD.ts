import { parseNotes, saveNotes } from './notes'
import { StorageManager } from './storage';

type pointerOffset = { x: number, y: number};

function moveAt(note: HTMLElement, posX: number, posY: number) {
    note.style.left = posX + 'px';
    note.style.top = posY + 'px';
}

function onMouseMove(note: HTMLElement, pointerOffset: pointerOffset, event: MouseEvent) {
    const posX = event.pageX - pointerOffset.x;
    const posY = event.pageY - pointerOffset.y;

    moveAt(note, posX, posY)
} 

// Принимает left и top координаты из getBoundingClientRect()
function animateMove(
        note: HTMLElement, 
        desiredX: number, 
        desiredY: number, 
        animateDuration: number, 
        callback?: CallableFunction
) { 
    let notePos = note.getBoundingClientRect();
    let currentX = notePos.left;
    let currentY = notePos.top;
    
    let offsetX = desiredX - currentX ;
    let offsetY = desiredY - currentY ;

    note.dataset.inAnimation = "true";
    note.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    note.style.transition = `transform ${animateDuration}s ease`;

    setTimeout((note: HTMLElement) => { 
        if (note.id === 'transparent-drag') { 
            delete note.dataset.inAnimation;
        }
        else {
            note.removeAttribute('style');
            delete note.dataset.inAnimation;
        }
        if (callback) { callback(); }
    }, animateDuration*1000, note);

}

function orderHandle(
    noteMiddlePointX: number, 
    noteMiddlePointY: number, 
    transparentClone: HTMLElement, 
    event: Event
) {
    let target = event.target as HTMLElement;

    if (target.id !== 'drag') {
        return;
    }

    const notePos = target.getBoundingClientRect();
    const coordsToSearch = {
        x: noteMiddlePointX + notePos.left,
        y: noteMiddlePointY + notePos.top,
    }
    target.style.display = 'none';
    const elemUnderDragNote = document.elementFromPoint(coordsToSearch.x, coordsToSearch.y);
    if (!(elemUnderDragNote instanceof HTMLElement)) return;
    target.style.display = '';
    
    const noteUnderDrag = elemUnderDragNote.closest('.note') ;
    if (!(noteUnderDrag instanceof HTMLElement)) return;
    if (noteUnderDrag.id === 'transparent-drag' || noteUnderDrag.dataset.inAnimation) { return; }
    
    const notesContainer = document.querySelector('#notesContainer');
    if (!(notesContainer instanceof HTMLElement)) {
        throw Error('Не существует элемента div с id "notesContainer" на главной странице');
    }

    const children = Array.from(notesContainer.children);
    const indexOfTransparent = children.indexOf(transparentClone);
    const indexOfNoteUnderDrag = children.indexOf(noteUnderDrag);

    const transparentClonePos = transparentClone.getBoundingClientRect();
    const noteUnderDragPos = transparentClone.getBoundingClientRect();

    const animateDuration = 0.1;

    animateMove(
        noteUnderDrag,
        transparentClonePos.left,
        transparentClonePos.top,
        animateDuration,
    )
    animateMove(
        transparentClone,
        noteUnderDragPos.left,
        noteUnderDragPos.top,
        animateDuration,
        () => {
            if (indexOfTransparent > indexOfNoteUnderDrag) {
                noteUnderDrag.before(transparentClone);
            }
            else {
                noteUnderDrag.after(transparentClone);
            }
        }
    )

}

function dragHandle(note: HTMLElement, event: MouseEvent, storage: StorageManager) {

    // Пайплайн начала DnD
    // Элемент 'заглушка', чтобы не съезжали остальные заметки из-за position absolute. Меняется с другими местами и становится видимым при onmouseup
    const transparentClone = note.cloneNode(true) as HTMLElement; 
    transparentClone.style.visibility = 'hidden';
    transparentClone.id = 'transparent-drag';

    const notePos = note.getBoundingClientRect();
    note.style.position = 'absolute';
    // Задаются исходные параметры ширины и высоты, так как при absolute объект может увеличиться в ширину.
    note.style.width = notePos.width + 'px'; 
    note.style.height = notePos.height + 'px';
    // Позиционирование на изначальное место, так как absolute вырывает из нормального потока
    note.style.left = notePos.left + 'px'; 
    note.style.top = notePos.top + 'px';
    note.style.zIndex = "10000";
    note.id = 'drag';
    note.style.cursor = 'grab'

    let notesContainer = document.querySelector('#notesContainer');
    if (!(notesContainer instanceof HTMLElement)) {
        throw Error('Не существует элемента div с id "notesContainer" на главной странице');
    }
    // Вставляем заглушку на место заметки, которая перемещается
    notesContainer.insertBefore(transparentClone, note); 


    // Координаты курсора относительно заметки для правильного позиционирования
    const pointerOffset = { 
        x: event.offsetX,
        y: event.offsetY,
    };

    const noteMiddlePointY = (notePos.bottom - notePos.top) / 2;
    const noteMiddlePointX = (notePos.right - notePos.left) / 2;

    const mouseMoveHandler = (e: MouseEvent) => { 
        orderHandle(noteMiddlePointX, noteMiddlePointY, transparentClone, e);
        onMouseMove(note, pointerOffset, e); 
    };
    const mouseUpHandler = () => {
        document.removeEventListener('mousemove', mouseMoveHandler);
        note.removeEventListener('mouseup', mouseUpHandler);
        note.style.cursor = '';
        
        const animateCallback = () => {
            transparentClone.removeAttribute('id');
            transparentClone.removeAttribute('style');
            // после анимации удаляется, так как transparentClone уже занимает точное место (позиционирование за счет обмена местами 
            // с соседними заметками максимально точное)
            note.remove() 
            // Сохранение нового порядка
            let notes = parseNotes();
            saveNotes(notes, storage)
        }

        const transparentPos = transparentClone.getBoundingClientRect();
        animateMove(
            note,
            transparentPos.left, 
            transparentPos.top, 
            0.5,
            animateCallback,
        );

    };
    document.addEventListener('mousemove', mouseMoveHandler);
    note.addEventListener('mouseup', mouseUpHandler);
}

export { dragHandle }
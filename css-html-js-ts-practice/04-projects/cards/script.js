let contacts_close_btn = document.querySelector('.close_button');
let contacts_open_btn = document.querySelector('.contacts_button');
let overlay = document.querySelector('.overlay');


const openContacts = () => {
    let contacts_menu = document.querySelector('.contacts_menu');
    contacts_menu.style.visibility = 'visible';
    overlay.classList.add('animated');
    document.body.style.overflow = 'hidden';
}

const closeContacts = () => {
    let contacts_menu = document.querySelector('.contacts_menu');
    contacts_menu.style.visibility = 'hidden';
    overlay.classList.remove('animated');
    document.body.style.overflow = '';
}

contacts_open_btn.addEventListener('click', openContacts);
contacts_close_btn.addEventListener('click', closeContacts);
overlay.addEventListener('click', closeContacts)
let contacts_close_btn = document.querySelector('.close_button');
let contacts_open_btn = document.querySelectorAll('.contacts_button');
let overlay = document.querySelector('.overlay');
let humburger_menu_btn = document.querySelector('.humburger_button');
let full_size_transparent = document.querySelector('.full_size_transparent') // full size transparent window to close other dropdown windows when clicked


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

const handleHumburgerMenu = () => {
    let humburgerMenu = document.querySelector('.humburger_menu');
    if (humburgerMenu.classList.contains('open')) {
        humburgerMenu.classList.remove('open');
        full_size_transparent.style.visibility = 'hidden';
        return;
    }
    humburgerMenu.classList.add('open');
    full_size_transparent.style.visibility = 'visible';

}

contacts_open_btn.forEach((btn) => {
    btn.addEventListener('click', openContacts);
    }
);

contacts_close_btn.addEventListener('click', closeContacts);
overlay.addEventListener('click', closeContacts);
humburger_menu_btn.addEventListener('click', handleHumburgerMenu);
full_size_transparent.addEventListener('click', handleHumburgerMenu);

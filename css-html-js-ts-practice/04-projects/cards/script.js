let contacts_open_btn = document.querySelector('.contacts_button');
contacts_open_btn.addEventListener('click', () => {
    let contacts_menu = document.querySelector('.contacts_menu');
    contacts_menu.style.visibility = 'visible';
})

let contacts_close_btn = document.querySelector('.close_button');
contacts_close_btn.addEventListener('click', () => {
    let contacts_menu = document.querySelector('.contacts_menu');
    contacts_menu.style.visibility = 'hidden';
})
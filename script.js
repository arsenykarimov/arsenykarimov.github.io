const menu = document.querySelector('.menu');
const menuIcon = document.querySelector('.menu-icon');

let opened = true;


// first automatic reveal

setTimeout(() => {
  menu.classList.add('menu-opened');
  menu.classList.remove('menu-closed');
}, 7200);


// manual control

menuIcon.addEventListener('click', () => {

  if (opened) {

    menu.classList.remove('menu-opened');
    menu.classList.add('menu-closed');

    opened = false;

  } else {

    menu.classList.remove('menu-closed');
    menu.classList.add('menu-opened');

    opened = true;

  }

});

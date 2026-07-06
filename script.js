const menu = document.querySelector('.menu');
const menuIcon = document.querySelector('.menu-icon');

let opened = false;

setTimeout(() => {
  menu.classList.add('menu-opened');
  menu.classList.remove('menu-closed');
  opened = true;
}, 4200);

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

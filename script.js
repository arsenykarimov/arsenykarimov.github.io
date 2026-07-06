const menu = document.querySelector('.menu');
const menuIcon = document.querySelector('.menu-icon');

let menuOpened = true;

menuIcon.addEventListener('click', () => {
  menuOpened = !menuOpened;

  if (menuOpened) {
    menu.classList.remove('menu-closed');
    menu.classList.add('menu-opened');
  } else {
    menu.classList.remove('menu-opened');
    menu.classList.add('menu-closed');
  }
});

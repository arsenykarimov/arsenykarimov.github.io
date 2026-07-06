const menu = document.querySelector('.menu');
const menuIcon = document.querySelector('.menu-icon');

menuIcon.addEventListener('click', () => {

  menu.classList.toggle('menu-opened');
  menu.classList.toggle('menu-closed');

});

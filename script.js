const menu = document.querySelector('.menu');
const menuIcon = document.querySelector('.menu-icon');

setTimeout(() => {
  menu.classList.add('menu-opened');
}, 7200);

menuIcon.addEventListener('click', () => {
  menu.classList.toggle('menu-opened');
  menu.classList.toggle('menu-closed');
});

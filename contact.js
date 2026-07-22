const menuButton = document.querySelector('.menu-button');
const menuOverlay = document.querySelector('.menu-overlay');

menuButton.addEventListener('click', () => {
  document.body.classList.toggle('menu-active');
});

menuOverlay.addEventListener('click', (event) => {
  if (!event.target.closest('.menu-links')) {
    document.body.classList.remove('menu-active');
  }
});

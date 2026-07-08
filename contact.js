const menuButton = document.querySelector('.contact-menu-button');
const menuOverlay = document.querySelector('.contact-menu-overlay');

menuButton.addEventListener('click', () => {
  document.body.classList.toggle('contact-menu-active');
});

menuOverlay.addEventListener('click', (event) => {
  if (!event.target.closest('.contact-menu-links')) {
    document.body.classList.remove('contact-menu-active');
  }
});

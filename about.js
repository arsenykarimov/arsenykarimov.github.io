const menuButton = document.querySelector('.about-menu-button');
const menuOverlay = document.querySelector('.about-menu-overlay');

let menuOpen = false;

function openAboutMenu() {
  document.body.classList.add('about-menu-active');
  menuOpen = true;
}

function closeAboutMenu() {
  document.body.classList.remove('about-menu-active');
  menuOpen = false;
}

menuButton.addEventListener('click', () => {
  if (menuOpen) {
    closeAboutMenu();
  } else {
    openAboutMenu();
  }
});

menuOverlay.addEventListener('click', (event) => {
  if (!event.target.closest('.about-menu-links')) {
    closeAboutMenu();
  }
});
const menu = document.querySelector('.menu');
const menuIcon = document.querySelector('.menu-icon');

let opened = false;
let menuWasUsed = false;

const autoOpenTimer = setTimeout(() => {
  if (menuWasUsed || opened) {
    return;
  }

  menu.classList.add('menu-opened');
  menu.classList.remove('menu-closed');

  document.body.classList.add('home-menu-open');

  preloadWorkPosters();

  opened = true;
}, 6200);

menuIcon.addEventListener('click', () => {
  menuWasUsed = true;
  clearTimeout(autoOpenTimer);

  if (opened) {
    menu.classList.remove('menu-opened');
    menu.classList.add('menu-closed');

    document.body.classList.remove('home-menu-open');

    opened = false;
    return;
  }

  menu.classList.remove('menu-closed');
  menu.classList.add('menu-opened');

  document.body.classList.add('home-menu-open');

  preloadWorkPosters();

  opened = true;
});

let workPostersPreloaded = false;

function preloadWorkPosters() {
  if (workPostersPreloaded) {
    return;
  }

  const posters = [
    'posters/retrograde.jpg',
    'posters/paraneba.jpg',
    'posters/anikushin.jpg'
  ];

  posters.forEach((src) => {
    const img = new Image();
    img.src = src;
  });

  workPostersPreloaded = true;
}

const workLink = document.querySelector('.work-link');

if (workLink) {
  workLink.addEventListener('click', (event) => {
    event.preventDefault();

    preloadWorkPosters();

    workLink.classList.add('loading');

    setTimeout(() => {
      window.location.href = workLink.href;
    }, 900);
  });
}
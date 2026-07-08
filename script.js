const menu = document.querySelector('.menu');
const menuIcon = document.querySelector('.menu-icon');

let opened = false;

setTimeout(() => {
  menu.classList.add('menu-opened');
  menu.classList.remove('menu-closed');
  preloadWorkPosters();
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
const playButton = document.querySelector('.showreel-play');
const player = document.querySelector('.showreel-player');
const video = document.querySelector('.showreel-video');
const closeButton = document.querySelector('.showreel-close');

const menuButton = document.querySelector('.showreel-menu-button');
const menuOverlay = document.querySelector('.showreel-menu-overlay');


const showreelUrl = "";


function openPlayer() {
  document.body.classList.remove('showreel-menu-active');

  video.src = showreelUrl;
  video.currentTime = 0;

  player.classList.add('visible');

  video.play().catch(() => {});
}


function closePlayer() {
  video.pause();

  player.classList.remove('visible');

  setTimeout(() => {
    video.src = "";
  }, 500);
}


playButton.addEventListener('click', () => {
  openPlayer();
});


closeButton.addEventListener('click', () => {
  closePlayer();
});


menuButton.addEventListener('click', () => {
  document.body.classList.toggle('showreel-menu-active');
});


menuOverlay.addEventListener('click', (event) => {
  if (!event.target.closest('.showreel-menu-links')) {
    document.body.classList.remove('showreel-menu-active');
  }
});

const title = document.querySelector('.showreel-title');
const playButton = document.querySelector('.showreel-play');
const player = document.querySelector('.showreel-player');
const video = document.querySelector('.showreel-video');
const closeButton = document.querySelector('.showreel-close');

const menuButton = document.querySelector('.showreel-menu-button');
const menuOverlay = document.querySelector('.showreel-menu-overlay');
const viewer = document.querySelector('.showreel-viewer');

const showreelUrl = "https://pub-e6c268da1b654b929cf0eb9763a0a6e1.r2.dev/Trailers/showreel.mp4";

let playVisible = false;


function showPlay() {
  title.classList.add('hidden');
  playButton.classList.add('visible');
  playVisible = true;
}


function hidePlay() {
  playButton.classList.remove('visible');
  title.classList.remove('hidden');
  playVisible = false;
}


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

  hidePlay();

  setTimeout(() => {
    video.src = "";
  }, 500);
}


viewer.addEventListener('click', (event) => {
  if (
    event.target.closest('.showreel-play') ||
    event.target.closest('.showreel-menu-button') ||
    event.target.closest('.showreel-menu-overlay')
  ) {
    return;
  }

  if (!playVisible) {
    showPlay();
    return;
  }

  hidePlay();
});


playButton.addEventListener('click', () => {
  openPlayer();
});


closeButton.addEventListener('click', () => {
  closePlayer();
});


menuButton.addEventListener('click', () => {
  document.body.classList.toggle('showreel-menu-active');

  title.classList.add('hidden');
  playButton.classList.remove('visible');
  playVisible = false;
});


menuOverlay.addEventListener('click', (event) => {
  if (!event.target.closest('.showreel-menu-links')) {
    document.body.classList.remove('showreel-menu-active');
    title.classList.remove('hidden');
  }
});

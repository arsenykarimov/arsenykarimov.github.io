const title = document.querySelector('.showreel-title');
const playButton = document.querySelector('.showreel-play');
const player = document.querySelector('.showreel-player');
const video = document.querySelector('.showreel-video');
const closeButton = document.querySelector('.showreel-close');

const viewer = document.querySelector('.showreel-viewer');

const canHover = window.matchMedia('(hover: hover)').matches;

const showreelUrl = "https://pub-e6c268da1b654b929cf0eb9763a0a6e1.r2.dev/Trailers/showreel.mp4";

let playVisible = false;
let hoverActive = false;
let titlePlayTimer = null;


function stopTitlePlayTimer() {
  clearTimeout(titlePlayTimer);
  titlePlayTimer = null;
}


function showTitle() {
  playButton.classList.remove('visible');
  title.classList.remove('hidden');
  playVisible = false;
}


function showPlay() {
  title.classList.add('hidden');
  playButton.classList.add('visible');
  playVisible = true;
}


function canRunTitlePlayTimer() {
  return (
    !menu.isOpen() &&
    !player.classList.contains('visible') &&
    !hoverActive
  );
}


function startTitlePlayTimer() {
  stopTitlePlayTimer();

  if (!canRunTitlePlayTimer()) return;

  titlePlayTimer = setTimeout(() => {
    if (!canRunTitlePlayTimer()) return;

    if (playVisible) {
      showTitle();
    } else {
      showPlay();
    }

    startTitlePlayTimer();
  }, 2000);
}


function openPlayer() {
  stopTitlePlayTimer();
  hoverActive = false;

  menu.close();

  playButton.classList.remove('visible');
  playVisible = false;

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

  showTitle();
  startTitlePlayTimer();
}


viewer.addEventListener('click', (event) => {
  if (
    menu.isOpen() ||
    player.classList.contains('visible') ||
    event.target.closest('.showreel-play') ||
    event.target.closest('.menu-button') ||
    event.target.closest('.menu-overlay')
  ) {
    return;
  }

  if (!playVisible) {
    stopTitlePlayTimer();
    hoverActive = false;
    showPlay();
    return;
  }

  hoverActive = false;
  showTitle();
  startTitlePlayTimer();
});


if (canHover) {
  viewer.addEventListener('mousemove', (event) => {
    if (
      menu.isOpen() ||
      player.classList.contains('visible') ||
      event.target.closest('.menu-button') ||
      event.target.closest('.menu-overlay') ||
      event.target.closest('.showreel-play')
    ) {
      return;
    }

    const rect = viewer.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const insideTitleZone =
      x > rect.width * 0.28 &&
      x < rect.width * 0.72 &&
      y > rect.height * 0.36 &&
      y < rect.height * 0.58;

    if (insideTitleZone && !hoverActive) {
      hoverActive = true;
      stopTitlePlayTimer();
      showPlay();
    }

    if (!insideTitleZone && hoverActive) {
      hoverActive = false;
      showTitle();
      startTitlePlayTimer();
    }
  });
}


playButton.addEventListener('click', () => {
  openPlayer();
});


closeButton.addEventListener('click', () => {
  closePlayer();
});


const menu = initMenu({
  onOpen() {
    stopTitlePlayTimer();
    title.classList.add('hidden');
    playButton.classList.remove('visible');
    playVisible = false;
  },
  onClose() {
    showTitle();
    startTitlePlayTimer();
  },
});


showTitle();
startTitlePlayTimer();
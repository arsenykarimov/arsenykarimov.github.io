const posterA = document.querySelector('.poster-a');
const posterB = document.querySelector('.poster-b');
const loopVideo = document.querySelector('.work-loop');
const trailerVideo = document.querySelector('.trailer-video');

const titleBlock = document.querySelector('.work-title');
const titleText = document.querySelector('#project-title');
const subtitleText = document.querySelector('#project-subtitle');

const playButton = document.querySelector('.work-play');
const player = document.querySelector('.work-player');
const closeButton = document.querySelector('.work-close');

const arrowLeft = document.querySelector('.work-arrow-left');
const arrowRight = document.querySelector('.work-arrow-right');
const workViewer = document.querySelector('.work-viewer');

const workMenuButton = document.querySelector('.work-menu-button');
const workMenuOverlay = document.querySelector('.work-menu-overlay');

let currentProject = 0;
let activePoster = posterA;
let hiddenPoster = posterB;

let previewPaused = false;
let playVisible = false;
let workMenuOpen = false;

let touchStartX = 0;
let touchStartY = 0;
let isSwitching = false;


function applyProject(index) {
  const project = projects[index];

  titleText.textContent = project.title;
  subtitleText.textContent = project.subtitle;

  document.documentElement.style.setProperty('--work-accent', project.accent);

  loopVideo.classList.remove('visible');
  loopVideo.pause();

  loopVideo.poster = project.poster;
  loopVideo.src = project.loop;
  loopVideo.load();

  trailerVideo.pause();
  trailerVideo.src = project.trailer;
  trailerVideo.load();

  loopVideo.addEventListener('canplay', () => {
    loopVideo.play().catch(() => {});
    loopVideo.classList.add('visible');
  }, { once: true });

  player.classList.remove('visible');
  document.body.classList.remove('player-open');

  titleBlock.classList.remove('hidden');
  playButton.classList.remove('visible');

  previewPaused = false;
  playVisible = false;
}


function loadFirstProject() {
  const project = projects[currentProject];

  activePoster.src = project.poster;
  activePoster.classList.add('active');
  activePoster.classList.remove('arriving');

  applyProject(currentProject);
}


function showProject(direction) {
  if (isSwitching) {
    return;
  }

  isSwitching = true;

  closeWorkMenu();

  const nextIndex =
    direction === 'next'
      ? (currentProject + 1) % projects.length
      : (currentProject - 1 + projects.length) % projects.length;

  const nextProject = projects[nextIndex];

  hiddenPoster.src = nextProject.poster;
  hiddenPoster.classList.add('arriving');

  document.body.classList.add('work-transition');
  titleBlock.classList.add('switching');

  playButton.classList.remove('visible');
  previewPaused = false;
  playVisible = false;

  setTimeout(() => {
    currentProject = nextIndex;

    document.documentElement.style.setProperty('--work-accent', nextProject.accent);

    titleText.textContent = nextProject.title;
    subtitleText.textContent = nextProject.subtitle;

    activePoster.classList.remove('active');
    hiddenPoster.classList.add('active');

    hiddenPoster.classList.remove('arriving');

    const oldPoster = activePoster;
    activePoster = hiddenPoster;
    hiddenPoster = oldPoster;

    applyProject(currentProject);

titleBlock.classList.add('switching');

setTimeout(() => {
  document.body.classList.remove('work-transition');
  isSwitching = false;
}, 260);

  }, 100);
}


function openWorkMenu() {
  titleBlock.classList.add('hidden');
  playButton.classList.remove('visible');

  document.body.classList.add('work-menu-active');

  previewPaused = false;
  playVisible = false;
  workMenuOpen = true;
}


function closeWorkMenu() {
  document.body.classList.remove('work-menu-active');

  if (!player.classList.contains('visible')) {
    titleBlock.classList.remove('hidden');
  }

  workMenuOpen = false;
}


workViewer.addEventListener('click', (event) => {
  if (
    workMenuOpen ||
    isSwitching ||
    event.target.closest('.work-arrow') ||
    event.target.closest('.work-play') ||
    event.target.closest('.work-player') ||
    event.target.closest('.work-menu-button') ||
    event.target.closest('.work-menu-overlay')
  ) {
    return;
  }

  if (!previewPaused) {
    titleBlock.classList.add('hidden');
    playButton.classList.add('visible');

    previewPaused = true;
    playVisible = true;

    return;
  }

  if (playVisible) {
    playButton.classList.remove('visible');
    titleBlock.classList.remove('hidden');

    previewPaused = false;
    playVisible = false;
  }
});


playButton.addEventListener('click', () => {
  closeWorkMenu();

  document.body.classList.add('player-open');
  player.classList.add('visible');

  trailerVideo.currentTime = 0;
  trailerVideo.play().catch(() => {});
});


closeButton.addEventListener('click', () => {
  trailerVideo.pause();

  player.classList.remove('visible');
  document.body.classList.remove('player-open');

  playButton.classList.remove('visible');
  titleBlock.classList.remove('hidden');

  previewPaused = false;
  playVisible = false;
});


arrowRight.addEventListener('click', () => {
  showProject('next');
});


arrowLeft.addEventListener('click', () => {
  showProject('prev');
});


workMenuButton.addEventListener('click', () => {
  if (workMenuOpen) {
    closeWorkMenu();
  } else {
    openWorkMenu();
  }
});


workMenuOverlay.addEventListener('click', (event) => {
  if (!event.target.closest('.work-menu-links')) {
    closeWorkMenu();
  }
});


workViewer.addEventListener('touchstart', (event) => {
  touchStartX = event.changedTouches[0].screenX;
  touchStartY = event.changedTouches[0].screenY;
}, { passive: true });


workViewer.addEventListener('touchend', (event) => {
  const touchEndX = event.changedTouches[0].screenX;
  const touchEndY = event.changedTouches[0].screenY;

  const diffX = touchEndX - touchStartX;
  const diffY = touchEndY - touchStartY;

  if (Math.abs(diffX) < 60 && Math.abs(diffY) < 60) {
    return;
  }

  if (Math.abs(diffY) > Math.abs(diffX)) {
    if (diffY < -60 && workMenuOpen) {
      closeWorkMenu();
    }

    return;
  }

  if (
    workMenuOpen ||
    player.classList.contains('visible') ||
    isSwitching
  ) {
    return;
  }

  if (diffX < -60) {
    showProject('next');
  }

  if (diffX > 60) {
    showProject('prev');
  }
}, { passive: true });


loadFirstProject();

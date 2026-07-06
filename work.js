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

let currentProject = 0;
let previewPaused = false;
let playVisible = false;
const workMenuButton = document.querySelector('.work-menu-button');
const workMenuOverlay = document.querySelector('.work-menu-overlay');

let workMenuOpen = false;


function loadProject(index) {
  const project = projects[index];

  titleText.textContent = project.title;
  subtitleText.textContent = project.subtitle;

  document.documentElement.style.setProperty('--work-accent', project.accent);

  loopVideo.src = project.loop;
  loopVideo.load();
  loopVideo.play().catch(() => {});

  trailerVideo.pause();
  trailerVideo.src = project.trailer;
  trailerVideo.load();

  player.classList.remove('visible');

  titleBlock.classList.remove('hidden');
  playButton.classList.remove('visible');

  previewPaused = false;
  playVisible = false;
}


function showProject(direction) {
  document.body.classList.add('work-flash');

  trailerVideo.pause();
  player.classList.remove('visible');

  setTimeout(() => {
    if (direction === 'next') {
      currentProject = (currentProject + 1) % projects.length;
    } else {
      currentProject = (currentProject - 1 + projects.length) % projects.length;
    }

    loadProject(currentProject);
  }, 180);

  setTimeout(() => {
    document.body.classList.remove('work-flash');
  }, 420);
}


workViewer.addEventListener('click', (event) => {
  if (
    event.target.closest('.work-arrow') ||
    event.target.closest('.work-play') ||
    event.target.closest('.work-player')
  ) {
    return;
  }

  if (!previewPaused) {
    loopVideo.pause();

    titleBlock.classList.add('hidden');
    playButton.classList.add('visible');

    previewPaused = true;
    playVisible = true;

    return;
  }

  if (playVisible) {
    playButton.classList.remove('visible');
    titleBlock.classList.remove('hidden');

    loopVideo.play().catch(() => {});

    previewPaused = false;
    playVisible = false;
  }
});


playButton.addEventListener('click', () => {
  player.classList.add('visible');

  trailerVideo.currentTime = 0;
  trailerVideo.play().catch(() => {});
});


closeButton.addEventListener('click', () => {
  trailerVideo.pause();
  player.classList.remove('visible');
});


arrowRight.addEventListener('click', () => {
  showProject('next');
});


arrowLeft.addEventListener('click', () => {
  showProject('prev');
});


loadProject(currentProject);

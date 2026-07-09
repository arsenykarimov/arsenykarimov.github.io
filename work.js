const posterA = document.querySelector('.poster-a');
const posterB = document.querySelector('.poster-b');
const loopVideo = document.querySelector('.work-loop');
const trailerVideo = document.querySelector('.trailer-video');

const titleText = document.querySelector('#project-title');
const subtitleText = document.querySelector('#project-subtitle');
const nextTitleText = document.querySelector('#next-project-title');
const nextSubtitleText = document.querySelector('#next-project-subtitle');

const currentTitleBlock = document.querySelector('.title-current');
const nextTitleBlock = document.querySelector('.title-next');

const playButton = document.querySelector('.work-play');
const player = document.querySelector('.work-player');
const closeButton = document.querySelector('.work-close');

const arrowLeft = document.querySelector('.work-arrow-left');
const arrowRight = document.querySelector('.work-arrow-right');
const workViewer = document.querySelector('.work-viewer');

const workMenuButton = document.querySelector('.work-menu-button');
const workMenuOverlay = document.querySelector('.work-menu-overlay');

const canHover = window.matchMedia('(hover: hover)').matches;

let currentProject = 0;
let activePoster = posterA;
let hiddenPoster = posterB;

let playVisible = false;
let workMenuOpen = false;

let touchStartX = 0;
let touchStartY = 0;
let isSwitching = false;

let workPostersReady = false;
let titlePlayTimer = null;
let hoverActive = false;


function preloadWorkPosters() {
  if (workPostersReady) return;

  projects.forEach((project) => {
    const img = new Image();
    img.src = project.poster;
  });

  workPostersReady = true;
}


function stopTitlePlayTimer() {
  clearTimeout(titlePlayTimer);
  titlePlayTimer = null;
}


function showTitle() {
  playButton.classList.remove('visible');

  currentTitleBlock.classList.remove('hidden');
  nextTitleBlock.classList.remove('hidden');

  currentTitleBlock.classList.remove('cross-out');
  nextTitleBlock.classList.remove('cross-in');

  playVisible = false;
}


function showPlay() {
  currentTitleBlock.classList.add('hidden');
  nextTitleBlock.classList.add('hidden');

  currentTitleBlock.classList.remove('cross-out');
  nextTitleBlock.classList.remove('cross-in');

  playButton.classList.add('visible');

  playVisible = true;
}


function canRunTitlePlayTimer() {
  return (
    !workMenuOpen &&
    !isSwitching &&
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


function applyProject(index) {
  const project = projects[index];

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
}


function loadFirstProject() {
  const project = projects[currentProject];

  activePoster.src = project.poster;
  activePoster.classList.add('active');
  activePoster.classList.remove('arriving');

  titleText.textContent = project.title;
  subtitleText.textContent = project.subtitle;

  document.documentElement.style.setProperty('--work-accent', project.accent);
  document.documentElement.style.setProperty('--current-accent', project.accent);

  applyProject(currentProject);
  preloadWorkPosters();
  showTitle();
  startTitlePlayTimer();
}


function showProject(direction) {
  if (isSwitching) return;

  isSwitching = true;
  hoverActive = false;

  stopTitlePlayTimer();
  closeWorkMenu();
  showTitle();

  const nextIndex =
    direction === 'next'
      ? (currentProject + 1) % projects.length
      : (currentProject - 1 + projects.length) % projects.length;

  const nextProject = projects[nextIndex];
  const preloadPoster = new Image();

  preloadPoster.onload = () => {
    hiddenPoster.src = nextProject.poster;
    hiddenPoster.classList.add('arriving');

    nextTitleText.textContent = nextProject.title;
    nextSubtitleText.textContent = nextProject.subtitle;

    document.documentElement.style.setProperty('--next-accent', nextProject.accent);

    nextTitleBlock.classList.add('cross-in');
    currentTitleBlock.classList.add('cross-out');

    document.body.classList.add('work-transition');

    setTimeout(() => {
      currentProject = nextIndex;

      activePoster.classList.remove('active');
      hiddenPoster.classList.add('active');

      const oldPoster = activePoster;
      activePoster = hiddenPoster;
      hiddenPoster = oldPoster;

      setTimeout(() => {
        activePoster.classList.remove('arriving');
      }, 420);

      applyProject(currentProject);

      setTimeout(() => {
        titleText.textContent = nextProject.title;
        subtitleText.textContent = nextProject.subtitle;

        document.documentElement.style.setProperty('--work-accent', nextProject.accent);
        document.documentElement.style.setProperty('--current-accent', nextProject.accent);

        currentTitleBlock.classList.remove('cross-out');

        document.body.classList.remove('work-transition');
        isSwitching = false;

        showTitle();
        startTitlePlayTimer();
      }, 520);

    }, 100);
  };

  preloadPoster.onerror = () => {
    isSwitching = false;
    startTitlePlayTimer();
  };

  preloadPoster.src = nextProject.poster;
}


function openWorkMenu() {
  stopTitlePlayTimer();

  currentTitleBlock.classList.add('hidden');
  nextTitleBlock.classList.add('hidden');

  playButton.classList.remove('visible');
  playVisible = false;

  document.body.classList.add('work-menu-active');

  workMenuOpen = true;
}


function closeWorkMenu() {
  document.body.classList.remove('work-menu-active');

  workMenuOpen = false;

  if (!player.classList.contains('visible') && !isSwitching) {
    showTitle();
    startTitlePlayTimer();
  }
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
  workViewer.addEventListener('mousemove', (event) => {
    if (
      workMenuOpen ||
      isSwitching ||
      player.classList.contains('visible') ||
      event.target.closest('.work-arrow') ||
      event.target.closest('.work-menu-button') ||
      event.target.closest('.work-menu-overlay') ||
      event.target.closest('.work-play')
    ) {
      return;
    }

    const rect = workViewer.getBoundingClientRect();
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
  stopTitlePlayTimer();
  hoverActive = false;
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

  showTitle();
  startTitlePlayTimer();
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

  if (Math.abs(diffX) < 60 && Math.abs(diffY) < 60) return;

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

  if (diffX < -60) showProject('next');
  if (diffX > 60) showProject('prev');
}, { passive: true });


loadFirstProject();

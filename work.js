const posterA = document.querySelector('.poster-a');
const posterB = document.querySelector('.poster-b');
const loopVideo = document.querySelector('.work-loop');
const trailerVideo = document.querySelector('.trailer-video');

const titleText = document.querySelector('#project-title');
const subtitleText = document.querySelector('#project-subtitle');
const nextTitleText = document.querySelector('#next-project-title');
const nextSubtitleText = document.querySelector('#next-project-subtitle');

const projectCounter = document.querySelector('#project-counter');

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

// Transition duration, read from --work-fade in work.css so JS + CSS stay in sync.
const FADE_MS = (parseFloat(
  getComputedStyle(document.documentElement).getPropertyValue('--work-fade')
) || 0.5) * 1000;

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

function updateProjectCounter() {
  if (!projectCounter) return;

  const currentNumber = String(currentProject + 1).padStart(2, '0');
  const totalNumber = String(projects.length).padStart(2, '0');

  projectCounter.innerHTML = `${currentNumber}&nbsp;&nbsp;/&nbsp;&nbsp;${totalNumber}`;
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
}, { once: true });

  player.classList.remove('visible');
  document.body.classList.remove('player-open');
}


function loadFirstProject() {
  const project = projects[currentProject];

  activePoster.src = project.poster;
  activePoster.classList.add('active');

  titleText.textContent = project.title;
  subtitleText.textContent = project.subtitle;

  updateProjectCounter();

  document.documentElement.style.setProperty('--work-accent', project.accent);
  document.documentElement.style.setProperty('--current-accent', project.accent);

  applyProject(currentProject);
  loopVideo.addEventListener('canplay', () => {
  loopVideo.classList.add('visible');
  }, { once: true });
  
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

  const previousPoster = activePoster;
  const nextPoster = hiddenPoster;

  // Load the incoming still into the (invisible) hidden poster up front.
  nextPoster.src = nextProject.poster;

  const runTransition = () => {
    currentProject = nextIndex;

    // The previous loop clip sits above the posters — drop it with no fade so
    // the poster crossfade underneath is visible. The still shows the same
    // frame, so the swap is seamless.
    loopVideo.classList.add('instant');
    loopVideo.classList.remove('visible');
    loopVideo.pause();

    // Title + accent colours + counter all recolour on the SAME frame as the
    // poster crossfade. --work-accent drives the UI (counter, arrows, logo),
    // so it must change now, not at the end — otherwise the UI lags ~1s behind.
    nextTitleText.textContent = nextProject.title;
    nextSubtitleText.textContent = nextProject.subtitle;
    document.documentElement.style.setProperty('--next-accent', nextProject.accent);
    document.documentElement.style.setProperty('--work-accent', nextProject.accent);
    updateProjectCounter();
    nextTitleBlock.classList.add('cross-in');
    currentTitleBlock.classList.add('cross-out');

    // Incoming poster goes on top and is reset to its hidden / un-zoomed start
    // WITHOUT animating the reset, then fades in AND zooms as a single gesture
    // over the still-opaque outgoing poster (which stays put — no flash).
    nextPoster.style.zIndex = '2';
    previousPoster.style.zIndex = '1';
    nextPoster.style.transition = 'none';
    nextPoster.classList.remove('active');
    void nextPoster.offsetWidth;
    nextPoster.style.transition = '';
    nextPoster.classList.add('active');

    activePoster = nextPoster;
    hiddenPoster = previousPoster;

    // Prepare the new loop clip (its poster attribute matches the still).
    applyProject(currentProject);

    // When the crossfade lands, everything commits together.
    setTimeout(() => {
      previousPoster.classList.remove('active');

      titleText.textContent = nextProject.title;
      subtitleText.textContent = nextProject.subtitle;
      document.documentElement.style.setProperty('--current-accent', nextProject.accent);

      loopVideo.classList.remove('instant');
      loopVideo.classList.add('visible');

      isSwitching = false;
      playVisible = false;
      startTitlePlayTimer();
    }, FADE_MS);
  };

  // Start the moment the incoming poster is decodable — instant for the
  // already-preloaded posters, a short wait otherwise.
  if (nextPoster.decode) {
    nextPoster.decode().then(runTransition).catch(runTransition);
  } else {
    runTransition();
  }
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
  document.body.classList.remove('work-menu-active');
  workMenuOpen = false;


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

const loopVideo = document.querySelector('.work-loop');

const title = document.querySelector('.work-title');
const playButton = document.querySelector('.work-play');

const player = document.querySelector('.work-player');
const trailer = document.querySelector('.trailer-video');
const closeButton = document.querySelector('.work-close');


let pausedPreview = false;


// первый клик по кадру:
// останавливаем loop и показываем play

document.querySelector('.work-viewer').addEventListener('click', (e) => {

  if (
    pausedPreview ||
    e.target.closest('.work-arrow') ||
    e.target.closest('.work-play')
  ) {
    return;
  }

  loopVideo.pause();

  title.classList.add('hidden');
  playButton.classList.add('visible');

  pausedPreview = true;

});


// открыть трейлер

playButton.addEventListener('click', () => {

  player.classList.add('visible');

  trailer.currentTime = 0;
  trailer.play();

});


// закрыть трейлер

closeButton.addEventListener('click', () => {

  trailer.pause();

  player.classList.remove('visible');

});

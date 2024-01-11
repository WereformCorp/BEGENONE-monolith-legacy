// eslint-disable-next-line import/no-extraneous-dependencies
const { JSDOM } = require('jsdom');

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');

// Now you can interact with the DOM using dom.window.document
const { document } = dom.window;

const video = document.querySelector('.sect-mid-vdoPlayer-video');
const backward = document.querySelector('.vdo-ctrls-item-1');
const forward = document.querySelector('.vdo-ctrls-item-2');
const playNpause = document.querySelector('.vdo-ctrls-item-3');
// const volume = document.querySelector('.vdo-ctrls-item-4');
const videoCtrlPanel = document.querySelector('.vdo-ctrlPanel');
const videoPlayerControls = document.querySelector('.vdoPlayer-controls');
const fullscreen = document.querySelector('.vdo-ctrls-item-10');

const bufferLineContainer = document.querySelector('.vdo-bufferLine-container');
const bufferLine = document.querySelector('.vdo-bufferLine');

// const vdoBackwardBtn = document.querySelector('.vdo-item-backward');
// const vdoForwardBtn = document.querySelector('.vdo-item-forward');
const play = document.querySelector('.vdo-item-play');
const changeVolumeIcon = document.querySelector('.vdo-item-volume');
// const cinemaMode = document.querySelector('.vdo-item-cinemaMode');
// const picInpic = document.querySelector('.vdo-item-picInpic');
// const setting = document.querySelector('.vdo-item-setting');
// const caption = document.querySelector('.vdo-item-caption');
// const fullScreen = document.querySelector('.vdo-item-fullScreen');

video.controls = true;

// Get the video element

// Add an event listener to the play/pause button
playNpause.addEventListener('click', () => {
  // If the video is playing, pause it
  if (video.paused) {
    video.play();
    play.src = 'imgs/Middle Nav/svgs/pause-solid.svg';
  } else {
    video.pause();
    play.src = 'imgs/Middle Nav/svgs/play-solid.svg';
  }
});

video.addEventListener('click', (event) => {
  // If the video is playing, pause it
  if (video.paused) {
    video.play();
    play.src = 'imgs/Middle Nav/svgs/pause-solid.svg';
  } else {
    video.pause();
    play.src = 'imgs/Middle Nav/svgs/play-solid.svg';
  }

  event.stopPropagation();
});

// Add an event listener to the fullscreen button
fullscreen.addEventListener('click', () => {
  // Toggle fullscreen mode
  if (video.requestFullscreen) video.requestFullscreen();
  else if (video.mozRequestFullScreen) video.mozRequestFullScreen();
  else if (video.webkitRequestFullscreen) video.webkitRequestFullscreen();
});

video.addEventListener('dblclick', () => {
  if (video.webkitIsFullScreen) {
    video.webkitExitFullscreen();
    // videoCtrlPanel.style.display = "block";
  } else {
    video.webkitRequestFullscreen();
    videoCtrlPanel.style.display = 'none';
  }
});

// Update the width of the buffer line element as the video is loading
bufferLine.style.width = `${0}%`;

video.addEventListener('progress', () => {
  const bufferedPercentage = video.buffered.length / video.duration;
  bufferLine.style.width = `${bufferedPercentage * 100}%`;
});

// Update the width of the buffer line element when the user clicks the backward or forward buttons
backward.addEventListener('click', () => {
  // Rewind the video by 10 seconds
  video.currentTime -= 5;

  // Update the width of the buffer line element
  bufferLine.style.width = `${(video.buffered.length / video.duration) * 100}%`;
});

forward.addEventListener('click', () => {
  // Fast forward the video by 10 seconds
  video.currentTime += 5;

  // Update the width of the buffer line element
  bufferLine.style.width = `${(video.buffered.length / video.duration) * 100}%`;
});

bufferLine.style.width = '0%';

// Add an event listener to the video element
video.addEventListener('timeupdate', () => {
  // Get the current playback position of the video
  const { currentTime } = video;

  // Set the width of the buffer line element to the current playback position
  bufferLine.style.width = `${(currentTime / video.duration) * 100}%`;
});

// Add an event listener to the keyboard
document.addEventListener('keydown', (event) => {
  // Check which arrow key was pressed
  // eslint-disable-next-line default-case
  switch (event.key) {
    case 'ArrowRight':
      // Move the video forward 5 seconds
      video.currentTime += 5;
      break;
    case 'ArrowLeft':
      // Move the video backward 5 seconds
      video.currentTime -= 5;
      break;
    case 'ArrowUp':
      // Increase the volume by 10%
      video.volume += 0.1;
      break;
    case 'ArrowDown':
      // Decrease the volume by 10%
      video.volume -= 0.1;
      break;
  }

  if (event.key === ' ') {
    // If the video is playing, pause it
    if (video.paused) {
      video.play();
      play.src = 'imgs/Middle Nav/svgs/pause-solid.svg';
    } else {
      video.pause();
      play.src = 'imgs/Middle Nav/svgs/play-solid.svg';
    }
    event.preventDefault();
  }

  if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
    event.preventDefault();
  }
});

// Add an event listener to the video element
video.addEventListener('mousemove', () => {
  // Show the control panel
  videoCtrlPanel.style.display = 'grid';
  // videoCtrlPanel.style.display = "grid";

  // Start a timer to fade out the control panel after 2 seconds if the cursor is not moving
  // const fadeOutTimer = setTimeout(() => {
  //   // Fade out the control panel
  //   videoCtrlPanel.style.opacity = 1;
  //   videoCtrlPanel.style.transition = "opacity 2s ease-out";

  //   // Hide the control panel after the fade-out is complete
  //   setTimeout(() => {
  //     videoCtrlPanel.style.display = "none";
  //   }, 1000);
  // }, 1000);

  // // Reset the fade out timer if the cursor moves or if the mouse is over the control panel
  // video.addEventListener("mousemove", () => {
  //   clearTimeout(fadeOutTimer);
  // });

  // videoCtrlPanel.addEventListener("mousemove", () => {
  //   clearTimeout(fadeOutTimer);
  // });
});

// Add an event listener to the video element to detect when the volume changes
video.addEventListener('volumechange', () => {
  // Get the current video volume
  const volumeFrequency = video.volume;

  // If the volume is 0%, show the volume-off button
  if (volumeFrequency === 0) {
    changeVolumeIcon.src = 'imgs/Middle Nav/svgs/volume-xmark-solid.svg';
  }

  // If the volume is less than 25%, show the volume-empty button
  else if (volumeFrequency < 0.25) {
    changeVolumeIcon.src = 'imgs/Middle Nav/svgs/volume-off-solid.svg';
  }

  // If the volume is more than 25% and less than 50%, show the volume-low button
  else if (volumeFrequency >= 0.25 && volumeFrequency < 0.5) {
    changeVolumeIcon.src = 'imgs/Middle Nav/svgs/volume-low-solid.svg';
  }

  // If the volume is more than 50% and less than 100%, show the volume-full button
  else if (volumeFrequency >= 0.5 && volumeFrequency < 1) {
    changeVolumeIcon.src = 'imgs/Middle Nav/svgs/volume-high-solid.svg';
  }
});

let isDragging = false;

bufferLineContainer.addEventListener('mousedown', (event) => {
  isDragging = true;

  // Get the mouse position relative to the buffer line
  const mouseX =
    event.clientX - bufferLineContainer.getBoundingClientRect().left;

  // Calculate the video time based on the mouse position
  const videoTime = (mouseX / bufferLineContainer.offsetWidth) * video.duration;

  // Set the video time
  video.currentTime = videoTime;
});

document.addEventListener('mousemove', (event) => {
  if (isDragging) {
    // Get the mouse position relative to the buffer line
    const mouseX =
      event.clientX - bufferLineContainer.getBoundingClientRect().left;

    // Calculate the video time based on the mouse position
    const videoTime =
      (mouseX / bufferLineContainer.offsetWidth) * video.duration;

    // Set the video time
    video.currentTime = videoTime;
  }
});

document.addEventListener('mouseup', () => {
  isDragging = false;
});

/* ////////////////// ROUGH CODE ///////////////////// */

videoCtrlPanel.style.zIndex = 2147483647;

// Hide the default video controls when the video enters fullscreen mode
videoPlayerControls.addEventListener('fullscreenchange', () => {
  if (videoPlayerControls.webkitIsFullScreen) {
    video.controls = true;
  } else {
    video.controls = true;
  }
});

video.addEventListener('fullscreenchange', () => {
  if (video.isFullScreen) {
    videoCtrlPanel.style.display = 'grid';
  } else {
    videoCtrlPanel.style.display = 'none';
  }
});

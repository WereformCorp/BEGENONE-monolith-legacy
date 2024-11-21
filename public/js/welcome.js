/* eslint-disable */

document.addEventListener('DOMContentLoaded', function () {
  if (typeof Storage !== 'undefined') {
    if (!localStorage.getItem('introShown')) {
      document.querySelector('.intro-screen').style.display = 'flex';
    } else {
      document.querySelector('.intro-screen').style.display = 'none';
    }

    document.getElementById('close-btn').addEventListener('click', function () {
      localStorage.setItem('introShown', 'true');
      document.querySelector('.intro-screen').style.display = 'none';
    });
  } else {
    console.log('localStorage is not supported.');
  }
});

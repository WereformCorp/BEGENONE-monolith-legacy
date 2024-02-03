/* eslint-disable */
// const notifBtn = document.querySelector('.sect-rgt-icon-5');
const homeSectionBtn = document.querySelector('.ctnt-nav-item-1');
const videosSectionBtn = document.querySelector('.ctnt-nav-item-2');
// const homeSectionBtn = document.querySelector('.ctnt-nav-item-3');
// const homeSectionBtn = document.querySelector('.ctnt-nav-item-4');
const wiresSectionBtn = document.querySelector('.ctnt-nav-item-5');
const aboutSectionBtn = document.querySelector('.ctnt-nav-item-6');

const homeSection = document.querySelector('.sect-mid-ctnt-home');
const videoSection = document.querySelector('.sect-mid-ctnt-vdos');
const aboutSection = document.querySelector('.sect-mid-ch-about');
const wiresSection = document.querySelector('.sect-mid-ch-wire');
// const notifPanel = document.querySelector('.sect-notification-panel');

// notifBtn.addEventListener('click', (event) => {
//   notifPanel.style.visibility =
//     notifPanel.style.visibility === 'visible' ? 'hidden' : 'visible';

//   event.stopPropagation();
// });

window.addEventListener('click', (event) => {
  // Check if the clicked element is outside the notifPanel
  if (
    !notifPanel.contains(event.target) &&
    notifPanel.style.visibility === 'visible'
  ) {
    notifPanel.style.visibility = 'hidden';
  }
});

homeSectionBtn.addEventListener('click', (e) => {
  videoSection.style.display = 'none';
  aboutSection.style.display = 'none';
  wiresSection.style.display = 'none';
  homeSection.style.display = 'flex';
});

videosSectionBtn.addEventListener('click', (e) => {
  homeSection.style.display = 'none';
  aboutSection.style.display = 'none';
  wiresSection.style.display = 'none';
  videoSection.style.display = 'flex';
});

wiresSectionBtn.addEventListener('click', (e) => {
  homeSection.style.display = 'none';
  aboutSection.style.display = 'none';
  videoSection.style.display = 'none';
  wiresSection.style.display = 'flex';
});

aboutSectionBtn.addEventListener('click', (e) => {
  homeSection.style.display = 'none';
  videoSection.style.display = 'none';
  wiresSection.style.display = 'none';
  aboutSection.style.display = 'flex';
});

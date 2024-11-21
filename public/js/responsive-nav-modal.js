/* eslint-disable */
const rightNavMenu = document.querySelector('.right-nav-menu');
const rightNavCloseModal = document.querySelector('.right-nav-close-modal');
const sectHeadIconImage = document.querySelector('.sect-head-icons-imgs');

sectHeadIconImage.addEventListener('click', function () {
  rightNavMenu.style.display = 'flex';
});

rightNavCloseModal.addEventListener('click', function () {
  rightNavMenu.style.display = 'none';
});

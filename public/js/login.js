/* eslint-disable */
// DOM ELEMENTS
// import baseUrl from './controllers/baseUrlController.js';
const loginForm = document.querySelector('.login-form');

const login = async (email, password) => {
  try {
    const baseUrl = await axios({
      method: 'GET',
      url: `/url/get-env-url`,
    });
    const urlPath = baseUrl.data.url;
    // console.log(baseUrl);
    // console.log(urlPath);

    const res = await axios({
      method: 'POST',
      url: `${urlPath}/api/v1/users/login`,
      data: {
        eAddress: {
          email,
          password,
        },
      },
    });

    // console.log('RESPONSE:', res);

    if (res.data.status === 'success') {
      // showAlert('success', 'Logged In Successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    alert(`Incorrect Email or Password`);
    console.log('error:', err);
  }
};

// document.addEventListener('DOMContentLoaded', function () {
//   const logoutOverlay = document.querySelector('.overlay-container-logout');
//   const logoutButton = document.querySelector('.logoutBtn');
//   const logoutOverlayConfirmButton = document.querySelector('.logout-confirm');
//   const logoutOverlayNotNowButton = document.querySelector('.logout-notNow');

//   // Event listeners for logout overlay buttons
//   logoutOverlayConfirmButton.addEventListener('click', function () {
//     // Handle logout confirmation logic
//     logoutOverlay.style.display = 'none'; // Hide the overlay
//   });

//   logoutOverlayNotNowButton.addEventListener('click', function () {
//     // Handle logout not now logic
//     logoutOverlay.style.display = 'none'; // Hide the overlay
//   });

//   logoutButton.addEventListener('click', function () {
//     // Show the logout overlay
//     logoutOverlay.style.display = 'flex';
//   });
// });

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  console.log(`EMAIL: ${email}`, `PASSWORD: ${password}`);
  login(email, password);
});

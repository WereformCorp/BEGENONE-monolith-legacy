/* eslint-disable */
// DOM ELEMENTS
const loginForm = document.querySelector('.login-form');

const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/login',
      data: {
        eAddress: {
          email,
          password,
        },
      },
    });

    console.log('RESPONSE:', res);

    if (res.data.status === 'success') {
      // showAlert('success', 'Logged In Successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
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

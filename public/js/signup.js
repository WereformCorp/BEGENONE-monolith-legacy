/* eslint-disable */
// import '@babel/polyfill';
// import { login } from './login';
// const login = require('login');

// const axios = require('axios');

// DOM ELEMENTS
// const notyf = new Notyf({
//   duration: 10000, // Notification display time in ms
//   position: {
//     x: 'right',
//     y: 'top',
//   },
//   types: [
//     {
//       type: 'info',
//       background: 'blue',
//       icon: {
//         className: 'material-icons',
//         tagName: 'i',
//         text: 'info',
//       },
//     },
//   ],
// });

const signupForm = document.querySelector('.signup-form');
const submitFormBtn = document.querySelector('.submit-form-btn');

const signup = async (
  firstName,
  secondName,
  email,
  password,
  passwordConfirm,
  username,
) => {
  try {
    submitFormBtn.textContent = 'Signing Up...';

    if (password !== passwordConfirm) {
      alert('Passwords do not match!');
      return;
    }

    const baseUrl = await axios({
      method: 'GET',
      url: `/url/get-env-url`,
    });
    const urlPath = baseUrl.data.url;
    const res = await axios({
      method: 'POST',
      url: `${urlPath}/api/v1/users/signup`,
      data: {
        name: {
          firstName,
          secondName,
        },
        username,
        eAddress: {
          email,
          password,
          passwordConfirm,
          passwordChangedAt: Date.now(),
        },
      },
    });

    console.log('RESPONSE:', res);

    if (res.data.status === 'success') {
      submitFormBtn.textContent = 'Signed Up Successfully!';
      // notyf.success('success', 'Logged In Successfully!');
      window.setTimeout(() => {
        location.assign('/email-confirmation');
      }, 1500);
    }
  } catch (err) {
    console.log('error:', err);
    alert('failed', 'Sign Up Failed, Please Try Again Later!');
  }
};

signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  try {
    const firstName = document.getElementById('firstName').value;
    const secondName = document.getElementById('secondName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    const username = document.getElementById('username').value;

    console.log(
      `FIRST NAME: ${firstName}`,
      `SECOND NAME: ${secondName}`,
      `EMAIL: ${email}`,
      `PASSWORD: ${password}`,
      `USERNAME: ${username}`,
    );

    if (password !== passwordConfirm) {
      alert('Password and Confirm Password do not match.');
      return; // Stop the function execution
    }

    signup(firstName, secondName, email, password, passwordConfirm, username);
  } catch (err) {
    console.log(err.message, err);
  }
  // console.log('Successful!! 🔥🔥🔥🔥🔥🔥🔥');
});

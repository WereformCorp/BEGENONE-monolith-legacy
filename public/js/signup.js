/* eslint-disable */
// import '@babel/polyfill';
// import { login } from './login';
// const login = require('login');

// const axios = require('axios');

// DOM ELEMENTS
const signupForm = document.querySelector('.signup-form');

const signup = async (
  firstName,
  secondName,
  email,
  password,
  passwordConfirm,
  username,
) => {
  try {
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
      // showAlert('success', 'Logged In Successfully!');
      window.setTimeout(() => {
        location.assign('/email-confirmation');
      }, 1500);
    }
  } catch (err) {
    console.log('error:', err);
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

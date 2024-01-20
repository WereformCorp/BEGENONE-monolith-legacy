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
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/signup',
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

    signup(firstName, secondName, email, password, passwordConfirm, username);
  } catch (err) {
    console.log(err.message, err);
  }
  // console.log('Successful!! 🔥🔥🔥🔥🔥🔥🔥');
});

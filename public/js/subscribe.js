/* eslint-disable */
const userIdInput = document.querySelector('.userId-input').value;
const videoIdInput = document.querySelector('.videoId-input').value;
const subscribeBtns = document.querySelectorAll(
  '.sect-mid-accDtls-subscribe, .sect-mid-vdoP-subsBtn',
);

const subBtn1 = document.querySelector('.sect-mid-vdoP-subsBtn');

let isUserOwnChannel;

const subscribe = async (button) => {
  try {
    const userId = userIdInput;
    const videoId = videoIdInput;
    console.log(userId);
    const response = await axios({
      method: 'POST',
      url: `http://127.0.0.1:3000/api/v1/channels/${videoId}/subscribe`,
    });
    console.log(response);
    if (response.data.status === 'success') {
      button.textContent = 'Subscribed';
      button.classList.remove('sect-mid-vdoP-subsBtn');
      button.classList.add('sect-mid-vdoP-subsBtn-done');
    }
  } catch (err) {
    console.log(`Error during subscription: ${err.message}`, err);
  }
};

subscribeBtns.forEach((button) =>
  button.addEventListener('click', (e) => subscribe(button)),
);

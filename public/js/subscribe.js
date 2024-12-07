/* eslint-disable */
const userIdInput = document.querySelector('.userId-input').value;
const videoIdInput = document.querySelector('.videoId-input').value;
const isUserSubscribed = document.querySelector(
  '.isUserSubscribed-input',
).value;

const subscribeBtn = document.querySelector('.sect-mid-vdoP-subsBtn');
const subscribedBtn = document.querySelector('.sect-mid-vdoP-subsBtn-done');

const allSubBtns = document.querySelectorAll(
  '.sect-mid-vdoP-subsBtn, .sect-mid-vdoP-subsBtn-done',
);

// console.log(subscribeBtn);
// console.log(subscribedBtn);

let sub = true;

const subscribe = async (button) => {
  try {
    const userId = userIdInput;
    const videoId = videoIdInput;
    // console.log(userId);

    const baseUrl = await axios({
      method: 'GET',
      url: `/url/get-env-url`,
    });
    const urlPath = baseUrl.data.url;
    const response = await axios({
      method: 'POST',
      url: `${urlPath}/api/v1/channels/${videoId}/subscribe`,
    });
    // console.log(response);
    if (response.data.status === 'success') {
      const { isSubscribed } = response.data;
      button.textContent = isSubscribed ? 'Subscribed' : 'Subscribe';
      button.classList.remove('sect-mid-vdoP-subsBtn');
      button.classList.add('sect-mid-vdoP-subsBtn-done');
    }
  } catch (err) {
    console.log(`Error during subscription: ${err.message}`, err);
  }
};

const unsubscribe = async (button) => {
  try {
    const userId = userIdInput;
    const videoId = videoIdInput;
    // console.log(userId);
    const response = await axios({
      method: 'POST',
      url: `${req.protocol}://${req.get(
        'host',
      )}/api/v1/channels/${videoId}/unsubscribe`,
    });
    // console.log(response);
    if (response.data.status === 'success') {
      const { isSubscribed } = response.data;
      button.textContent = isSubscribed ? 'Subscribed' : 'Subscribe';
      button.classList.remove('sect-mid-vdoP-subsBtn-done');
      button.classList.add('sect-mid-vdoP-subsBtn');
    }
  } catch (err) {
    console.log(`Error during subscription: ${err.message}`, err);
  }
};

// console.log(`CHECKING FOR USER SUBSCRIBED OR NOT: ${isUserSubscribed}`);

if (isUserSubscribed === 'true') {
  console.log('Attaching unsubscribe event listener');
  subscribedBtn.addEventListener('click', (e) => {
    unsubscribe(subscribedBtn);
  });
} else if (isUserSubscribed === 'false') {
  console.log('Attaching subscribe event listener');
  subscribeBtn.addEventListener('click', (e) => {
    subscribe(subscribeBtn);
  });
}

/* eslint-disable */
const subscribeBtnCh = document.querySelector('.sect-mid-accDtls-subscribe');
const subscribeBtnVd = document.querySelector('.sect-mid-vdoP-subsBtn');
const subscribeBtns = document.querySelectorAll(
  '.sect-mid-accDtls-subscribe, .sect-mid-vdoP-subsBtn',
);

const subscribe = async (req, res) => {
  // const channelId = subscribeBtns.dataset.channelId;
  try {
    // console.log(channelId);
    subscribeBtns.forEach(async (button) => {
      const channelId = button.dataset.channelId;
      console.log(channelId);
      const response = await axios({
        method: 'POST',
        url: `http://127.0.0.1:3000/api/v1/channels/${channelId}/subscribe`,
      });

      console.log(`RESPONSE 🔥🔥🔥: ${response}`);
    });
    // if (response.data.status === 'success') location.reload(true);
  } catch (err) {
    console.log(`Error during subscription: ${err.message}`, err);
  }
};

// subscribeBtnCh.addEventListener('click', subscribe);
subscribeBtns.forEach((button) => button.addEventListener('click', subscribe));

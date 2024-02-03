/* eslint-disable */
const notifBtn = document.querySelector('.sect-rgt-icon-5');
const notifPanel = document.querySelector('.sect-notification-panel');

const getNotif = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:3000/api/v1/notification/get-notification',
    });

    console.log(res.data);
  } catch (err) {
    console.log(err.message, err);
  }
};

const readNotif = async () => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/notification/read-notification',
    });

    if (!res.data) {
      return console.log(`NO DATA FOUND`);
    } else console.log(res.data);
  } catch (err) {
    console.log(err.message, err);
  }
};

const checkNotif = async (req, res) => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:3000/api/v1/notification/get-all-notification',
    });
  } catch (err) {}
};

getNotif();

notifBtn.addEventListener('click', (e) => {
  notifPanel.style.visibility =
    notifPanel.style.visibility === 'visible' ? 'hidden' : 'visible';

  readNotif();
  e.stopPropagation();
});

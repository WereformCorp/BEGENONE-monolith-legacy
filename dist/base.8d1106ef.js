/* eslint-disable */ const notifBtn = document.querySelector('.sect-rgt-icon-5');
const notifPanel = document.querySelector('.sect-notification-panel');
const getNotif = async ()=>{};
const readNotif = async ()=>{
    try {
        const baseUrl = await axios({
            method: 'GET',
            url: `/url/get-env-url`
        });
        const urlPath = baseUrl.data.url;
        const res = await axios({
            method: 'POST',
            url: `${urlPath}/api/v1/notification/read-notification`
        });
        if (!res.data) return console.log(`NO DATA FOUND`);
        else console.log(res.data);
    } catch (err) {
        console.log(err.message, err);
    }
};
const checkNotif = async (req, res)=>{
    try {
        const baseUrl = await axios({
            method: 'GET',
            url: `/url/get-env-url`
        });
        const urlPath = baseUrl.data.url;
        const res = await axios({
            method: 'GET',
            url: `${urlPath}/api/v1/notification/get-all-notification`
        });
    } catch (err) {
        console.log(`Message: ${err.message}`, `Error: ${err}`);
    }
};
notifBtn.addEventListener('click', (e)=>{
    notifPanel.style.visibility = notifPanel.style.visibility === 'visible' ? 'hidden' : 'visible';
    // readNotif();
    getNotif();
    e.stopPropagation();
});

//# sourceMappingURL=base.8d1106ef.js.map

/* eslint-disable */

const submit_info = document.querySelector('.submit_info');

const updateUser = async (firstName, secondName, username, mode, languages) => {
  try {
    const me = await axios.get('http://127.0.0.1:3000/api/v1/users/me');

    const updateData = { ...me.data.data }; // Create an empty object to store the fields to update
    // console.log(updateData);
    // Update fields with new values
    if (firstName || secondName) {
      updateData.name = { ...(updateData.name || {}) };
      if (firstName)
        updateData.name.firstName = firstName || me.data.data.name.firstName;
      if (secondName)
        updateData.name.secondName = secondName || me.data.data.name.secondName;
    }

    // if (email) {
    //   updateData.eAddress = { ...(updateData.eAddress || {}) };
    //   updateData.eAddress.email = email || me.data.data.eAddress.email;
    // }

    // console.log(me.data.data.eAddress);

    if (username) {
      updateData.username = username || me.data.data.username;
    }

    if (!firstName && !secondName && !username) {
      alert(
        `At least put some data in the input fields in order to update. \n It's like spinning an empty washing machine. \n Making request to server that please add some dust in it.`,
      );
      return;
    }

    const res = await axios({
      method: 'PATCH',
      url: 'http://127.0.0.1:3000/api/v1/users/updateMe',
      data: updateData,
    });

    console.log('RESPONSE:', res);

    // if (res.data.status === 'success') {
    //   setTimeout(function () {
    //     location.reload(true); // Force a complete page reload
    //   }, 1000);
    // }
  } catch (err) {
    console.log(`ERROR MESSAGE 🥲: ${err.message}`, `ERROR ITSELF 😭: ${err}`);
  }
};

document.addEventListener('DOMContentLoaded', function () {
  const submitInfoButton = document.querySelector('.submit_info');
  const updateOverlay = document.querySelector('.overlay-container-update');
  const updateOverlayConfirmButton = document.querySelector(
    '.submit-info-confirm',
  );
  const updateOverlayNotNowButton = document.querySelector(
    '.submit-info-notNow',
  );

  submitInfoButton.addEventListener('click', function () {
    // Show the update overlay
    updateOverlay.style.display = 'flex';
  });

  // Add event listeners for overlay buttons
  // Event listeners for update overlay buttons
  updateOverlayConfirmButton.addEventListener('click', function () {
    updateOverlay.style.display = 'none'; // Hide the overlay
  });
  updateOverlayNotNowButton.addEventListener('click', function () {
    updateOverlay.style.display = 'none'; // Hide the overlay
  });

  // MAKING REQUEST HERE ---------------------------------------------------------

  updateOverlayConfirmButton.addEventListener('click', (e) => {
    e.preventDefault();
    const firstNameInput = document.querySelector('.firstNameInput').value;
    const secondNameInput = document.querySelector('.secondNameInput').value;
    const emailInput = document.querySelector('.emailInput').value;
    const usernameInput = document.querySelector('.usernameInput').value;
    const phoneNumberInput = document.querySelector('.phoneNumberInput').value;
    const oldPasswordInput = document.querySelector('.oldPasswordInput').value;
    const confirmPasswordInput = document.querySelector(
      '.confirmPasswordInput',
    ).value;
    const newPasswordInput = document.querySelector('.newPasswordInput').value;

    console.log(
      `First Name: ${firstNameInput}`,
      `Second Name: ${secondNameInput}`,
      `Email: ${emailInput}`,
      `Username: ${usernameInput}`,
    );
    updateUser(firstNameInput, secondNameInput, usernameInput);
    updateOverlay.style.display = 'none';
  });
});

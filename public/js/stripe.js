/* eslint-disable */
const stripe = Stripe(
  'pk_live_51QF723H2ZlDirGgoJpnekAJmoUFPmngPTqHZm8uo8lcsyBnGJ30WsFcaaTocAQIXcMA6OIOeP2rqRIflrHUn4Zpp007YUPKdxM',
);
// require('stripe');

const checkoutPricing = document.getElementById('checkout-pricing');

// {
//   "_id": {
//     "$oid": "675f082673b7896564abbc6f"
//   },
//   "pricingName": "early-access",
//   "status": "active",
//   "autoRenew": true,
//   "active": false,
//   "user": {
//     "$oid": "675e73574655c14f6c24742a"
//   },
//   "pricings": {
//     "$oid": "674e8f34b71483d6e64188dc"
//   },
//   "stripeId": "sub_1QWKyeH2ZlDirGgoOf6bZZLs",
//   "endDate": {
//     "$date": "2024-12-16T16:47:00.000Z"
//   },
//   "startDate": {
//     "$date": "2024-12-15T16:47:34.813Z"
//   },
//   "__v": 0
// }

const purchasePricing = async (pricingID) => {
  const baseUrl = await axios({
    method: 'GET',
    url: `/url/get-env-url`,
  });
  const urlPath = baseUrl.data.url;

  try {
    // Get the Sessions from API
    const session = await axios(
      `${urlPath}/api/v1/pricings/checkout-session/${pricingID}`,
    );

    console.log(`SESSIONS`, session);
    // CREATE CHECKOUT FORM + CHARGE CREDIT CARD
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    return console.log(err);
  }
};

if (checkoutPricing)
  checkoutPricing.addEventListener('click', (e) => {
    e.target.textContent = `Processing...`;
    const { pricingId } = e.target.dataset;
    purchasePricing(pricingId);
  });

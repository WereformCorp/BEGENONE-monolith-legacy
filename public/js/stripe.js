/* eslint-disable */
const stripe = Stripe(
  'pk_test_51QF723H2ZlDirGgokIj0VjBwLFNvEJcnrV3s73FrWCvSQmMsM6N4WP5bRp4BhLnNUwUgtgSnc3BqELLsOMrLA49P00rt4kijbX',
);
// require('stripe');

const checkoutPricing = document.getElementById('checkout-pricing');

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
    res.json(err);
  }
};

if (checkoutPricing)
  checkoutPricing.addEventListener('click', (e) => {
    e.target.textContent = `Processing...`;
    const { pricingId } = e.target.dataset;
    purchasePricing(pricingId);
  });

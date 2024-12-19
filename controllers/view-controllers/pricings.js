const axios = require('axios');
const catchAsync = require('../../utils/catchAsync');
const { urlPath } = require('../util-controllers/urlPath-TimeController');
const User = require('../../models/userModel');

const pricings = catchAsync(async (req, res, next) => {
  try {
    let userData;
    if (res.locals.user)
      userData = await User.findById(res.locals.user._id).populate('channel');

    // console.log(`USER DATA`, userData);
    const priceData = await axios.get(`${urlPath}/api/v1/pricings/`);
    const pricingsData = priceData.data.pricings;

    const subscriptionStatus = res.locals.subscriptionValid;
    console.log(`SUBSCRIPTION STATUS:`, subscriptionStatus);

    // Initialize the categories with empty arrays for each
    const pricingCategories = [
      'early-access',
      'basic',
      'standard',
      'premium',
      'premium-plus',
      'gift',
      'limited',
      'signup',
    ];

    // Initialize the idsByName object with empty arrays for each category
    const idsByName = pricingCategories.reduce((acc, category) => {
      acc[category] = []; // Start each category with an empty array
      return acc;
    }, {});

    // Separate IDs based on name
    pricingsData.forEach((pricing) => {
      if (idsByName[pricing.name]) {
        idsByName[pricing.name].push(pricing._id);
      }
    });

    // console.log('PRICING IDS BY NAME:', idsByName);
    // const { videos } = userData.channel;
    res.status(200).render(`../views/main/pricing/allPricings`, {
      title: `BEGENONE | Pricing`,
      userData,
      pricings: {
        earlyAccess: idsByName['early-access'],
        basic: idsByName.basic,
        standard: idsByName.standard,
        premium: idsByName.premium,
        premiumPlus: idsByName['premium-plus'],
        // gift: idsByName.gift,
        // limited: idsByName.limited,
        signup: idsByName.signup,
      },
      useCustomLeftNav: false,
      userActiveStatus: userData ? userData.active : null,
      isPricingPage: true,
      subscriptionStatus,
      showAds: res.locals.showAds || null,
    });
  } catch (err) {
    console.log(
      `ERROR from PRICINGS | Views Controller | [TRY / CATCH BLOCK]`,
      err,
    );
    throw err;
  }
});

module.exports = pricings;

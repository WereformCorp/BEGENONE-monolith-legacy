const express = require('express');
const sponsorController = require('../controllers/sponsorController');
// const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(sponsorController.getAllSponsors)
  .post(sponsorController.setVideoIds, sponsorController.createSponsor);
// .post(sponsorController.setChannelIds, sponsorController.createSponsor);

router
  .route('/:id')
  .get(sponsorController.getSponsor)
  .patch(sponsorController.updateSponsor)
  .delete(sponsorController.deleteSponsor);

module.exports = router;

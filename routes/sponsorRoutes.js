const express = require('express');
const sponsorController = require('../controllers/sponsorController');
// const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(sponsorController.getAllSponsors)
  .post(sponsorController.createSponsor);

router
  .route('/:id')
  .get(sponsorController.getSponsor)
  .patch(sponsorController.updateSponsor)
  .delete(sponsorController.deleteSponsor);

module.exports = router;

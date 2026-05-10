const express = require('express');
const router = express.Router();
const { addTripStop, addActivityToStop, getTripBudget, getCities } = require('../controllers/itineraryController');
const { protect } = require('../middleware/authMiddleware');

// Cities search
router.get('/cities', getCities);

// Trip Specific Routes
router.post('/trips/:id/stops', protect, addTripStop);
router.get('/trips/:id/budget', protect, getTripBudget);

// Stop Specific Routes
router.post('/stops/:stopId/activities', protect, addActivityToStop);

module.exports = router;

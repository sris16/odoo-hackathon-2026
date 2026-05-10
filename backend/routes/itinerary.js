const express = require('express');
const router = express.Router();
const { addTripStop, addActivityToStop, getTripBudget, getCities, getTrendingCities, getBudgetCities, getPopularCities, getCityActivities, autoGenerateItinerary } = require('../controllers/itineraryController');
const { protect } = require('../middleware/authMiddleware');

// Cities search
router.get('/cities/trending', getTrendingCities);
router.get('/cities/budget', getBudgetCities);
router.get('/cities/popular', getPopularCities);
router.get('/cities/:id/activities', getCityActivities);
router.get('/cities', getCities);

// Trip Specific Routes
router.post('/trips/:id/stops', protect, addTripStop);
router.get('/trips/:id/budget', protect, getTripBudget);
router.post('/trips/:id/auto-generate', protect, autoGenerateItinerary);

// Stop Specific Routes
router.post('/stops/:stopId/activities', protect, addActivityToStop);

module.exports = router;

const prisma = require('../prismaClient');

// @desc    Add a city stop to a trip
// @route   POST /api/trips/:id/stops
// @access  Private
const addTripStop = async (req, res) => {
  const tripId = parseInt(req.params.id);
  const { cityId, arrivalDate, departureDate, stopOrder } = req.body;

  try {
    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId: req.user.id }
    });

    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    const tripStop = await prisma.tripStop.create({
      data: {
        tripId,
        cityId,
        arrivalDate: new Date(arrivalDate),
        departureDate: new Date(departureDate),
        stopOrder: stopOrder || 1
      },
      include: { city: true }
    });

    res.status(201).json(tripStop);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Add an activity to a specific stop
// @route   POST /api/stops/:stopId/activities
// @access  Private
const addActivityToStop = async (req, res) => {
  const tripStopId = parseInt(req.params.stopId);
  const { activityId, scheduledTime } = req.body;

  try {
    // Verify user owns the trip this stop belongs to
    const tripStop = await prisma.tripStop.findUnique({
      where: { id: tripStopId },
      include: { trip: true }
    });

    if (!tripStop || tripStop.trip.userId !== req.user.id) {
      return res.status(404).json({ message: 'Trip stop not found or unauthorized' });
    }

    const tripActivity = await prisma.tripActivity.create({
      data: {
        tripStopId,
        activityId,
        scheduledTime: scheduledTime ? new Date(scheduledTime) : null
      },
      include: { activity: true }
    });

    res.status(201).json(tripActivity);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get dynamic budget calculation for a trip
// @route   GET /api/trips/:id/budget
// @access  Private
const getTripBudget = async (req, res) => {
  const tripId = parseInt(req.params.id);

  try {
    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId: req.user.id },
      include: {
        stops: {
          include: {
            city: true,
            activities: {
              include: { activity: true }
            }
          }
        }
      }
    });

    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    let totalActivityCost = 0;
    let totalStayCost = 0;
    const cityBreakdown = [];
    
    // Perform dynamic calculation
    trip.stops.forEach(stop => {
      // Calculate stay duration in days
      const days = Math.max(1, Math.ceil((stop.departureDate - stop.arrivalDate) / (1000 * 60 * 60 * 24)));
      
      // Assume a base cost per day depending on the city's cost index (e.g., index * $50)
      const stayCost = days * stop.city.costIndex * 50; 
      let stopActivityCost = 0;

      // Add activities cost
      stop.activities.forEach(ta => {
        stopActivityCost += ta.activity.estimatedCost;
      });

      totalStayCost += stayCost;
      totalActivityCost += stopActivityCost;

      cityBreakdown.push({
        city: stop.city.name,
        cost: stayCost + stopActivityCost
      });
    });

    const totalBudget = totalActivityCost + totalStayCost;

    res.json({
      tripId,
      totalBudget,
      breakdown: {
        activities: totalActivityCost,
        stay: totalStayCost,
        transportation: 500 // Base transportation mock cost
      },
      cityBreakdown
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all cities for search
// @route   GET /api/cities
// @access  Public
const getCities = async (req, res) => {
  try {
    const cities = await prisma.city.findMany({
      orderBy: { popularity: 'desc' }
    });
    res.json(cities);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get trending cities (high popularity)
// @route   GET /api/cities/trending
// @access  Public
const getTrendingCities = async (req, res) => {
  try {
    const cities = await prisma.city.findMany({
      orderBy: { popularity: 'desc' },
      take: 10
    });
    res.json(cities);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get budget friendly cities (low cost index)
// @route   GET /api/cities/budget
// @access  Public
const getBudgetCities = async (req, res) => {
  try {
    const cities = await prisma.city.findMany({
      orderBy: { costIndex: 'asc' },
      take: 10
    });
    res.json(cities);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get popular cities
// @route   GET /api/cities/popular
// @access  Public
const getPopularCities = async (req, res) => {
  try {
    const cities = await prisma.city.findMany({
      where: { popularity: { gte: 4 } },
      take: 10
    });
    // Shuffle for variety
    const shuffled = cities.sort(() => 0.5 - Math.random());
    res.json(shuffled);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get activities for a specific city
// @route   GET /api/cities/:id/activities
// @access  Public
const getCityActivities = async (req, res) => {
  try {
    const activities = await prisma.activity.findMany({
      where: { cityId: parseInt(req.params.id) },
      take: 5
    });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Auto-generate a smart itinerary for a trip
// @route   POST /api/trips/:id/auto-generate
// @access  Private
const autoGenerateItinerary = async (req, res) => {
  const tripId = parseInt(req.params.id);

  try {
    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId: req.user.id },
      include: { stops: true }
    });

    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    // Clear existing activities for these stops to prevent massive duplication
    const stopIds = trip.stops.map(s => s.id);
    if (stopIds.length > 0) {
      await prisma.tripActivity.deleteMany({
        where: { tripStopId: { in: stopIds } }
      });
    }

    const newTripActivities = [];

    for (const stop of trip.stops) {
      // Calculate duration of stay in days (inclusive of end date)
      const diffMs = new Date(stop.departureDate) - new Date(stop.arrivalDate);
      const days = Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)) + 1);
      
      // Fetch available activities for this city
      const availableActivities = await prisma.activity.findMany({
        where: { cityId: stop.cityId }
      });

      if (availableActivities.length === 0) continue;

      // Group activities by category
      const activitiesByCategory = {};
      availableActivities.forEach(a => {
        if (!activitiesByCategory[a.category]) activitiesByCategory[a.category] = [];
        activitiesByCategory[a.category].push(a);
      });

      const categories = Object.keys(activitiesByCategory);
      let usedActivityIds = new Set();

      for (let day = 0; day < days; day++) {
        // Pick 2-3 activities per day
        const numActivitiesToday = Math.floor(Math.random() * 2) + 2; 
        
        for (let i = 0; i < numActivitiesToday; i++) {
          // Shuffle categories and try to find an unused activity
          const shuffledCategories = [...categories].sort(() => 0.5 - Math.random());
          let availableAct = null;

          for (const cat of shuffledCategories) {
            const actsInCat = activitiesByCategory[cat];
            availableAct = actsInCat.find(a => !usedActivityIds.has(a.id));
            if (availableAct) break;
          }

          // If we ran out of unique activities, clear the set and try again!
          if (!availableAct) {
            usedActivityIds.clear();
            for (const cat of shuffledCategories) {
              const actsInCat = activitiesByCategory[cat];
              availableAct = actsInCat.find(a => !usedActivityIds.has(a.id));
              if (availableAct) break;
            }
          }
          
          if (availableAct) {
            usedActivityIds.add(availableAct.id);
            
            // Schedule it at 10 AM, 2 PM, or 6 PM
            const scheduledTime = new Date(stop.arrivalDate);
            scheduledTime.setDate(scheduledTime.getDate() + day);
            scheduledTime.setHours(10 + (i * 4), 0, 0, 0);

            newTripActivities.push({
              tripStopId: stop.id,
              activityId: availableAct.id,
              scheduledTime
            });
          }
        }
      }
    }

    if (newTripActivities.length > 0) {
      await prisma.tripActivity.createMany({
        data: newTripActivities
      });
    }

    res.status(201).json({ message: 'Itinerary generated successfully!', generatedCount: newTripActivities.length });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { addTripStop, addActivityToStop, getTripBudget, getCities, getTrendingCities, getBudgetCities, getPopularCities, getCityActivities, autoGenerateItinerary };

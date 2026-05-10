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
    
    // Perform dynamic calculation
    trip.stops.forEach(stop => {
      // Calculate stay duration in days
      const days = Math.max(1, Math.ceil((stop.departureDate - stop.arrivalDate) / (1000 * 60 * 60 * 24)));
      
      // Assume a base cost per day depending on the city's cost index (e.g., index * $50)
      const stayCost = days * stop.city.costIndex * 50; 
      totalStayCost += stayCost;

      // Add activities cost
      stop.activities.forEach(ta => {
        totalActivityCost += ta.activity.estimatedCost;
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
      }
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

module.exports = { addTripStop, addActivityToStop, getTripBudget, getCities };

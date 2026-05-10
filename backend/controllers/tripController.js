const prisma = require('../prismaClient');

// @desc    Get all trips for logged in user
// @route   GET /api/trips
// @access  Private
const getTrips = async (req, res) => {
  try {
    const trips = await prisma.trip.findMany({
      where: { userId: req.user.id },
      orderBy: { startDate: 'asc' },
    });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create a trip
// @route   POST /api/trips
// @access  Private
const createTrip = async (req, res) => {
  const { name, description, startDate, endDate, coverPhoto } = req.body;

  if (!name || !startDate || !endDate) {
    return res.status(400).json({ message: 'Please provide name, start date, and end date' });
  }

  try {
    const trip = await prisma.trip.create({
      data: {
        userId: req.user.id,
        name,
        description,
        coverPhoto,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
    });
    res.status(201).json(trip);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single trip details
// @route   GET /api/trips/:id
// @access  Private
const getTripById = async (req, res) => {
  try {
    const trip = await prisma.trip.findFirst({
      where: {
        id: parseInt(req.params.id),
        userId: req.user.id,
      },
      include: {
        stops: {
          include: {
            city: true,
            activities: {
              include: {
                activity: true,
              }
            }
          },
          orderBy: { stopOrder: 'asc' }
        }
      }
    });

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a trip
// @route   DELETE /api/trips/:id
// @access  Private
const deleteTrip = async (req, res) => {
  try {
    const trip = await prisma.trip.findFirst({
      where: {
        id: parseInt(req.params.id),
        userId: req.user.id,
      }
    });

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    await prisma.trip.delete({
      where: { id: trip.id }
    });

    res.json({ message: 'Trip removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getTrips, createTrip, getTripById, deleteTrip };

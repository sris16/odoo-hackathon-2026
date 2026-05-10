require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  
  // Clear existing static data (optional but good for rerunning)
  await prisma.activity.deleteMany({});
  await prisma.city.deleteMany({});

  // Create Cities
  const paris = await prisma.city.create({
    data: {
      name: 'Paris',
      country: 'France',
      costIndex: 4,
      popularity: 5,
      imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e9076113840'
    }
  });

  const tokyo = await prisma.city.create({
    data: {
      name: 'Tokyo',
      country: 'Japan',
      costIndex: 5,
      popularity: 5,
      imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26'
    }
  });

  const bali = await prisma.city.create({
    data: {
      name: 'Bali',
      country: 'Indonesia',
      costIndex: 2,
      popularity: 4,
      imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4'
    }
  });

  // Create Activities
  await prisma.activity.createMany({
    data: [
      { cityId: paris.id, name: 'Eiffel Tower Tour', category: 'Sightseeing', estimatedCost: 30, durationMins: 120 },
      { cityId: paris.id, name: 'Louvre Museum', category: 'Sightseeing', estimatedCost: 20, durationMins: 180 },
      { cityId: paris.id, name: 'Seine River Cruise', category: 'Sightseeing', estimatedCost: 15, durationMins: 60 },
      
      { cityId: tokyo.id, name: 'Shibuya Crossing', category: 'Sightseeing', estimatedCost: 0, durationMins: 60 },
      { cityId: tokyo.id, name: 'Sushi Making Class', category: 'Food', estimatedCost: 80, durationMins: 180 },
      { cityId: tokyo.id, name: 'Tokyo Skytree', category: 'Sightseeing', estimatedCost: 25, durationMins: 90 },

      { cityId: bali.id, name: 'Ubud Monkey Forest', category: 'Adventure', estimatedCost: 5, durationMins: 120 },
      { cityId: bali.id, name: 'Mount Batur Sunrise Trek', category: 'Adventure', estimatedCost: 40, durationMins: 360 },
      { cityId: bali.id, name: 'Balinese Cooking Class', category: 'Food', estimatedCost: 25, durationMins: 180 },
    ]
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

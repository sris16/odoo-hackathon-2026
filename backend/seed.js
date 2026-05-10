require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const citiesData = [
  { name: 'Paris', country: 'France', costIndex: 4, popularity: 5, imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e9076113840' },
  { name: 'Tokyo', country: 'Japan', costIndex: 5, popularity: 5, imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26' },
  { name: 'Bali', country: 'Indonesia', costIndex: 2, popularity: 4, imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4' },
  { name: 'Rome', country: 'Italy', costIndex: 4, popularity: 5, imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5' },
  { name: 'New York', country: 'USA', costIndex: 5, popularity: 5, imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9' },
  { name: 'Bangkok', country: 'Thailand', costIndex: 2, popularity: 5, imageUrl: 'https://images.unsplash.com/photo-1508009603885-247a596920f0' },
  { name: 'Cape Town', country: 'South Africa', costIndex: 3, popularity: 4, imageUrl: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99' },
  { name: 'Istanbul', country: 'Turkey', costIndex: 2, popularity: 4, imageUrl: 'https://images.unsplash.com/photo-1522206090980-5028448ebf31' },
  { name: 'Dubai', country: 'UAE', costIndex: 5, popularity: 4, imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c' },
  { name: 'Rio de Janeiro', country: 'Brazil', costIndex: 3, popularity: 4, imageUrl: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325' },
  { name: 'Kyoto', country: 'Japan', costIndex: 4, popularity: 4, imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e' },
  { name: 'Barcelona', country: 'Spain', costIndex: 4, popularity: 5, imageUrl: 'https://images.unsplash.com/photo-1583422409516-2895a77efded' },
  { name: 'Prague', country: 'Czechia', costIndex: 3, popularity: 4, imageUrl: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439' },
  { name: 'Sydney', country: 'Australia', costIndex: 5, popularity: 4, imageUrl: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9' },
  { name: 'Amsterdam', country: 'Netherlands', costIndex: 4, popularity: 5, imageUrl: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4' },
  { name: 'Seoul', country: 'South Korea', costIndex: 4, popularity: 4, imageUrl: 'https://images.unsplash.com/photo-1538485399081-7191377e8241' },
  { name: 'Berlin', country: 'Germany', costIndex: 4, popularity: 4, imageUrl: 'https://images.unsplash.com/photo-1560930950-5cc20e8cbe14' },
  { name: 'Hanoi', country: 'Vietnam', costIndex: 1, popularity: 3, imageUrl: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b' },
  { name: 'Buenos Aires', country: 'Argentina', costIndex: 2, popularity: 3, imageUrl: 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849' },
  { name: 'Vancouver', country: 'Canada', costIndex: 4, popularity: 3, imageUrl: 'https://images.unsplash.com/photo-1559511260-66a654ae982a' },
  { name: 'Lisbon', country: 'Portugal', costIndex: 3, popularity: 4, imageUrl: 'https://images.unsplash.com/photo-1538332576228-eb5b4c4de6f5' },
  { name: 'Machu Picchu', country: 'Peru', costIndex: 3, popularity: 5, imageUrl: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1' },
  { name: 'Cairo', country: 'Egypt', costIndex: 2, popularity: 4, imageUrl: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750' },
  { name: 'Santorini', country: 'Greece', costIndex: 5, popularity: 5, imageUrl: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e' },
  { name: 'Marrakech', country: 'Morocco', costIndex: 2, popularity: 4, imageUrl: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70' }
];

const activityArchetypes = [
  { prefix: 'Historical Tour of', category: 'Sightseeing', costMulti: 15, duration: 120 },
  { prefix: 'Traditional Cooking Class in', category: 'Food', costMulti: 25, duration: 180 },
  { prefix: 'Adventure Hiking near', category: 'Adventure', costMulti: 10, duration: 240 },
  { prefix: 'Evening Cruise in', category: 'Nightlife', costMulti: 20, duration: 90 },
  { prefix: 'Museum Pass for', category: 'Culture', costMulti: 12, duration: 180 },
  { prefix: 'Street Food Tasting in', category: 'Food', costMulti: 8, duration: 120 },
  { prefix: 'Guided Bike Tour of', category: 'Adventure', costMulti: 10, duration: 150 },
  { prefix: 'Local Pub Crawl in', category: 'Nightlife', costMulti: 15, duration: 180 },
  { prefix: 'Photography Walk through', category: 'Sightseeing', costMulti: 5, duration: 120 },
  { prefix: 'Spa & Relaxation in', category: 'Relaxation', costMulti: 30, duration: 90 }
];

async function main() {
  console.log('Seeding database with rich data...');
  
  // Clear existing static data
  await prisma.tripActivity.deleteMany({});
  await prisma.tripStop.deleteMany({});
  await prisma.activity.deleteMany({});
  await prisma.city.deleteMany({});

  // Insert Cities
  for (const cityData of citiesData) {
    const city = await prisma.city.create({ data: cityData });
    
    // Generate 5-8 random activities for this city
    const numActivities = Math.floor(Math.random() * 4) + 5;
    
    // Shuffle archetypes
    const shuffled = [...activityArchetypes].sort(() => 0.5 - Math.random());
    const selectedArchetypes = shuffled.slice(0, numActivities);
    
    const activitiesToCreate = selectedArchetypes.map(arch => ({
      cityId: city.id,
      name: `${arch.prefix} ${city.name}`,
      category: arch.category,
      // Scale cost based on city's cost index
      estimatedCost: Math.round(arch.costMulti * (city.costIndex * 0.8)),
      durationMins: arch.duration
    }));

    await prisma.activity.createMany({ data: activitiesToCreate });
  }

  console.log(`Seeding completed successfully! Inserted ${citiesData.length} cities and hundreds of activities.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

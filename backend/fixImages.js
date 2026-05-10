const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fix() {
  console.log('Fixing image URLs...');
  const cities = await prisma.city.findMany();
  for (const city of cities) {
    const formattedName = city.name.toLowerCase().replace(/\s+/g, '');
    const newUrl = `https://loremflickr.com/800/600/${formattedName},city`;
    await prisma.city.update({
      where: { id: city.id },
      data: { imageUrl: newUrl }
    });
  }
  console.log('Finished updating image URLs to loremflickr!');
}

fix().catch(console.error).finally(() => prisma.$disconnect());

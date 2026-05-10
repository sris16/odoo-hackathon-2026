const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function update() {
  const paris = await prisma.city.findFirst({ where: { name: 'Paris' } });
  if (paris) {
    await prisma.city.update({
      where: { id: paris.id },
      data: { imageUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80' }
    });
  }
  const bali = await prisma.city.findFirst({ where: { name: 'Bali' } });
  if (bali) {
    await prisma.city.update({
      where: { id: bali.id },
      data: { imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80' }
    });
  }
  console.log('Updated Paris and Bali images.');
}
update().catch(console.error).finally(() => prisma.$disconnect());

import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  try {
    const user = await prisma.user.findFirst({
      where: { email: 'user@example.com' }
    });
    console.log('User found:', user ? 'YES' : 'NO');
    if (user) {
      console.log('User Role:', user.role);
      console.log('User Address JSON:', JSON.stringify(user.address, null, 2));
      console.log('User Payment Method:', user.paymentMethod);
    }
  } catch (err) {
    console.error('Error querying DB:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();

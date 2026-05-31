const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  try {
    const user = await prisma.user.findFirst({
      where: { email: 'user@example.com' }
    });
    console.log('User found:', user ? 'YES' : 'NO');
    if (user) {
      console.log('User Address JSON:', JSON.stringify(user.address, null, 2));
    }
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}
main();

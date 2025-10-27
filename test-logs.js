const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    // First create a test user if none exists
    let user = await prisma.user.findFirst({
      where: { login: 'test' }
    });
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          login: 'test',
          password: 'test123'
        }
      });
    }

    // Create a test log entry
    const log = await prisma.log.create({
      data: {
        type: 'AUTH',
        action: 'Test log entry',
        userId: user.id,
        metadata: JSON.stringify({ test: 'metadata' })
      }
    });
    
    console.log('Created log:', log);

    // Count logs again
    const count = await prisma.log.count();
    console.log('Current logs count:', count);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

test();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@apphub.local';
  const newPassword = 'Admin123!';
  
  const user = await prisma.user.findUnique({
    where: { email }
  });
  
  if (!user) {
    console.log("User not found!");
    // Create the user if it doesn't exist
    const passwordHash = await bcrypt.hash(newPassword, 10);
    const newUser = await prisma.user.create({
      data: {
        name: 'Administrator',
        email: email,
        passwordHash: passwordHash,
        role: 'ADMIN',
        department: 'IT',
        isActive: true,
      }
    });
    console.log("Created user:", newUser);
  } else {
    console.log("User found:", user);
    // Force reset the password to make sure
    const passwordHash = await bcrypt.hash(newPassword, 10);
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { 
        passwordHash: passwordHash,
        role: 'ADMIN', // Ensure they are admin
        isActive: true
      }
    });
    console.log("Password reset successfully for:", updatedUser.email);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

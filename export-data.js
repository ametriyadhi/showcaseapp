const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function exportData() {
  console.log("Mengekspor data dari database lokal...");
  const data = {};

  // Export Apphub Data
  data.users = await prisma.user.findMany();
  data.categories = await prisma.category.findMany();
  data.applications = await prisma.application.findMany();
  data.roles = await prisma.role.findMany();
  data.applicationRoles = await prisma.applicationRole.findMany();
  data.userFavorites = await prisma.userFavorite.findMany();
  data.appClickLogs = await prisma.appClickLog.findMany();
  data.systemSettings = await prisma.systemSetting.findMany();

  // Export Showcase Data
  data.showcaseApps = await prisma.showcaseApp.findMany();
  data.showcaseMedias = await prisma.showcaseMedia.findMany();
  data.showcaseFeatures = await prisma.showcaseFeature.findMany();

  fs.writeFileSync('data-dump.json', JSON.stringify(data, null, 2));
  console.log("Berhasil diekspor ke data-dump.json!");
}

exportData()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

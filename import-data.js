const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function importData() {
  console.log("Membaca data-dump.json...");
  if (!fs.existsSync('data-dump.json')) {
    console.error("File data-dump.json tidak ditemukan!");
    process.exit(1);
  }

  const rawData = fs.readFileSync('data-dump.json', 'utf-8');
  const data = JSON.parse(rawData);

  console.log("Mulai mengimpor data ke database server...");

  // Kita gunakan createMany dengan skipDuplicates agar aman.
  
  // 1. Users
  if (data.users && data.users.length > 0) {
    await prisma.user.createMany({ data: data.users, skipDuplicates: true });
    console.log(`- Impor ${data.users.length} Users`);
  }
  
  // 2. Roles
  if (data.roles && data.roles.length > 0) {
    await prisma.role.createMany({ data: data.roles, skipDuplicates: true });
    console.log(`- Impor ${data.roles.length} Roles`);
  }

  // 3. Categories
  if (data.categories && data.categories.length > 0) {
    await prisma.category.createMany({ data: data.categories, skipDuplicates: true });
    console.log(`- Impor ${data.categories.length} Categories`);
  }

  // 4. Applications
  if (data.applications && data.applications.length > 0) {
    await prisma.application.createMany({ data: data.applications, skipDuplicates: true });
    console.log(`- Impor ${data.applications.length} Applications`);
  }

  // 5. ApplicationRoles
  if (data.applicationRoles && data.applicationRoles.length > 0) {
    await prisma.applicationRole.createMany({ data: data.applicationRoles, skipDuplicates: true });
    console.log(`- Impor ${data.applicationRoles.length} ApplicationRoles`);
  }

  // 6. UserFavorites
  if (data.userFavorites && data.userFavorites.length > 0) {
    await prisma.userFavorite.createMany({ data: data.userFavorites, skipDuplicates: true });
    console.log(`- Impor ${data.userFavorites.length} UserFavorites`);
  }

  // 7. AppClickLogs
  if (data.appClickLogs && data.appClickLogs.length > 0) {
    await prisma.appClickLog.createMany({ data: data.appClickLogs, skipDuplicates: true });
    console.log(`- Impor ${data.appClickLogs.length} AppClickLogs`);
  }

  // 8. SystemSettings
  if (data.systemSettings && data.systemSettings.length > 0) {
    await prisma.systemSetting.createMany({ data: data.systemSettings, skipDuplicates: true });
    console.log(`- Impor ${data.systemSettings.length} SystemSettings`);
  }

  // 9. ShowcaseApps
  if (data.showcaseApps && data.showcaseApps.length > 0) {
    await prisma.showcaseApp.createMany({ data: data.showcaseApps, skipDuplicates: true });
    console.log(`- Impor ${data.showcaseApps.length} ShowcaseApps`);
  }

  // 10. ShowcaseMedias
  if (data.showcaseMedias && data.showcaseMedias.length > 0) {
    await prisma.showcaseMedia.createMany({ data: data.showcaseMedias, skipDuplicates: true });
    console.log(`- Impor ${data.showcaseMedias.length} ShowcaseMedias`);
  }

  // 11. ShowcaseFeatures
  if (data.showcaseFeatures && data.showcaseFeatures.length > 0) {
    await prisma.showcaseFeature.createMany({ data: data.showcaseFeatures, skipDuplicates: true });
    console.log(`- Impor ${data.showcaseFeatures.length} ShowcaseFeatures`);
  }

  console.log("Proses impor selesai dengan SUKSES!");
}

importData()
  .catch(e => {
    console.error("Terjadi error saat impor:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

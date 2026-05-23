const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function importShowcaseOnly() {
  console.log("Membaca data-dump.json...");
  if (!fs.existsSync('data-dump.json')) {
    console.error("File data-dump.json tidak ditemukan!");
    process.exit(1);
  }

  const rawData = fs.readFileSync('data-dump.json', 'utf-8');
  const data = JSON.parse(rawData);

  console.log("Mulai mengimpor KHUSUS data Showcase ke database...");

  // HANYA MENGIMPOR TABEL SHOWCASE (ShowcaseApp, ShowcaseMedia, ShowcaseFeature, SystemSetting)
  // Tabel inti Apphub (User, Application, Category) TIDAK DISENTUH agar tidak merusak data asli.

  if (data.systemSettings && data.systemSettings.length > 0) {
    await prisma.systemSetting.createMany({ data: data.systemSettings, skipDuplicates: true });
    console.log(`- Impor ${data.systemSettings.length} SystemSettings (Branding)`);
  }

  if (data.showcaseApps && data.showcaseApps.length > 0) {
    await prisma.showcaseApp.createMany({ data: data.showcaseApps, skipDuplicates: true });
    console.log(`- Impor ${data.showcaseApps.length} ShowcaseApps`);
  }

  if (data.showcaseMedias && data.showcaseMedias.length > 0) {
    await prisma.showcaseMedia.createMany({ data: data.showcaseMedias, skipDuplicates: true });
    console.log(`- Impor ${data.showcaseMedias.length} ShowcaseMedias`);
  }

  if (data.showcaseFeatures && data.showcaseFeatures.length > 0) {
    await prisma.showcaseFeature.createMany({ data: data.showcaseFeatures, skipDuplicates: true });
    console.log(`- Impor ${data.showcaseFeatures.length} ShowcaseFeatures`);
  }

  console.log("Proses impor Showcase selesai dengan SUKSES!");
}

importShowcaseOnly()
  .catch(e => {
    console.error("Terjadi error saat impor:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

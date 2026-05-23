import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { AppDetailClient } from "./app-detail-client";

export default async function AppDetailPage({ params }: { params: { slug: string } }) {
  const app = await prisma.showcaseApp.findUnique({
    where: { slug: params.slug },
    include: {
      media: { orderBy: { order: "asc" } },
      features: { orderBy: { order: "asc" } },
    },
  });

  if (!app) notFound();

  return <AppDetailClient app={app} />;
}

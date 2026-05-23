import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { AppEditClient } from "./app-edit-client";

export default async function AppEditPage({ params }: { params: { id: string } }) {
  const app = await prisma.showcaseApp.findUnique({
    where: { id: params.id },
    include: { 
      media: { orderBy: { order: "asc" } },
      features: { orderBy: { id: "asc" } }
    }
  });

  if (!app) return notFound();

  return <AppEditClient app={app} />;
}

import { redirect } from "next/navigation";

export default function DashboardPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const category = searchParams.category;
  if (category) {
    redirect(`/?category=${encodeURIComponent(category)}`);
  }
  redirect("/");
}

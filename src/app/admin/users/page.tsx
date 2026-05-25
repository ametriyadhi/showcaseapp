import { prisma } from "@/lib/db";
import { UsersClient } from "./users-client";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      department: true,
      isActive: true,
      createdAt: true,
    }
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900">Kelola User</h1>
        <p className="text-slate-500 mt-1">
          Daftar pengguna terpusat. Akun yang dibuat di sini otomatis tersinkronisasi dan dapat digunakan di AppHub.
        </p>
      </div>

      <UsersClient users={users} />
    </div>
  );
}

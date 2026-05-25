"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function createUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;
  const department = formData.get("department") as string;
  const isActive = formData.get("isActive") === "on";

  if (!name || !email || !password) {
    throw new Error("Nama, Email, dan Password wajib diisi");
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error("Email sudah terdaftar");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: role || "USER",
      department,
      isActive,
    },
  });

  revalidatePath("/admin/users");
}

export async function updateUser(userId: string, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const role = formData.get("role") as string;
  const department = formData.get("department") as string;
  const isActive = formData.get("isActive") === "on";

  if (!name || !email) {
    throw new Error("Nama dan Email wajib diisi");
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing && existing.id !== userId) {
    throw new Error("Email sudah digunakan oleh user lain");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { name, email, role, department, isActive },
  });

  revalidatePath("/admin/users");
}

export async function deleteUser(userId: string) {
  // Cegah penghapusan semua admin (minimal sisakan 1)
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user?.role === "ADMIN") {
    const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
    if (adminCount <= 1) {
      throw new Error("Tidak dapat menghapus satu-satunya ADMIN. Sisakan minimal 1 akun ADMIN.");
    }
  }

  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/admin/users");
}

export async function resetPassword(userId: string, formData: FormData) {
  const newPassword = formData.get("newPassword") as string;
  if (!newPassword || newPassword.length < 6) {
    throw new Error("Password baru minimal 6 karakter");
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });

  revalidatePath("/admin/users");
}

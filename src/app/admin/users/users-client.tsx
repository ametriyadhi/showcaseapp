"use client";

import React, { useState, useTransition } from "react";
import { createUser, updateUser, deleteUser, resetPassword } from "./actions";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string | null;
  isActive: boolean;
};

export function UsersClient({ users }: { users: User[] }) {
  const [isPending, startTransition] = useTransition();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [resettingUser, setResettingUser] = useState<User | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleCreate = async (formData: FormData) => {
    startTransition(async () => {
      try {
        await createUser(formData);
        setIsAdding(false);
      } catch (err: any) {
        alert(err.message || "Terjadi kesalahan");
      }
    });
  };

  const handleUpdate = async (formData: FormData) => {
    if (!editingUser) return;
    startTransition(async () => {
      try {
        await updateUser(editingUser.id, formData);
        setEditingUser(null);
      } catch (err: any) {
        alert(err.message || "Terjadi kesalahan");
      }
    });
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Hapus pengguna ini secara permanen?")) return;
    startTransition(async () => {
      try {
        await deleteUser(userId);
      } catch (err: any) {
        alert(err.message || "Terjadi kesalahan");
      }
    });
  };

  const handleResetPassword = async (formData: FormData) => {
    if (!resettingUser) return;
    startTransition(async () => {
      try {
        await resetPassword(resettingUser.id, formData);
        alert("Password berhasil direset!");
        setResettingUser(null);
      } catch (err: any) {
        alert(err.message || "Terjadi kesalahan");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Actions */}
      <div className="flex justify-end">
        <button
          onClick={() => {
            setIsAdding(true);
            setEditingUser(null);
            setResettingUser(null);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-md"
        >
          + Tambah User Baru
        </button>
      </div>

      {/* Forms Modal/Inline logic */}
      {(isAdding || editingUser) && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-xl font-black text-slate-900 mb-4">
            {isAdding ? "Tambah User Baru" : "Edit User"}
          </h3>
          <form action={isAdding ? handleCreate : handleUpdate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Nama Lengkap *</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingUser?.name || ""}
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-900 font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  defaultValue={editingUser?.email || ""}
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-900 font-medium"
                />
              </div>
            </div>

            {isAdding && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Password *</label>
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="Minimal 6 karakter"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-900 font-medium"
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Role</label>
                <select
                  name="role"
                  defaultValue={editingUser?.role || "USER"}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-900 font-medium"
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Departemen</label>
                <input
                  type="text"
                  name="department"
                  defaultValue={editingUser?.department || ""}
                  placeholder="Opsional (Misal: IT, HR, Finance)"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-900 font-medium"
                />
              </div>
            </div>

            <div className="flex items-center p-4 bg-slate-50 rounded-xl border border-slate-100 mt-2">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                defaultChecked={editingUser ? editingUser.isActive : true}
                className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="isActive" className="ml-3 text-sm font-bold text-slate-700 cursor-pointer select-none">
                Akun Aktif (Dapat Login)
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-4">
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setEditingUser(null);
                }}
                className="px-5 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-all"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2.5 rounded-xl font-bold shadow-md transition-all"
              >
                {isPending ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reset Password UI */}
      {resettingUser && (
        <div className="bg-amber-50 p-6 rounded-2xl shadow-sm border border-amber-200">
          <h3 className="text-xl font-black text-amber-900 mb-2">
            Reset Password: {resettingUser.name}
          </h3>
          <p className="text-amber-700 text-sm mb-4">Masukkan password baru untuk pengguna ini.</p>
          <form action={handleResetPassword} className="flex flex-col sm:flex-row gap-3">
            <input
              type="password"
              name="newPassword"
              required
              placeholder="Password Baru"
              className="flex-1 px-4 py-2.5 bg-white border border-amber-300 rounded-xl focus:outline-none focus:border-amber-500 text-slate-900 font-medium"
            />
            <button
              type="submit"
              disabled={isPending}
              className="bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white px-6 py-2.5 rounded-xl font-bold shadow-md transition-all whitespace-nowrap"
            >
              {isPending ? "Meriset..." : "Ubah Password"}
            </button>
            <button
              type="button"
              onClick={() => setResettingUser(null)}
              className="px-5 py-2.5 rounded-xl font-bold text-amber-800 hover:bg-amber-100 transition-all"
            >
              Batal
            </button>
          </form>
        </div>
      )}

      {/* User Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Pengguna</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role & Dept</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{user.name}</div>
                    <div className="text-sm text-slate-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider mb-1 ${
                      user.role === "ADMIN" ? "bg-purple-100 text-purple-700" : "bg-slate-100 text-slate-600"
                    }`}>
                      {user.role}
                    </span>
                    {user.department && (
                      <div className="text-xs text-slate-500 font-medium">{user.department}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {user.isActive ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Aktif
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span> Nonaktif
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => {
                        setEditingUser(user);
                        setIsAdding(false);
                        setResettingUser(null);
                      }}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline px-2 py-1"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setResettingUser(user);
                        setIsAdding(false);
                        setEditingUser(null);
                      }}
                      className="text-xs font-bold text-amber-600 hover:text-amber-800 hover:underline px-2 py-1"
                    >
                      Reset Pwd
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      disabled={isPending}
                      className="text-xs font-bold text-red-600 hover:text-red-800 hover:underline px-2 py-1 disabled:opacity-50"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-slate-500 text-sm">
                    Belum ada pengguna.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Pagination from '@/Components/Pagination';
import ConfirmModal from '@/Components/ConfirmModal';
import {
    Plus,
    Search,
    Edit3,
    Trash2,
    Users,
    Shield,
    X,
    Loader2,
    CheckCircle2,
    XCircle,
} from 'lucide-react';

export default function Index({ users, roles = [], filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const { data, setData, post, put, reset, errors, processing } = useForm({
        name: '',
        username: '',
        email: '',
        password: '',
        role_ids: [],
        status: 'active',
        bio: '',
    });

    const openAddModal = () => {
        setEditingUser(null);
        reset({
            name: '',
            username: '',
            email: '',
            password: '',
            role_ids: roles.length > 0 ? [roles[0].id] : [],
            status: 'active',
            bio: '',
        });
        setModalOpen(true);
    };

    const openEditModal = (u) => {
        setEditingUser(u);
        setData({
            name: u.name,
            username: u.username,
            email: u.email,
            password: '',
            role_ids: u.roles.map((r) => r.id),
            status: u.status || 'active',
            bio: u.bio || '',
        });
        setModalOpen(true);
    };

    const toggleRole = (roleId) => {
        const currentRoles = [...data.role_ids];
        const idx = currentRoles.indexOf(roleId);
        if (idx > -1) {
            if (currentRoles.length > 1) {
                currentRoles.splice(idx, 1);
            }
        } else {
            currentRoles.push(roleId);
        }
        setData('role_ids', currentRoles);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (editingUser) {
            put(`/admin/users/${editingUser.id}`, {
                onSuccess: () => setModalOpen(false),
            });
        } else {
            post('/admin/users', {
                onSuccess: () => {
                    reset();
                    setModalOpen(false);
                },
            });
        }
    };

    const handleDelete = () => {
        if (userToDelete) {
            router.delete(`/admin/users/${userToDelete.id}`, {
                preserveScroll: true,
            });
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/users', { search }, { preserveState: true, replace: true });
    };

    return (
        <AdminLayout title="Manajemen Pengguna">
            <Head title="Kelola Akun Pengguna" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Pengguna & Penulis</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Kelola akun pengelola, hak akses, dan penulis portal
                    </p>
                </div>
                <button
                    type="button"
                    onClick={openAddModal}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors shadow-sm shadow-indigo-600/20 cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Pengguna</span>
                </button>
            </div>

            {/* Search */}
            <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 mb-6 shadow-sm">
                <form onSubmit={handleSearch} className="flex gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari nama, email, username..."
                            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
                    >
                        Cari
                    </button>
                </form>
            </div>

            {/* Users Table */}
            <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-175">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                <th className="py-3.5 px-4">Nama Pengguna</th>
                                <th className="py-3.5 px-4">Username & Email</th>
                                <th className="py-3.5 px-4">Peran (Role)</th>
                                <th className="py-3.5 px-4 text-center">Status</th>
                                <th className="py-3.5 px-4 text-center">Artikel</th>
                                <th className="py-3.5 px-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs text-slate-600 dark:text-slate-300">
                            {users.data.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-10 text-center text-slate-400 dark:text-slate-500">
                                        <Users className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
                                        Belum ada pengguna ditemukan
                                    </td>
                                </tr>
                            ) : (
                                users.data.map((u) => (
                                    <tr key={u.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-slate-800 border border-indigo-100 dark:border-slate-700 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-400">
                                                    {u.name.charAt(0)}
                                                </div>
                                                <span className="font-semibold text-slate-900 dark:text-slate-200">{u.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <p className="text-slate-700 dark:text-slate-300 font-mono text-[11px]">@{u.username}</p>
                                            <p className="text-slate-400 dark:text-slate-500 text-[11px]">{u.email}</p>
                                        </td>
                                        <td className="py-3 px-4 whitespace-nowrap">
                                            <div className="flex flex-wrap gap-1">
                                                {u.roles.map((r) => (
                                                    <span
                                                        key={r.id}
                                                        className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20"
                                                    >
                                                        {r.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-center whitespace-nowrap">
                                            <span
                                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${
                                                    u.status === 'active' || !u.status
                                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
                                                        : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20'
                                                }`}
                                            >
                                                {u.status || 'active'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <span className="text-slate-700 dark:text-slate-300 font-medium">
                                                {u.posts_count || 0}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-right whitespace-nowrap">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <button
                                                    onClick={() => openEditModal(u)}
                                                    className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                                                    title="Edit Pengguna"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setUserToDelete(u);
                                                        setDeleteModalOpen(true);
                                                    }}
                                                    className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                                                    title="Hapus Pengguna"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination links={users.links} />
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
                    <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                                {editingUser ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}
                            </h3>
                            <button
                                onClick={() => setModalOpen(false)}
                                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleFormSubmit} className="space-y-3.5 mt-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                                    Nama Lengkap <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Nama pengguna"
                                    required
                                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950"
                                />
                                {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                                        Username <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.username}
                                        onChange={(e) => setData('username', e.target.value)}
                                        placeholder="username"
                                        required
                                        className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950"
                                    />
                                    {errors.username && <p className="mt-1 text-xs text-rose-500">{errors.username}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                                        Email <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="email@domain.com"
                                        required
                                        className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950"
                                    />
                                    {errors.email && <p className="mt-1 text-xs text-rose-500">{errors.email}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                                    Kata Sandi {editingUser && '(Kosongkan jika tidak diubah)'}
                                </label>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    required={!editingUser}
                                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950"
                                />
                                {errors.password && <p className="mt-1 text-xs text-rose-500">{errors.password}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                    Peran (Role)
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {roles.map((r) => {
                                        const isSelected = data.role_ids.includes(r.id);
                                        return (
                                            <button
                                                type="button"
                                                key={r.id}
                                                onClick={() => toggleRole(r.id)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                                                    isSelected
                                                        ? 'bg-indigo-600 text-white shadow-sm'
                                                        : 'bg-slate-100 text-slate-600 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                                                }`}
                                            >
                                                {r.name}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                                    Status Akun
                                </label>
                                <select
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
                                >
                                    <option value="active">Aktif (Active)</option>
                                    <option value="suspended">Ditangguhkan (Suspended)</option>
                                    <option value="pending">Menunggu (Pending)</option>
                                </select>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 bg-slate-100 dark:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
                                >
                                    {processing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                    <span>{editingUser ? 'Simpan' : 'Tambah'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Confirm Delete */}
            <ConfirmModal
                isOpen={deleteModalOpen}
                title="Hapus Pengguna"
                message={`Apakah Anda yakin ingin menghapus akun "${userToDelete?.name}"?`}
                onConfirm={handleDelete}
                onClose={() => setDeleteModalOpen(false)}
            />
        </AdminLayout>
    );
}


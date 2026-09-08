import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import ConfirmModal from '@/Components/ConfirmModal';
import { Plus, Edit3, Trash2, Shield, X, Check, Loader2, Lock } from 'lucide-react';

export default function Index({ roles = [], grouped_permissions = {} }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState(null);

    const { data, setData, post, put, reset, errors, processing } = useForm({
        name: '',
        slug: '',
        description: '',
        permission_ids: [],
    });

    const openAddModal = () => {
        setEditingRole(null);
        reset({
            name: '',
            slug: '',
            description: '',
            permission_ids: [],
        });
        setModalOpen(true);
    };

    const openEditModal = (role) => {
        setEditingRole(role);
        setData({
            name: role.name,
            slug: role.slug,
            description: role.description || '',
            permission_ids: role.permissions.map((p) => p.id),
        });
        setModalOpen(true);
    };

    const togglePermission = (permId) => {
        const current = [...data.permission_ids];
        const idx = current.indexOf(permId);
        if (idx > -1) {
            current.splice(idx, 1);
        } else {
            current.push(permId);
        }
        setData('permission_ids', current);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (editingRole) {
            put(`/admin/roles/${editingRole.id}`, {
                onSuccess: () => setModalOpen(false),
            });
        } else {
            post('/admin/roles', {
                onSuccess: () => {
                    reset();
                    setModalOpen(false);
                },
            });
        }
    };

    const handleDelete = () => {
        if (roleToDelete) {
            router.delete(`/admin/roles/${roleToDelete.id}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <AdminLayout title="Peran & Hak Akses (RBAC)">
            <Head title="Kelola Peran & Hak Akses" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Peran & Matriks Hak Akses</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Atur wewenang dan izin modul untuk setiap tingkatan pengguna
                    </p>
                </div>
                <button
                    type="button"
                    onClick={openAddModal}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors shadow-sm shadow-indigo-600/20 cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Peran (Role)</span>
                </button>
            </div>

            {/* Roles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roles.map((role) => {
                    const isSystem = ['super-admin', 'admin'].includes(role.slug);
                    return (
                        <div
                            key={role.id}
                            className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-center gap-2.5">
                                        <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20">
                                            <Shield className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{role.name}</h3>
                                            <p className="text-slate-400 dark:text-slate-500 font-mono text-[11px]">@{role.slug}</p>
                                        </div>
                                    </div>

                                    {isSystem && (
                                        <span className="p-1 text-slate-400 dark:text-slate-500" title="Peran Sistem Bawaan">
                                            <Lock className="w-4 h-4" />
                                        </span>
                                    )}
                                </div>

                                <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
                                    {role.description || 'Tidak ada deskripsi.'}
                                </p>

                                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                                    <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                                        Hak Akses ({role.permissions.length})
                                    </p>
                                    <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                                        {role.slug === 'super-admin' ? (
                                            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
                                                ★ Akses Penuh (All Permissions)
                                            </span>
                                        ) : (
                                            role.permissions.map((p) => (
                                                <span
                                                    key={p.id}
                                                    className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700/60"
                                                >
                                                    {p.name}
                                                </span>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                                <span className="text-slate-500 dark:text-slate-400">
                                    {role.users_count || 0} Pengguna terkait
                                </span>
                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={() => openEditModal(role)}
                                        className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                                        title="Edit Peran"
                                    >
                                        <Edit3 className="w-4 h-4" />
                                    </button>
                                    {!isSystem && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setRoleToDelete(role);
                                                setDeleteModalOpen(true);
                                            }}
                                            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                                            title="Hapus Peran"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
                    <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl max-h-[90vh] flex flex-col">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
                            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                                {editingRole ? 'Edit Peran & Hak Akses' : 'Tambah Peran Baru'}
                            </h3>
                            <button
                                onClick={() => setModalOpen(false)}
                                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleFormSubmit} className="space-y-4 mt-4 flex-1 overflow-y-auto pr-1">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                                        Nama Peran <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Contoh: Editor Senior"
                                        required
                                        className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950"
                                    />
                                    {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                                        Slug (Opsional)
                                    </label>
                                    <input
                                        type="text"
                                        value={data.slug}
                                        onChange={(e) => setData('slug', e.target.value)}
                                        placeholder="otomatis-dari-nama"
                                        className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950"
                                    />
                                    {errors.slug && <p className="mt-1 text-xs text-rose-500">{errors.slug}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                                    Deskripsi Wewenang
                                </label>
                                <input
                                    type="text"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Jelaskan ruang lingkup wewenang peran ini..."
                                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950"
                                />
                            </div>

                            {/* Matrix Checkboxes by module group */}
                            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
                                    Pilih Hak Akses (Permissions Matrix)
                                </label>

                                <div className="space-y-4">
                                    {Object.entries(grouped_permissions).map(([group, perms]) => (
                                        <div key={group} className="bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                                            <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">
                                                Modul {group}
                                            </p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {perms.map((p) => {
                                                    const isChecked = data.permission_ids.includes(p.id);
                                                    return (
                                                        <label
                                                            key={p.id}
                                                            className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={isChecked}
                                                                onChange={() => togglePermission(p.id)}
                                                                className="w-4 h-4 rounded bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-0 cursor-pointer"
                                                            />
                                                            <span>{p.name}</span>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 shrink-0">
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
                                    <span>{editingRole ? 'Simpan' : 'Tambah'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Confirm Delete */}
            <ConfirmModal
                isOpen={deleteModalOpen}
                title="Hapus Peran"
                message={`Apakah Anda yakin ingin menghapus peran "${roleToDelete?.name}"?`}
                onConfirm={handleDelete}
                onClose={() => setDeleteModalOpen(false)}
            />
        </AdminLayout>
    );
}


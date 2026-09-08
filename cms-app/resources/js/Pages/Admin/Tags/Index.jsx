import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Pagination from '@/Components/Pagination';
import ConfirmModal from '@/Components/ConfirmModal';
import { Plus, Search, Edit3, Trash2, Tags, X, Loader2 } from 'lucide-react';

export default function Index({ tags, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingTag, setEditingTag] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [tagToDelete, setTagToDelete] = useState(null);

    const { data, setData, post, put, reset, errors, processing } = useForm({
        name: '',
        slug: '',
    });

    const openAddModal = () => {
        setEditingTag(null);
        reset();
        setModalOpen(true);
    };

    const openEditModal = (tag) => {
        setEditingTag(tag);
        setData({
            name: tag.name,
            slug: tag.slug,
        });
        setModalOpen(true);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (editingTag) {
            put(`/admin/tags/${editingTag.id}`, {
                onSuccess: () => setModalOpen(false),
            });
        } else {
            post('/admin/tags', {
                onSuccess: () => {
                    reset();
                    setModalOpen(false);
                },
            });
        }
    };

    const handleDelete = () => {
        if (tagToDelete) {
            router.delete(`/admin/tags/${tagToDelete.id}`, {
                preserveScroll: true,
            });
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/tags', { search }, { preserveState: true, replace: true });
    };

    return (
        <AdminLayout title="Manajemen Tagar">
            <Head title="Kelola Tagar (Tags)" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Tagar (Tags)</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Kelola label kata kunci dan relasi artikel portal
                    </p>
                </div>
                <button
                    type="button"
                    onClick={openAddModal}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors shadow-sm shadow-indigo-600/20 cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Tag</span>
                </button>
            </div>

            {/* Search */}
            <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 mb-6 shadow-sm">
                <form onSubmit={handleSearch} className="flex gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari tagar..."
                            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
                    >
                        Cari
                    </button>
                </form>
            </div>

            {/* Tags Table */}
            <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[500px]">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/50 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                <th className="py-3.5 px-4">Nama Tag</th>
                                <th className="py-3.5 px-4">Slug (URL)</th>
                                <th className="py-3.5 px-4 text-center">Jumlah Artikel Terkait</th>
                                <th className="py-3.5 px-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs text-slate-700 dark:text-slate-300">
                            {tags.data.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="py-10 text-center text-slate-400 dark:text-slate-500">
                                        <Tags className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
                                        Belum ada tagar ditemukan
                                    </td>
                                </tr>
                            ) : (
                                tags.data.map((tag) => (
                                    <tr key={tag.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-200">
                                            #{tag.name}
                                        </td>
                                        <td className="py-3 px-4 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                                            {tag.slug}
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-700">
                                                {tag.posts_count || 0}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-right whitespace-nowrap">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <button
                                                    onClick={() => openEditModal(tag)}
                                                    className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                                                    title="Edit Tag"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setTagToDelete(tag);
                                                        setDeleteModalOpen(true);
                                                    }}
                                                    className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                                                    title="Hapus Tag"
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

                <Pagination links={tags.links} />
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
                    <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                                {editingTag ? 'Edit Tagar' : 'Tambah Tagar Baru'}
                            </h3>
                            <button
                                onClick={() => setModalOpen(false)}
                                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleFormSubmit} className="space-y-4 mt-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                    Nama Tag <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Contoh: Laravel, React, Tips"
                                    required
                                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                                />
                                {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                                    Slug (Opsional)
                                </label>
                                <input
                                    type="text"
                                    value={data.slug}
                                    onChange={(e) => setData('slug', e.target.value)}
                                    placeholder="otomatis-dari-nama"
                                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                                />
                                {errors.slug && <p className="mt-1 text-xs text-rose-500">{errors.slug}</p>}
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
                                >
                                    {processing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                    <span>{editingTag ? 'Simpan' : 'Tambah'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Confirm Delete */}
            <ConfirmModal
                isOpen={deleteModalOpen}
                title="Hapus Tagar"
                message={`Apakah Anda yakin ingin menghapus tag #${tagToDelete?.name}? Tag akan dilepas dari seluruh artikel terkait.`}
                onConfirm={handleDelete}
                onClose={() => setDeleteModalOpen(false)}
            />
        </AdminLayout>
    );
}

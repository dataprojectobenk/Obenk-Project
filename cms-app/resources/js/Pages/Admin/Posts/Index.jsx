import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Pagination from '@/Components/Pagination';
import ConfirmModal from '@/Components/ConfirmModal';
import {
    Plus,
    Search,
    Edit3,
    Trash2,
    Eye,
    MessageSquare,
    Calendar,
    Image as ImageIcon,
    FileText,
} from 'lucide-react';

export default function Index({ posts, filters = {}, categories = [] }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [categoryId, setCategoryId] = useState(filters.category_id || '');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [postToDelete, setPostToDelete] = useState(null);

    const handleFilter = (e) => {
        e.preventDefault();
        router.get(
            '/admin/posts',
            { search, status, category_id: categoryId },
            { preserveState: true, replace: true }
        );
    };

    const handleDelete = () => {
        if (postToDelete) {
            router.delete(`/admin/posts/${postToDelete.id}`, {
                preserveScroll: true,
            });
        }
    };

    const statusBadges = {
        published: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20',
        draft: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20',
        scheduled: 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-500/20',
        archived: 'bg-slate-100 dark:bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-500/20',
    };

    return (
        <AdminLayout title="Manajemen Artikel & Konten">
            <Head title="Kelola Artikel & Konten" />

            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Daftar Artikel</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Kelola seluruh publikasi konten, draf, dan jadwal artikel portal
                    </p>
                </div>
                <Link
                    href="/admin/posts/create"
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors shadow-sm shadow-indigo-600/20"
                >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Artikel Baru</span>
                </Link>
            </div>

            {/* Filter Bar */}
            <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 mb-6 shadow-sm">
                <form onSubmit={handleFilter} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari judul artikel..."
                            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                        />
                    </div>

                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
                    >
                        <option value="">Semua Status</option>
                        <option value="published">Terbit (Published)</option>
                        <option value="draft">Draf (Draft)</option>
                        <option value="archived">Diarsipkan (Archived)</option>
                    </select>

                    <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
                    >
                        <option value="">Semua Kategori</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>

                    <button
                        type="submit"
                        className="w-full py-2 px-4 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white rounded-xl transition-colors cursor-pointer"
                    >
                        Terapkan Filter
                    </button>
                </form>
            </div>

            {/* Posts Table */}
            <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/50 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                <th className="py-3.5 px-4 w-12">Gambar</th>
                                <th className="py-3.5 px-4">Judul & Penulis</th>
                                <th className="py-3.5 px-4">Kategori</th>
                                <th className="py-3.5 px-4 text-center">Status</th>
                                <th className="py-3.5 px-4 text-center">Statistik</th>
                                <th className="py-3.5 px-4">Tanggal</th>
                                <th className="py-3.5 px-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs text-slate-700 dark:text-slate-300">
                            {posts.data.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="py-12 text-center text-slate-400 dark:text-slate-500">
                                        <FileText className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
                                        <p>Tidak ada artikel ditemukan</p>
                                    </td>
                                </tr>
                            ) : (
                                posts.data.map((post) => (
                                    <tr key={post.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="py-3 px-4">
                                            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 overflow-hidden flex items-center justify-center shrink-0">
                                                {post.featured_image ? (
                                                    <img
                                                        src={`/storage/${post.featured_image.file_path}`}
                                                        alt={post.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <ImageIcon className="w-5 h-5 text-slate-400 dark:text-slate-600" />
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <Link
                                                href={`/admin/posts/${post.id}/edit`}
                                                className="font-semibold text-slate-900 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-1 text-sm"
                                            >
                                                {post.title}
                                            </Link>
                                            <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                                                Oleh <span className="text-slate-600 dark:text-slate-400">{post.author?.name || 'Admin'}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 whitespace-nowrap">
                                            {post.category ? (
                                                <span className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60">
                                                    {post.category.name}
                                                </span>
                                            ) : (
                                                <span className="text-slate-400 dark:text-slate-600">-</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-center whitespace-nowrap">
                                            <span
                                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${
                                                    statusBadges[post.status] || statusBadges.draft
                                                }`}
                                            >
                                                {post.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-center whitespace-nowrap">
                                            <div className="flex items-center justify-center gap-3 text-slate-500 dark:text-slate-400">
                                                <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-medium">
                                                    <Eye className="w-3.5 h-3.5" />
                                                    {post.view_count || 0}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <MessageSquare className="w-3.5 h-3.5" />
                                                    {post.comments_count || 0}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 whitespace-nowrap text-slate-500 dark:text-slate-400 text-[11px]">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                <span>
                                                    {post.published_at ? new Date(post.published_at).toLocaleDateString('id-ID') : 'Belum terbit'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-right whitespace-nowrap">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <Link
                                                    href={`/admin/posts/${post.id}/edit`}
                                                    className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                                    title="Edit Artikel"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => {
                                                        setPostToDelete(post);
                                                        setDeleteModalOpen(true);
                                                    }}
                                                    className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                                                    title="Hapus Artikel"
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

                <Pagination links={posts.links} />
            </div>

            {/* Confirm Delete Modal */}
            <ConfirmModal
                isOpen={deleteModalOpen}
                title="Hapus Artikel"
                message={`Apakah Anda yakin ingin menghapus artikel "${postToDelete?.title}"? Artikel akan dipindahkan ke tempat sampah.`}
                onConfirm={handleDelete}
                onClose={() => setDeleteModalOpen(false)}
            />
        </AdminLayout>
    );
}

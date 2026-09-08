import React, { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Pagination from '@/Components/Pagination';
import ConfirmModal from '@/Components/ConfirmModal';
import {
    MessageSquare,
    Search,
    Check,
    AlertTriangle,
    Trash2,
    Clock,
    ExternalLink,
} from 'lucide-react';

export default function Index({ comments, counts = {}, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const currentStatus = filters.status || 'all';
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState(null);

    const handleFilterStatus = (status) => {
        router.get(
            '/admin/comments',
            { status, search },
            { preserveState: true, replace: true }
        );
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            '/admin/comments',
            { status: currentStatus, search },
            { preserveState: true, replace: true }
        );
    };

    const handleUpdateStatus = (commentId, newStatus) => {
        router.put(
            `/admin/comments/${commentId}/status`,
            { status: newStatus },
            { preserveScroll: true }
        );
    };

    const handleDelete = () => {
        if (commentToDelete) {
            router.delete(`/admin/comments/${commentToDelete.id}`, {
                preserveScroll: true,
            });
        }
    };

    const tabs = [
        { key: 'all', label: 'Semua', count: counts.all || 0 },
        { key: 'pending', label: 'Menunggu Moderasi', count: counts.pending || 0 },
        { key: 'approved', label: 'Disetujui', count: counts.approved || 0 },
        { key: 'spam', label: 'Spam', count: counts.spam || 0 },
    ];

    const statusBadge = {
        approved: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20',
        pending: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20',
        spam: 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/20',
        trash: 'bg-slate-100 dark:bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-500/20',
    };

    return (
        <AdminLayout title="Moderasi Komentar">
            <Head title="Kelola Komentar Pembaca" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Moderasi Komentar</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Tinjau, setujui, dan filter tanggapan dari pembaca artikel
                    </p>
                </div>
            </div>

            {/* Status Tabs */}
            <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-200 dark:border-slate-800 pb-3">
                {tabs.map((tab) => {
                    const isActive = currentStatus === tab.key;
                    return (
                        <button
                            key={tab.key}
                            onClick={() => handleFilterStatus(tab.key)}
                            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                isActive
                                    ? 'bg-indigo-600 text-white shadow-sm'
                                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                            }`}
                        >
                            <span>{tab.label}</span>
                            <span
                                className={`px-1.5 py-0.2 rounded-md text-[10px] font-bold ${
                                    isActive ? 'bg-indigo-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                }`}
                            >
                                {tab.count}
                            </span>
                        </button>
                    );
                })}
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
                            placeholder="Cari nama komentator, email, isi pesan..."
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

            {/* Comments List */}
            <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
                <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {comments.data.length === 0 ? (
                        <div className="py-16 text-center text-slate-400 dark:text-slate-500">
                            <MessageSquare className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
                            <p>Tidak ada komentar pada kategori status ini</p>
                        </div>
                    ) : (
                        comments.data.map((c) => (
                            <div key={c.id} className="p-5 hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                    {/* Author & Content */}
                                    <div className="flex items-start gap-3.5 flex-1">
                                        <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-400 shrink-0">
                                            {c.user?.name?.charAt(0) || c.author_name?.charAt(0) || 'A'}
                                        </div>
                                        <div className="space-y-1 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                                                    {c.user ? c.user.name : c.author_name}
                                                </span>
                                                <span className="text-[11px] text-slate-400 dark:text-slate-500">
                                                    {c.author_email}
                                                </span>
                                                <span
                                                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${
                                                        statusBadge[c.status] || statusBadge.pending
                                                    }`}
                                                >
                                                    {c.status}
                                                </span>
                                            </div>

                                            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pt-1">
                                                {c.content}
                                            </p>

                                            {c.post && (
                                                <div className="pt-2 text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                                                    <span>Pada artikel:</span>
                                                    <Link
                                                        href={`/blog/${c.post.slug}`}
                                                        target="_blank"
                                                        className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
                                                    >
                                                        <span>{c.post.title}</span>
                                                        <ExternalLink className="w-3 h-3" />
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2 shrink-0 self-end md:self-start">
                                        {c.status !== 'approved' && (
                                            <button
                                                type="button"
                                                onClick={() => handleUpdateStatus(c.id, 'approved')}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/20 rounded-xl transition-colors cursor-pointer"
                                                title="Setujui komentar"
                                            >
                                                <Check className="w-3.5 h-3.5" />
                                                <span>Setujui</span>
                                            </button>
                                        )}

                                        {c.status !== 'pending' && (
                                            <button
                                                type="button"
                                                onClick={() => handleUpdateStatus(c.id, 'pending')}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20 border border-amber-200 dark:border-amber-500/20 rounded-xl transition-colors cursor-pointer"
                                                title="Tunda / moderasi"
                                            >
                                                <Clock className="w-3.5 h-3.5" />
                                                <span>Tunda</span>
                                            </button>
                                        )}

                                        {c.status !== 'spam' && (
                                            <button
                                                type="button"
                                                onClick={() => handleUpdateStatus(c.id, 'spam')}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 border border-rose-200 dark:border-rose-500/20 rounded-xl transition-colors cursor-pointer"
                                                title="Tandai spam"
                                            >
                                                <AlertTriangle className="w-3.5 h-3.5" />
                                                <span>Spam</span>
                                            </button>
                                        )}

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setCommentToDelete(c);
                                                setDeleteModalOpen(true);
                                            }}
                                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                                            title="Hapus komentar"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <Pagination links={comments.links} />
            </div>

            {/* Confirm Delete */}
            <ConfirmModal
                isOpen={deleteModalOpen}
                title="Hapus Komentar"
                message="Apakah Anda yakin ingin menghapus komentar ini secara permanen?"
                onConfirm={handleDelete}
                onClose={() => setDeleteModalOpen(false)}
            />
        </AdminLayout>
    );
}

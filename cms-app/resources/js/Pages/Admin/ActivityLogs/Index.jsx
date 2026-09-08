import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Pagination from '@/Components/Pagination';
import ConfirmModal from '@/Components/ConfirmModal';
import { Activity, Search, Trash2, Shield, User, Globe, Calendar } from 'lucide-react';

export default function Index({ logs, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [clearModalOpen, setClearModalOpen] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/activity-logs', { search }, { preserveState: true, replace: true });
    };

    const handleClearLogs = () => {
        router.delete('/admin/activity-logs/clear', {
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout title="Log Aktivitas Sistem">
            <Head title="Audit Trail & Log Aktivitas" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Audit Trail & Log Aktivitas</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Rekam jejak setiap aksi perubahan data dan keamanan sistem
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => setClearModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 border border-rose-200 dark:border-rose-500/20 rounded-xl transition-colors cursor-pointer"
                >
                    <Trash2 className="w-4 h-4" />
                    <span>Bersihkan Semua Log</span>
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
                            placeholder="Cari aksi, entitas, IP address..."
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

            {/* Logs Table */}
            <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                <th className="py-3.5 px-4">Pengguna</th>
                                <th className="py-3.5 px-4">Aksi / Tindakan</th>
                                <th className="py-3.5 px-4">Entitas Target</th>
                                <th className="py-3.5 px-4">IP & Info Klien</th>
                                <th className="py-3.5 px-4 text-right">Waktu</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs text-slate-600 dark:text-slate-300">
                            {logs.data.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-12 text-center text-slate-400 dark:text-slate-500">
                                        <Activity className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
                                        Belum ada catatan log aktivitas
                                    </td>
                                </tr>
                            ) : (
                                logs.data.map((log) => (
                                    <tr key={log.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-7 h-7 rounded-full bg-indigo-50 dark:bg-slate-800 border border-indigo-100 dark:border-slate-700 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-400">
                                                    {log.user?.name?.charAt(0) || 'S'}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900 dark:text-slate-200">{log.user?.name || 'Sistem'}</p>
                                                    <p className="text-[10px] text-slate-400 dark:text-slate-500">{log.user?.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20">
                                                {log.action_name}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                                            {log.entity_type ? log.entity_type.split('\\').pop() : '-'}
                                            {log.entity_id && (
                                                <span className="text-slate-400 dark:text-slate-500 ml-1">#{log.entity_id}</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-slate-500 dark:text-slate-400 text-[11px]">
                                            <div className="flex items-center gap-1.5">
                                                <Globe className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                                                <span className="font-mono">{log.ip_address || '127.0.0.1'}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-right whitespace-nowrap text-slate-500 dark:text-slate-400 text-[11px]">
                                            <div className="flex items-center justify-end gap-1">
                                                <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                                                <span>
                                                    {new Date(log.created_at).toLocaleString('id-ID', {
                                                        dateStyle: 'short',
                                                        timeStyle: 'short',
                                                    })}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination links={logs.links} />
            </div>

            {/* Clear Logs Confirm Modal */}
            <ConfirmModal
                isOpen={clearModalOpen}
                title="Bersihkan Semua Log"
                message="Apakah Anda yakin ingin menghapus semua rekam jejak riwayat aktivitas? Tindakan ini tidak dapat dibatalkan."
                confirmText="Bersihkan Log"
                onConfirm={handleClearLogs}
                onClose={() => setClearModalOpen(false)}
            />
        </AdminLayout>
    );
}


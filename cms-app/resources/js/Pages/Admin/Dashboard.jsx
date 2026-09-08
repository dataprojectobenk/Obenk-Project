import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import VisitorTrendChart from '@/Components/Analytics/VisitorTrendChart';
import VisitorGeoMap from '@/Components/Analytics/VisitorGeoMap';
import BestPostsTable from '@/Components/Analytics/BestPostsTable';
import TrafficSourcesChart from '@/Components/Analytics/TrafficSourcesChart';
import DeviceDistributionChart from '@/Components/Analytics/DeviceDistributionChart';
import CategoryShareChart from '@/Components/Analytics/CategoryShareChart';
import {
    FileText,
    Eye,
    MessageSquare,
    Users,
    Activity,
    ArrowUpRight,
    Sparkles,
} from 'lucide-react';

export default function Dashboard({
    metrics = {},
    best_posts = [],
    trend_data = [],
    geo_distribution = [],
    traffic_sources = [],
    device_distribution = [],
    category_share = [],
    recent_activities = [],
}) {
    const statCards = [
        {
            label: 'Total Artikel',
            value: metrics.total_posts || 0,
            sub: `${metrics.published_posts || 0} Terbit • ${metrics.draft_posts || 0} Draf`,
            icon: FileText,
            color: 'text-indigo-600 dark:text-indigo-400',
            bg: 'bg-indigo-50 dark:bg-indigo-500/10',
            border: 'border-indigo-200 dark:border-indigo-500/20',
            href: '/admin/posts',
        },
        {
            label: 'Total Tayangan (Views)',
            value: (metrics.total_views || 0).toLocaleString(),
            sub: 'Akumulasi pembaca',
            icon: Eye,
            color: 'text-emerald-600 dark:text-emerald-400',
            bg: 'bg-emerald-50 dark:bg-emerald-500/10',
            border: 'border-emerald-200 dark:border-emerald-500/20',
            href: '/admin/posts',
        },
        {
            label: 'Komentar',
            value: metrics.total_comments || 0,
            sub: `${metrics.pending_comments || 0} Menunggu moderasi`,
            icon: MessageSquare,
            color: 'text-amber-600 dark:text-amber-400',
            bg: 'bg-amber-50 dark:bg-amber-500/10',
            border: 'border-amber-200 dark:border-amber-500/20',
            href: '/admin/comments',
        },
        {
            label: 'Pustaka & Pengguna',
            value: `${metrics.total_media || 0} / ${metrics.total_users || 0}`,
            sub: `${metrics.total_media || 0} Media • ${metrics.total_users || 0} Pengguna`,
            icon: Users,
            color: 'text-cyan-600 dark:text-cyan-400',
            bg: 'bg-cyan-50 dark:bg-cyan-500/10',
            border: 'border-cyan-200 dark:border-cyan-500/20',
            href: '/admin/users',
        },
    ];

    return (
        <AdminLayout title="Dashboard Analitik">
            <Head title="Dashboard Analitik" />

            {/* Welcome Banner */}
            <div className="relative overflow-hidden bg-gradient-to-r from-indigo-50 via-white to-white dark:from-indigo-950/40 dark:via-slate-900 dark:to-slate-900 border border-indigo-200/80 dark:border-indigo-500/20 rounded-3xl p-6 sm:p-7 mb-8 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
                            <Sparkles className="w-4 h-4" />
                            <span>Ikhtisar Kinerja Website</span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                            Selamat Datang di Panel Obenk CMS
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl leading-relaxed">
                            Pantau performa trafik pembaca, artikel terpopuler, dan sebaran pengunjung secara terintegrasi.
                        </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                        <Link
                            href="/admin/posts/create"
                            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-md shadow-indigo-600/25 cursor-pointer"
                        >
                            <FileText className="w-4 h-4" />
                            <span>Tulis Artikel Baru</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                {statCards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <Link
                            key={index}
                            href={card.href}
                            className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-slate-700/80 rounded-2xl p-5 shadow-sm transition-all hover:translate-y-[-2px] group"
                        >
                            <div className="flex items-start justify-between">
                                <div className={`p-2.5 rounded-xl ${card.bg} ${card.color} ${card.border} border`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-slate-300 transition-colors" />
                            </div>
                            <div className="mt-4">
                                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    {card.label}
                                </p>
                                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1 tracking-tight">
                                    {card.value}
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                                    {card.sub}
                                </p>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Main Analytics Section: Trend Chart & Geo Map */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2">
                    <VisitorTrendChart data={trend_data} />
                </div>
                <div className="lg:col-span-1">
                    <VisitorGeoMap data={geo_distribution} />
                </div>
            </div>

            {/* Secondary Analytics: Best Posts & Traffic Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2">
                    <BestPostsTable posts={best_posts} />
                </div>
                <div className="lg:col-span-1 space-y-6">
                    <TrafficSourcesChart data={traffic_sources} />
                    <DeviceDistributionChart data={device_distribution} />
                </div>
            </div>

            {/* Bottom Row: Category Share & Recent Activity Logs */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <CategoryShareChart data={category_share} />
                </div>

                <div className="lg:col-span-2 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center justify-between gap-2 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            Riwayat Aktivitas Terakhir
                        </h3>
                        <Link
                            href="/admin/activity-logs"
                            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
                        >
                            Lihat Semua Log
                        </Link>
                    </div>

                    <div className="space-y-2.5">
                        {recent_activities.length === 0 ? (
                            <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-6">
                                Belum ada catatan aktivitas tercatat.
                            </p>
                        ) : (
                            recent_activities.map((act) => (
                                <div
                                    key={act.id}
                                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800/80 text-xs text-slate-700 dark:text-slate-300"
                                >
                                    <div className="flex items-center gap-3 truncate">
                                        <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-400 shrink-0">
                                            {act.user?.name?.charAt(0) || 'U'}
                                        </div>
                                        <div className="truncate">
                                            <p className="font-medium text-slate-800 dark:text-slate-200 truncate">
                                                <strong className="text-indigo-600 dark:text-indigo-400 font-semibold">{act.user?.name || 'Sistem'}</strong> {act.action}
                                            </p>
                                            {act.subject_type && (
                                                <p className="text-[11px] text-slate-400 dark:text-slate-500">
                                                    Entitas: {act.subject_type}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <span className="text-[11px] text-slate-400 dark:text-slate-500 whitespace-nowrap ml-4">
                                        {act.created_at}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

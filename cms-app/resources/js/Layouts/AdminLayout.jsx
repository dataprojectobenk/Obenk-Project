import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import ThemeToggle from '@/Components/ThemeToggle';
import {
    LayoutDashboard,
    FileText,
    FolderTree,
    Tags,
    Image as ImageIcon,
    MessageSquare,
    Users,
    User,
    Shield,
    Settings,
    Activity,
    Menu,
    X,
    LogOut,
    ExternalLink,
    CheckCircle,
    AlertCircle,
    ChevronDown,
} from 'lucide-react';

export default function AdminLayout({ children, title }) {
    const { auth, flash, site } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);

    const user = auth?.user;
    const currentUrl = window.location.pathname;

    const navItems = [
        {
            name: 'Dashboard',
            href: '/admin',
            icon: LayoutDashboard,
            active: currentUrl === '/admin',
        },
        {
            name: 'Artikel & Post',
            href: '/admin/posts',
            icon: FileText,
            active: currentUrl.startsWith('/admin/posts'),
        },
        {
            name: 'Kategori',
            href: '/admin/categories',
            icon: FolderTree,
            active: currentUrl.startsWith('/admin/categories'),
        },
        {
            name: 'Tagar (Tags)',
            href: '/admin/tags',
            icon: Tags,
            active: currentUrl.startsWith('/admin/tags'),
        },
        {
            name: 'Pustaka Media',
            href: '/admin/media',
            icon: ImageIcon,
            active: currentUrl.startsWith('/admin/media'),
        },
        {
            name: 'Komentar',
            href: '/admin/comments',
            icon: MessageSquare,
            active: currentUrl.startsWith('/admin/comments'),
        },
        {
            name: 'Pengguna',
            href: '/admin/users',
            icon: Users,
            active: currentUrl.startsWith('/admin/users'),
        },
        {
            name: 'Peran & Hak Akses',
            href: '/admin/roles',
            icon: Shield,
            active: currentUrl.startsWith('/admin/roles'),
        },
        {
            name: 'Pengaturan Web',
            href: '/admin/settings',
            icon: Settings,
            active: currentUrl.startsWith('/admin/settings'),
        },
        {
            name: 'Log Aktivitas',
            href: '/admin/activity-logs',
            icon: Activity,
            active: currentUrl.startsWith('/admin/activity-logs'),
        },
    ];

    const handleLogout = (e) => {
        e.preventDefault();
        router.post('/admin/logout');
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col antialiased transition-colors duration-200">
            {/* Mobile Drawer Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden transition-opacity"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar (Mobile Slide-Over & Desktop Sticky) */}
            <aside
                className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Brand Logo Header */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800 shrink-0">
                    <Link href="/admin" className="flex items-center gap-2.5 font-bold text-lg text-slate-900 dark:text-slate-100">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white font-black shadow-md shadow-indigo-500/20">
                            O
                        </div>
                        <span className="tracking-tight font-extrabold">{site?.name || 'Obenk CMS'}</span>
                        <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 ml-1">
                            Admin
                        </span>
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white lg:hidden"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Nav Links */}
                <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
                    <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Menu Utama
                    </div>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = item.active;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                                    isActive
                                        ? 'bg-indigo-600 text-white font-semibold shadow-sm shadow-indigo-600/30'
                                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/80 dark:hover:text-slate-200'
                                }`}
                            >
                                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </div>

                {/* Sidebar Footer User Info */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-800 shrink-0 bg-slate-50/70 dark:bg-slate-900/50">
                    <div className="flex items-center justify-between">
                        <Link
                            href="/admin/profile"
                            className="flex items-center gap-2.5 truncate hover:opacity-80 transition-opacity flex-1 mr-2"
                        >
                            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-400 border border-slate-300 dark:border-slate-700 shrink-0 overflow-hidden">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                ) : (
                                    user?.name?.charAt(0) || 'A'
                                )}
                            </div>
                            <div className="truncate">
                                <p className="text-xs font-semibold text-slate-900 dark:text-slate-200 truncate">{user?.name || 'Administrator'}</p>
                                <p className="text-[11px] text-slate-500 capitalize truncate">{user?.role_names?.[0] || 'Super Admin'}</p>
                            </div>
                        </Link>
                        <button
                            onClick={handleLogout}
                            title="Keluar"
                            className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="lg:pl-64 flex flex-col flex-1 min-h-screen">
                {/* Top Navigation Bar */}
                <header className="h-16 bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 lg:hidden"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 truncate">
                            {title || 'Dashboard'}
                        </h1>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Theme Toggle Button (Light/Dark Mode) */}
                        <ThemeToggle />

                        {/* Visit Site Button */}
                        <a
                            href="/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700/60 rounded-xl transition-colors shadow-sm"
                        >
                            <span className="hidden sm:inline">Lihat Website</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                        </a>

                        {/* User Profile dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300"
                            >
                                <div className="w-7 h-7 rounded-full bg-indigo-50 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center text-xs font-bold overflow-hidden">
                                    {user?.avatar ? (
                                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                    ) : (
                                        user?.name?.charAt(0) || 'A'
                                    )}
                                </div>
                                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
                            </button>

                            {userDropdownOpen && (
                                <div
                                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-1 z-50 animate-fade-in"
                                    onClick={() => setUserDropdownOpen(false)}
                                >
                                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                                        <p className="text-xs font-semibold text-slate-900 dark:text-slate-200 truncate">{user?.name}</p>
                                        <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                                    </div>
                                    <Link
                                        href="/admin/profile"
                                        className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                                    >
                                        <User className="w-3.5 h-3.5" />
                                        <span>Profil Saya</span>
                                    </Link>
                                    <Link
                                        href="/admin/settings"
                                        className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                                    >
                                        <Settings className="w-3.5 h-3.5" />
                                        <span>Pengaturan</span>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-800 hover:text-rose-600 dark:hover:text-rose-400 text-left"
                                    >
                                        <LogOut className="w-3.5 h-3.5" />
                                        <span>Keluar (Logout)</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Flash Messages */}
                {flash?.success && (
                    <div className="mx-4 sm:mx-8 mt-4 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-400 flex items-center gap-3 text-sm animate-fade-in shadow-sm">
                        <CheckCircle className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                        <p>{flash.success}</p>
                    </div>
                )}
                {flash?.error && (
                    <div className="mx-4 sm:mx-8 mt-4 p-4 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-800 dark:text-rose-400 flex items-center gap-3 text-sm animate-fade-in shadow-sm">
                        <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400" />
                        <p>{flash.error}</p>
                    </div>
                )}

                {/* Main View Container */}
                <main className="flex-1 p-4 sm:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}

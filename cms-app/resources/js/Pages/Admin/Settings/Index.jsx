import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Settings as SettingsIcon, Globe, Share2, Save, Loader2 } from 'lucide-react';

export default function Index({ settings = {} }) {
    const [activeTab, setActiveTab] = useState('general');

    const generalForm = useForm({
        group: 'general',
        settings: settings.general || {},
    });

    const seoForm = useForm({
        group: 'seo',
        settings: settings.seo || {},
    });

    const socialForm = useForm({
        group: 'social',
        settings: settings.social || {},
    });

    const handleSaveGeneral = (e) => {
        e.preventDefault();
        generalForm.post('/admin/settings', { preserveScroll: true });
    };

    const handleSaveSeo = (e) => {
        e.preventDefault();
        seoForm.post('/admin/settings', { preserveScroll: true });
    };

    const handleSaveSocial = (e) => {
        e.preventDefault();
        socialForm.post('/admin/settings', { preserveScroll: true });
    };

    const tabs = [
        { key: 'general', label: 'Pengaturan Umum', icon: SettingsIcon },
        { key: 'seo', label: 'SEO & Analitik', icon: Globe },
        { key: 'social', label: 'Media Sosial', icon: Share2 },
    ];

    return (
        <AdminLayout title="Pengaturan Situs">
            <Head title="Pengaturan Sistem & Situs" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Konfigurasi Situs</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Sesuaikan preferensi situs, meta SEO, dan integrasi jejaring sosial
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-200 dark:border-slate-800 pb-3">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.key;
                    return (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                isActive
                                    ? 'bg-indigo-600 text-white shadow-sm'
                                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                            }`}
                        >
                            <Icon className="w-4 h-4" />
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Form Panels */}
            <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm max-w-3xl">
                {/* General Settings Tab */}
                {activeTab === 'general' && (
                    <form onSubmit={handleSaveGeneral} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                Judul Situs (Site Title) <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={generalForm.data.settings.site_title || ''}
                                onChange={(e) =>
                                    generalForm.setData('settings', {
                                        ...generalForm.data.settings,
                                        site_title: e.target.value,
                                    })
                                }
                                placeholder="Obenk CMS"
                                required
                                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                Slogan Situs (Tagline)
                            </label>
                            <input
                                type="text"
                                value={generalForm.data.settings.site_tagline || ''}
                                onChange={(e) =>
                                    generalForm.setData('settings', {
                                        ...generalForm.data.settings,
                                        site_tagline: e.target.value,
                                    })
                                }
                                placeholder="Modern Tailored Content Management System"
                                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                Deskripsi Situs
                            </label>
                            <textarea
                                rows="3"
                                value={generalForm.data.settings.site_description || ''}
                                onChange={(e) =>
                                    generalForm.setData('settings', {
                                        ...generalForm.data.settings,
                                        site_description: e.target.value,
                                    })
                                }
                                placeholder="Deskripsi singkat seputar portal..."
                                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                    Email Administrator
                                </label>
                                <input
                                    type="email"
                                    value={generalForm.data.settings.admin_email || ''}
                                    onChange={(e) =>
                                        generalForm.setData('settings', {
                                            ...generalForm.data.settings,
                                            admin_email: e.target.value,
                                        })
                                    }
                                    placeholder="admin@obenk.test"
                                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                    Artikel Per Halaman
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="50"
                                    value={generalForm.data.settings.posts_per_page || '10'}
                                    onChange={(e) =>
                                        generalForm.setData('settings', {
                                            ...generalForm.data.settings,
                                            posts_per_page: e.target.value,
                                        })
                                    }
                                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950"
                                />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                            <button
                                type="submit"
                                disabled={generalForm.processing}
                                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl transition-all shadow-sm cursor-pointer"
                            >
                                {generalForm.processing ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Save className="w-4 h-4" />
                                )}
                                <span>Simpan Pengaturan Umum</span>
                            </button>
                        </div>
                    </form>
                )}

                {/* SEO Settings Tab */}
                {activeTab === 'seo' && (
                    <form onSubmit={handleSaveSeo} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                Kata Kunci Utama Situs (Meta Keywords)
                            </label>
                            <input
                                type="text"
                                value={seoForm.data.settings.meta_keywords || ''}
                                onChange={(e) =>
                                    seoForm.setData('settings', {
                                        ...seoForm.data.settings,
                                        meta_keywords: e.target.value,
                                    })
                                }
                                placeholder="laravel, cms, berita, blog"
                                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                Google Analytics Measurement ID
                            </label>
                            <input
                                type="text"
                                value={seoForm.data.settings.google_analytics_id || ''}
                                onChange={(e) =>
                                    seoForm.setData('settings', {
                                        ...seoForm.data.settings,
                                        google_analytics_id: e.target.value,
                                    })
                                }
                                placeholder="G-XXXXXXXXXX"
                                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                Base URL Kanonikal
                            </label>
                            <input
                                type="url"
                                value={seoForm.data.settings.canonical_base_url || ''}
                                onChange={(e) =>
                                    seoForm.setData('settings', {
                                        ...seoForm.data.settings,
                                        canonical_base_url: e.target.value,
                                    })
                                }
                                placeholder="https://obenk.test"
                                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950"
                            />
                        </div>

                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                            <button
                                type="submit"
                                disabled={seoForm.processing}
                                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl transition-all shadow-sm cursor-pointer"
                            >
                                {seoForm.processing ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Save className="w-4 h-4" />
                                )}
                                <span>Simpan Pengaturan SEO</span>
                            </button>
                        </div>
                    </form>
                )}

                {/* Social Settings Tab */}
                {activeTab === 'social' && (
                    <form onSubmit={handleSaveSocial} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                Twitter / X Handle
                            </label>
                            <input
                                type="text"
                                value={socialForm.data.settings.twitter_handle || ''}
                                onChange={(e) =>
                                    socialForm.setData('settings', {
                                        ...socialForm.data.settings,
                                        twitter_handle: e.target.value,
                                    })
                                }
                                placeholder="@obenk"
                                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                Facebook Fanpage URL
                            </label>
                            <input
                                type="url"
                                value={socialForm.data.settings.facebook_url || ''}
                                onChange={(e) =>
                                    socialForm.setData('settings', {
                                        ...socialForm.data.settings,
                                        facebook_url: e.target.value,
                                    })
                                }
                                placeholder="https://facebook.com/obenk"
                                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                GitHub Repository / Org URL
                            </label>
                            <input
                                type="url"
                                value={socialForm.data.settings.github_url || ''}
                                onChange={(e) =>
                                    socialForm.setData('settings', {
                                        ...socialForm.data.settings,
                                        github_url: e.target.value,
                                    })
                                }
                                placeholder="https://github.com/obenk"
                                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                LinkedIn Page URL
                            </label>
                            <input
                                type="url"
                                value={socialForm.data.settings.linkedin_url || ''}
                                onChange={(e) =>
                                    socialForm.setData('settings', {
                                        ...socialForm.data.settings,
                                        linkedin_url: e.target.value,
                                    })
                                }
                                placeholder="https://linkedin.com/company/obenk"
                                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950"
                            />
                        </div>

                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                            <button
                                type="submit"
                                disabled={socialForm.processing}
                                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl transition-all shadow-sm cursor-pointer"
                            >
                                {socialForm.processing ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Save className="w-4 h-4" />
                                )}
                                <span>Simpan Pengaturan Sosial</span>
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </AdminLayout>
    );
}


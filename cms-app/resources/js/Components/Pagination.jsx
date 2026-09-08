import React from 'react';
import { Link } from '@inertiajs/react';

export default function Pagination({ links }) {
    if (!links || links.length <= 3) return null;

    return (
        <div className="flex flex-wrap items-center justify-between gap-3 py-3 border-t border-slate-200 dark:border-slate-800/80 px-4">
            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                Menampilkan halaman navigasi
            </div>
            <nav className="flex items-center gap-1">
                {links.map((link, index) => {
                    if (link.url === null) {
                        return (
                            <span
                                key={index}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className="inline-flex min-w-[34px] h-8 items-center justify-center px-2.5 text-xs font-medium text-slate-400 dark:text-slate-600 rounded-lg select-none"
                            />
                        );
                    }

                    const isActive = link.active;

                    return (
                        <Link
                            key={index}
                            href={link.url}
                            preserveScroll
                            preserveState
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            className={`inline-flex min-w-[34px] h-8 items-center justify-center px-2.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                                isActive
                                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800'
                            }`}
                        />
                    );
                })}
            </nav>
        </div>
    );
}

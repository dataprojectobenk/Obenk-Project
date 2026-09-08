import React from 'react';
import { Link } from '@inertiajs/react';
import { Award, Eye, MessageSquare, ExternalLink } from 'lucide-react';

export default function BestPostsTable({ posts = [] }) {
    return (
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between gap-2 mb-4">
                <div>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <Award className="w-5 h-5 text-amber-500" />
                        Artikel Terpopuler (Best Posts)
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Peringkat artikel dengan akumulasi tayangan pembaca tertinggi
                    </p>
                </div>
                <Link
                    href="/admin/posts"
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors flex items-center gap-1"
                >
                    Lihat Semua
                    <ExternalLink className="w-3.5 h-3.5" />
                </Link>
            </div>

            <div className="overflow-x-auto -mx-5 px-5">
                <table className="w-full text-left border-collapse min-w-[500px]">
                    <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                            <th className="py-2.5 pr-3 text-center w-10">No</th>
                            <th className="py-2.5 px-3">Judul Konten</th>
                            <th className="py-2.5 px-3">Kategori</th>
                            <th className="py-2.5 px-3 text-right">Tayangan</th>
                            <th className="py-2.5 pl-3 text-right">Komentar</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs text-slate-700 dark:text-slate-300">
                        {posts.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="py-8 text-center text-slate-400 dark:text-slate-500">
                                    Belum ada data artikel.
                                </td>
                            </tr>
                        ) : (
                            posts.map((post, idx) => (
                                <tr
                                    key={post.id}
                                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
                                >
                                    <td className="py-3 pr-3 text-center">
                                        <span
                                            className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-bold text-xs ${
                                                idx === 0
                                                    ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-500/30'
                                                    : idx === 1
                                                    ? 'bg-slate-100 dark:bg-slate-400/20 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-400/30'
                                                    : idx === 2
                                                    ? 'bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-300 dark:border-orange-500/30'
                                                    : 'text-slate-400'
                                            }`}
                                        >
                                            {idx + 1}
                                        </span>
                                    </td>
                                    <td className="py-3 px-3">
                                        <Link
                                            href={`/admin/posts/${post.id}/edit`}
                                            className="font-semibold text-slate-900 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1"
                                        >
                                            {post.title}
                                        </Link>
                                        <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                                            <span>Oleh {post.author?.name || 'Admin'}</span>
                                            {post.published_at && (
                                                <>
                                                    <span>•</span>
                                                    <span>{post.published_at}</span>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-3 px-3 whitespace-nowrap">
                                        {post.category ? (
                                            <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60">
                                                {post.category.name}
                                            </span>
                                        ) : (
                                            <span className="text-slate-400">-</span>
                                        )}
                                    </td>
                                    <td className="py-3 px-3 text-right whitespace-nowrap">
                                        <span className="inline-flex items-center gap-1 font-bold text-indigo-600 dark:text-indigo-400">
                                            <Eye className="w-3.5 h-3.5" />
                                            {post.views?.toLocaleString() || 0}
                                        </span>
                                    </td>
                                    <td className="py-3 pl-3 text-right whitespace-nowrap">
                                        <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400 font-medium">
                                            <MessageSquare className="w-3.5 h-3.5" />
                                            {post.comments_count || 0}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

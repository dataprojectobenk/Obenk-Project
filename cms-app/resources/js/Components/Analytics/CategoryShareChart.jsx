import React from 'react';
import { FolderTree } from 'lucide-react';

export default function CategoryShareChart({ data = [] }) {
    const totalPosts = data.reduce((acc, item) => acc + (item.count || 0), 0);

    return (
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-1">
                <FolderTree className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Distribusi Kategori
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Porsi publikasi konten per kategori
            </p>

            <div className="space-y-3">
                {data.map((item, idx) => {
                    const percentage = totalPosts > 0 ? Math.round((item.count / totalPosts) * 100) : 0;
                    return (
                        <div key={idx} className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-700 dark:text-slate-300 font-medium truncate max-w-[180px]">
                                    {item.name}
                                </span>
                                <span className="text-slate-500 dark:text-slate-400">
                                    {item.count} artikel ({percentage}%)
                                </span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full"
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

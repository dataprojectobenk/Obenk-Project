import React from 'react';
import { Globe, MapPin } from 'lucide-react';

const countryFlags = {
    ID: '🇮🇩',
    US: '🇺🇸',
    SG: '🇸🇬',
    MY: '🇲🇾',
    JP: '🇯🇵',
    DE: '🇩🇪',
    GB: '🇬🇧',
    OTHER: '🌐',
};

export default function VisitorGeoMap({ data = [] }) {
    const totalVisitors = data.reduce((acc, item) => acc + (item.visitors || 0), 0);

    return (
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        Sebaran Geografis Pengunjung
                    </h3>
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700/60">
                        Total {totalVisitors.toLocaleString()}
                    </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
                    Distribusi asal negara audiens dan pembaca website
                </p>

                {/* Country List & Progress Bars */}
                <div className="space-y-3.5">
                    {data.map((item, index) => {
                        const flag = countryFlags[item.code] || '🌐';
                        const percentage = item.percentage || 0;

                        return (
                            <div key={index} className="space-y-1.5">
                                <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-medium">
                                        <span className="text-base leading-none">{flag}</span>
                                        <span>{item.country}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-slate-500 dark:text-slate-400">
                                            {item.visitors?.toLocaleString()}
                                        </span>
                                        <span className="font-bold text-slate-800 dark:text-slate-200 min-w-[40px] text-right">
                                            {percentage}%
                                        </span>
                                    </div>
                                </div>
                                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800/80 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${
                                            index === 0
                                                ? 'bg-gradient-to-r from-indigo-500 to-indigo-400'
                                                : index === 1
                                                ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                                                : index === 2
                                                ? 'bg-gradient-to-r from-cyan-500 to-cyan-400'
                                                : 'bg-slate-400 dark:bg-slate-600'
                                        }`}
                                        style={{ width: `${Math.min(100, Math.max(2, percentage))}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
                <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    Berdasarkan resolusi GeoIP publik
                </span>
                <span>Real-time</span>
            </div>
        </div>
    );
}

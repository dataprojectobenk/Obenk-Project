import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { TrendingUp } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 p-3 rounded-xl shadow-xl">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{label}</p>
                <div className="space-y-1 text-xs">
                    <p className="text-indigo-600 dark:text-indigo-400 flex items-center justify-between gap-4 font-medium">
                        <span>Tayangan Halaman:</span>
                        <span className="font-bold">{payload[0]?.value?.toLocaleString()}</span>
                    </p>
                    <p className="text-emerald-600 dark:text-emerald-400 flex items-center justify-between gap-4 font-medium">
                        <span>Pengunjung Unik:</span>
                        <span className="font-bold">{payload[1]?.value?.toLocaleString()}</span>
                    </p>
                </div>
            </div>
        );
    }
    return null;
};

export default function VisitorTrendChart({ data = [] }) {
    return (
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
                <div>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        Tren Kunjungan & Tayangan
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Statistik 14 hari terakhir (Page Views vs Unique Visitors)
                    </p>
                </div>

                <div className="flex items-center gap-4 text-xs">
                    <span className="inline-flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-medium">
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                        Tayangan (Views)
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        Pengunjung (Visitors)
                    </span>
                </div>
            </div>

            <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                            </linearGradient>
                            <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} />
                        <XAxis
                            dataKey="date"
                            stroke="#94a3b8"
                            tick={{ fill: '#94a3b8', fontSize: 11 }}
                            axisLine={{ stroke: '#cbd5e1' }}
                        />
                        <YAxis
                            stroke="#94a3b8"
                            tick={{ fill: '#94a3b8', fontSize: 11 }}
                            axisLine={{ stroke: '#cbd5e1' }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="views"
                            name="Tayangan"
                            stroke="#6366f1"
                            strokeWidth={2.5}
                            fillOpacity={1}
                            fill="url(#colorViews)"
                        />
                        <Area
                            type="monotone"
                            dataKey="visitors"
                            name="Pengunjung"
                            stroke="#10b981"
                            strokeWidth={2.5}
                            fillOpacity={1}
                            fill="url(#colorVisitors)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

import React from 'react';
import { Smartphone, Monitor, Tablet } from 'lucide-react';

const deviceIcons = {
    Mobile: Smartphone,
    Desktop: Monitor,
    Tablet: Tablet,
};

export default function DeviceDistributionChart({ data = [] }) {
    return (
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-1">
                <Smartphone className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Perangkat Pengunjung
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Komposisi perangkat yang digunakan pembaca
            </p>

            <div className="space-y-4">
                {data.map((item, idx) => {
                    const Icon = deviceIcons[item.name] || Smartphone;
                    return (
                        <div key={idx} className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                                <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                                    <Icon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                    {item.name}
                                </span>
                                <span className="font-bold text-slate-900 dark:text-slate-100">{item.value}%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{
                                        width: `${item.value}%`,
                                        backgroundColor: item.color,
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

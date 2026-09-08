import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Compass } from 'lucide-react';

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const item = payload[0];
        return (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl shadow-xl text-xs">
                <p className="font-semibold text-slate-800 dark:text-slate-200">{item.name}</p>
                <p className="text-indigo-600 dark:text-indigo-400 font-bold mt-0.5">{item.value}% Lalu Lintas</p>
            </div>
        );
    }
    return null;
};

export default function TrafficSourcesChart({ data = [] }) {
    return (
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-1">
                <Compass className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Kanal Sumber Lalu Lintas
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Asal rujukan trafik pembaca website
            </p>

            <div className="h-[180px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            innerRadius={50}
                            outerRadius={75}
                            paddingAngle={4}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                {data.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                        <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: item.color }}
                        />
                        <span className="text-slate-600 dark:text-slate-400 truncate">{item.name}</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 ml-auto">{item.value}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

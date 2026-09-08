import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({
    isOpen,
    title = 'Konfirmasi Tindakan',
    message = 'Apakah Anda yakin ingin melanjutkan tindakan ini? Data yang dihapus mungkin tidak dapat dikembalikan.',
    confirmText = 'Hapus',
    cancelText = 'Batal',
    onConfirm,
    onClose,
    isDanger = true,
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-md p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-2xl ${isDanger ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400' : 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'}`}>
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{title}</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-xl cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {message}
                </p>

                <div className="mt-6 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white rounded-xl transition-colors cursor-pointer"
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`px-5 py-2 text-xs sm:text-sm font-semibold text-white rounded-xl transition-colors shadow-md cursor-pointer ${
                            isDanger
                                ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/25'
                                : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/25'
                        }`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

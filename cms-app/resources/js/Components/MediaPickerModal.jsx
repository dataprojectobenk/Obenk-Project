import React, { useState, useEffect } from 'react';
import { X, Upload, Search, Check, Image as ImageIcon, Loader2 } from 'lucide-react';

export default function MediaPickerModal({
    isOpen,
    onClose,
    onSelect,
    title = 'Pilih Media Gambar',
}) {
    const [mediaItems, setMediaItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);

    const fetchMedia = async (searchQuery = '') => {
        setLoading(true);
        try {
            const url = searchQuery
                ? `/admin/media?json=1&search=${encodeURIComponent(searchQuery)}`
                : '/admin/media?json=1';
            const res = await fetch(url, {
                headers: {
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });
            const data = await res.json();
            setMediaItems(data.data || []);
        } catch (err) {
            console.error('Failed to fetch media:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchMedia(search);
            setSelectedItem(null);
        }
    }, [isOpen]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchMedia(search);
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('alt_text', file.name.replace(/\.[^/.]+$/, ''));

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

            const res = await fetch('/admin/media', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}),
                },
                body: formData,
            });

            const data = await res.json();
            if (data.media) {
                setMediaItems((prev) => [data.media, ...prev]);
                setSelectedItem(data.media);
            }
        } catch (err) {
            console.error('Upload failed:', err);
        } finally {
            setUploading(false);
        }
    };

    const getFullUrl = (item) => {
        if (!item) return '';
        const path = item.url || (item.file_path ? `/storage/${item.file_path}` : '');
        if (!path) return '';
        if (path.startsWith('http://') || path.startsWith('https://')) return path;
        return window.location.origin + (path.startsWith('/') ? '' : '/') + path;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-4xl max-h-[90vh] flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
                            <ImageIcon className="w-5 h-5" />
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

                {/* Toolbar */}
                <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900/50">
                    <form onSubmit={handleSearchSubmit} className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari gambar atau file..."
                            className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                        />
                    </form>

                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors shadow-sm shadow-indigo-600/20">
                        {uploading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Mengunggah...</span>
                            </>
                        ) : (
                            <>
                                <Upload className="w-4 h-4" />
                                <span>Unggah Media Baru</span>
                            </>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            disabled={uploading}
                            className="hidden"
                        />
                    </label>
                </div>

                {/* Grid */}
                <div className="flex-1 p-4 overflow-y-auto min-h-[300px] max-h-[450px]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-48 gap-3 text-slate-500 dark:text-slate-400">
                            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400" />
                            <p className="text-xs">Memuat pustaka media...</p>
                        </div>
                    ) : mediaItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-48 gap-2 text-slate-400 dark:text-slate-500">
                            <ImageIcon className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                            <p className="text-xs">Belum ada media ditemukan</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            {mediaItems.map((item) => {
                                const isSelected = selectedItem?.id === item.id;
                                const fileUrl = getFullUrl(item);
                                return (
                                    <div
                                        key={item.id}
                                        onClick={() => setSelectedItem(item)}
                                        className={`group relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all bg-slate-50 dark:bg-slate-950 flex items-center justify-center ${
                                            isSelected
                                                ? 'border-indigo-600 ring-2 ring-indigo-500/30 shadow-md'
                                                : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600'
                                        }`}
                                    >
                                        <img
                                            src={fileUrl}
                                            alt={item.alt_text || item.original_name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            loading="lazy"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                                const fallback = document.createElement('div');
                                                fallback.className = 'flex flex-col items-center justify-center text-slate-400 text-[10px] text-center p-2';
                                                fallback.innerHTML = '<span class="font-bold">IMG</span><span class="truncate max-w-[80px] mt-1">' + item.original_name + '</span>';
                                                e.currentTarget.parentElement?.appendChild(fallback);
                                            }}
                                        />
                                        {isSelected && (
                                            <div className="absolute inset-0 bg-indigo-600/30 flex items-center justify-center">
                                                <div className="w-7 h-7 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg">
                                                    <Check className="w-4 h-4" />
                                                </div>
                                            </div>
                                        )}
                                        <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-slate-950/90 to-transparent text-[11px] text-white truncate opacity-0 group-hover:opacity-100 transition-opacity">
                                            {item.original_name}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[50%]">
                        {selectedItem ? (
                            <span>Terpilih: <strong className="text-slate-900 dark:text-slate-200">{selectedItem.original_name}</strong></span>
                        ) : (
                            <span>Pilih gambar untuk melanjutkan</span>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            disabled={!selectedItem}
                            onClick={() => {
                                if (selectedItem) {
                                    onSelect(selectedItem);
                                    onClose();
                                }
                            }}
                            className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors shadow-sm cursor-pointer"
                        >
                            Gunakan Media
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

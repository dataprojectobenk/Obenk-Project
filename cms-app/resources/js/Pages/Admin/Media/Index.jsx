import React, { useState, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Pagination from '@/Components/Pagination';
import ConfirmModal from '@/Components/ConfirmModal';
import {
    Upload,
    Search,
    Image as ImageIcon,
    Trash2,
    Copy,
    Check,
    X,
    FileText,
    File,
    Loader2,
    Save,
    ExternalLink,
    Filter,
} from 'lucide-react';

export default function Index({ media, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [mimeType, setMimeType] = useState(filters.mime_type || '');
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [editAlt, setEditAlt] = useState('');
    const [editCaption, setEditCaption] = useState('');
    const [savingMeta, setSavingMeta] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [mediaToDelete, setMediaToDelete] = useState(null);
    const fileInputRef = useRef(null);

    const getFullUrl = (item) => {
        if (!item) return '';
        const path = item.url || (item.file_path ? `/storage/${item.file_path}` : '');
        if (!path) return '';
        if (path.startsWith('http://') || path.startsWith('https://')) return path;
        return window.location.origin + (path.startsWith('/') ? '' : '/') + path;
    };

    const handleUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const altText = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');

        router.post(
            '/admin/media',
            {
                file: file,
                alt_text: altText,
            },
            {
                forceFormData: true,
                preserveScroll: true,
                onStart: () => setUploading(true),
                onFinish: () => {
                    setUploading(false);
                    if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                    }
                },
            }
        );
    };

    const handleSelectMedia = (item) => {
        setSelectedMedia(item);
        setEditAlt(item.alt_text || '');
        setEditCaption(item.caption || '');
    };

    const handleSaveMetadata = (e) => {
        e.preventDefault();
        if (!selectedMedia) return;

        setSavingMeta(true);
        router.put(
            `/admin/media/${selectedMedia.id}`,
            {
                alt_text: editAlt,
                caption: editCaption,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedMedia((prev) =>
                        prev ? { ...prev, alt_text: editAlt, caption: editCaption } : null
                    );
                },
                onFinish: () => setSavingMeta(false),
            }
        );
    };

    const handleCopyUrl = () => {
        if (!selectedMedia) return;
        const fullUrl = getFullUrl(selectedMedia);
        navigator.clipboard.writeText(fullUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDelete = () => {
        if (mediaToDelete) {
            router.delete(`/admin/media/${mediaToDelete.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    if (selectedMedia?.id === mediaToDelete.id) {
                        setSelectedMedia(null);
                    }
                    setDeleteModalOpen(false);
                    setMediaToDelete(null);
                },
            });
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            '/admin/media',
            { search, mime_type: mimeType || undefined },
            { preserveState: true, replace: true }
        );
    };

    const handleMimeFilter = (type) => {
        setMimeType(type);
        router.get(
            '/admin/media',
            { search: search || undefined, mime_type: type || undefined },
            { preserveState: true, replace: true }
        );
    };

    const formatBytes = (bytes) => {
        if (!bytes || bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    return (
        <AdminLayout title="Pustaka Media">
            <Head title="Pustaka Media Universal" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Pustaka Media</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Kelola seluruh berkas aset gambar, foto, dan dokumen portal
                    </p>
                </div>
                <label className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors shadow-sm shadow-indigo-600/20 cursor-pointer ${uploading ? 'opacity-70 pointer-events-none' : ''}`}>
                    {uploading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Mengunggah Berkas...</span>
                        </>
                    ) : (
                        <>
                            <Upload className="w-4 h-4" />
                            <span>Unggah Berkas Media</span>
                        </>
                    )}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={handleUpload}
                        disabled={uploading}
                        className="hidden"
                    />
                </label>
            </div>

            {/* Filters & Search Bar */}
            <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 mb-6 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                {/* Search */}
                <form onSubmit={handleSearch} className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari nama berkas, teks alternatif..."
                        className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950"
                    />
                </form>

                {/* Filter Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                    <button
                        type="button"
                        onClick={() => handleMimeFilter('')}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors shrink-0 cursor-pointer ${
                            !mimeType
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'bg-slate-100 text-slate-600 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                        }`}
                    >
                        Semua Media
                    </button>
                    <button
                        type="button"
                        onClick={() => handleMimeFilter('image')}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors shrink-0 cursor-pointer ${
                            mimeType === 'image'
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'bg-slate-100 text-slate-600 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                        }`}
                    >
                        Gambar (Images)
                    </button>
                    <button
                        type="button"
                        onClick={() => handleMimeFilter('application')}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors shrink-0 cursor-pointer ${
                            mimeType === 'application'
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'bg-slate-100 text-slate-600 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                        }`}
                    >
                        Dokumen (Docs)
                    </button>
                </div>
            </div>

            {/* Media Visual Grid */}
            <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                {media.data.length === 0 ? (
                    <div className="py-16 text-center text-slate-400 dark:text-slate-500">
                        <ImageIcon className="w-12 h-12 mx-auto mb-3 text-slate-300 dark:text-slate-700" />
                        <p className="font-semibold text-slate-700 dark:text-slate-400">Belum ada media ditemukan</p>
                        <p className="text-xs mt-1">Unggah berkas foto, gambar, atau dokumen untuk mulai mengisi pustaka</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {media.data.map((item) => {
                            const isImage = item.mime_type?.startsWith('image/');
                            const fileUrl = getFullUrl(item);

                            return (
                                <div
                                    key={item.id}
                                    onClick={() => handleSelectMedia(item)}
                                    className="group relative aspect-square rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 overflow-hidden cursor-pointer transition-all shadow-sm flex items-center justify-center"
                                >
                                    {isImage ? (
                                        <img
                                            src={fileUrl}
                                            alt={item.alt_text || item.original_name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            loading="lazy"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                                e.currentTarget.parentElement?.classList.add('flex-col', 'p-3');
                                                const fallback = document.createElement('div');
                                                fallback.className = 'flex flex-col items-center justify-center text-slate-400 text-[10px] text-center';
                                                fallback.innerHTML = '<span class="font-bold">IMG</span><span class="truncate max-w-20 mt-1">' + item.original_name + '</span>';
                                                e.currentTarget.parentElement?.appendChild(fallback);
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center p-3 text-slate-400">
                                            <FileText className="w-8 h-8 mb-1 text-indigo-500" />
                                            <span className="text-[10px] uppercase font-bold text-slate-600 dark:text-slate-400 truncate max-w-full">
                                                {item.mime_type?.split('/')[1] || 'DOC'}
                                            </span>
                                        </div>
                                    )}

                                    {/* Overlay title */}
                                    <div className="absolute inset-x-0 bottom-0 p-2 bg-linear-to-t from-slate-950 via-slate-950/80 to-transparent text-[11px] text-white truncate opacity-0 group-hover:opacity-100 transition-opacity">
                                        {item.original_name}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                <div className="mt-6">
                    <Pagination links={media.links} />
                </div>
            </div>

            {/* Media Detail & Metadata Modal */}
            {selectedMedia && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
                    <div className="w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
                            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 truncate pr-4">
                                Rincian & Metadata Berkas
                            </h3>
                            <button
                                onClick={() => setSelectedMedia(null)}
                                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 flex-1 overflow-y-auto pr-1">
                            {/* Preview image */}
                            <div className="flex flex-col gap-3">
                                <div className="aspect-square rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-hidden flex items-center justify-center">
                                    {selectedMedia.mime_type?.startsWith('image/') ? (
                                        <img
                                            src={getFullUrl(selectedMedia)}
                                            alt={selectedMedia.alt_text || selectedMedia.original_name}
                                            className="w-full h-full object-contain"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center p-6 text-slate-400">
                                            <File className="w-16 h-16 mb-2 text-indigo-500" />
                                            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
                                                {selectedMedia.mime_type}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center justify-between gap-2">
                                    <a
                                        href={getFullUrl(selectedMedia)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                                    >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                        <span>Buka Berkas Asli</span>
                                    </a>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setMediaToDelete(selectedMedia);
                                            setDeleteModalOpen(true);
                                        }}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 border border-rose-200 dark:border-rose-500/20 rounded-xl transition-colors cursor-pointer"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        <span>Hapus Berkas</span>
                                    </button>
                                </div>
                            </div>

                            {/* Metadata & Edit Form */}
                            <div className="space-y-3.5 text-xs flex flex-col justify-between">
                                <form onSubmit={handleSaveMetadata} className="space-y-3">
                                    <div>
                                        <p className="text-slate-500 dark:text-slate-400 font-medium">Nama Berkas</p>
                                        <p className="text-slate-900 dark:text-slate-200 font-semibold mt-0.5 break-all">
                                            {selectedMedia.original_name}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <p className="text-slate-500 dark:text-slate-400 font-medium">Ukuran</p>
                                            <p className="text-slate-800 dark:text-slate-300 mt-0.5 font-mono">
                                                {formatBytes(selectedMedia.file_size)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-slate-500 dark:text-slate-400 font-medium">Dimensi</p>
                                            <p className="text-slate-800 dark:text-slate-300 mt-0.5 font-mono">
                                                {selectedMedia.dimensions
                                                    ? `${selectedMedia.dimensions.width} × ${selectedMedia.dimensions.height} px`
                                                    : '-'}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-slate-500 dark:text-slate-400 font-medium">Tipe MIME</p>
                                        <p className="text-slate-800 dark:text-slate-300 mt-0.5 font-mono">
                                            {selectedMedia.mime_type}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-slate-500 dark:text-slate-400 font-medium mb-1">Tautan Publik (URL)</p>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                readOnly
                                                value={getFullUrl(selectedMedia)}
                                                className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-300 text-[11px] font-mono select-all focus:outline-none"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleCopyUrl}
                                                className="p-1.5 text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors shrink-0 cursor-pointer"
                                                title="Salin Tautan"
                                            >
                                                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                                        <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                                            Teks Alternatif (Alt Text)
                                        </label>
                                        <input
                                            type="text"
                                            value={editAlt}
                                            onChange={(e) => setEditAlt(e.target.value)}
                                            placeholder="Deskripsi singkat gambar untuk aksesibilitas dan SEO"
                                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                                            Keterangan / Caption
                                        </label>
                                        <input
                                            type="text"
                                            value={editCaption}
                                            onChange={(e) => setEditCaption(e.target.value)}
                                            placeholder="Keterangan gambar..."
                                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>

                                    <div className="pt-2 flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={savingMeta}
                                            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl transition-colors shadow-sm cursor-pointer"
                                        >
                                            {savingMeta ? (
                                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            ) : (
                                                <Save className="w-3.5 h-3.5" />
                                            )}
                                            <span>Simpan Perubahan</span>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirm Delete Modal */}
            <ConfirmModal
                isOpen={deleteModalOpen}
                title="Hapus Media"
                message={`Apakah Anda yakin ingin menghapus berkas "${mediaToDelete?.original_name}"? Berkas fisik akan dihapus dari server.`}
                onConfirm={handleDelete}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setMediaToDelete(null);
                }}
            />
        </AdminLayout>
    );
}


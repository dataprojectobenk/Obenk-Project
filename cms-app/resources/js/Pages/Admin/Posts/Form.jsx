import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import TiptapEditor from '@/Components/TiptapEditor';
import MediaPickerModal from '@/Components/MediaPickerModal';
import {
    Save,
    ArrowLeft,
    Image as ImageIcon,
    X,
    Globe,
    Loader2,
} from 'lucide-react';

export default function Form({ post = null, categories = [], tags = [] }) {
    const isEditing = Boolean(post);

    const { data, setData, post: submitPost, put: updatePost, processing, errors } = useForm({
        title: post?.title || '',
        slug: post?.slug || '',
        excerpt: post?.excerpt || '',
        content: post?.content || '',
        category_id: post?.category_id || '',
        featured_image_id: post?.featured_image_id || null,
        status: post?.status || 'published',
        visibility: post?.visibility || 'public',
        is_featured: post?.is_featured || false,
        published_at: post?.published_at || '',
        seo_title: post?.seo_title || '',
        seo_description: post?.seo_description || '',
        seo_keywords: post?.seo_keywords || '',
        tags: post?.tag_ids || [],
    });

    const [mediaModalOpen, setMediaModalOpen] = useState(false);
    const [featuredPreview, setFeaturedPreview] = useState(
        post?.featured_image ? post.featured_image.url || `/storage/${post.featured_image.file_path}` : null
    );

    const handleSelectFeatured = (media) => {
        setData('featured_image_id', media.id);
        setFeaturedPreview(media.url || `/storage/${media.file_path}`);
    };

    const handleRemoveFeatured = () => {
        setData('featured_image_id', null);
        setFeaturedPreview(null);
    };

    const toggleTag = (tagId) => {
        const currentTags = [...data.tags];
        const index = currentTags.indexOf(tagId);
        if (index > -1) {
            currentTags.splice(index, 1);
        } else {
            currentTags.push(tagId);
        }
        setData('tags', currentTags);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            updatePost(`/admin/posts/${post.id}`);
        } else {
            submitPost('/admin/posts');
        }
    };

    return (
        <AdminLayout title={isEditing ? 'Edit Artikel' : 'Tulis Artikel Baru'}>
            <Head title={isEditing ? `Edit: ${post.title}` : 'Tulis Artikel Baru'} />

            <form onSubmit={handleSubmit}>
                {/* Top Action Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/admin/posts"
                            className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors shadow-sm"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                                {isEditing ? 'Perbarui Artikel' : 'Tulis Artikel Baru'}
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {isEditing ? 'Ubah konten dan optimasi artikel' : 'Buat publikasi baru untuk website'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/admin/posts"
                            className="px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors shadow-sm"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl transition-all shadow-md shadow-indigo-600/25 cursor-pointer"
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Menyimpan...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    <span>
                                        {data.status === 'draft'
                                            ? 'Simpan sebagai Draf'
                                            : data.status === 'archived'
                                            ? 'Simpan ke Arsip'
                                            : isEditing
                                            ? 'Simpan Perubahan'
                                            : 'Terbitkan Artikel'}
                                    </span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Main 2-Column Form Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column (Content & SEO) */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Title & Slug */}
                        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    Judul Artikel <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="Masukkan judul artikel yang menarik..."
                                    required
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-base font-semibold text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                />
                                {errors.title && (
                                    <p className="mt-1.5 text-xs text-rose-500">{errors.title}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                                    Kustom Slug (URL)
                                </label>
                                <div className="flex items-center bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-500 dark:text-slate-400 focus-within:border-indigo-500">
                                    <span className="text-slate-400 select-none">/blog/</span>
                                    <input
                                        type="text"
                                        value={data.slug}
                                        onChange={(e) => setData('slug', e.target.value)}
                                        placeholder="otomatis-dari-judul"
                                        className="w-full bg-transparent text-slate-900 dark:text-slate-200 focus:outline-none pl-1"
                                    />
                                </div>
                                {errors.slug && (
                                    <p className="mt-1.5 text-xs text-rose-500">{errors.slug}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    Ringkasan (Excerpt)
                                </label>
                                <textarea
                                    rows="2"
                                    value={data.excerpt}
                                    onChange={(e) => setData('excerpt', e.target.value)}
                                    placeholder="Ringkasan singkat artikel yang muncul pada kartu artikel..."
                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                                />
                            </div>
                        </div>

                        {/* Tiptap Rich Text Editor */}
                        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                Isi Artikel Lengkap <span className="text-rose-500">*</span>
                            </label>
                            <TiptapEditor
                                value={data.content}
                                onChange={(html) => setData('content', html)}
                                placeholder="Mulai tuliskan isi artikel Anda secara mendalam..."
                            />
                            {errors.content && (
                                <p className="mt-1.5 text-xs text-rose-500">{errors.content}</p>
                            )}
                        </div>

                        {/* SEO Metadata Box */}
                        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-200">
                                <Globe className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                <span>Optimasi Mesin Pencari (SEO)</span>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                                    Judul Meta SEO (Meta Title)
                                </label>
                                <input
                                    type="text"
                                    value={data.seo_title}
                                    onChange={(e) => setData('seo_title', e.target.value)}
                                    placeholder="Judul khusus untuk Google Search (opsional)"
                                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                                    Deskripsi Meta (Meta Description)
                                </label>
                                <textarea
                                    rows="2"
                                    value={data.seo_description}
                                    onChange={(e) => setData('seo_description', e.target.value)}
                                    placeholder="Deskripsi singkat yang tampil pada hasil penelusuran mesin pencari (maks 160 karakter)"
                                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                                    Kata Kunci (SEO Keywords)
                                </label>
                                <input
                                    type="text"
                                    value={data.seo_keywords}
                                    onChange={(e) => setData('seo_keywords', e.target.value)}
                                    placeholder="cms, laravel, berita, teknologi"
                                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Publishing Settings, Categories, Image) */}
                    <div className="space-y-6">
                        {/* Publish Status Card */}
                        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-200 pb-2 border-b border-slate-100 dark:border-slate-800">
                                Pengaturan Publikasi
                            </h3>

                            <div>
                                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                                    Status Artikel
                                </label>
                                <select
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
                                >
                                    <option value="published">Terbitkan (Published)</option>
                                    <option value="draft">Draf (Draft)</option>
                                    <option value="archived">Arsipkan (Archived)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                                    Visibilitas Konten
                                </label>
                                <select
                                    value={data.visibility}
                                    onChange={(e) => setData('visibility', e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
                                >
                                    <option value="public">Publik (Semua Pengunjung)</option>
                                    <option value="private">Privat (Hanya Admin/Penulis)</option>
                                    <option value="password">Terproteksi Sandi</option>
                                </select>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
                                        Waktu Publikasi
                                    </label>
                                    {data.published_at && (
                                        <button
                                            type="button"
                                            onClick={() => setData('published_at', '')}
                                            className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors cursor-pointer"
                                        >
                                            Reset (Terbit Otomatis)
                                        </button>
                                    )}
                                </div>
                                <input
                                    type="datetime-local"
                                    value={data.published_at || ''}
                                    onChange={(e) => setData('published_at', e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
                                />
                                <p className="text-[11px] text-slate-500 dark:text-slate-500 mt-1">
                                    {data.published_at
                                        ? 'Artikel akan dijadwalkan / diterbitkan sesuai waktu di atas.'
                                        : 'Biarkan kosong untuk otomatis diterbitkan saat ini.'}
                                </p>
                            </div>

                            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                                    <input
                                        type="checkbox"
                                        checked={data.is_featured}
                                        onChange={(e) => setData('is_featured', e.target.checked)}
                                        className="w-4 h-4 rounded bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-indigo-600 focus:ring-0"
                                    />
                                    <span className="font-semibold">Jadikan Artikel Unggulan (Featured)</span>
                                </label>
                            </div>
                        </div>

                        {/* Featured Image Card */}
                        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-200 pb-2 border-b border-slate-100 dark:border-slate-800">
                                Gambar Utama (Featured Image)
                            </h3>

                            {featuredPreview ? (
                                <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-950 group">
                                    <img
                                        src={featuredPreview}
                                        alt="Featured Preview"
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemoveFeatured}
                                        className="absolute top-2 right-2 p-1.5 bg-rose-600/90 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                        title="Hapus gambar"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <div
                                    onClick={() => setMediaModalOpen(true)}
                                    className="border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-indigo-500 rounded-xl p-6 text-center cursor-pointer transition-colors bg-slate-50 dark:bg-slate-950/50"
                                >
                                    <ImageIcon className="w-8 h-8 text-slate-400 dark:text-slate-600 mx-auto mb-2" />
                                    <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                                        Pilih dari Pustaka Media
                                    </p>
                                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                                        PNG, JPG, WebP hingga 10MB
                                    </p>
                                </div>
                            )}

                            {featuredPreview && (
                                <button
                                    type="button"
                                    onClick={() => setMediaModalOpen(true)}
                                    className="w-full py-1.5 px-3 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors text-center cursor-pointer"
                                >
                                    Ganti Gambar
                                </button>
                            )}
                        </div>

                        {/* Category Card */}
                        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-200 pb-2 border-b border-slate-100 dark:border-slate-800">
                                Kategori Konten
                            </h3>
                            <select
                                value={data.category_id}
                                onChange={(e) => setData('category_id', e.target.value)}
                                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
                            >
                                <option value="">-- Pilih Kategori --</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Tags Card */}
                        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-200 pb-2 border-b border-slate-100 dark:border-slate-800">
                                Tagar (Tags)
                            </h3>
                            <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
                                {tags.map((tag) => {
                                    const isSelected = data.tags.includes(tag.id);
                                    return (
                                        <button
                                            type="button"
                                            key={tag.id}
                                            onClick={() => toggleTag(tag.id)}
                                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                                isSelected
                                                    ? 'bg-indigo-600 text-white shadow-sm'
                                                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-700'
                                            }`}
                                        >
                                            #{tag.name}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </form>

            {/* Media Picker Modal */}
            <MediaPickerModal
                isOpen={mediaModalOpen}
                onClose={() => setMediaModalOpen(false)}
                onSelect={handleSelectFeatured}
                title="Pilih Gambar Utama (Featured Image)"
            />
        </AdminLayout>
    );
}

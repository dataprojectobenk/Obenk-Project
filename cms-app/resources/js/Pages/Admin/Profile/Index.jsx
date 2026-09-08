import React, { useState, useRef } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    User,
    KeyRound,
    Mail,
    AtSign,
    UploadCloud,
    Shield,
    Calendar,
    Save,
    Loader2,
    Eye,
    EyeOff,
} from 'lucide-react';

export default function Index({ user }) {
    const [activeTab, setActiveTab] = useState('general');
    const [previewUrl, setPreviewUrl] = useState(null);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const fileInputRef = useRef(null);

    // Profile Info Form
    const {
        data: profileData,
        setData: setProfileData,
        post: postProfile,
        processing: profileProcessing,
        errors: profileErrors,
    } = useForm({
        name: user?.name || '',
        username: user?.username || '',
        email: user?.email || '',
        bio: user?.bio || '',
        avatar: null,
    });

    // Password Form
    const {
        data: pwdData,
        setData: setPwdData,
        put: putPassword,
        processing: pwdProcessing,
        errors: pwdErrors,
        reset: resetPassword,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileData('avatar', file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        postProfile('/admin/profile', {
            preserveScroll: true,
            forceFormData: true,
        });
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        putPassword('/admin/profile/password', {
            preserveScroll: true,
            onSuccess: () => {
                resetPassword();
            },
        });
    };

    const tabs = [
        { key: 'general', label: 'Informasi Akun', icon: User },
        { key: 'security', label: 'Keamanan & Kata Sandi', icon: KeyRound },
    ];

    const currentAvatarDisplay = previewUrl || user?.avatar;

    return (
        <AdminLayout title="Profil Saya">
            <Head title="Profil Akun Saya" />

            {/* Page Title & Breadcrumb */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Pengaturan Profil</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Kelola identitas akun Anda, foto profil, dan kata sandi keamanan.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: User Summary Card */}
                <div className="lg:col-span-4">
                    <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm sticky top-24">
                        <div className="flex flex-col items-center text-center">
                            {/* Avatar Display */}
                            <div className="relative group mb-4">
                                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-indigo-500/30 flex items-center justify-center text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 shadow-md">
                                    {currentAvatarDisplay ? (
                                        <img
                                            src={currentAvatarDisplay}
                                            alt={user?.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        user?.name?.charAt(0).toUpperCase() || 'U'
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setActiveTab('general');
                                        fileInputRef.current?.click();
                                    }}
                                    className="absolute inset-0 bg-slate-950/60 rounded-2xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[10px] font-semibold transition-opacity duration-200 cursor-pointer"
                                >
                                    <UploadCloud className="w-5 h-5 mb-0.5" />
                                    <span>Ganti Foto</span>
                                </button>
                            </div>

                            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 truncate w-full">
                                {user?.name}
                            </h3>
                            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">
                                @{user?.username}
                            </p>

                            {/* Roles Badge */}
                            <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3">
                                {user?.roles && user.roles.length > 0 ? (
                                    user.roles.map((role, idx) => (
                                        <span
                                            key={idx}
                                            className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-medium rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/20"
                                        >
                                            <Shield className="w-3 h-3" />
                                            {role}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-[11px] text-slate-400">Pengguna</span>
                                )}
                            </div>

                            {/* Bio */}
                            {user?.bio && (
                                <p className="text-xs text-slate-600 dark:text-slate-300 mt-4 px-2 py-2.5 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-100 dark:border-slate-800/60 italic w-full text-left leading-relaxed">
                                    "{user.bio}"
                                </p>
                            )}

                            {/* Details meta */}
                            <div className="w-full mt-5 pt-5 border-t border-slate-100 dark:border-slate-800 text-left space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                                    <span className="truncate">{user?.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                                    <span>
                                        Bergabung:{' '}
                                        {user?.created_at
                                            ? new Date(user.created_at).toLocaleDateString('id-ID', {
                                                  day: 'numeric',
                                                  month: 'long',
                                                  year: 'numeric',
                                              })
                                            : '-'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Edit Forms */}
                <div className="lg:col-span-8">
                    {/* Navigation Tabs */}
                    <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-200 dark:border-slate-800 pb-3">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.key;
                            return (
                                <button
                                    key={tab.key}
                                    type="button"
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                        isActive
                                            ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                                            : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                                    }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Tab 1: General Profile Info */}
                    {activeTab === 'general' && (
                        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm animate-fade-in">
                            <form onSubmit={handleProfileSubmit} className="space-y-5">
                                {/* Avatar File Input */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                        Foto Profil / Avatar
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0 flex items-center justify-center font-bold text-indigo-600 text-xl">
                                            {currentAvatarDisplay ? (
                                                <img
                                                    src={currentAvatarDisplay}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                user?.name?.charAt(0) || 'U'
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                accept="image/png, image/jpeg, image/jpg, image/webp"
                                                onChange={handleAvatarChange}
                                                className="hidden"
                                                id="avatar-upload"
                                            />
                                            <label
                                                htmlFor="avatar-upload"
                                                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer transition-colors"
                                            >
                                                <UploadCloud className="w-4 h-4 text-indigo-500" />
                                                <span>Pilih Foto Baru</span>
                                            </label>
                                            <p className="text-[11px] text-slate-400 mt-1.5">
                                                Format yang didukung: JPG, PNG, WEBP. Maksimal 2MB.
                                            </p>
                                        </div>
                                    </div>
                                    {profileErrors.avatar && (
                                        <p className="text-xs text-rose-500 mt-1.5">{profileErrors.avatar}</p>
                                    )}
                                </div>

                                <hr className="border-slate-100 dark:border-slate-800" />

                                {/* Name & Username */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                            Nama Lengkap <span className="text-rose-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                                <User className="w-4 h-4" />
                                            </div>
                                            <input
                                                type="text"
                                                value={profileData.name}
                                                onChange={(e) => setProfileData('name', e.target.value)}
                                                placeholder="Nama Anda"
                                                required
                                                className={`w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-950/70 border rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950 ${
                                                    profileErrors.name
                                                        ? 'border-rose-300 dark:border-rose-500/50'
                                                        : 'border-slate-200 dark:border-slate-800'
                                                }`}
                                            />
                                        </div>
                                        {profileErrors.name && (
                                            <p className="text-xs text-rose-500 mt-1">{profileErrors.name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                            Nama Pengguna (Username) <span className="text-rose-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                                <AtSign className="w-4 h-4" />
                                            </div>
                                            <input
                                                type="text"
                                                value={profileData.username}
                                                onChange={(e) => setProfileData('username', e.target.value)}
                                                placeholder="username"
                                                required
                                                className={`w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-950/70 border rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950 ${
                                                    profileErrors.username
                                                        ? 'border-rose-300 dark:border-rose-500/50'
                                                        : 'border-slate-200 dark:border-slate-800'
                                                }`}
                                            />
                                        </div>
                                        {profileErrors.username && (
                                            <p className="text-xs text-rose-500 mt-1">{profileErrors.username}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                        Alamat Email <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                            <Mail className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="email"
                                            value={profileData.email}
                                            onChange={(e) => setProfileData('email', e.target.value)}
                                            placeholder="alamat@email.com"
                                            required
                                            className={`w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-950/70 border rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950 ${
                                                profileErrors.email
                                                    ? 'border-rose-300 dark:border-rose-500/50'
                                                    : 'border-slate-200 dark:border-slate-800'
                                            }`}
                                        />
                                    </div>
                                    {profileErrors.email && (
                                        <p className="text-xs text-rose-500 mt-1">{profileErrors.email}</p>
                                    )}
                                </div>

                                {/* Bio */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                        Bio & Deskripsi Singkat
                                    </label>
                                    <div className="relative">
                                        <textarea
                                            rows="3"
                                            value={profileData.bio}
                                            onChange={(e) => setProfileData('bio', e.target.value)}
                                            placeholder="Tuliskan sekilas tentang profil, minat, atau profesi Anda..."
                                            className={`w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-950/70 border rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950 ${
                                                profileErrors.bio
                                                    ? 'border-rose-300 dark:border-rose-500/50'
                                                    : 'border-slate-200 dark:border-slate-800'
                                            }`}
                                        />
                                    </div>
                                    <p className="text-[11px] text-slate-400 mt-1">
                                        Bio ini akan ditampilkan pada halaman penulis artikel publik.
                                    </p>
                                    {profileErrors.bio && (
                                        <p className="text-xs text-rose-500 mt-1">{profileErrors.bio}</p>
                                    )}
                                </div>

                                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={profileProcessing}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl transition-all shadow-sm shadow-indigo-600/30 cursor-pointer"
                                    >
                                        {profileProcessing ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Save className="w-4 h-4" />
                                        )}
                                        <span>Simpan Profil</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Tab 2: Security & Password */}
                    {activeTab === 'security' && (
                        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm animate-fade-in">
                            <form onSubmit={handlePasswordSubmit} className="space-y-5">
                                <div className="p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl text-amber-900 dark:text-amber-300 text-xs">
                                    <p className="font-semibold mb-1">Perhatian Keamanan</p>
                                    <p className="text-amber-800/90 dark:text-amber-300/80 text-[11px]">
                                        Pastikan kata sandi baru minimal 8 karakter dan menggabungkan huruf besar, huruf kecil, angka, dan simbol untuk menjaga keamanan akun Anda.
                                    </p>
                                </div>

                                {/* Current Password */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                        Kata Sandi Saat Ini <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                            <KeyRound className="w-4 h-4" />
                                        </div>
                                        <input
                                            type={showCurrentPassword ? 'text' : 'password'}
                                            value={pwdData.current_password}
                                            onChange={(e) => setPwdData('current_password', e.target.value)}
                                            placeholder="••••••••"
                                            required
                                            className={`w-full pl-9 pr-10 py-2.5 text-xs bg-slate-50 dark:bg-slate-950/70 border rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950 ${
                                                pwdErrors.current_password
                                                    ? 'border-rose-300 dark:border-rose-500/50'
                                                    : 'border-slate-200 dark:border-slate-800'
                                            }`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                        >
                                            {showCurrentPassword ? (
                                                <EyeOff className="w-4 h-4" />
                                            ) : (
                                                <Eye className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                    {pwdErrors.current_password && (
                                        <p className="text-xs text-rose-500 mt-1">{pwdErrors.current_password}</p>
                                    )}
                                </div>

                                <hr className="border-slate-100 dark:border-slate-800" />

                                {/* New Password */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                        Kata Sandi Baru <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                            <KeyRound className="w-4 h-4" />
                                        </div>
                                        <input
                                            type={showNewPassword ? 'text' : 'password'}
                                            value={pwdData.password}
                                            onChange={(e) => setPwdData('password', e.target.value)}
                                            placeholder="Minimal 8 karakter"
                                            required
                                            className={`w-full pl-9 pr-10 py-2.5 text-xs bg-slate-50 dark:bg-slate-950/70 border rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950 ${
                                                pwdErrors.password
                                                    ? 'border-rose-300 dark:border-rose-500/50'
                                                    : 'border-slate-200 dark:border-slate-800'
                                            }`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                        >
                                            {showNewPassword ? (
                                                <EyeOff className="w-4 h-4" />
                                            ) : (
                                                <Eye className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                    {pwdErrors.password && (
                                        <p className="text-xs text-rose-500 mt-1">{pwdErrors.password}</p>
                                    )}
                                </div>

                                {/* Confirm New Password */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                        Konfirmasi Kata Sandi Baru <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                            <KeyRound className="w-4 h-4" />
                                        </div>
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={pwdData.password_confirmation}
                                            onChange={(e) => setPwdData('password_confirmation', e.target.value)}
                                            placeholder="Ulangi kata sandi baru"
                                            required
                                            className="w-full pl-9 pr-10 py-2.5 text-xs bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="w-4 h-4" />
                                            ) : (
                                                <Eye className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={pwdProcessing}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl transition-all shadow-sm shadow-indigo-600/30 cursor-pointer"
                                    >
                                        {pwdProcessing ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Save className="w-4 h-4" />
                                        )}
                                        <span>Perbarui Kata Sandi</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}


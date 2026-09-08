import React from 'react';
import { useForm, Head } from '@inertiajs/react';
import { Lock, User, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        login: '',
        password: '',
        remember: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/login');
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 selection:bg-indigo-500 selection:text-white relative overflow-hidden">
            <Head title="Masuk Admin CMS" />

            {/* Subtle background glow */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="w-full max-w-md relative z-10">
                {/* Brand Logo & Title */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-linear-to-tr from-indigo-600 to-indigo-400 text-white font-black text-xl shadow-lg shadow-indigo-600/20 mb-3">
                        O
                    </div>
                    <h2 className="text-2xl font-bold text-slate-100 tracking-tight">
                        Obenk CMS Engine
                    </h2>
                    <p className="text-sm text-slate-400 mt-1">
                        Silakan masuk untuk mengelola portal & konten
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Username or Email */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                                Email atau Username
                            </label>
                            <div className="relative">
                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="text"
                                    value={data.login}
                                    onChange={(e) => setData('login', e.target.value)}
                                    placeholder="admin@obenk.test"
                                    required
                                    autoFocus
                                    className={`w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
                                        errors.login
                                            ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500'
                                            : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500'
                                    }`}
                                />
                            </div>
                            {errors.login && (
                                <p className="mt-1.5 text-xs text-rose-400 font-medium">
                                    {errors.login}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                                Kata Sandi (Password)
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className={`w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
                                        errors.password
                                            ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500'
                                            : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500'
                                    }`}
                                />
                            </div>
                            {errors.password && (
                                <p className="mt-1.5 text-xs text-rose-400 font-medium">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Remember me */}
                        <div className="flex items-center justify-between pt-1">
                            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400 hover:text-slate-300">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-0"
                                />
                                <span>Ingat saya di perangkat ini</span>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full mt-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 group cursor-pointer"
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Memverifikasi...</span>
                                </>
                            ) : (
                                <>
                                    <span>Masuk ke Dashboard</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
                        <p className="text-xs text-slate-500 flex items-center justify-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                            Akses terproteksi RBAC Multi-Role Admin
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}


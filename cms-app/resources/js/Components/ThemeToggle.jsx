import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ className = '' }) {
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        const isDark = document.documentElement.classList.contains('dark');
        setTheme(isDark ? 'dark' : 'light');
    }, []);

    const toggleTheme = () => {
        const nextTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(nextTheme);

        if (nextTheme === 'dark') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('admin_theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('admin_theme', 'light');
        }
    };

    return (
        <button
            type="button"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Ganti ke Mode Terang (Light)' : 'Ganti ke Mode Gelap (Dark)'}
            aria-label="Toggle Theme"
            className={`relative p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 transition-all duration-200 cursor-pointer ${className}`}
        >
            {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform duration-300" />
            ) : (
                <Moon className="w-4 h-4 text-indigo-600 hover:-rotate-12 transition-transform duration-300" />
            )}
        </button>
    );
}


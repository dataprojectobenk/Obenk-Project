import React, { useState, useRef, useEffect } from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import {
    AlignLeft,
    AlignCenter,
    AlignRight,
    Trash2,
    Edit3,
    Check,
    X,
    Maximize2,
} from 'lucide-react';

export default function ResizableImageNode(props) {
    const { node, updateAttributes, deleteNode, selected } = props;
    const { src, alt, title, width = '100%', alignment = 'center' } = node.attrs;

    const [isResizing, setIsResizing] = useState(false);
    const [editAltOpen, setEditAltOpen] = useState(false);
    const [tempAlt, setTempAlt] = useState(alt || '');
    const [tempTitle, setTempTitle] = useState(title || '');

    const containerRef = useRef(null);
    const imageRef = useRef(null);

    // Alignment container classes
    const getAlignmentClass = () => {
        switch (alignment) {
            case 'left':
                return 'justify-start mr-auto';
            case 'right':
                return 'justify-end ml-auto';
            case 'center':
            default:
                return 'justify-center mx-auto';
        }
    };

    // Width presets
    const setWidthPreset = (preset) => {
        updateAttributes({ width: preset });
    };

    // Alignment handler
    const setAlign = (align) => {
        updateAttributes({ alignment: align });
    };

    // Save Alt / Title text
    const handleSaveMeta = () => {
        updateAttributes({
            alt: tempAlt,
            title: tempTitle,
        });
        setEditAltOpen(false);
    };

    // Interactive Drag to Resize
    const handleMouseDown = (e, direction) => {
        e.preventDefault();
        e.stopPropagation();
        setIsResizing(true);

        const startX = e.clientX;
        const initialWidth = imageRef.current ? imageRef.current.getBoundingClientRect().width : 300;
        const parentWidth = containerRef.current ? containerRef.current.parentElement.getBoundingClientRect().width : 800;

        const handleMouseMove = (moveEvent) => {
            const currentX = moveEvent.clientX;
            let delta = currentX - startX;
            if (direction === 'left') {
                delta = -delta;
            }

            let newPixelWidth = initialWidth + delta * 2;
            let newPercent = Math.round((newPixelWidth / parentWidth) * 100);

            // Clamp between 15% and 100%
            if (newPercent < 15) newPercent = 15;
            if (newPercent > 100) newPercent = 100;

            updateAttributes({ width: `${newPercent}%` });
        };

        const handleMouseUp = () => {
            setIsResizing(false);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };

    return (
        <NodeViewWrapper
            ref={containerRef}
            className={`relative my-6 flex ${getAlignmentClass()} group select-none`}
        >
            <div
                className={`relative inline-block transition-all duration-150 ${
                    selected ? 'ring-2 ring-indigo-500 rounded-2xl shadow-xl' : ''
                }`}
                style={{ width: width, maxWidth: '100%' }}
            >
                {/* Image Element */}
                <img
                    ref={imageRef}
                    src={src}
                    alt={alt || ''}
                    title={title || ''}
                    data-align={alignment}
                    className="w-full h-auto rounded-xl object-cover shadow-sm border border-slate-200 dark:border-slate-800 transition-all block pointer-events-auto"
                />

                {/* Floating Image Control Toolbar (Visible on selection or hover) */}
                {(selected || isResizing) && (
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1 p-1 bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl backdrop-blur-md text-xs whitespace-nowrap animate-fade-in">
                        {/* Size Presets */}
                        <div className="flex items-center gap-0.5 px-1 border-r border-slate-200 dark:border-slate-800">
                            {['25%', '50%', '75%', '100%'].map((size) => (
                                <button
                                    key={size}
                                    type="button"
                                    onClick={() => setWidthPreset(size)}
                                    className={`px-2 py-1 rounded-lg font-semibold transition-all ${
                                        width === size
                                            ? 'bg-indigo-600 text-white shadow-sm'
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>

                        {/* Alignment Buttons */}
                        <div className="flex items-center gap-0.5 px-1 border-r border-slate-200 dark:border-slate-800">
                            <button
                                type="button"
                                onClick={() => setAlign('left')}
                                title="Rata Kiri"
                                className={`p-1.5 rounded-lg transition-colors ${
                                    alignment === 'left'
                                        ? 'bg-indigo-600 text-white'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            >
                                <AlignLeft className="w-3.5 h-3.5" />
                            </button>
                            <button
                                type="button"
                                onClick={() => setAlign('center')}
                                title="Rata Tengah"
                                className={`p-1.5 rounded-lg transition-colors ${
                                    alignment === 'center'
                                        ? 'bg-indigo-600 text-white'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            >
                                <AlignCenter className="w-3.5 h-3.5" />
                            </button>
                            <button
                                type="button"
                                onClick={() => setAlign('right')}
                                title="Rata Kanan"
                                className={`p-1.5 rounded-lg transition-colors ${
                                    alignment === 'right'
                                        ? 'bg-indigo-600 text-white'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            >
                                <AlignRight className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        {/* Edit Alt Text Button */}
                        <button
                            type="button"
                            onClick={() => {
                                setTempAlt(alt || '');
                                setTempTitle(title || '');
                                setEditAltOpen(!editAltOpen);
                            }}
                            title="Edit Alt Text / Keterangan"
                            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                            <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Image Button */}
                        <button
                            type="button"
                            onClick={deleteNode}
                            title="Hapus Gambar dari Artikel"
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                )}

                {/* Edit Alt & Title Modal Dropdown */}
                {editAltOpen && (
                    <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-40 w-72 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl space-y-2.5 text-xs text-slate-800 dark:text-slate-200">
                        <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
                            <span className="font-bold text-slate-900 dark:text-white">Properti Gambar</span>
                            <button
                                type="button"
                                onClick={() => setEditAltOpen(false)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>
                        <div>
                            <label className="block font-semibold text-slate-500 dark:text-slate-400 mb-1">
                                Teks Alternatif (Alt Text)
                            </label>
                            <input
                                type="text"
                                value={tempAlt}
                                onChange={(e) => setTempAlt(e.target.value)}
                                placeholder="Deskripsi untuk SEO / aksesibilitas"
                                className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:border-indigo-500 text-xs"
                            />
                        </div>
                        <div>
                            <label className="block font-semibold text-slate-500 dark:text-slate-400 mb-1">
                                Judul / Keterangan (Title)
                            </label>
                            <input
                                type="text"
                                value={tempTitle}
                                onChange={(e) => setTempTitle(e.target.value)}
                                placeholder="Teks keterangan saat kursor diarahkan"
                                className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:border-indigo-500 text-xs"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleSaveMeta}
                            className="w-full py-1.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                        >
                            <Check className="w-3.5 h-3.5" />
                            <span>Terapkan</span>
                        </button>
                    </div>
                )}

                {/* Corner Drag Resize Handles */}
                {selected && (
                    <>
                        <div
                            onMouseDown={(e) => handleMouseDown(e, 'left')}
                            className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3.5 h-7 bg-indigo-600 rounded-full cursor-ew-resize shadow-md hover:scale-125 transition-transform z-20 flex items-center justify-center border border-white"
                            title="Tarik untuk ubah lebar"
                        />
                        <div
                            onMouseDown={(e) => handleMouseDown(e, 'right')}
                            className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3.5 h-7 bg-indigo-600 rounded-full cursor-ew-resize shadow-md hover:scale-125 transition-transform z-20 flex items-center justify-center border border-white"
                            title="Tarik untuk ubah lebar"
                        />
                    </>
                )}
            </div>
        </NodeViewWrapper>
    );
}


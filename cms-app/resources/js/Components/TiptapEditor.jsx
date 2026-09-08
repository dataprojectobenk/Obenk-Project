import React, { useState } from 'react';
import { useEditor, EditorContent, ReactNodeViewRenderer } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import MediaPickerModal from './MediaPickerModal';
import ResizableImageNode from './ResizableImageNode';
import {
    Bold,
    Italic,
    Strikethrough,
    Code,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Quote,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    Link as LinkIcon,
    Image as ImageIcon,
    Undo,
    Redo,
    Minus,
} from 'lucide-react';

// Custom Image Extension with attributes & Resizable React NodeView
const CustomImageExtension = Image.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            width: {
                default: '100%',
                parseHTML: (element) => element.getAttribute('width') || element.style.width || '100%',
                renderHTML: (attributes) => ({
                    width: attributes.width,
                    style: `width: ${attributes.width}; max-width: 100%;`,
                }),
            },
            alignment: {
                default: 'center',
                parseHTML: (element) => element.getAttribute('data-align') || 'center',
                renderHTML: (attributes) => ({
                    'data-align': attributes.alignment,
                }),
            },
            alt: {
                default: null,
                parseHTML: (element) => element.getAttribute('alt'),
                renderHTML: (attributes) => ({
                    alt: attributes.alt,
                }),
            },
            title: {
                default: null,
                parseHTML: (element) => element.getAttribute('title'),
                renderHTML: (attributes) => ({
                    title: attributes.title,
                }),
            },
        };
    },
    addNodeView() {
        return ReactNodeViewRenderer(ResizableImageNode);
    },
});

export default function TiptapEditor({
    value = '',
    onChange,
    placeholder = 'Tuliskan isi artikel konten di sini...',
}) {
    const [mediaModalOpen, setMediaModalOpen] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3, 4],
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-indigo-600 dark:text-indigo-400 hover:underline',
                },
            }),
            CustomImageExtension,
            Placeholder.configure({
                placeholder,
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            if (onChange) {
                onChange(editor.getHTML());
            }
        },
        editorProps: {
            attributes: {
                class: 'prose prose-slate dark:prose-invert prose-indigo max-w-none min-h-[380px] p-4 sm:p-6 focus:outline-none text-slate-800 dark:text-slate-200 leading-relaxed text-base',
            },
        },
    });

    if (!editor) {
        return (
            <div className="h-64 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 rounded-2xl animate-pulse" />
        );
    }

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('Masukkan URL Link:', previousUrl);

        if (url === null) {
            return;
        }

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    const handleInsertMedia = (media) => {
        const url = media.url || `/storage/${media.file_path}`;
        editor.chain().focus().setImage({
            src: url,
            alt: media.alt_text || media.original_name,
            title: media.caption || media.original_name,
            width: '100%',
            alignment: 'center',
        }).run();
    };

    const ToolbarButton = ({ onClick, isActive, disabled, children, title }) => (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800/80'
            } disabled:opacity-30 disabled:cursor-not-allowed`}
        >
            {children}
        </button>
    );

    return (
        <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm focus-within:border-indigo-500 transition-colors">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-50/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 backdrop-blur-md overflow-x-auto">
                {/* Text Formatting */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive('bold')}
                    title="Tebal (Ctrl+B)"
                >
                    <Bold className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive('italic')}
                    title="Miring (Ctrl+I)"
                >
                    <Italic className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    isActive={editor.isActive('strike')}
                    title="Coret"
                >
                    <Strikethrough className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    isActive={editor.isActive('code')}
                    title="Kode Baris"
                >
                    <Code className="w-4 h-4" />
                </ToolbarButton>

                <div className="w-[1px] h-5 bg-slate-200 dark:bg-slate-800 mx-1" />

                {/* Headings */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    isActive={editor.isActive('heading', { level: 1 })}
                    title="Judul 1 (H1)"
                >
                    <Heading1 className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive('heading', { level: 2 })}
                    title="Judul 2 (H2)"
                >
                    <Heading2 className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    isActive={editor.isActive('heading', { level: 3 })}
                    title="Judul 3 (H3)"
                >
                    <Heading3 className="w-4 h-4" />
                </ToolbarButton>

                <div className="w-[1px] h-5 bg-slate-200 dark:bg-slate-800 mx-1" />

                {/* Lists & Quotes */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive('bulletList')}
                    title="Daftar Poin"
                >
                    <List className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive('orderedList')}
                    title="Daftar Angka"
                >
                    <ListOrdered className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    isActive={editor.isActive('blockquote')}
                    title="Kutipan"
                >
                    <Quote className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                    title="Garis Pemisah"
                >
                    <Minus className="w-4 h-4" />
                </ToolbarButton>

                <div className="w-[1px] h-5 bg-slate-200 dark:bg-slate-800 mx-1" />

                {/* Alignment */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    isActive={editor.isActive({ textAlign: 'left' })}
                    title="Rata Kiri"
                >
                    <AlignLeft className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    isActive={editor.isActive({ textAlign: 'center' })}
                    title="Rata Tengah"
                >
                    <AlignCenter className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    isActive={editor.isActive({ textAlign: 'right' })}
                    title="Rata Kanan"
                >
                    <AlignRight className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                    isActive={editor.isActive({ textAlign: 'justify' })}
                    title="Rata Kanan Kiri"
                >
                    <AlignJustify className="w-4 h-4" />
                </ToolbarButton>

                <div className="w-[1px] h-5 bg-slate-200 dark:bg-slate-800 mx-1" />

                {/* Link & Media */}
                <ToolbarButton
                    onClick={setLink}
                    isActive={editor.isActive('link')}
                    title="Sisipkan Tautan"
                >
                    <LinkIcon className="w-4 h-4" />
                </ToolbarButton>
                <button
                    type="button"
                    onClick={() => setMediaModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/20 transition-colors"
                    title="Sisipkan Gambar dari Media"
                >
                    <ImageIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">Media</span>
                </button>

                <div className="w-[1px] h-5 bg-slate-200 dark:bg-slate-800 mx-1 ml-auto" />

                {/* History */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    title="Urungkan (Ctrl+Z)"
                >
                    <Undo className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    title="Ulangi (Ctrl+Y)"
                >
                    <Redo className="w-4 h-4" />
                </ToolbarButton>
            </div>

            {/* Editor Content Canvas */}
            <div className="min-h-[380px] bg-white dark:bg-slate-900/40 cursor-text" onClick={() => editor.chain().focus()}>
                <EditorContent editor={editor} />
            </div>

            {/* Media Picker Modal */}
            <MediaPickerModal
                isOpen={mediaModalOpen}
                onClose={() => setMediaModalOpen(false)}
                onSelect={handleInsertMedia}
                title="Pilih Gambar untuk Konten Artikel"
            />
        </div>
    );
}

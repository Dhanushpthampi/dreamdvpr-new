'use client';

import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import {
    FaBold,
    FaItalic,
    FaStrikethrough,
    FaListUl,
    FaListOl,
    FaQuoteRight,
    FaCode,
    FaHeading,
    FaLink,
    FaImage,
    FaUndo,
    FaRedo
} from 'react-icons/fa';

const RichTextEditor = ({ value, onChange, placeholder = 'Write your content here...' }) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3, 4, 5, 6],
                },
                paragraph: {
                    HTMLAttributes: {
                        class: 'tiptap-paragraph',
                    },
                },
            }),
            Image.configure({
                inline: true,
                allowBase64: true,
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-[#c53030] underline',
                },
            }),
        ],
        content: value || '',
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-lg max-w-none focus:outline-none',
            },
            handleKeyDown: (view, event) => {
                // Shift+Enter creates a hard break (line break)
                if (event.key === 'Enter' && event.shiftKey) {
                    event.preventDefault();
                    editor.chain().focus().setHardBreak().run();
                    return true;
                }
                // Enter creates a new paragraph (default behavior)
                return false;
            },
        },
        immediatelyRender: false,
    });

    // Update editor content when value prop changes externally
    useEffect(() => {
        if (editor && value !== undefined) {
            const currentContent = editor.getHTML();
            if (value !== currentContent) {
                editor.commands.setContent(value || '', false);
            }
        }
    }, [value, editor]);

    if (!editor) {
        return null;
    }

    const addImage = () => {
        const url = window.prompt('Enter image URL:');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    const addLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        let url = window.prompt('Enter URL:', previousUrl);

        if (url === null) {
            return;
        }

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        // Ensure absolute URL if it doesn't look like an internal link
        if (url && !url.startsWith('http') && !url.startsWith('/') && !url.startsWith('#') && !url.startsWith('mailto:')) {
            url = `https://${url}`;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    const ToolbarButton = ({ onClick, isActive, disabled, ariaLabel, children }) => (
        <button
            onClick={onClick}
            disabled={disabled}
            aria-label={ariaLabel}
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${isActive ? 'bg-[#c53030]/10 text-[#c53030]' : 'text-gray-600'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            {children}
        </button>
    );

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
            <style jsx global>{`
                .tiptap {
                    min-height: 400px;
                    padding: 1rem;
                    font-size: 16px;
                    line-height: 1.6;
                    outline: none;
                }
                .tiptap p.is-editor-empty:first-child::before {
                    color: #86868b;
                    content: attr(data-placeholder);
                    float: left;
                    height: 0;
                    pointer-events: none;
                }
                .tiptap h1 {
                    font-size: 2.5rem;
                    font-weight: bold;
                    margin-top: 1.5rem;
                    margin-bottom: 1rem;
                }
                .tiptap h2 {
                    font-size: 2rem;
                    font-weight: bold;
                    margin-top: 1.5rem;
                    margin-bottom: 1rem;
                }
                .tiptap h3 {
                    font-size: 1.5rem;
                    font-weight: bold;
                    margin-top: 1.5rem;
                    margin-bottom: 1rem;
                }
                .tiptap h4 {
                    font-size: 1.25rem;
                    font-weight: bold;
                    margin-top: 1.5rem;
                    margin-bottom: 1rem;
                }
                .tiptap h5 {
                    font-size: 1.125rem;
                    font-weight: bold;
                    margin-top: 1.5rem;
                    margin-bottom: 1rem;
                }
                .tiptap h6 {
                    font-size: 1rem;
                    font-weight: bold;
                    margin-top: 1.5rem;
                    margin-bottom: 1rem;
                }
                .tiptap p {
                    margin-bottom: 0.5rem;
                }
                .tiptap p:last-child {
                    margin-bottom: 0;
                }
                .tiptap br {
                    line-height: 1.6;
                }
                .tiptap ul {
                    padding-left: 1.5rem;
                    margin-bottom: 1rem;
                    list-style-type: disc;
                    list-style-position: outside;
                }
                .tiptap ol {
                    padding-left: 1.5rem;
                    margin-bottom: 1rem;
                    list-style-type: decimal;
                    list-style-position: outside;
                }
                .tiptap li {
                    margin-bottom: 0.5rem;
                    display: list-item;
                }
                .tiptap blockquote {
                    border-left: 4px solid #c53030;
                    padding-left: 1rem;
                    padding-top: 0.5rem;
                    padding-bottom: 0.5rem;
                    margin: 1rem 0;
                    font-style: italic;
                    background-color: #f7fafc;
                }
                .tiptap code {
                    background-color: #edf2f7;
                    padding: 0.25rem 0.5rem;
                    border-radius: 0.25rem;
                    font-size: 0.875rem;
                    font-family: 'Courier New', monospace;
                }
                .tiptap pre {
                    background-color: #1a202c;
                    color: #f7fafc;
                    padding: 1rem;
                    border-radius: 0.5rem;
                    overflow-x: auto;
                    margin: 1rem 0;
                }
                .tiptap pre code {
                    background-color: transparent;
                    color: inherit;
                    padding: 0;
                }
                .tiptap img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 0.5rem;
                    margin: 1rem 0;
                }
                .tiptap a {
                    color: #c53030;
                    text-decoration: underline;
                }
                .tiptap a:hover {
                    color: #008c8e;
                }
                .tiptap strong {
                    font-weight: bold;
                }
                .tiptap em {
                    font-style: italic;
                }
            `}</style>

            {/* Toolbar */}
            <div className="bg-gray-50 p-2 border-b border-gray-200">
                <div className="flex gap-2 flex-wrap">
                    {/* Text Formatting */}
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        isActive={editor.isActive('bold')}
                        ariaLabel="Bold"
                    >
                        <FaBold />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        isActive={editor.isActive('italic')}
                        ariaLabel="Italic"
                    >
                        <FaItalic />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        isActive={editor.isActive('strike')}
                        ariaLabel="Strikethrough"
                    >
                        <FaStrikethrough />
                    </ToolbarButton>

                    {/* Headings */}
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        isActive={editor.isActive('heading', { level: 1 })}
                        ariaLabel="Heading 1"
                    >
                        <FaHeading /> 1
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        isActive={editor.isActive('heading', { level: 2 })}
                        ariaLabel="Heading 2"
                    >
                        <FaHeading /> 2
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        isActive={editor.isActive('heading', { level: 3 })}
                        ariaLabel="Heading 3"
                    >
                        <FaHeading /> 3
                    </ToolbarButton>

                    {/* Lists */}
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        isActive={editor.isActive('bulletList')}
                        ariaLabel="Bullet List"
                    >
                        <FaListUl />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        isActive={editor.isActive('orderedList')}
                        ariaLabel="Ordered List"
                    >
                        <FaListOl />
                    </ToolbarButton>

                    {/* Blockquote */}
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        isActive={editor.isActive('blockquote')}
                        ariaLabel="Blockquote"
                    >
                        <FaQuoteRight />
                    </ToolbarButton>

                    {/* Code */}
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleCode().run()}
                        isActive={editor.isActive('code')}
                        ariaLabel="Inline Code"
                    >
                        <FaCode />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                        isActive={editor.isActive('codeBlock')}
                        ariaLabel="Code Block"
                    >
                        <FaCode /> Block
                    </ToolbarButton>

                    {/* Links and Images */}
                    <ToolbarButton
                        onClick={addLink}
                        ariaLabel="Add Link"
                    >
                        <FaLink />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={addImage}
                        ariaLabel="Add Image"
                    >
                        <FaImage />
                    </ToolbarButton>

                    {/* Undo/Redo */}
                    <ToolbarButton
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().undo()}
                        ariaLabel="Undo"
                    >
                        <FaUndo />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().redo()}
                        ariaLabel="Redo"
                    >
                        <FaRedo />
                    </ToolbarButton>
                </div>
            </div>

            {/* Editor Content */}
            <div className="bg-white">
                <EditorContent
                    editor={editor}
                    data-placeholder={placeholder}
                />
            </div>
        </div>
    );
};

export default RichTextEditor;

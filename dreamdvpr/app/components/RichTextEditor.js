'use client';

import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { Box, Button, HStack } from '@chakra-ui/react';
import { 
    FaBold, 
    FaItalic, 
    FaUnderline, 
    FaStrikethrough, 
    FaListUl, 
    FaListOl,
    FaQuoteRight,
    FaCode,
    FaHeading,
    FaLink,
    FaImage,
    FaAlignLeft,
    FaAlignCenter,
    FaAlignRight,
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
                    class: 'text-brand-500 underline',
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
        const url = window.prompt('Enter URL:', previousUrl);
        
        if (url === null) {
            return;
        }
        
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }
        
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    return (
        <Box border="1px solid" borderColor="gray.200" borderRadius="md" overflow="hidden">
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
                    border-left: 4px solid #00abad;
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
                    color: #00abad;
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
            <Box bg="gray.50" p={2} borderBottom="1px solid" borderColor="gray.200">
                <HStack spacing={2} flexWrap="wrap">
                    {/* Text Formatting */}
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        isActive={editor.isActive('bold')}
                        _active={editor.isActive('bold') ? { bg: 'brand.100', color: 'brand.600' } : {}}
                        aria-label="Bold"
                    >
                        <FaBold />
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        isActive={editor.isActive('italic')}
                        _active={editor.isActive('italic') ? { bg: 'brand.100', color: 'brand.600' } : {}}
                        aria-label="Italic"
                    >
                        <FaItalic />
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        isActive={editor.isActive('strike')}
                        _active={editor.isActive('strike') ? { bg: 'brand.100', color: 'brand.600' } : {}}
                        aria-label="Strikethrough"
                    >
                        <FaStrikethrough />
                    </Button>
                    
                    {/* Headings */}
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        isActive={editor.isActive('heading', { level: 1 })}
                        _active={editor.isActive('heading', { level: 1 }) ? { bg: 'brand.100', color: 'brand.600' } : {}}
                        aria-label="Heading 1"
                    >
                        <FaHeading /> 1
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        isActive={editor.isActive('heading', { level: 2 })}
                        _active={editor.isActive('heading', { level: 2 }) ? { bg: 'brand.100', color: 'brand.600' } : {}}
                        aria-label="Heading 2"
                    >
                        <FaHeading /> 2
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        isActive={editor.isActive('heading', { level: 3 })}
                        _active={editor.isActive('heading', { level: 3 }) ? { bg: 'brand.100', color: 'brand.600' } : {}}
                        aria-label="Heading 3"
                    >
                        <FaHeading /> 3
                    </Button>
                    
                    {/* Lists */}
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        isActive={editor.isActive('bulletList')}
                        _active={editor.isActive('bulletList') ? { bg: 'brand.100', color: 'brand.600' } : {}}
                        aria-label="Bullet List"
                    >
                        <FaListUl />
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        isActive={editor.isActive('orderedList')}
                        _active={editor.isActive('orderedList') ? { bg: 'brand.100', color: 'brand.600' } : {}}
                        aria-label="Ordered List"
                    >
                        <FaListOl />
                    </Button>
                    
                    {/* Blockquote */}
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        isActive={editor.isActive('blockquote')}
                        _active={editor.isActive('blockquote') ? { bg: 'brand.100', color: 'brand.600' } : {}}
                        aria-label="Blockquote"
                    >
                        <FaQuoteRight />
                    </Button>
                    
                    {/* Code */}
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => editor.chain().focus().toggleCode().run()}
                        isActive={editor.isActive('code')}
                        _active={editor.isActive('code') ? { bg: 'brand.100', color: 'brand.600' } : {}}
                        aria-label="Inline Code"
                    >
                        <FaCode />
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                        isActive={editor.isActive('codeBlock')}
                        _active={editor.isActive('codeBlock') ? { bg: 'brand.100', color: 'brand.600' } : {}}
                        aria-label="Code Block"
                    >
                        <FaCode /> Block
                    </Button>
                    
                    {/* Links and Images */}
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={addLink}
                        aria-label="Add Link"
                    >
                        <FaLink />
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={addImage}
                        aria-label="Add Image"
                    >
                        <FaImage />
                    </Button>
                    
                    {/* Undo/Redo */}
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => editor.chain().focus().undo().run()}
                        isDisabled={!editor.can().undo()}
                        aria-label="Undo"
                    >
                        <FaUndo />
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => editor.chain().focus().redo().run()}
                        isDisabled={!editor.can().redo()}
                        aria-label="Redo"
                    >
                        <FaRedo />
                    </Button>
                </HStack>
            </Box>
            
            {/* Editor Content */}
            <Box bg="white">
                <EditorContent 
                    editor={editor} 
                    data-placeholder={placeholder}
                />
            </Box>
        </Box>
    );
};

export default RichTextEditor;

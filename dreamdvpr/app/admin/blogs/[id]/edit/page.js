'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { AdminSidebarWrapper } from '../../../../components/AdminSidebar';
import GlassCard from '../../../../components/GlassCard';
import ThemedInput from '../../../../components/ThemedInput';
import ThemedSelect from '../../../../components/ThemedSelect';
import ThemedButton from '../../../../components/ThemedButton';
import RichTextEditor from '../../../../components/RichTextEditor';

const CATEGORIES = [
    { value: 'Design', label: 'Design' },
    { value: 'Development', label: 'Development' },
    { value: 'Strategy', label: 'Strategy' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Business', label: 'Business' },
];

export default function EditBlogPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const params = useParams();
    const [toast, setToast] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [blogData, setBlogData] = useState({
        title: '',
        content: '',
        excerpt: '',
        category: '',
        imageUrl: '',
        published: false,
    });

    const showToast = (title, description, type = 'success') => {
        setToast({ title, description, type });
        setTimeout(() => setToast(null), 3000);
    };

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated') {
            if (session?.user?.role !== 'admin') {
                router.push('/login');
            } else {
                fetchBlog();
            }
        }
    }, [status, session, router, params.id]);

    const fetchBlog = async () => {
        try {
            const res = await fetch(`/api/blogs/${params.id}`);
            if (res.ok) {
                const data = await res.json();
                setBlogData({
                    title: data.blog.title || '',
                    content: data.blog.content || '',
                    excerpt: data.blog.excerpt || '',
                    category: data.blog.category || '',
                    imageUrl: data.blog.imageUrl || '',
                    published: data.blog.published || false,
                });
            } else {
                showToast('Error', 'Blog not found', 'error');
                router.push('/admin/blogs');
            }
        } catch (error) {
            console.error('Error fetching blog:', error);
            showToast('Error', 'Failed to fetch blog', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!blogData.title || !blogData.content || !blogData.category) {
            showToast('Missing fields', 'Title, content, and category are required', 'error');
            return;
        }

        setSaving(true);
        try {
            const res = await fetch(`/api/blogs/${params.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(blogData),
            });

            const data = await res.json();

            if (res.ok) {
                showToast('Blog updated', 'Blog has been updated successfully', 'success');
                setTimeout(() => router.push('/admin/blogs'), 1000);
            } else {
                throw new Error(data.error || 'Failed to update blog');
            }
        } catch (error) {
            console.error('Error saving blog:', error);
            showToast('Error', error.message || 'Failed to update blog', 'error');
        } finally {
            setSaving(false);
        }
    };

    if (status === 'loading' || loading) {
        return (
            <AdminSidebarWrapper>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-t-[#00abad] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
                </div>
            </AdminSidebarWrapper>
        );
    }

    return (
        <AdminSidebarWrapper>
            <div className="container mx-auto max-w-7xl px-4 py-8">
                <div className="flex flex-col gap-8">
                    {/* Header */}
                    <div className="flex justify-between items-center flex-wrap gap-4">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-2" style={{ color: '#1d1d1f' }}>
                                Edit Blog Post
                            </h1>
                            <p className="text-lg" style={{ color: '#86868b' }}>
                                Update your blog post content and settings
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <ThemedButton
                                variant="outline"
                                onClick={() => router.push('/admin/blogs')}
                            >
                                Cancel
                            </ThemedButton>
                            <ThemedButton
                                variant="primary"
                                onClick={handleSave}
                                isLoading={saving}
                            >
                                Save Changes
                            </ThemedButton>
                        </div>
                    </div>

                    {/* Form */}
                    <GlassCard p={8}>
                        <div className="flex flex-col gap-6">
                            <ThemedInput
                                label="Title"
                                value={blogData.title}
                                onChange={(e) => setBlogData({ ...blogData, title: e.target.value })}
                                required
                            />
                            <ThemedSelect
                                label="Category"
                                value={blogData.category}
                                onChange={(e) => setBlogData({ ...blogData, category: e.target.value })}
                                options={CATEGORIES}
                                required
                            />
                            <ThemedInput
                                label="Image URL"
                                value={blogData.imageUrl}
                                onChange={(e) => setBlogData({ ...blogData, imageUrl: e.target.value })}
                                placeholder="https://example.com/image.jpg"
                            />
                            <ThemedInput
                                label="Excerpt"
                                type="textarea"
                                value={blogData.excerpt}
                                onChange={(e) => setBlogData({ ...blogData, excerpt: e.target.value })}
                                rows={3}
                                placeholder="A brief summary of your blog post..."
                            />
                            <div>
                                <p className="text-sm font-medium mb-2" style={{ color: '#1d1d1f' }}>
                                    Content <span className="text-red-500">*</span>
                                </p>
                                <p className="text-xs mb-2" style={{ color: '#86868b' }}>
                                    Tip: Press Enter for a new paragraph, Shift+Enter for a line break
                                </p>
                                <RichTextEditor
                                    value={blogData.content}
                                    onChange={(value) => setBlogData({ ...blogData, content: value })}
                                    placeholder="Write your blog content here. You can format text, add headings, images, code blocks, and more..."
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <label className="text-sm font-medium" style={{ color: '#1d1d1f' }}>Published</label>
                                <input
                                    type="checkbox"
                                    checked={blogData.published}
                                    onChange={(e) => setBlogData({ ...blogData, published: e.target.checked })}
                                    className="w-5 h-5 rounded border-gray-300 text-[#00abad] focus:ring-[#00abad]"
                                />
                            </div>
                        </div>
                    </GlassCard>
                </div>
            </div>

            {/* Toast Notification */}
            {toast && (
                <div className={`fixed top-4 right-4 px-6 py-4 rounded-lg shadow-lg z-[3000] ${
                    toast.type === 'error' ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-green-50 border border-green-200 text-green-700'
                }`}>
                    <div className="flex items-center gap-2">
                        {toast.type === 'error' ? (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        )}
                        <div>
                            <p className="font-semibold">{toast.title}</p>
                            {toast.description && <p className="text-sm">{toast.description}</p>}
                        </div>
                    </div>
                </div>
            )}
        </AdminSidebarWrapper>
    );
}

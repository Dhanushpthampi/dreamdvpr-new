'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AdminSidebarWrapper } from '@/app/components/admin/AdminSidebar';
import GlassCard from '@/app/components/ui/GlassCard';

export default function BlogManagementPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useState([]);
    const [toast, setToast] = useState(null);

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
                fetchBlogs();
            }
        }
    }, [status, session, router]);

    const fetchBlogs = async () => {
        try {
            const res = await fetch('/api/blogs');
            const data = await res.json();
            setBlogs(data.blogs || []);
        } catch (error) {
            console.error('Error fetching blogs:', error);
            showToast('Error', 'Failed to fetch blogs', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        router.push('/admin/blogs/new');
    };

    const handleDelete = async (blogId) => {
        if (!window.confirm('Are you sure you want to delete this blog?')) return;

        try {
            const res = await fetch(`/api/blogs/${blogId}`, {
                method: 'DELETE',
            });

            const data = await res.json();

            if (res.ok) {
                showToast('Blog deleted', 'Blog has been deleted successfully', 'success');
                fetchBlogs();
            } else {
                throw new Error(data.error || 'Failed to delete blog');
            }
        } catch (error) {
            console.error('Error deleting blog:', error);
            showToast('Error', error.message || 'Failed to delete blog', 'error');
        }
    };

    if (status === 'loading' || loading) {
        return (
            <AdminSidebarWrapper>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-t-[#1d1d1f] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
                </div>
            </AdminSidebarWrapper>
        );
    }

    return (
        <AdminSidebarWrapper>
            <div className="container mx-auto max-w-7xl px-4 py-8">
                <div className="flex flex-col gap-8">
                    <div className="flex justify-between items-center flex-wrap gap-4">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-2" style={{ color: '#1d1d1f' }}>
                                Blog Management
                            </h1>
                            <p className="text-lg" style={{ color: '#86868b' }}>
                                Create and manage blog posts
                            </p>
                        </div>
                        <button
                            onClick={handleCreate}
                            className="px-4 py-2 bg-[#1d1d1f] text-white rounded-lg hover:bg-black transition-colors flex items-center gap-2"
                        >
                            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                            </svg>
                            New Blog Post
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {blogs.map((blog) => (
                            <GlassCard key={blog._id} p={6} className="flex flex-col">
                                <div className="flex flex-col items-start gap-4">
                                    <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100">
                                        {blog.imageUrl ? (
                                            <img
                                                src={blog.imageUrl}
                                                alt={blog.title}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'flex';
                                                }}
                                            />
                                        ) : null}
                                        <div className={`w-full h-full ${blog.imageUrl ? 'hidden' : 'flex'} items-center justify-center bg-gray-200`}>
                                            <svg viewBox="0 0 24 24" className="w-12 h-12 text-gray-400" fill="currentColor">
                                                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                                            </svg>
                                        </div>
                                        {blog.published && (
                                            <span className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
                                                Published
                                            </span>
                                        )}
                                    </div>
                                    <div className="w-full">
                                        <p className="text-xs mb-1" style={{ color: '#86868b' }}>
                                            {blog.category} • {new Date(blog.createdAt).toLocaleDateString()}
                                        </p>
                                        <h3 className="text-base font-semibold mb-2 line-clamp-2" style={{ color: '#1d1d1f' }}>
                                            {blog.title}
                                        </h3>
                                        <p className="text-sm line-clamp-2" style={{ color: '#86868b' }}>
                                            {blog.excerpt || 'No excerpt provided'}
                                        </p>
                                    </div>
                                    <div className="flex gap-2 w-full">
                                        <button
                                            onClick={() => router.push(`/admin/blogs/${blog._id}/edit`)}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(blog._id)}
                                            className="flex-1 px-3 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors text-sm"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </GlassCard>
                        ))}
                    </div>

                    {blogs.length === 0 && (
                        <GlassCard p={12} className="text-center">
                            <div className="flex flex-col items-center gap-4">
                                <svg viewBox="0 0 24 24" className="w-16 h-16 text-gray-300" fill="currentColor">
                                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                                </svg>
                                <p style={{ color: '#86868b' }}>No blog posts yet. Create your first one!</p>
                            </div>
                        </GlassCard>
                    )}
                </div>
            </div>

            {/* Toast Notification */}
            {toast && (
                <div className={`fixed top-4 right-4 px-6 py-4 rounded-lg shadow-lg z-[3000] ${toast.type === 'error' ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-green-50 border border-green-200 text-green-700'
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

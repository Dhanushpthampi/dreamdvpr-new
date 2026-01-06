'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/homepage/Header';
import Footer from '../../components/homepage/Footer';

const colorMap = {
    'Design': 'purple',
    'Development': 'green',
    'Strategy': 'orange',
    'Marketing': 'blue',
    'Business': 'teal',
};

export default function BlogDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            fetchBlog();
        }
    }, [params.id]);

    const fetchBlog = async () => {
        try {
            const res = await fetch(`/api/blogs/${params.id}`);
            if (res.ok) {
                const data = await res.json();
                setBlog(data.blog);
            } else {
                router.push('/blog');
            }
        } catch (error) {
            console.error('Error fetching blog:', error);
            router.push('/blog');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg-app, #f5f5f7)' }}>
                <div className="w-12 h-12 border-4 border-t-[var(--color-brand-500)] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!blog) {
        return null;
    }

    const color = colorMap[blog.category] || 'gray';

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg-app, #f5f5f7)' }}>
            <Header />
            <div className="pt-24 pb-16">
                <div className="container mx-auto max-w-3xl px-4">
                    <div className="flex flex-col gap-8">
                        <button
                            onClick={() => router.push('/blog')}
                            className="self-start flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors hover:text-[var(--color-brand-500)]"
                            style={{ color: 'var(--color-text-secondary, #86868b)' }}
                        >
                            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                            </svg>
                            Back to Blog
                        </button>

                        <div className="flex flex-col gap-6">
                            <div className="flex items-center gap-3">
                                <span
                                    className="px-3 py-1 text-sm font-bold uppercase rounded"
                                    style={{
                                        backgroundColor: `var(--color-${color}-100, rgba(0, 0, 0, 0.1))`,
                                        color: `var(--color-${color}-700, #1d1d1f)`,
                                    }}
                                >
                                    {blog.category}
                                </span>
                                <span className="text-sm" style={{ color: '#6b7280' }}>•</span>
                                <span className="text-sm" style={{ color: '#6b7280' }}>
                                    {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-bold" style={{ color: 'var(--color-text-main, #1d1d1f)' }}>
                                {blog.title}
                            </h1>

                            {blog.imageUrl && (
                                <div
                                    className="h-96 rounded-2xl overflow-hidden bg-cover bg-center"
                                    style={{ backgroundImage: `url(${blog.imageUrl})` }}
                                />
                            )}

                            <div
                                className="blog-content text-lg leading-relaxed prose prose-lg max-w-none"
                                style={{ color: 'var(--color-text-main, #1d1d1f)' }}
                                dangerouslySetInnerHTML={{ __html: blog.content }}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
            <style jsx global>{`
                .blog-content h1,
                .blog-content h2,
                .blog-content h3,
                .blog-content h4,
                .blog-content h5,
                .blog-content h6 {
                    font-weight: bold;
                    margin-top: 1.5rem;
                    margin-bottom: 1rem;
                    color: var(--color-text-main, #1d1d1f);
                }
                .blog-content h1 { font-size: 1.875rem; }
                .blog-content h2 { font-size: 1.5rem; }
                .blog-content h3 { font-size: 1.25rem; }
                .blog-content h4 { font-size: 1.125rem; }
                .blog-content p {
                    margin-bottom: 1rem;
                    line-height: 1.75;
                }
                .blog-content ul {
                    margin-bottom: 1rem;
                    padding-left: 1.5rem;
                    list-style-type: disc;
                    list-style-position: outside;
                }
                .blog-content ol {
                    margin-bottom: 1rem;
                    padding-left: 1.5rem;
                    list-style-type: decimal;
                    list-style-position: outside;
                }
                .blog-content li {
                    margin-bottom: 0.5rem;
                    display: list-item;
                }
                .blog-content ul li::marker {
                    color: var(--color-brand-500, #c53030);
                }
                .blog-content ol li::marker {
                    color: var(--color-brand-500, #c53030);
                    font-weight: bold;
                }
                .blog-content blockquote {
                    border-left: 4px solid var(--color-brand-500, #c53030);
                    padding-left: 1rem;
                    padding-top: 0.5rem;
                    padding-bottom: 0.5rem;
                    margin: 1rem 0;
                    font-style: italic;
                    background-color: #f9fafb;
                }
                .blog-content code {
                    background-color: #f3f4f6;
                    padding: 0.25rem 0.5rem;
                    border-radius: 0.375rem;
                    font-size: 0.875rem;
                    font-family: monospace;
                }
                .blog-content pre {
                    background-color: #111827;
                    color: white;
                    padding: 1rem;
                    border-radius: 0.5rem;
                    overflow-x: auto;
                    margin-bottom: 1rem;
                }
                .blog-content pre code {
                    background-color: transparent;
                    color: inherit;
                    padding: 0;
                }
                .blog-content img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 0.5rem;
                    margin: 1rem 0;
                }
                .blog-content a {
                    color: var(--color-brand-500, #c53030);
                    text-decoration: underline;
                }
                .blog-content a:hover {
                    color: var(--color-brand-600, #008c8e);
                }
            `}</style>
        </div>
    );
}

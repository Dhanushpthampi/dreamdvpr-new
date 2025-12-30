'use client';

import React from 'react';
import Link from 'next/link';
import { useBlogs, useBackgroundColor } from '../../lib/hooks';

const colorMap = {
    'Design': 'purple',
    'Development': 'green',
    'Strategy': 'orange',
    'Marketing': 'blue',
    'Business': 'teal',
};

const BlogCard = ({ blog, category, title, date, color, imageUrl }) => {
    const [hovered, setHovered] = React.useState(false);

    return (
        <Link href={blog?._id ? `/blog/${blog._id}` : '#'} className="block no-underline">
            <div
                className="cursor-pointer group"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                <div
                    className="h-60 rounded-2xl mb-6 relative overflow-hidden transition-all duration-300"
                    style={{
                        backgroundColor: imageUrl ? 'transparent' : undefined,
                        backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        transform: hovered ? 'translateY(-4px)' : 'none',
                        boxShadow: hovered ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none',
                    }}
                />
                <div className="flex items-center gap-3 mb-2">
                    <span
                        className="px-2 py-1 text-xs font-bold uppercase rounded"
                        style={{
                            backgroundColor: `var(--color-${color}-100, rgba(0, 0, 0, 0.1))`,
                            color: `var(--color-${color}-700, #1d1d1f)`,
                        }}
                    >
                        {category}
                    </span>
                    <span className="text-xs font-bold" style={{ color: '#6b7280' }}>•</span>
                    <span className="text-xs font-bold uppercase" style={{ color: '#6b7280' }}>
                        {date}
                    </span>
                </div>
                <h3
                    className="text-lg font-semibold leading-relaxed transition-colors duration-200"
                    style={{
                        color: hovered ? 'var(--color-brand-500, #00abad)' : 'var(--color-text-main, #1d1d1f)',
                    }}
                >
                    {title}
                </h3>
            </div>
        </Link>
    );
};

// Default blogs if no blogs are available
const defaultBlogs = [
    {
        category: 'Design',
        title: 'The Psychology of Minimalist UI',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        color: 'purple',
    },
    {
        category: 'Development',
        title: 'Why React Server Components are the Future',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        color: 'green',
    },
    {
        category: 'Strategy',
        title: 'Converting Visitors into Loyal Customers',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        color: 'orange',
    },
];

const BlogSection = () => {
    const { blogs } = useBlogs({ published: true, limit: 3 });
    const bgColor = useBackgroundColor('secondary');
    const displayBlogs = blogs.length > 0 ? blogs : defaultBlogs;

    return (
        <div className="py-24" id="blog" style={{ backgroundColor: bgColor }}>
            <div className="container mx-auto max-w-7xl px-4">
                <div className="flex justify-between items-end mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold" style={{ color: 'var(--color-text-main, #1d1d1f)' }}>
                        Latest Insights
                    </h2>
                    <Link
                        href="/blog"
                        className="hidden md:block font-bold transition-colors hover:text-[var(--color-brand-600)]"
                        style={{ color: 'var(--color-brand-500, #00abad)' }}
                    >
                        View all articles →
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {displayBlogs.map((blog, index) => (
                        <BlogCard
                            key={blog._id || index}
                            blog={blog}
                            category={blog.category}
                            color={colorMap[blog.category] || blog.color || 'gray'}
                            title={blog.title}
                            date={blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : blog.date}
                            imageUrl={blog.imageUrl}
                        />
                    ))}
                </div>

                <div className="mt-8 text-center md:hidden">
                    <Link
                        href="/blog"
                        className="font-bold transition-colors hover:text-[var(--color-brand-600)]"
                        style={{ color: 'var(--color-brand-500, #00abad)' }}
                    >
                        View all articles →
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BlogSection;

'use client';

import React from 'react';
import Link from 'next/link';
import { useBlogs } from '../../lib/hooks';

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
                    className="h-60 rounded-2xl mb-6 relative overflow-hidden transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-md"
                    style={{
                        backgroundColor: imageUrl ? 'transparent' : undefined,
                        backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                <div className="flex items-center gap-3 mb-2">
                    <span
                        className={`px-2 py-1 text-xs font-bold uppercase rounded bg-${color}-100 text-${color}-700`}
                    >
                        {category}
                    </span>
                    <span className="text-xs font-bold" style={{ color: '#6b7280' }}>•</span>
                    <span className="text-xs font-bold uppercase" style={{ color: '#6b7280' }}>
                        {date}
                    </span>
                </div>
                <h3
                    className="text-lg font-semibold leading-relaxed transition-colors duration-200 group-hover:text-brand-500 text-text-main"
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
    const displayBlogs = blogs.length > 0 ? blogs : defaultBlogs;

    return (
        <div className="py-24 bg-bg-secondary" id="blog">
            <div className="container mx-auto max-w-7xl px-4">
                <div className="flex justify-between items-end mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-text-main">
                        Latest Insights
                    </h2>
                    <Link
                        href="/blog"
                        className="hidden md:block font-bold transition-colors hover:text-brand-600 text-brand-500"
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
                        className="font-bold transition-colors hover:text-brand-600 text-brand-500"
                    >
                        View all articles →
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BlogSection;

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '../components/homepage/Header';
import Footer from '../components/homepage/Footer';
import { hexToRgba } from '../lib/utils/colors';


const colorMap = {
  Design: 'purple',
  Development: 'green',
  Strategy: 'orange',
  Marketing: 'blue',
  Business: 'teal',
};

/* =======================
   Blog Card (Glass)
======================= */
const BlogCard = ({ blog }) => {
  const color = colorMap[blog.category] || 'gray';
  const brandColor = '#e53e3e';

  return (
    <Link href={`/blog/${blog._id}`} className="block no-underline">
      <div
        className="group cursor-pointer bg-white/40 backdrop-blur-[20px] backdrop-saturate-[180%] rounded-2xl overflow-hidden border border-white/30 transition-all duration-300 ease-in-out hover:-translate-y-1.5 shadow-[0_0_18px_rgba(229,62,62,0.12)] hover:shadow-[0_0_28px_rgba(229,62,62,0.22)]"
      >
        {/* Image */}
        <div
          className="h-60 bg-cover bg-center"
          style={{
            backgroundColor: blog.imageUrl ? 'transparent' : undefined,
            backgroundImage: blog.imageUrl ? `url(${blog.imageUrl})` : 'none',
          }}
        />

        {/* Content */}
        <div className="flex flex-col items-start p-6 gap-3">
          <div className="flex items-center gap-3">
            <span
              className="px-2 py-1 text-xs font-bold uppercase rounded"
              style={{
                backgroundColor: `var(--color-${color}-100, rgba(0, 0, 0, 0.1))`,
                color: `var(--color-${color}-700, #1d1d1f)`,
              }}
            >
              {blog.category}
            </span>
            <span className="text-xs font-bold text-text-secondary">
              •
            </span>
            <span
              className="text-xs font-bold uppercase text-text-secondary"
            >
              {new Date(blog.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>

          <h3
            className="text-lg font-semibold leading-relaxed transition-colors duration-200 group-hover:text-brand-500 text-text-main"
          >
            {blog.title}
          </h3>

          <p
            className="text-sm line-clamp-2 text-text-secondary"
          >
            {blog.excerpt}
          </p>
        </div>
      </div>
    </Link>
  );
};

/* =======================
   Blog Page
======================= */
export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const brandColor = '#e53e3e';

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await fetch('/api/blogs?published=true');
      const data = await res.json();
      setBlogs(data.blogs || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-app">
      <Header />

      <div className="pt-24 pb-16 relative">
        <div
          className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50_0%,rgba(229,62,62,0.12),transparent_60%)]"
        />

        <div className="container mx-auto max-w-7xl px-4 relative">
          <div className="flex flex-col gap-12">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-text-main">
                Blog
              </h1>
              <p className="text-lg text-text-secondary">
                Latest insights, tips, and updates from RE<span style={{ display: 'inline-block', transform: 'scaleX(-1)' }}>D</span>gravity
              </p>
            </div>

            {/* Content */}
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block w-12 h-12 border-4 border-t-brand-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
              </div>
            ) : blogs.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-lg text-text-secondary">
                  No blog posts available yet. Check back soon!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map((blog) => (
                  <BlogCard key={blog._id} blog={blog} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

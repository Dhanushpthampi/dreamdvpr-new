import clientPromise from '@/app/lib/db';

export default async function sitemap() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://redgravity.com';

    // Static pages
    const staticPages = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/login`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
    ];

    // Fetch dynamic blog posts
    let blogPosts = [];
    try {
        const client = await clientPromise;
        const db = client.db('dreamdvpr');

        const blogs = await db
            .collection('blogs')
            .find({ published: true })
            .sort({ createdAt: -1 })
            .toArray();

        blogPosts = blogs.map((blog) => ({
            url: `${baseUrl}/blog/${blog._id}`,
            lastModified: new Date(blog.updatedAt || blog.createdAt),
            changeFrequency: 'monthly',
            priority: 0.7,
        }));
    } catch (error) {
        console.error('Error fetching blogs for sitemap:', error);
    }

    return [...staticPages, ...blogPosts];
}

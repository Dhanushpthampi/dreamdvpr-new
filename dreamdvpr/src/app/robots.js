export default function robots() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://redgravity.com';

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin/', '/client/', '/api/'],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}

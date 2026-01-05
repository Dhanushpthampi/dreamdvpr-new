export default function robots() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://redgravity.in';

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin/', '/client/', '/api/', '/login/'],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}

import clientPromise from "./db";

// Server-side function to get content (used in layouts/pages)
export async function getContent() {
    try {
        const client = await clientPromise;
        const db = client.db("dreamdvpr");

        const content = await db.collection("homepage_content").findOne({ type: 'homepage' });

        if (!content) {
            // Return default content
            return {
                hero: {
                    title: "Explore the Future of Web",
                    titleHighlight: "Future of Web",
                    subtitle: "DREAMdvpr crafts digital experiences that are out of this world. Clean, precise, and engineered for performance.",
                    ctaText: "Start Mission",
                },
                services: {
                    title: "Our Expertise",
                    subtitle: "A comprehensive suite of digital services designed to elevate your brand.",
                    items: [],
                },
                whyChooseUs: {
                    title: "Why leading brands choose DREAMdvpr.",
                    titleHighlight: "DREAMdvpr",
                    subtitle: "We don't just write code; we engineer experiences. Our obsessive attention to detail and performance optimization ensures your digital product stands out in a crowded market.",
                    points: [],
                },
                comparison: {
                    title: "The Difference is Clear",
                    subtitle: "Stop settling for average. Upgrade to premium.",
                    traditionalPoints: [],
                    ourPoints: [],
                },
                faq: {
                    title: "Common Questions",
                    subtitle: "Everything you need to know about working with us.",
                    items: [],
                },
                cta: {
                    title: "Ready to Transform Your Business with DREAMdvpr?",
                    subtitle: "Your Trusted Partner for Transformative Digital Solutions",
                    buttonText: "Book a Call today!",
                    points: [],
                },
                    theme: {
                        colors: {
                            brand500: '#00abad',
                            brand600: '#008c8e',
                            accent500: '#ff0000ff',
                            bgApp: '#f5f5f7',
                            bgSecondary: '#ffffff',
                            textMain: '#1d1d1f',
                            textSecondary: '#86868b',
                        },
                    fonts: {
                        heading: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
                        body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
                    },
                    borderRadius: 'xl',
                    logo: '',
                },
            };
        }

        return content.data;
    } catch (error) {
        console.error('Error fetching content:', error);
        return null;
    }
}

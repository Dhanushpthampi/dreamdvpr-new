/**
 * Content management - Single source of truth for content defaults, normalization, and fetching
 */




export const DEFAULT_CONTENT = {
    hero: {
        title: "Explore the Future of Web",
        titleHighlight: "Future of Web",
        subtitle: "REDgravity crafts digital experiences that are out of this world. Clean, precise, and engineered for performance.",
        ctaText: "Start Mission",
    },
    services: {
        title: "Our Expertise",
        subtitle: "A comprehensive suite of digital services designed to elevate your brand.",
        items: [
            {
                title: "Web & App Development",
                description: "Building the foundations of your digital empire with Next.js, React, and native technologies.",
                media: "/service1.gif",
                colSpan: 2,
                rowSpan: 2,
                iconColor: "brand.500",
            },
            {
                title: "UI/UX Design",
                description: "Interfaces that feel as good as they look.",
                media: "/service2.gif",
                colSpan: 1,
                rowSpan: 1,
                iconColor: "accent.500",
            },
            {
                title: "Brand Strategy",
                description: "Crafting correct narratives.",
                media: "/service3.gif",
                colSpan: 1,
                rowSpan: 1,
                iconColor: "purple.400",
            },
            {
                title: "Performance",
                description: "Speed is a feature.",
                media: "/service4.gif",
                colSpan: 1,
                rowSpan: 1,
                iconColor: "green.400",
            },
            {
                title: "SEO & Growth",
                description: "Data-driven visibility.",
                media: "/service5.gif",
                colSpan: 2,
                rowSpan: 1,
                iconColor: "blue.400",
            },
        ],
    },
    whyChooseUs: {
        title: "Why leading brands choose REDgravity.",
        titleHighlight: "REDgravity",
        subtitle: "We don't just write code; we engineer experiences. Our obsessive attention to detail and performance optimization ensures your digital product stands out in a crowded market.",
        points: [
            "Apple-inspired design philosophy",
            "Performance-first engineering",
            "Conversion-focused user flows",
            "Scalable & maintainable code"
        ],
    },
    comparison: {
        title: "The Difference is Clear",
        subtitle: "Stop settling for average. Upgrade to premium.",
        traditionalPoints: [
            "Generic, template designs",
            "Slow loading & unoptimized",
            "Cluttered user experience",
            "Poor communication"
        ],
        ourPoints: [
            "Custom, high-end aesthetics",
            "Blazing fast load times",
            "Intuitive, fluid animations",
            "Strategic growth partnership"
        ],
    },
    faq: {
        title: "Common Questions",
        subtitle: "Everything you need to know about working with us.",
        items: [
            {
                question: "What makes REDgravity different?",
                answer: "We focus on 'Premium' in every sense. Not just how it looks, but how it feels and performs. We combine high-end aesthetic sensibilities with rigorous engineering standards."
            },
            {
                question: "Do you work with startups?",
                answer: "Yes, we love working with ambitious visionaries, whether they are just starting out with a disruptive idea or are an established brand looking to modernize."
            },
            {
                question: "How long does a project take?",
                answer: "It varies, but a typical high-end landing page takes 2-4 weeks, while complex web applications can take 2-4 months."
            },
            {
                question: "What is your pricing model?",
                answer: "We provide a detailed fixed-price proposal after understanding your specific needs. No hidden surprises."
            }
        ],
    },
    cta: {
        title: "Ready to Transform Your Business with REDgravity?",
        subtitle: "Your Trusted Partner for Transformative Digital Solutions",
        buttonText: "Book a Call today!",
        points: [
            "Premium Quality Guaranteed",
            "Fast Turnaround Times",
            "Dedicated Support Team",
            "Scalable Solutions"
        ],
    },
};

export function normalizeContent(contentData) {
    if (!contentData || typeof contentData !== 'object') {
        return DEFAULT_CONTENT;
    }

    return {
        hero: {
            title: contentData.hero?.title || DEFAULT_CONTENT.hero.title,
            titleHighlight: contentData.hero?.titleHighlight || DEFAULT_CONTENT.hero.titleHighlight,
            subtitle: contentData.hero?.subtitle || DEFAULT_CONTENT.hero.subtitle,
            ctaText: contentData.hero?.ctaText || DEFAULT_CONTENT.hero.ctaText,
        },
        services: {
            title: contentData.services?.title || DEFAULT_CONTENT.services.title,
            subtitle: contentData.services?.subtitle || DEFAULT_CONTENT.services.subtitle,
            items: (() => {
                const dbItems = contentData.services?.items;
                const defaultItems = DEFAULT_CONTENT.services.items;

                // If no database items, use defaults
                if (!dbItems || !Array.isArray(dbItems)) {
                    return defaultItems;
                }

                // Merge database items with defaults, using local GIFs as fallback
                return dbItems.map((dbItem, index) => {
                    const defaultItem = defaultItems[index] || {};
                    return {
                        ...dbItem,
                        // Use local GIF from default if media is empty/missing in database
                        media: dbItem.media || defaultItem.media || '',
                    };
                });
            })(),
        },
        whyChooseUs: {
            title: contentData.whyChooseUs?.title || DEFAULT_CONTENT.whyChooseUs.title,
            titleHighlight: contentData.whyChooseUs?.titleHighlight || DEFAULT_CONTENT.whyChooseUs.titleHighlight,
            subtitle: contentData.whyChooseUs?.subtitle || DEFAULT_CONTENT.whyChooseUs.subtitle,
            points: contentData.whyChooseUs?.points || DEFAULT_CONTENT.whyChooseUs.points,
        },
        comparison: {
            title: contentData.comparison?.title || DEFAULT_CONTENT.comparison.title,
            subtitle: contentData.comparison?.subtitle || DEFAULT_CONTENT.comparison.subtitle,
            traditionalPoints: contentData.comparison?.traditionalPoints || DEFAULT_CONTENT.comparison.traditionalPoints,
            ourPoints: contentData.comparison?.ourPoints || DEFAULT_CONTENT.comparison.ourPoints,
        },
        faq: {
            title: contentData.faq?.title || DEFAULT_CONTENT.faq.title,
            subtitle: contentData.faq?.subtitle || DEFAULT_CONTENT.faq.subtitle,
            items: contentData.faq?.items || DEFAULT_CONTENT.faq.items,
        },
        cta: {
            title: contentData.cta?.title || DEFAULT_CONTENT.cta.title,
            subtitle: contentData.cta?.subtitle || DEFAULT_CONTENT.cta.subtitle,
            buttonText: contentData.cta?.buttonText || DEFAULT_CONTENT.cta.buttonText,
            points: contentData.cta?.points || DEFAULT_CONTENT.cta.points,
        },
    };
}



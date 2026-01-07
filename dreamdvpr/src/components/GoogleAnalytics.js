"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";

export default function GoogleAnalytics() {
    const pathname = usePathname();
    const gaId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

    // Render only if we have an ID
    if (!gaId) return null;

    // Check if we are on the landing page ("/") or any blog page ("/blog...")
    const isLandingOrBlog = pathname === "/" || pathname.startsWith("/blog");

    if (!isLandingOrBlog) {
        return null;
    }

    return (
        <>
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
                strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
                {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${gaId}');
        `}
            </Script>
        </>
    );
}

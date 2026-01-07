"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";

export default function GoogleAnalytics() {
    const pathname = usePathname();
    // Hardcoded for reliability during debugging
    const gaId = 'G-1PNYQ3NRMV';

    // Check if we are on the landing page ("/") or any blog page ("/blog...")
    const isLandingOrBlog = pathname === "/" || pathname.startsWith("/blog");

    // Debug log
    console.log('GA Debug:', { pathname, isLandingOrBlog, gaId });

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

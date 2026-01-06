'use client';

import { useEffect } from 'react';
import ReactGA from 'react-ga4';

export default function GoogleAnalytics() {
    useEffect(() => {
        const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

        if (measurementId) {
            // Initialize Google Analytics
            ReactGA.initialize(measurementId);

            // Send pageview
            ReactGA.send({ hitType: 'pageview', page: window.location.pathname });

            console.log('Google Analytics initialized for homepage');
        } else {
            console.warn('GA4 Measurement ID not found. Please add NEXT_PUBLIC_GA_MEASUREMENT_ID to your .env.local file');
        }
    }, []);

    return null;
}

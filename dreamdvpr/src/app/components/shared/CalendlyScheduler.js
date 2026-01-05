'use client';

import { useEffect, useState } from 'react';

const CalendlyScheduler = ({ url }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://assets.calendly.com/assets/external/widget.js";
        script.async = true;
        script.onload = () => setLoading(false);
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div className="w-full h-[1400px] min-h-[1400px] flex flex-col items-center justify-center bg-white/40 rounded-2xl border border-white/30 backdrop-blur-sm overflow-hidden">
            {loading && (
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-t-[#e53e3e] border-transparent rounded-full animate-spin" />
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading Scheduler...</p>
                </div>
            )}
            <div
                className="calendly-inline-widget w-full h-full min-w-[320px] min-h-[1400px]"
                data-url={url || "https://calendly.com/dhanushpthampi"}
            />
        </div>
    );
};

export default CalendlyScheduler;

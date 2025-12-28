'use client';

import React, { useEffect, useState, useRef } from 'react';

const AnimatedCounter = ({ end, duration = 2000, suffix = '', label }) => {
    const [count, setCount] = useState(0);
    const countRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const [brandColors, setBrandColors] = useState({ primary: '#00abad', secondary: '#008c8e' });

    useEffect(() => {
        const updateColors = () => {
            if (typeof window !== 'undefined') {
                const primary = getComputedStyle(document.documentElement)
                    .getPropertyValue('--color-brand-500')
                    .trim() || '#00abad';
                const secondary = getComputedStyle(document.documentElement)
                    .getPropertyValue('--color-brand-600')
                    .trim() || '#008c8e';
                setBrandColors({ primary, secondary });
            }
        };
        
        updateColors();
        window.addEventListener('theme-updated', updateColors);
        return () => window.removeEventListener('theme-updated', updateColors);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (countRef.current) {
            observer.observe(countRef.current);
        }

        return () => {
            if (countRef.current) {
                observer.unobserve(countRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        let startTime;
        let animationFrame;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);

            // Easing function for smooth counting
            const easeOutQuart = 1 - Math.pow(1 - percentage, 4);

            setCount(Math.floor(easeOutQuart * end));

            if (progress < duration) {
                animationFrame = requestAnimationFrame(animate);
            } else {
                setCount(end);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrame);
    }, [isVisible, end, duration]);

    return (
        <div ref={countRef} className="text-center">
            <div 
                className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent"
                style={{
                    backgroundImage: `linear-gradient(to right, ${brandColors.primary}, ${brandColors.secondary})`
                }}
            >
                {count}{suffix}
            </div>
            {label && <div className="text-gray-500 mt-2 font-medium">{label}</div>}
        </div>
    );
};

export default AnimatedCounter;

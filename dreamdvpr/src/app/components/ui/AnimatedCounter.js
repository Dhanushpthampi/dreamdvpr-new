'use client';

import React, { useEffect, useState, useRef } from 'react';

const AnimatedCounter = ({ end, duration = 2000, suffix = '', label }) => {
    const [count, setCount] = useState(0);
    const countRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

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
            const rawCount = Math.floor(easeOutQuart * end);
            setCount(rawCount);

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
        <div ref={countRef} className="text-center font-sans">
            <div className="text-4xl md:text-6xl font-black tracking-tight flex items-baseline justify-center">
                <span>{new Intl.NumberFormat().format(count)}</span>
                {suffix && <span className="text-2xl md:text-3xl ml-0.5 opacity-80">{suffix}</span>}
            </div>
            {label && <div className="text-gray-500 mt-2 font-medium">{label}</div>}
        </div>
    );
};

export default AnimatedCounter;

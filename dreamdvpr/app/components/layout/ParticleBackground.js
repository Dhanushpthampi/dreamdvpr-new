'use client';

import React, { useEffect, useRef } from 'react';
import { Box } from '@chakra-ui/react';

const ParticleBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 3 + 1;
                this.speedX = Math.random() * 0.5 - 0.25;
                this.speedY = Math.random() * 0.5 - 0.25;
                this.opacity = Math.random() * 0.5 + 0.2;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x > canvas.width) this.x = 0;
                if (this.x < 0) this.x = canvas.width;
                if (this.y > canvas.height) this.y = 0;
                if (this.y < 0) this.y = canvas.height;
            }

            draw() {
                // Get brand color from CSS variable, fallback to default
                const brandColor = getComputedStyle(document.documentElement)
                    .getPropertyValue('--color-brand-500')
                    .trim() || '#00abad';
                
                // Convert hex to rgb
                const hex = brandColor.replace('#', '');
                const r = parseInt(hex.substring(0, 2), 16);
                const g = parseInt(hex.substring(2, 4), 16);
                const b = parseInt(hex.substring(4, 6), 16);
                
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const init = () => {
            particles = [];
            const particleCount = Math.floor((canvas.width * canvas.height) / 15000);
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            // Draw connections
            particles.forEach((particleA, indexA) => {
                particles.slice(indexA + 1).forEach(particleB => {
                    const dx = particleA.x - particleB.x;
                    const dy = particleA.y - particleB.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 120) {
                        // Get brand color from CSS variable
                        const brandColor = getComputedStyle(document.documentElement)
                            .getPropertyValue('--color-brand-500')
                            .trim() || '#00abad';
                        
                        // Convert hex to rgb
                        const hex = brandColor.replace('#', '');
                        const r = parseInt(hex.substring(0, 2), 16);
                        const g = parseInt(hex.substring(2, 4), 16);
                        const b = parseInt(hex.substring(4, 6), 16);
                        
                        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${0.15 * (1 - distance / 120)})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particleA.x, particleA.y);
                        ctx.lineTo(particleB.x, particleB.y);
                        ctx.stroke();
                    }
                });
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        init();
        animate();

        // Listen for theme updates and re-draw particles
        const handleThemeUpdate = () => {
            // Particles will use new color on next draw cycle
        };
        window.addEventListener('theme-updated', handleThemeUpdate);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('theme-updated', handleThemeUpdate);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <Box
            as="canvas"
            ref={canvasRef}
            position="absolute"
            top={0}
            left={0}
            width="100%"
            height="100%"
            zIndex={0}
            pointerEvents="none"
        />
    );
};

export default ParticleBackground;

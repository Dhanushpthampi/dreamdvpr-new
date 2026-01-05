'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  useGLTF,
  PresentationControls,
  Environment,
  Float,
} from '@react-three/drei';
import { motion } from 'framer-motion';
import { useContent } from '../../lib/hooks';
import ParticleBackground from './ParticleBackground';

/* ===============================
   3D MODEL WITH FREE FLOATING MOTION
================================ */
function SpaceshipModel({ scale = 0.2 }) {
  const { scene } = useGLTF('/Spaceship.glb');
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.elapsedTime;
      meshRef.current.position.x = Math.sin(t * 0.1) * 0.2;
      meshRef.current.position.y = Math.sin(t * 0.3) * 0.6;
      meshRef.current.position.z = Math.sin(t * 0.3) * 0.8;
      meshRef.current.rotation.y = Math.sin(t * 0.1) * 0.3;
      meshRef.current.rotation.x = Math.sin(t * 0.07) * 0.1;
    }
  });

  return <primitive ref={meshRef} object={scene} scale={scale} />;
}

/* ===============================
   HERO COMPONENT
================================ */
const Hero = () => {
  const { content } = useContent('hero'); // dynamic content
  const [modelPosition, setModelPosition] = useState([2, 0, 0]); // Desktop default
  const [modelScale, setModelScale] = useState(0.2);
  const [textTranslateY, setTextTranslateY] = useState(0);

  useEffect(() => {
    const updatePosition = () => {
      if (window.innerWidth >= 1024) {
        setModelPosition([2, 0, 0]);   // Desktop: right
        setModelScale(0.18);
        setTextTranslateY(0);
      } else if (window.innerWidth >= 768) {
        setModelPosition([1.4, 0, 0]); // Tablet: moderate right
        setModelScale(0.15);
        setTextTranslateY(0);
      } else {
        // Mobile: stacked layout
        setModelPosition([0, -1.5, 0]); // slightly lower
        setModelScale(0.12);           // smaller
        setTextTranslateY(-50);        // move text slightly up
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, []);

  const titleParts = content?.title?.split(content?.titleHighlight || '') || [];

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-bg-app">
      {/* Particle Background */}
      <div className="absolute inset-0 z-0">
        <ParticleBackground />
      </div>

      {/* 3D Scene */}
      <div className="absolute inset-0 z-[1]">
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={1} />
          <Environment preset="city" />

          <group position={modelPosition}>
            <PresentationControls
              global={true}
              snap={false}
              speed={1.5}
              rotation={[0, 0, 0]}
              polar={[-Math.PI / 4, Math.PI / 4]}
              azimuth={[-Math.PI, Math.PI]}
              config={{ mass: 1, tension: 120, friction: 14 }}
            >
              <Float speed={0.5} rotationIntensity={0.2} floatIntensity={0.1}>
                <SpaceshipModel scale={modelScale} />
              </Float>
            </PresentationControls>
          </group>
        </Canvas>
      </div>

      {/* Content Overlay */}
      <div className="container mx-auto max-w-7xl h-full relative z-[10] pointer-events-none px-4">
        <div
          className="h-full flex items-center justify-center md:justify-start"
          style={{ transform: `translateY(${textTranslateY}px)` }}
        >
          <div className="flex flex-col items-center md:items-start gap-6 max-w-xl text-center md:text-left pointer-events-auto">
            <motion.h1
              className="text-5xl md:text-7xl font-bold text-white"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {titleParts.map((part, i, arr) =>
                i === arr.length - 1 ? (
                  <React.Fragment key={i}>
                    <span className="text-brand-500">
                      {content?.titleHighlight || ''}
                    </span>
                    {part}
                  </React.Fragment>
                ) : (
                  <React.Fragment key={i}>{part}</React.Fragment>
                )
              )}
            </motion.h1>

            <motion.p
              className="text-xl text-gray-300"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {content?.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <a
                href="#contact"
                className="px-6 py-3 text-lg font-medium text-white rounded-xl transition-all hover:opacity-90 hover:-translate-y-0.5 bg-brand-500"
              >
                {content?.ctaText}
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

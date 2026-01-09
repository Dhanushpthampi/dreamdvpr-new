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
   ERROR BOUNDARY
================================ */
class ModelErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error("3D Model Error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) return null; // Don't show anything on error
    return this.props.children;
  }
}

/* ===============================
   3D MODEL WITH FREE FLOATING MOTION
================================ */
import { clone } from 'three/examples/jsm/utils/SkeletonUtils';

function SpaceshipModel({ scale = 0.2, onLoad }) {
  const { scene } = useGLTF('/Spaceship.glb');

  useEffect(() => {
    if (scene) onLoad?.();
  }, [scene, onLoad]);

  // Clone the scene to ensure we have a fresh instance for this component
  const clonedScene = React.useMemo(() => clone(scene), [scene]);
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

  return <primitive ref={meshRef} object={clonedScene} scale={scale} />;
}

/* ===============================
   HERO COMPONENT
================================ */
const Hero = () => {
  const { content } = useContent('hero'); // dynamic content
  const [modelPosition, setModelPosition] = useState([2, 0, 0]); // Desktop default
  const [modelScale, setModelScale] = useState(0.2);
  const [textTranslateY, setTextTranslateY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [isLowEndMobile, setIsLowEndMobile] = useState(false);

  useEffect(() => {
    const updatePosition = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);

      const lowEnd = typeof navigator !== 'undefined' &&
        (navigator.hardwareConcurrency <= 4 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) && width < 768);
      setIsLowEndMobile(lowEnd);

      if (width >= 1024) {
        setModelPosition([2, 0, 0]);   // Desktop: right
        setModelScale(0.18);
        setTextTranslateY(0);
      } else if (width >= 768) {
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
      {!isLowEndMobile && (
        <motion.div
          className="absolute inset-0 z-[1]"
          initial={{ opacity: 0 }}
          animate={{ opacity: modelLoaded ? 1 : 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <Canvas
            camera={{ position: [0, 0, 8], fov: 45 }}
            dpr={[1, 2]} // Limit pixel ratio to 2 to improve performance on high-res mobile
            gl={{
              powerPreference: "high-performance",
              antialias: false,
              alpha: true,
              stencil: false,
              depth: true,
            }}
            onCreated={({ gl }) => {
              const canvas = gl.domElement;

              const handleContextLost = (e) => {
                e.preventDefault();
                console.warn('WebGL context lost');
              };

              const handleContextRestored = () => {
                console.warn('WebGL context restored');
                window.location.reload(); // safest fix on mobile
              };

              canvas.addEventListener('webglcontextlost', handleContextLost);
              canvas.addEventListener('webglcontextrestored', handleContextRestored);

              if (!gl.getContext()) {
                console.warn("WebGL not supported, disabling 3D scene");
                setModelLoaded(false);
              }
            }}
            onError={(error) => {
              console.error("Canvas Error:", error);
              setModelLoaded(false);
            }}
          >
            <ambientLight intensity={0.4} color="#2d3250" />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} color="#ffffff" />
            <pointLight position={[-10, -10, -10]} intensity={1} color="#451212" />
            <pointLight position={[0, 10, 0]} intensity={0.5} color="#2563eb" />
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
                  <ModelErrorBoundary>
                    <React.Suspense fallback={null}>
                      <SpaceshipModel scale={modelScale} onLoad={() => setModelLoaded(true)} />
                    </React.Suspense>
                  </ModelErrorBoundary>
                </Float>
              </PresentationControls>
            </group>
          </Canvas>
        </motion.div>
      )}

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
              className="text-xl text-white/90"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {content?.subtitle?.split('REDgravity').map((part, i, arr) => (
                <React.Fragment key={i}>
                  {part}
                  {i < arr.length - 1 && (
                    <>REDgravity</>
                  )}
                </React.Fragment>
              ))}
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

'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Box, Container, Heading, Text, Button, Flex, VStack, useBreakpointValue } from '@chakra-ui/react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, PresentationControls, Environment, Float } from '@react-three/drei';
import { motion } from 'framer-motion';

const MotionHeading = motion(Heading);
const MotionText = motion(Text);
const MotionBox = motion(Box);

function SpaceshipModel({ position, isDragging }) {
    const { scene } = useGLTF('/Spaceship.glb');
    const meshRef = useRef();

    useFrame((state, delta) => {
        if (meshRef.current && !isDragging) {
            // Slower continuous auto-rotation
            meshRef.current.rotation.y += delta * 0.2;

            // Gentle left-right sway
            meshRef.current.position.x = position[0] + Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
        }
    });

    return (
        <primitive
            ref={meshRef}
            object={scene}
            scale={0.01}
            position={position}
            rotation={[0.01, 0, 0]}
        />
    );
}

const Hero = () => {
    const [isDragging, setIsDragging] = React.useState(false);
    const [content, setContent] = useState({
        title: "Explore the Future of Web",
        titleHighlight: "Future of Web",
        subtitle: "DREAMdvpr crafts digital experiences that are out of this world. Clean, precise, and engineered for performance.",
        ctaText: "Start Mission",
    });

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            const res = await fetch('/api/content');
            const data = await res.json();
            if (data.content?.hero) {
                setContent(data.content.hero);
            }
        } catch (error) {
            console.error('Error fetching hero content:', error);
        }
    };

    // Responsive positioning: Center on mobile, Right on desktop
    const modelPosition = useBreakpointValue({
        base: [0, -1.6, 0],
        md: [2.5, -0.5, 0],
        lg: [3.5, -0.5, 0]
    }) || [3, 0, 0];

    const [bgColor, setBgColor] = useState('#ffffff');

    useEffect(() => {
        const updateBgColor = () => {
            if (typeof window !== 'undefined') {
                const color = getComputedStyle(document.documentElement)
                    .getPropertyValue('--color-bg-secondary')
                    .trim() || '#ffffff';
                setBgColor(color);
            }
        };
        
        updateBgColor();
        window.addEventListener('theme-updated', updateBgColor);
        return () => window.removeEventListener('theme-updated', updateBgColor);
    }, []);

    return (
        <Box position="relative" h="100vh" w="100vw" overflow="hidden" bg={bgColor}>
            {/* 3D Scene Layer */}
            <Box position="absolute" inset="0" zIndex="0">
                <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                    <ambientLight intensity={0.5} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
                    <pointLight position={[-10, -10, -10]} intensity={1} />
                    <Environment preset="city" />

                    {/* PresentationControls handles the "drag to rotate" and "snap back" behavior */}
                    {/* Pivot Adjustment: Move the entire interaction group to the right, so rotation happens in-place */}
                    <group position={modelPosition}>
                        <PresentationControls
                            global={true} // Allow dragging anywhere
                            config={{ mass: 1, tension: 200, friction: 20 }}
                            snap={true} // Instant snap back to origin
                            rotation={[0, 0, 0]}
                            polar={[-Math.PI / 6, Math.PI / 6]} // Tighter vertical limit
                            azimuth={[-Math.PI / 6, Math.PI / 6]} // Tighter horizontal limit to prevent disappearing
                            cursor={true}
                            onDragStart={() => setIsDragging(true)}
                            onDragEnd={() => setIsDragging(false)}
                        >
                            {/* Model is now centered relative to the parent group */}
                            <SpaceshipModel position={[0, 0, 0]} isDragging={isDragging} />
                        </PresentationControls>
                    </group>
                </Canvas>
            </Box>

            {/* Content Overlay */}
            <Container maxW="container.xl" h="100%" position="relative" zIndex="10" pointerEvents="none">
                <Flex h="100%" align="center" justify={{ base: 'center', md: 'flex-start' }}>
                    <VStack
                        align={{ base: 'center', md: 'flex-start' }}
                        spacing={6}
                        maxW="xl"
                        textAlign={{ base: 'center', md: 'left' }}
                        pointerEvents="auto"
                    >
                        <MotionHeading
                            as="h1"
                            size="4xl"
                            fontWeight="bold"
                            color="text.main"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            {content.title.split(content.titleHighlight || 'Future of Web').map((part, i, arr) => 
                                i === arr.length - 1 ? (
                                    <React.Fragment key={i}>
                                        <Box as="span" color="brand.500">{content.titleHighlight || 'Future of Web'}</Box>
                                        {part}
                                    </React.Fragment>
                                ) : (
                                    <React.Fragment key={i}>{part}</React.Fragment>
                                )
                            )}
                        </MotionHeading>

                        <MotionText
                            fontSize="xl"
                            color="text.secondary"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            {content.subtitle}
                        </MotionText>

                        <MotionBox
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <Button
                                size="lg"
                                variant="solid"
                                colorScheme="brand"
                                bg="brand.500"
                                color="white"
                                _hover={{ bg: 'brand.600', transform: 'translateY(-2px)' }}
                                as="a"
                                href="#contact"
                                style={{ textDecoration: 'none' }}
                            >
                                {content.ctaText}
                            </Button>
                        </MotionBox>
                    </VStack>
                </Flex>
            </Container>
        </Box>
    );
};

export default Hero;

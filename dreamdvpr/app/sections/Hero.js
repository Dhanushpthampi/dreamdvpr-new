'use client';

import React, { useRef } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Flex,
  VStack,
  useBreakpointValue,
} from '@chakra-ui/react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  useGLTF,
  PresentationControls,
  Environment,
  Float,
} from '@react-three/drei';
import { motion } from 'framer-motion';
import { useContent, useBackgroundColor } from '../lib/hooks';
import ParticleBackground from '../components/ParticleBackground';

const MotionHeading = motion(Heading);
const MotionText = motion(Text);
const MotionBox = motion(Box);

/* ===============================
   3D MODEL WITH FREE FLOATING MOTION
================================ */
function SpaceshipModel() {
    const { scene } = useGLTF('/Spaceship.glb');
    const meshRef = useRef(); // <-- removed <any>
  
    useFrame((state, delta) => {
      if (meshRef.current) {
        const t = state.clock.elapsedTime;
  
        meshRef.current.position.x = Math.sin(t * 0.5) * 1.2;
        meshRef.current.position.y = Math.sin(t * 0.7) * 0.6;
        meshRef.current.position.z = Math.sin(t * 0.3) * 0.8;
  
        meshRef.current.rotation.y = Math.sin(t * 0.2) * 0.3;
        meshRef.current.rotation.x = Math.sin(t * 0.15) * 0.1;
      }
    });
  
    return <primitive ref={meshRef} object={scene} scale={0.007} />;
  }
  

/* ===============================
   HERO COMPONENT
================================ */
const Hero = () => {
  const { content } = useContent('hero');
  const bgColor = useBackgroundColor('primary');

  const modelPosition =
    useBreakpointValue({
      base: [0, 0, 0],
      md: [1.5, 0, 0],
      lg: [2, 0, 0],
    }) ?? [0, 0, 0];

  return (
    <Box position="relative" h="100vh" w="100vw" overflow="hidden" bg={bgColor}>
      {/* Particle Background */}
      <Box position="absolute" inset={0} zIndex={0}>
        <ParticleBackground />
      </Box>

      {/* 3D Scene */}
      <Box position="absolute" inset={0} zIndex={1}>
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={1} />
          <Environment preset="city" />

          <group position={modelPosition}>
            <PresentationControls
              global={true}       // Drag anywhere on canvas
              snap={false}        // Free rotation
              speed={1.5}
              rotation={[0, 0, 0]}
              polar={[-Math.PI / 4, Math.PI / 4]}
              azimuth={[-Math.PI, Math.PI]}
              config={{ mass: 1, tension: 120, friction: 14 }}
            >
              {/* Float just adds gentle rotation + vertical motion, can keep or remove */}
              <Float
                speed={0.5}
                rotationIntensity={0.2}
                floatIntensity={0.1}
              >
                <SpaceshipModel />
              </Float>
            </PresentationControls>
          </group>
        </Canvas>
      </Box>

      {/* Content Overlay */}
      <Container maxW="container.xl" h="100%" position="relative" zIndex={10} pointerEvents="none">
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
              {content?.title
                ?.split(content?.titleHighlight || 'Future of Web')
                .map((part, i, arr) =>
                  i === arr.length - 1 ? (
                    <React.Fragment key={i}>
                      <Box as="span" color="brand.500">
                        {content?.titleHighlight || 'Future of Web'}
                      </Box>
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
              {content?.subtitle}
            </MotionText>

            <MotionBox
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button
                size="lg"
                colorScheme="brand"
                bg="brand.500"
                color="white"
                _hover={{
                  bg: 'brand.600',
                  transform: 'translateY(-2px)',
                }}
                as="a"
                href="#contact"
              >
                {content?.ctaText}
              </Button>
            </MotionBox>
          </VStack>
        </Flex>
      </Container>
    </Box>
  );
};

export default Hero;

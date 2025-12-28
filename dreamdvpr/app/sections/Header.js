'use client';

import React, { useState, useEffect } from 'react';
import { Box, Container, Flex, Heading, Button, HStack, Link, useColorModeValue } from '@chakra-ui/react';

const Header = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const glassBg = 'rgba(255, 255, 255, 0.8)';

    return (
        <Box
            as="header"
            position="fixed"
            top="0"
            left="0"
            right="0"
            zIndex="1000"
            transition="all 0.3s"
            py={scrolled ? 3 : 5}
            bg={scrolled ? glassBg : 'transparent'}
            backdropFilter={scrolled ? 'saturate(180%) blur(20px)' : 'none'}
            borderBottom={scrolled ? '1px solid' : 'none'}
            borderColor="gray.100"
        >
            <Container maxW="container.xl">
                <Flex align="center" justify="space-between">
                    <Heading as="h2" size="lg" cursor="pointer" letterSpacing="tight">
                        DREAM<Box as="span" color="brand.500">dvpr</Box>
                    </Heading>

                    <HStack as="nav" spacing={8} display={{ base: 'none', md: 'flex' }}>
                        <Link href="#services" fontWeight="medium" color="text.secondary" _hover={{ color: 'brand.500' }}>Services</Link>
                        <Link href="#comparison" fontWeight="medium" color="text.secondary" _hover={{ color: 'brand.500' }}>Why Us</Link>
                        <Link href="#blog" fontWeight="medium" color="text.secondary" _hover={{ color: 'brand.500' }}>Blog</Link>
                    </HStack>

                    <Button
                        variant="solid"
                        size="sm"
                        as="a"
                        href="#contact"
                        bg="brand.500"
                        color="white"
                        _hover={{ bg: 'brand.600' }}
                    >
                        Book a Call
                    </Button>
                </Flex>
            </Container>
        </Box>
    );
};

export default Header;

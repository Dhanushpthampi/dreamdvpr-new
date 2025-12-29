'use client';

import React, { useState, useEffect } from 'react';
import { Box, Container, Flex, Heading, Button, HStack, IconButton, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerBody, VStack, useDisclosure, Icon } from '@chakra-ui/react';
import Link from 'next/link';

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const glassBg = 'rgba(255, 255, 255, 0.8)';

    const navLinks = [
        { href: '#services', label: 'Services', isAnchor: true },
        { href: '#comparison', label: 'Why Us', isAnchor: true },
        { href: '/blog', label: 'Blog', isAnchor: true },
        { href: '/login', label: 'Login', isAnchor: true },
    ];

    return (
        <>
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
                      <Link href="/">  <Heading as="h2" size="lg" cursor="pointer" letterSpacing="tight">
                            DREAM<Box as="span" color="brand.500">dvpr</Box>
                        </Heading></Link>

                        <HStack as="nav" spacing={8} display={{ base: 'none', md: 'flex' }}>
                            {navLinks.map((link) => (
                                link.isAnchor ? (
                                    <Box
                                        key={link.href}
                                        as="a"
                                        href={link.href}
                                        fontWeight="medium"
                                        color="text.secondary"
                                        _hover={{ color: 'brand.500' }}
                                        style={{ textDecoration: 'none', cursor: 'pointer' }}
                                    >
                                        {link.label}
                                    </Box>
                                ) : (
                                    <Link key={link.href} href={link.href} style={{ fontWeight: '500', color: '#86868b', textDecoration: 'none' }} _hover={{ color: 'brand.500' }}>
                                        {link.label}
                                    </Link>
                                )
                            ))}
                        </HStack>

                        <HStack spacing={4}>
                            <Button
                                variant="solid"
                                size="sm"
                                as="a"
                                href="#contact"
                                bg="brand.500"
                                color="white"
                                _hover={{ bg: 'brand.600' }}
                                display={{ base: 'none', md: 'flex' }}
                                style={{ textDecoration: 'none' }}
                            >
                                Book a Call
                            </Button>
                            <IconButton
                                icon={
                                    <Icon viewBox="0 0 24 24" boxSize={6}>
                                        <path fill="currentColor" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
                                    </Icon>
                                }
                                variant="ghost"
                                aria-label="Open menu"
                                onClick={onOpen}
                                display={{ base: 'flex', md: 'none' }}
                            />
                        </HStack>
                    </Flex>
                </Container>
            </Box>

            {/* Mobile Menu Drawer */}
            <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerBody pt={16}>
                        <VStack spacing={6} align="stretch">
                            {navLinks.map((link) => (
                                link.isAnchor ? (
                                    <Box
                                        key={link.href}
                                        as="a"
                                        href={link.href}
                                        fontWeight="medium"
                                        fontSize="lg"
                                        color="text.main"
                                        _hover={{ color: 'brand.500' }}
                                        onClick={onClose}
                                        style={{ textDecoration: 'none', cursor: 'pointer' }}
                                    >
                                        {link.label}
                                    </Box>
                                ) : (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        style={{ fontWeight: '500', fontSize: 'lg', color: '#1d1d1f', textDecoration: 'none' }}
                                        onClick={onClose}
                                    >
                                        {link.label}
                                    </Link>
                                )
                            ))}
                            <Button
                                bg="brand.500"
                                color="white"
                                _hover={{ bg: 'brand.600' }}
                                as="a"
                                href="#contact"
                                onClick={onClose}
                            >
                                Book a Call
                            </Button>
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
};

export default Header;

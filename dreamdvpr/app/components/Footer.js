'use client';

import React from 'react';
import { Box, Container, Stack, Text, Link, SimpleGrid, Icon } from '@chakra-ui/react';

const Footer = () => {
    return (
        <Box bg="gray.50" color="gray.600" py={12} borderTop="1px solid" borderColor="gray.200">
            <Container maxW="container.xl">
                <Stack direction={{ base: 'column', md: 'row' }} justify="space-between" align="center" spacing={8}>

                    <Box textAlign={{ base: 'center', md: 'left' }}>
                        <Text fontWeight="bold" fontSize="lg" color="text.main">DREAMdvpr</Text>
                        <Text fontSize="sm">© {new Date().getFullYear()} DREAMdvpr. All rights reserved.</Text>
                    </Box>

                    <Stack direction="row" spacing={8} fontWeight="medium">
                        <Link href="#" _hover={{ color: 'brand.500' }}>Services</Link>
                        <Link href="#" _hover={{ color: 'brand.500' }}>Blog</Link>
                        <Link href="#" _hover={{ color: 'brand.500' }}>Contact</Link>
                    </Stack>

                    <Stack direction="row" spacing={4}>
                        <Box w={10} h={10} bg="gray.200" rounded="full" display="flex" alignItems="center" justifyContent="center" _hover={{ bg: 'brand.500', color: 'white' }} cursor="pointer" transition="all 0.2s">
                            <Text fontSize="xs" fontWeight="bold">TW</Text>
                        </Box>
                        <Box w={10} h={10} bg="gray.200" rounded="full" display="flex" alignItems="center" justifyContent="center" _hover={{ bg: 'brand.500', color: 'white' }} cursor="pointer" transition="all 0.2s">
                            <Text fontSize="xs" fontWeight="bold">LI</Text>
                        </Box>
                    </Stack>
                </Stack>
            </Container>
        </Box>
    );
};

export default Footer;

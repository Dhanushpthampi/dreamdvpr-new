'use client';

import React from 'react';
import { Box, Container, Stack, Text, SimpleGrid, Icon } from '@chakra-ui/react';
import Link from 'next/link';

const Footer = () => {
    return (
<Box bg="bg.surface" color="text.secondary" py={12} borderTop="1px solid" borderColor="border.light">
  <Container maxW="container.xl">
    <Stack direction={{ base: 'column', md: 'row' }} justify="space-between" align="center" spacing={8}>
      <Box textAlign={{ base: 'center', md: 'left' }}>
        <Text fontWeight="bold" fontSize="lg" color="text.main">DREAMdvpr</Text>
        <Text fontSize="sm" color="text.secondary">© 2025 DREAMdvpr. All rights reserved.</Text>
      </Box>

      <Stack direction="row" spacing={8} fontWeight="medium">
        <Link href="#services" style={{ color: 'text.secondary', textDecoration: 'none' }}>Services</Link>
        <Link href="/blog" style={{ color: 'text.secondary', textDecoration: 'none' }}>Blog</Link>
        <Link href="#contact" style={{ color: 'text.secondary', textDecoration: 'none' }}>Contact</Link>
      </Stack>

      <Stack direction="row" spacing={4}>
        <Box w={10} h={10} bg="bg.muted" rounded="full" display="flex" alignItems="center" justifyContent="center" _hover={{ bg: 'brand.500', color: 'white' }} cursor="pointer" transition="all 0.2s">
          <Text fontSize="xs" fontWeight="bold">TW</Text>
        </Box>
        <Box w={10} h={10} bg="bg.muted" rounded="full" display="flex" alignItems="center" justifyContent="center" _hover={{ bg: 'brand.500', color: 'white' }} cursor="pointer" transition="all 0.2s">
          <Text fontSize="xs" fontWeight="bold">LI</Text>
        </Box>
      </Stack>
    </Stack>
  </Container>
</Box>

    );
};

export default Footer;

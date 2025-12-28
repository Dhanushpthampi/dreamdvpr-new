'use client';

import React from 'react';
import { Box, Container, Heading, SimpleGrid, Text, Link, Tag, HStack } from '@chakra-ui/react';

const BlogCard = ({ category, title, date, color }) => (
    <Box cursor="pointer" role="group">
        <Box
            h="240px"
            bg={`${color}.100`}
            rounded="2xl"
            mb={6}
            position="relative"
            overflow="hidden"
            _groupHover={{ transform: 'translateY(-4px)', shadow: 'md' }}
            transition="all 0.3s"
        />
        <HStack mb={2} spacing={3}>
            <Tag size="sm" variant="subtle" colorScheme={color} textTransform="uppercase" fontWeight="bold">
                {category}
            </Tag>
            <Text fontSize="xs" color="gray.500" fontWeight="bold">•</Text>
            <Text fontSize="xs" color="gray.500" fontWeight="bold" textTransform="uppercase">{date}</Text>
        </HStack>
        <Heading size="md" lineHeight="tall" _groupHover={{ color: 'brand.500' }} transition="color 0.2s">
            {title}
        </Heading>
    </Box>
);

const BlogSection = () => {
    return (
        <Box py={24} bg="white" id="blog">
            <Container maxW="container.xl">
                <HStack justify="space-between" align="end" mb={12}>
                    <Heading size="xl">Latest Insights</Heading>
                    <Link href="#" color="brand.500" fontWeight="bold" display={{ base: 'none', md: 'block' }}>View all articles →</Link>
                </HStack>

                <SimpleGrid columns={{ base: 1, md: 3 }} gap={8}>
                    <BlogCard
                        category="Design"
                        color="purple"
                        title="The Psychology of Minimalist UI"
                        date="Oct 12, 2024"
                    />
                    <BlogCard
                        category="Development"
                        color="green"
                        title="Why React Server Components are the Future"
                        date="Oct 28, 2024"
                    />
                    <BlogCard
                        category="Strategy"
                        color="orange"
                        title="Converting Visitors into Loyal Customers"
                        date="Nov 05, 2024"
                    />
                </SimpleGrid>

                <Box mt={8} textAlign="center" display={{ md: 'none' }}>
                    <Link href="#" color="brand.500" fontWeight="bold">View all articles →</Link>
                </Box>
            </Container>
        </Box>
    );
};

export default BlogSection;

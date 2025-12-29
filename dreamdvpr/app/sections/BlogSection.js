'use client';

import React from 'react';
import { Box, Container, Heading, SimpleGrid, Text, Tag, HStack } from '@chakra-ui/react';
import Link from 'next/link';
import { useBlogs, useBackgroundColor } from '../lib/hooks';

const colorMap = {
    'Design': 'purple',
    'Development': 'green',
    'Strategy': 'orange',
    'Marketing': 'blue',
    'Business': 'teal',
};

const BlogCard = ({ blog, category, title, date, color, imageUrl }) => (
    <Link href={blog?._id ? `/blog/${blog._id}` : '#'} style={{ textDecoration: 'none' }}>
        <Box cursor="pointer" role="group">
            <Box
                h="240px"
                bg={imageUrl ? 'transparent' : `${color}.100`}
                bgImage={imageUrl ? `url(${imageUrl})` : 'none'}
                bgSize="cover"
                bgPosition="center"
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
    </Link>
);

// Default blogs if no blogs are available
const defaultBlogs = [
    {
        category: 'Design',
        title: 'The Psychology of Minimalist UI',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        color: 'purple',
    },
    {
        category: 'Development',
        title: 'Why React Server Components are the Future',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        color: 'green',
    },
    {
        category: 'Strategy',
        title: 'Converting Visitors into Loyal Customers',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        color: 'orange',
    },
];

const BlogSection = () => {
    const { blogs } = useBlogs({ published: true, limit: 3 });
    const bgColor = useBackgroundColor('secondary');
    const displayBlogs = blogs.length > 0 ? blogs : defaultBlogs;

    return (
        <Box py={24} bg={bgColor} id="blog">
            <Container maxW="container.xl">
                <HStack justify="space-between" align="end" mb={12}>
                    <Heading size="xl">Latest Insights</Heading>
                    <Link href="/blog" className="link-primary" style={{ fontWeight: 'bold' }} display={{ base: 'none', md: 'block' }}>View all articles →</Link>
                </HStack>

                <SimpleGrid columns={{ base: 1, md: 3 }} gap={8}>
                    {displayBlogs.map((blog, index) => (
                        <BlogCard
                            key={blog._id || index}
                            blog={blog}
                            category={blog.category}
                            color={colorMap[blog.category] || blog.color || 'gray'}
                            title={blog.title}
                            date={blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : blog.date}
                            imageUrl={blog.imageUrl}
                        />
                    ))}
                </SimpleGrid>

                <Box mt={8} textAlign="center" display={{ md: 'none' }}>
                    <Link href="/blog" className="link-primary" style={{ fontWeight: 'bold' }}>View all articles →</Link>
                </Box>
            </Container>
        </Box>
    );
};

export default BlogSection;

'use client';

import { useEffect, useState } from 'react';
import { Box, Container, Heading, Text, SimpleGrid, VStack, HStack, Tag, Spinner } from '@chakra-ui/react';
import Link from 'next/link';
import Header from '../sections/Header';
import Footer from '../components/Footer';

const colorMap = {
    'Design': 'purple',
    'Development': 'green',
    'Strategy': 'orange',
    'Marketing': 'blue',
    'Business': 'teal',
};

const BlogCard = ({ blog }) => {
    const color = colorMap[blog.category] || 'gray';
    
    return (
        <Link href={`/blog/${blog._id}`} style={{ textDecoration: 'none' }}>
            <Box
                cursor="pointer"
                role="group"
                bg="white"
                rounded="2xl"
                overflow="hidden"
                shadow="md"
                transition="all 0.3s"
                _hover={{ transform: 'translateY(-4px)', shadow: 'xl' }}
            >
                <Box
                    h="240px"
                    bg={blog.imageUrl ? 'transparent' : `${color}.100`}
                    bgImage={blog.imageUrl ? `url(${blog.imageUrl})` : 'none'}
                    bgSize="cover"
                    bgPosition="center"
                    position="relative"
                    overflow="hidden"
                />
                <VStack align="start" p={6} spacing={3}>
                    <HStack spacing={3}>
                        <Tag size="sm" variant="subtle" colorScheme={color} textTransform="uppercase" fontWeight="bold">
                            {blog.category}
                        </Tag>
                        <Text fontSize="xs" color="gray.500" fontWeight="bold">•</Text>
                        <Text fontSize="xs" color="gray.500" fontWeight="bold" textTransform="uppercase">
                            {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </Text>
                    </HStack>
                    <Heading size="md" lineHeight="tall" _groupHover={{ color: 'brand.500' }} transition="color 0.2s">
                        {blog.title}
                    </Heading>
                    <Text fontSize="sm" color="text.secondary" noOfLines={2}>
                        {blog.excerpt}
                    </Text>
                </VStack>
            </Box>
        </Link>
    );
};

export default function BlogPage() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const res = await fetch('/api/blogs?published=true');
            const data = await res.json();
            setBlogs(data.blogs || []);
        } catch (error) {
            console.error('Error fetching blogs:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box minH="100vh" bg="bg.app">
            <Header />
            <Box pt={24} pb={16}>
                <Container maxW="container.xl">
                    <VStack spacing={12} align="stretch">
                        <Box textAlign="center">
                            <Heading size="2xl" mb={4} color="text.main">
                                Blog
                            </Heading>
                            <Text fontSize="lg" color="text.secondary">
                                Latest insights, tips, and updates from DREAMdvpr
                            </Text>
                        </Box>

                        {loading ? (
                            <Box textAlign="center" py={20}>
                                <Spinner size="xl" color="brand.500" thickness="4px" />
                            </Box>
                        ) : blogs.length === 0 ? (
                            <Box textAlign="center" py={20}>
                                <Text fontSize="lg" color="text.secondary">
                                    No blog posts available yet. Check back soon!
                                </Text>
                            </Box>
                        ) : (
                            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={8}>
                                {blogs.map((blog) => (
                                    <BlogCard key={blog._id} blog={blog} />
                                ))}
                            </SimpleGrid>
                        )}
                    </VStack>
                </Container>
            </Box>
            <Footer />
        </Box>
    );
}

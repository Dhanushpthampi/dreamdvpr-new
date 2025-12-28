'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Box, Container, Heading, Text, VStack, HStack, Tag, Spinner, Button, Icon } from '@chakra-ui/react';
import Link from 'next/link';
import Header from '../../sections/Header';
import Footer from '../../components/Footer';

const colorMap = {
    'Design': 'purple',
    'Development': 'green',
    'Strategy': 'orange',
    'Marketing': 'blue',
    'Business': 'teal',
};

export default function BlogDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            fetchBlog();
        }
    }, [params.id]);

    const fetchBlog = async () => {
        try {
            const res = await fetch(`/api/blogs/${params.id}`);
            if (res.ok) {
                const data = await res.json();
                setBlog(data.blog);
            } else {
                router.push('/blog');
            }
        } catch (error) {
            console.error('Error fetching blog:', error);
            router.push('/blog');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box minH="100vh" bg="bg.app" display="flex" alignItems="center" justifyContent="center">
                <Spinner size="xl" color="brand.500" thickness="4px" />
            </Box>
        );
    }

    if (!blog) {
        return null;
    }

    const color = colorMap[blog.category] || 'gray';

    return (
        <Box minH="100vh" bg="bg.app">
            <Header />
            <Box pt={24} pb={16}>
                <Container maxW="container.md">
                    <VStack spacing={8} align="stretch">
                        <Button
                            variant="ghost"
                            leftIcon={
                                <Icon viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                                </Icon>
                            }
                            onClick={() => router.push('/blog')}
                            alignSelf="flex-start"
                        >
                            Back to Blog
                        </Button>

                        <VStack spacing={6} align="stretch">
                            <HStack spacing={3}>
                                <Tag size="md" variant="subtle" colorScheme={color} textTransform="uppercase" fontWeight="bold">
                                    {blog.category}
                                </Tag>
                                <Text fontSize="sm" color="gray.500">•</Text>
                                <Text fontSize="sm" color="gray.500">
                                    {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </Text>
                            </HStack>

                            <Heading size="2xl" color="text.main">
                                {blog.title}
                            </Heading>

                            {blog.imageUrl && (
                                <Box
                                    h="400px"
                                    bgImage={`url(${blog.imageUrl})`}
                                    bgSize="cover"
                                    bgPosition="center"
                                    rounded="2xl"
                                    overflow="hidden"
                                />
                            )}

                            <Box
                                className="blog-content"
                                fontSize="lg"
                                color="text.main"
                                lineHeight="tall"
                                dangerouslySetInnerHTML={{ __html: blog.content }}
                                sx={{
                                    '& h1, & h2, & h3, & h4, & h5, & h6': {
                                        fontWeight: 'bold',
                                        mt: 6,
                                        mb: 4,
                                        color: 'text.main',
                                    },
                                    '& h1': { fontSize: '3xl' },
                                    '& h2': { fontSize: '2xl' },
                                    '& h3': { fontSize: 'xl' },
                                    '& h4': { fontSize: 'lg' },
                                    '& p': {
                                        mb: 4,
                                        lineHeight: 'tall',
                                    },
                                    '& ul': {
                                        mb: 4,
                                        pl: 6,
                                        listStyleType: 'disc',
                                        listStylePosition: 'outside',
                                    },
                                    '& ol': {
                                        mb: 4,
                                        pl: 6,
                                        listStyleType: 'decimal',
                                        listStylePosition: 'outside',
                                    },
                                    '& li': {
                                        mb: 2,
                                        display: 'list-item',
                                    },
                                    '& ul li::marker': {
                                        color: 'brand.500',
                                    },
                                    '& ol li::marker': {
                                        color: 'brand.500',
                                        fontWeight: 'bold',
                                    },
                                    '& blockquote': {
                                        borderLeft: '4px solid',
                                        borderColor: 'brand.500',
                                        pl: 4,
                                        py: 2,
                                        my: 4,
                                        fontStyle: 'italic',
                                        bg: 'gray.50',
                                    },
                                    '& code': {
                                        bg: 'gray.100',
                                        px: 2,
                                        py: 1,
                                        rounded: 'md',
                                        fontSize: 'sm',
                                        fontFamily: 'mono',
                                    },
                                    '& pre': {
                                        bg: 'gray.900',
                                        color: 'white',
                                        p: 4,
                                        rounded: 'lg',
                                        overflowX: 'auto',
                                        mb: 4,
                                        '& code': {
                                            bg: 'transparent',
                                            color: 'inherit',
                                            px: 0,
                                            py: 0,
                                        },
                                    },
                                    '& img': {
                                        maxW: '100%',
                                        h: 'auto',
                                        rounded: 'lg',
                                        my: 4,
                                    },
                                    '& a': {
                                        color: 'brand.500',
                                        textDecoration: 'underline',
                                        _hover: {
                                            color: 'brand.600',
                                        },
                                    },
                                }}
                            />
                        </VStack>
                    </VStack>
                </Container>
            </Box>
            <Footer />
        </Box>
    );
}

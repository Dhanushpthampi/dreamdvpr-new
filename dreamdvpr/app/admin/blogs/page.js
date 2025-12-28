'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
    Box, Container, Heading, Text, VStack, HStack, Spinner, useToast,
    SimpleGrid, Icon, Image, Badge
} from '@chakra-ui/react';
import { AdminSidebarWrapper } from '../../components/AdminSidebar';
import GlassCard from '../../components/GlassCard';
import ThemedButton from '../../components/ThemedButton';

export default function BlogManagementPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const toast = useToast();
    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated') {
            if (session?.user?.role !== 'admin') {
                router.push('/login');
            } else {
                fetchBlogs();
            }
        }
    }, [status, session, router]);

    const fetchBlogs = async () => {
        try {
            const res = await fetch('/api/blogs');
            const data = await res.json();
            setBlogs(data.blogs || []);
        } catch (error) {
            console.error('Error fetching blogs:', error);
            toast({
                title: 'Error',
                description: 'Failed to fetch blogs',
                status: 'error',
                duration: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        router.push('/admin/blogs/new');
    };


    const handleDelete = async (blogId) => {
        if (!window.confirm('Are you sure you want to delete this blog?')) return;

        try {
            const res = await fetch(`/api/blogs/${blogId}`, {
                method: 'DELETE',
            });

            const data = await res.json();

            if (res.ok) {
                toast({
                    title: 'Blog deleted',
                    description: 'Blog has been deleted successfully',
                    status: 'success',
                    duration: 3000,
                });
                fetchBlogs();
            } else {
                throw new Error(data.error || 'Failed to delete blog');
            }
        } catch (error) {
            console.error('Error deleting blog:', error);
            toast({
                title: 'Error',
                description: error.message || 'Failed to delete blog',
                status: 'error',
                duration: 3000,
            });
        }
    };

    if (status === 'loading' || loading) {
        return (
            <AdminSidebarWrapper>
                <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
                    <Spinner size="xl" color="brand.500" thickness="4px" />
                </Box>
            </AdminSidebarWrapper>
        );
    }

    return (
        <AdminSidebarWrapper>
            <Container maxW="container.xl" py={8}>
                <VStack spacing={8} align="stretch">
                    <HStack justify="space-between">
                        <Box>
                            <Heading size="2xl" color="text.main" mb={2}>
                                Blog Management
                            </Heading>
                            <Text color="text.secondary" fontSize="lg">
                                Create and manage blog posts
                            </Text>
                        </Box>
                        <ThemedButton
                            variant="primary"
                            onClick={handleCreate}
                            leftIcon={
                                <Icon viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                                </Icon>
                            }
                        >
                            New Blog Post
                        </ThemedButton>
                    </HStack>

                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
                        {blogs.map((blog) => (
                            <GlassCard key={blog._id} p={6}>
                                <VStack align="start" spacing={4}>
                                    <Box position="relative" w="full" h="200px" rounded="lg" overflow="hidden" bg="gray.100">
                                        {blog.imageUrl ? (
                                            <Image
                                                src={blog.imageUrl}
                                                alt={blog.title}
                                                w="full"
                                                h="full"
                                                objectFit="cover"
                                                fallback={
                                                    <Box w="full" h="full" bg="gray.200" display="flex" alignItems="center" justifyContent="center">
                                                        <Icon viewBox="0 0 24 24" boxSize={12} color="gray.400">
                                                            <path fill="currentColor" d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                                                        </Icon>
                                                    </Box>
                                                }
                                            />
                                        ) : (
                                            <Box w="full" h="full" bg="gray.200" display="flex" alignItems="center" justifyContent="center">
                                                <Icon viewBox="0 0 24 24" boxSize={12} color="gray.400">
                                                    <path fill="currentColor" d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                                                </Icon>
                                            </Box>
                                        )}
                                        {blog.published && (
                                            <Badge
                                                position="absolute"
                                                top={2}
                                                right={2}
                                                bg="green.500"
                                                color="white"
                                                px={2}
                                                py={1}
                                                rounded="md"
                                                fontSize="xs"
                                                fontWeight="semibold"
                                            >
                                                Published
                                            </Badge>
                                        )}
                                    </Box>
                                    <Box w="full">
                                        <Text fontSize="xs" color="text.secondary" mb={1}>
                                            {blog.category} • {new Date(blog.createdAt).toLocaleDateString()}
                                        </Text>
                                        <Heading size="sm" color="text.main" noOfLines={2} mb={2}>
                                            {blog.title}
                                        </Heading>
                                        <Text fontSize="sm" color="text.secondary" noOfLines={2}>
                                            {blog.excerpt || 'No excerpt provided'}
                                        </Text>
                                    </Box>
                                    <HStack spacing={2} w="full">
                                        <ThemedButton
                                            size="sm"
                                            variant="outline"
                                            flex={1}
                                            onClick={() => router.push(`/admin/blogs/${blog._id}/edit`)}
                                        >
                                            Edit
                                        </ThemedButton>
                                        <ThemedButton
                                            size="sm"
                                            variant="outline"
                                            flex={1}
                                            onClick={() => handleDelete(blog._id)}
                                            color="red.500"
                                            borderColor="red.500"
                                            _hover={{ bg: 'red.50', borderColor: 'red.600' }}
                                        >
                                            Delete
                                        </ThemedButton>
                                    </HStack>
                                </VStack>
                            </GlassCard>
                        ))}
                    </SimpleGrid>

                    {blogs.length === 0 && (
                        <GlassCard p={12} textAlign="center">
                            <VStack spacing={4}>
                                <Icon viewBox="0 0 24 24" boxSize={16} color="gray.300">
                                    <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                                </Icon>
                                <Text color="text.secondary">No blog posts yet. Create your first one!</Text>
                            </VStack>
                        </GlassCard>
                    )}
                </VStack>
            </Container>
        </AdminSidebarWrapper>
    );
}

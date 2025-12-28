'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import {
    Box, Container, Heading, Text, VStack, HStack, Button, Spinner, useToast,
    FormControl, FormLabel, Switch
} from '@chakra-ui/react';
import { AdminSidebarWrapper } from '../../../components/AdminSidebar';
import GlassCard from '../../../components/GlassCard';
import ThemedInput from '../../../components/ThemedInput';
import ThemedSelect from '../../../components/ThemedSelect';
import ThemedButton from '../../../components/ThemedButton';
import RichTextEditor from '../../../components/RichTextEditor';

const CATEGORIES = [
    { value: 'Design', label: 'Design' },
    { value: 'Development', label: 'Development' },
    { value: 'Strategy', label: 'Strategy' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Business', label: 'Business' },
];

export default function EditBlogPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const params = useParams();
    const toast = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [blogData, setBlogData] = useState({
        title: '',
        content: '',
        excerpt: '',
        category: '',
        imageUrl: '',
        published: false,
    });

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated') {
            if (session?.user?.role !== 'admin') {
                router.push('/login');
            } else {
                fetchBlog();
            }
        }
    }, [status, session, router, params.id]);

    const fetchBlog = async () => {
        try {
            const res = await fetch(`/api/blogs/${params.id}`);
            if (res.ok) {
                const data = await res.json();
                setBlogData({
                    title: data.blog.title || '',
                    content: data.blog.content || '',
                    excerpt: data.blog.excerpt || '',
                    category: data.blog.category || '',
                    imageUrl: data.blog.imageUrl || '',
                    published: data.blog.published || false,
                });
            } else {
                toast({
                    title: 'Error',
                    description: 'Blog not found',
                    status: 'error',
                    duration: 3000,
                });
                router.push('/admin/blogs');
            }
        } catch (error) {
            console.error('Error fetching blog:', error);
            toast({
                title: 'Error',
                description: 'Failed to fetch blog',
                status: 'error',
                duration: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!blogData.title || !blogData.content || !blogData.category) {
            toast({
                title: 'Missing fields',
                description: 'Title, content, and category are required',
                status: 'error',
                duration: 3000,
            });
            return;
        }

        setSaving(true);
        try {
            const res = await fetch(`/api/blogs/${params.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(blogData),
            });

            const data = await res.json();

            if (res.ok) {
                toast({
                    title: 'Blog updated',
                    description: 'Blog has been updated successfully',
                    status: 'success',
                    duration: 3000,
                });
                router.push('/admin/blogs');
            } else {
                throw new Error(data.error || 'Failed to update blog');
            }
        } catch (error) {
            console.error('Error saving blog:', error);
            toast({
                title: 'Error',
                description: error.message || 'Failed to update blog',
                status: 'error',
                duration: 3000,
            });
        } finally {
            setSaving(false);
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
                    {/* Header */}
                    <HStack justify="space-between">
                        <Box>
                            <Heading size="2xl" color="text.main" mb={2}>
                                Edit Blog Post
                            </Heading>
                            <Text color="text.secondary" fontSize="lg">
                                Update your blog post content and settings
                            </Text>
                        </Box>
                        <HStack spacing={4}>
                            <ThemedButton
                                variant="outline"
                                onClick={() => router.push('/admin/blogs')}
                            >
                                Cancel
                            </ThemedButton>
                            <ThemedButton
                                variant="primary"
                                onClick={handleSave}
                                isLoading={saving}
                            >
                                Save Changes
                            </ThemedButton>
                        </HStack>
                    </HStack>

                    {/* Form */}
                    <GlassCard p={8}>
                        <VStack spacing={6} align="stretch">
                            <ThemedInput
                                label="Title"
                                value={blogData.title}
                                onChange={(e) => setBlogData({ ...blogData, title: e.target.value })}
                                required
                            />
                            <ThemedSelect
                                label="Category"
                                value={blogData.category}
                                onChange={(e) => setBlogData({ ...blogData, category: e.target.value })}
                                options={CATEGORIES}
                                required
                            />
                            <ThemedInput
                                label="Image URL"
                                value={blogData.imageUrl}
                                onChange={(e) => setBlogData({ ...blogData, imageUrl: e.target.value })}
                                placeholder="https://example.com/image.jpg"
                            />
                            <ThemedInput
                                label="Excerpt"
                                type="textarea"
                                value={blogData.excerpt}
                                onChange={(e) => setBlogData({ ...blogData, excerpt: e.target.value })}
                                rows={3}
                                placeholder="A brief summary of your blog post..."
                            />
                            <Box>
                                <Text fontSize="sm" fontWeight="medium" mb={2} color="text.main">
                                    Content <Text as="span" color="red.500">*</Text>
                                </Text>
                                <Text fontSize="xs" color="text.secondary" mb={2}>
                                    Tip: Press Enter for a new paragraph, Shift+Enter for a line break
                                </Text>
                                <RichTextEditor
                                    value={blogData.content}
                                    onChange={(value) => setBlogData({ ...blogData, content: value })}
                                    placeholder="Write your blog content here. You can format text, add headings, images, code blocks, and more..."
                                />
                            </Box>
                            <FormControl display="flex" alignItems="center">
                                <FormLabel mb={0}>Published</FormLabel>
                                <Switch
                                    isChecked={blogData.published}
                                    onChange={(e) => setBlogData({ ...blogData, published: e.target.checked })}
                                />
                            </FormControl>
                        </VStack>
                    </GlassCard>
                </VStack>
            </Container>
        </AdminSidebarWrapper>
    );
}

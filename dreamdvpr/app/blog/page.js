'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Tag,
  Spinner,
} from '@chakra-ui/react';
import Link from 'next/link';
import Header from '../sections/Header';
import Footer from '../components/Footer';
import { hexToRgba } from '../lib/utils';
import { useThemeColor } from '../lib/hooks';

const colorMap = {
  Design: 'purple',
  Development: 'green',
  Strategy: 'orange',
  Marketing: 'blue',
  Business: 'teal',
};

/* =======================
   Blog Card (Glass)
======================= */
const BlogCard = ({ blog }) => {
  const color = colorMap[blog.category] || 'gray';
  const brandColor = useThemeColor('--color-brand-500', '#00abad');

  return (
    <Link href={`/blog/${blog._id}`} style={{ textDecoration: 'none' }}>
      <Box
        role="group"
        cursor="pointer"
        bg="whiteAlpha.400"
        backdropFilter="blur(20px) saturate(180%)"
        rounded="2xl"
        overflow="hidden"
        border="1px solid"
        borderColor="whiteAlpha.300"
        boxShadow={`0 0 18px ${hexToRgba(brandColor, 0.12)}`}
        transition="all 0.3s ease"
        _hover={{
          transform: 'translateY(-6px)',
          boxShadow: `0 0 28px ${hexToRgba(brandColor, 0.22)}`,
        }}
      >
        {/* Image */}
        <Box
          h="240px"
          bg={blog.imageUrl ? 'transparent' : `${color}.100`}
          bgImage={blog.imageUrl ? `url(${blog.imageUrl})` : 'none'}
          bgSize="cover"
          bgPosition="center"
        />

        {/* Content */}
        <VStack align="start" p={6} spacing={3}>
          <HStack spacing={3}>
            <Tag
              size="sm"
              variant="subtle"
              colorScheme={color}
              textTransform="uppercase"
              fontWeight="bold"
            >
              {blog.category}
            </Tag>
            <Text fontSize="xs" color="text.secondary" fontWeight="bold">
              •
            </Text>
            <Text
              fontSize="xs"
              color="text.secondary"
              fontWeight="bold"
              textTransform="uppercase"
            >
              {new Date(blog.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </Text>
          </HStack>

          <Heading
            size="md"
            lineHeight="tall"
            color="text.main"
            transition="color 0.2s"
            _groupHover={{ color: 'brand.500' }}
          >
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

/* =======================
   Blog Page
======================= */
export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const brandColor = useThemeColor('--color-brand-500', '#00abad');

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

      <Box pt={24} pb={16} position="relative">
        {/* background glow */}
        <Box
          position="absolute"
          inset={0}
          bgGradient={`radial(circle at 50% 0%, ${hexToRgba(
            brandColor,
            0.12
          )}, transparent 60%)`}
          pointerEvents="none"
        />

        <Container maxW="container.xl" position="relative">
          <VStack spacing={12} align="stretch">
            {/* Header */}
            <Box textAlign="center">
              <Heading size="2xl" mb={4} color="text.main">
                Blog
              </Heading>
              <Text fontSize="lg" color="text.secondary">
                Latest insights, tips, and updates from DREAMdvpr
              </Text>
            </Box>

            {/* Content */}
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

'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Box, Container, Heading, Text, VStack, HStack, SimpleGrid, Icon, Spinner } from '@chakra-ui/react';
import { ClientSidebarWrapper } from '../components/ClientSidebar';
import GlassCard from '../components/GlassCard';
import StatusBadge from '../components/StatusBadge';

export default function ClientDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated') {
            if (session?.user?.role !== 'client') {
                router.push('/login');
            } else {
                fetchProjects();
            }
        }
    }, [status, session, router]);

    const fetchProjects = async () => {
        try {
            const res = await fetch('/api/projects');
            const data = await res.json();
            setProjects(data.projects || []);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    if (status === 'loading' || loading) {
        return (
            <ClientSidebarWrapper>
                <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
                    <Spinner size="xl" color="brand.500" thickness="4px" />
                </Box>
            </ClientSidebarWrapper>
        );
    }

    return (
        <ClientSidebarWrapper>
            <Container maxW="container.xl" py={8}>
                <VStack spacing={10} align="stretch">
                    {/* Welcome Section */}
                    <Box>
                        <Heading size="2xl" color="text.main" mb={2}>
                            Welcome back, {session?.user?.name}!
                        </Heading>
                        <Text color="text.secondary" fontSize="lg">
                            Here's what's happening with your projects
                        </Text>
                    </Box>

                    {/* Quick Stats */}
                    <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
                        <GlassCard p={6}>
                            <VStack align="start" spacing={3}>
                                <Box bg="brand.500" p={3} rounded="xl">
                                    <Icon viewBox="0 0 24 24" boxSize={8} color="white">
                                        <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
                                    </Icon>
                                </Box>
                                <VStack align="start" spacing={1}>
                                    <Text fontSize="sm" color="text.secondary" fontWeight="medium">
                                        Total Projects
                                    </Text>
                                    <Heading size="xl" color="text.main">
                                        {projects.length}
                                    </Heading>
                                </VStack>
                            </VStack>
                        </GlassCard>

                        <GlassCard p={6}>
                            <VStack align="start" spacing={3}>
                                <Box bg="blue.500" p={3} rounded="xl">
                                    <Icon viewBox="0 0 24 24" boxSize={8} color="white">
                                        <path fill="currentColor" d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                                    </Icon>
                                </Box>
                                <VStack align="start" spacing={1}>
                                    <Text fontSize="sm" color="text.secondary" fontWeight="medium">
                                        In Progress
                                    </Text>
                                    <Heading size="xl" color="text.main">
                                        {projects.filter(p => p.status === 'in-progress').length}
                                    </Heading>
                                </VStack>
                            </VStack>
                        </GlassCard>

                        <GlassCard p={6}>
                            <VStack align="start" spacing={3}>
                                <Box bg="green.500" p={3} rounded="xl">
                                    <Icon viewBox="0 0 24 24" boxSize={8} color="white">
                                        <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                    </Icon>
                                </Box>
                                <VStack align="start" spacing={1}>
                                    <Text fontSize="sm" color="text.secondary" fontWeight="medium">
                                        Completed
                                    </Text>
                                    <Heading size="xl" color="text.main">
                                        {projects.filter(p => p.status === 'completed').length}
                                    </Heading>
                                </VStack>
                            </VStack>
                        </GlassCard>
                    </SimpleGrid>

                    {/* Recent Projects */}
                    <Box>
                        <HStack justify="space-between" mb={6}>
                            <Heading size="lg" color="text.main">
                                Recent Projects
                            </Heading>
                            <Text
                                color="brand.500"
                                fontWeight="medium"
                                cursor="pointer"
                                onClick={() => router.push('/client/projects')}
                                _hover={{ textDecoration: 'underline' }}
                            >
                                View All →
                            </Text>
                        </HStack>

                        {projects.length === 0 ? (
                            <GlassCard p={12} textAlign="center">
                                <VStack spacing={4}>
                                    <Icon viewBox="0 0 24 24" boxSize={16} color="gray.300">
                                        <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
                                    </Icon>
                                    <Heading size="md" color="text.main">No projects yet</Heading>
                                    <Text color="text.secondary">
                                        Start your first project to get started!
                                    </Text>
                                </VStack>
                            </GlassCard>
                        ) : (
                            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
                                {projects.slice(0, 6).map((project) => (
                                    <GlassCard
                                        key={project._id}
                                        p={6}
                                        onClick={() => router.push(`/client/projects/${project._id}`)}
                                        cursor="pointer"
                                        transition="all 0.2s"
                                        _hover={{ transform: 'translateY(-4px)', shadow: 'xl' }}
                                    >
                                        <VStack align="start" spacing={4}>
                                            <HStack justify="space-between" w="full">
                                                <Heading size="sm" color="text.main" noOfLines={1}>
                                                    {project.name}
                                                </Heading>
                                                <StatusBadge status={project.status} size="sm" />
                                            </HStack>

                                            <Text fontSize="sm" color="text.secondary" noOfLines={2}>
                                                {project.description || 'No description'}
                                            </Text>

                                            <HStack fontSize="xs" color="text.secondary">
                                                <Icon viewBox="0 0 24 24" boxSize={4}>
                                                    <path fill="currentColor" d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
                                                </Icon>
                                                <Text>
                                                    {new Date(project.startDate).toLocaleDateString()}
                                                </Text>
                                            </HStack>
                                        </VStack>
                                    </GlassCard>
                                ))}
                            </SimpleGrid>
                        )}
                    </Box>
                </VStack>
            </Container>
        </ClientSidebarWrapper>
    );
}

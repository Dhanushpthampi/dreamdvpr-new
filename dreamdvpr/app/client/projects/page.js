'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Box, Container, Heading, Text, VStack, SimpleGrid, Icon, Spinner, Button, HStack } from '@chakra-ui/react';
import { ClientSidebarWrapper } from '../../components/ClientSidebar';
import GlassCard from '../../components/GlassCard';
import StatusBadge from '../../components/StatusBadge';

export default function ClientProjectsPage() {
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
                <VStack spacing={8} align="stretch">
                    {/* Header */}
                    <HStack justify="space-between" align="center">
                        <Box>
                            <Heading size="xl" color="text.main" mb={2}>
                                My Projects
                            </Heading>
                            <Text color="text.secondary">
                                View and manage all your projects
                            </Text>
                        </Box>
                        <Button
                            bg="brand.500"
                            color="white"
                            onClick={() => router.push('/client/new-project')}
                            _hover={{ bg: 'brand.600' }}
                            leftIcon={
                                <Icon viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                                </Icon>
                            }
                        >
                            New Project
                        </Button>
                    </HStack>

                    {/* Projects Grid */}
                    {projects.length === 0 ? (
                        <GlassCard p={16} textAlign="center">
                            <VStack spacing={6}>
                                <Icon viewBox="0 0 24 24" boxSize={20} color="gray.300">
                                    <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
                                </Icon>
                                <Heading size="lg" color="text.main">No projects yet</Heading>
                                <Text color="text.secondary" fontSize="lg">
                                    Start your first project to get started!
                                </Text>
                                <Button
                                    bg="brand.500"
                                    color="white"
                                    size="lg"
                                    onClick={() => router.push('/client/new-project')}
                                    _hover={{ bg: 'brand.600' }}
                                >
                                    Start New Project
                                </Button>
                            </VStack>
                        </GlassCard>
                    ) : (
                        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
                            {projects.map((project) => (
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
                                            <Heading size="md" color="text.main" noOfLines={1}>
                                                {project.name}
                                            </Heading>
                                            <StatusBadge status={project.status} size="sm" />
                                        </HStack>

                                        <Text fontSize="sm" color="text.secondary" noOfLines={3}>
                                            {project.description || 'No description'}
                                        </Text>

                                        <HStack fontSize="xs" color="text.secondary" w="full">
                                            <Icon viewBox="0 0 24 24" boxSize={4}>
                                                <path fill="currentColor" d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
                                            </Icon>
                                            <Text>
                                                Started {new Date(project.startDate).toLocaleDateString()}
                                            </Text>
                                        </HStack>

                                        <Button variant="outline" size="sm" w="full">
                                            View Project →
                                        </Button>
                                    </VStack>
                                </GlassCard>
                            ))}
                        </SimpleGrid>
                    )}
                </VStack>
            </Container>
        </ClientSidebarWrapper>
    );
}

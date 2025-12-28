'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import {
    Box, Container, Heading, Text, VStack, HStack, SimpleGrid,
    Spinner, Icon, Button, Input, useToast, Badge
} from '@chakra-ui/react';
import GlassCard from '../../../components/GlassCard';
import StatusBadge from '../../../components/StatusBadge';

export default function AdminClientDetail() {
    const { data: session } = useSession();
    const router = useRouter();
    const params = useParams();
    const toast = useToast();

    const clientId = params.id;
    const [client, setClient] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (clientId) {
            fetchClient();
            fetchProjects();
        }
    }, [clientId]);

    const fetchClient = async () => {
        try {
            const res = await fetch(`/api/clients/${clientId}`);
            const data = await res.json();
            if (res.ok) {
                setClient(data.client);
            }
        } catch (error) {
            console.error('Error fetching client:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchProjects = async () => {
        try {
            const res = await fetch('/api/projects');
            const data = await res.json();
            if (res.ok) {
                const clientProjects = data.projects.filter(p => p.clientId === clientId);
                setProjects(clientProjects);
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    if (loading) {
        return (
            <Box minH="100vh" bg="bg.app" display="flex" alignItems="center" justifyContent="center">
                <Spinner size="xl" color="brand.500" />
            </Box>
        );
    }

    if (!client) return null;

    return (
        <Box minH="100vh" bg="bg.app">
            {/* Header */}
            <Box bg="white" borderBottom="1px" borderColor="gray.200" py={4}>
                <Container maxW="container.xl">
                    <Button
                        variant="ghost"
                        onClick={() => router.push('/admin')}
                        leftIcon={
                            <Icon viewBox="0 0 24 24">
                                <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                            </Icon>
                        }
                    >
                        Back to Dashboard
                    </Button>
                </Container>
            </Box>

            <Container maxW="container.xl" py={12}>
                <VStack spacing={8} align="stretch">
                    {/* Client Header */}
                    <Box>
                        <Heading size="2xl" color="text.main" mb={2}>
                            {client.name}
                        </Heading>
                        <Text color="text.secondary" fontSize="lg">
                            {client.email}
                        </Text>
                    </Box>

                    {/* Client Info */}
                    <GlassCard p={6}>
                        <Heading size="md" color="text.main" mb={6}>Client Information</Heading>
                        <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                            <Box>
                                <Text fontSize="sm" color="text.secondary" fontWeight="semibold" mb={1}>
                                    Company
                                </Text>
                                <Text fontSize="md" color="text.main">
                                    {client.company || 'Not provided'}
                                </Text>
                            </Box>
                            <Box>
                                <Text fontSize="sm" color="text.secondary" fontWeight="semibold" mb={1}>
                                    Industry
                                </Text>
                                {client.industry ? (
                                    <Badge colorScheme="blue">{client.industry}</Badge>
                                ) : (
                                    <Text fontSize="md" color="text.main">Not provided</Text>
                                )}
                            </Box>
                            <Box>
                                <Text fontSize="sm" color="text.secondary" fontWeight="semibold" mb={1}>
                                    Phone
                                </Text>
                                <Text fontSize="md" color="text.main">
                                    {client.phone || 'Not provided'}
                                </Text>
                            </Box>
                            <Box>
                                <Text fontSize="sm" color="text.secondary" fontWeight="semibold" mb={1}>
                                    Website
                                </Text>
                                <Text fontSize="md" color="text.main">
                                    {client.website || 'Not provided'}
                                </Text>
                            </Box>
                        </SimpleGrid>
                    </GlassCard>

                    {/* Projects */}
                    <Box>
                        <HStack justify="space-between" mb={6}>
                            <Heading size="lg" color="text.main">
                                Projects ({projects.length})
                            </Heading>
                            <Button
                                bg="brand.500"
                                color="white"
                                size="sm"
                                _hover={{ bg: 'brand.600' }}
                                onClick={() => alert('Create project for client - coming soon')}
                            >
                                + New Project
                            </Button>
                        </HStack>

                        {projects.length === 0 ? (
                            <GlassCard p={12} textAlign="center">
                                <Text color="text.secondary">No projects yet</Text>
                            </GlassCard>
                        ) : (
                            <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                                {projects.map((project) => (
                                    <GlassCard
                                        key={project._id}
                                        p={6}
                                        onClick={() => router.push(`/admin/projects/${project._id}`)}
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

                                            <Text fontSize="sm" color="text.secondary" noOfLines={2}>
                                                {project.description || 'No description'}
                                            </Text>

                                            <HStack fontSize="xs" color="text.secondary">
                                                <Icon viewBox="0 0 24 24" boxSize={4}>
                                                    <path fill="currentColor" d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
                                                </Icon>
                                                <Text>
                                                    Started {new Date(project.startDate).toLocaleDateString()}
                                                </Text>
                                            </HStack>

                                            <Button variant="outline" size="sm" w="full">
                                                Manage Project →
                                            </Button>
                                        </VStack>
                                    </GlassCard>
                                ))}
                            </SimpleGrid>
                        )}
                    </Box>
                </VStack>
            </Container>
        </Box>
    );
}

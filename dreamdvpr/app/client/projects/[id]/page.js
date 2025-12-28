'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { Box, Container, Heading, Text, VStack, HStack, Tabs, TabList, TabPanels, Tab, TabPanel, Spinner, Icon, Button } from '@chakra-ui/react';
import GlassCard from '../../../components/GlassCard';
import StatusBadge from '../../../components/StatusBadge';
import ProjectTimeline from '../../../components/ProjectTimeline';
import FileUploadZone from '../../../components/FileUploadZone';

export default function ProjectDetailPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const params = useParams();
    const projectId = params.id;

    const [project, setProject] = useState(null);
    const [timeline, setTimeline] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (projectId) {
            fetchProject();
            fetchTimeline();
        }
    }, [projectId]);

    const fetchProject = async () => {
        try {
            const res = await fetch(`/api/projects/${projectId}`);
            const data = await res.json();
            if (res.ok) {
                setProject(data.project);
            } else {
                alert(data.error || 'Failed to fetch project');
                router.push('/client');
            }
        } catch (error) {
            console.error('Fetch project error:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTimeline = async () => {
        try {
            const res = await fetch(`/api/timeline?projectId=${projectId}`);
            const data = await res.json();
            if (res.ok) {
                setTimeline(data.events || []);
            }
        } catch (error) {
            console.error('Fetch timeline error:', error);
        }
    };

    const handleFilesSelected = (files) => {
        console.log('Files selected:', files);
        alert('File upload will be implemented in the next phase');
    };

    if (loading) {
        return (
            <Box minH="100vh" bg="bg.app" display="flex" alignItems="center" justifyContent="center">
                <Spinner size="xl" color="brand.500" thickness="4px" />
            </Box>
        );
    }

    if (!project) return null;

    return (
        <Box minH="100vh" bg="bg.app">
            {/* Header */}
            <Box bg="white" borderBottom="1px" borderColor="gray.200" py={4}>
                <Container maxW="container.xl">
                    <HStack justify="space-between">
                        <Button
                            variant="ghost"
                            onClick={() => router.push('/client')}
                            leftIcon={
                                <Icon viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                                </Icon>
                            }
                        >
                            Back to Dashboard
                        </Button>
                        <StatusBadge status={project.status} />
                    </HStack>
                </Container>
            </Box>

            <Container maxW="container.xl" py={12}>
                <VStack spacing={8} align="stretch">
                    {/* Project Header */}
                    <Box>
                        <Heading size="2xl" color="text.main" mb={2}>
                            {project.name}
                        </Heading>
                        <Text color="text.secondary" fontSize="lg">
                            {project.description}
                        </Text>
                    </Box>

                    {/* Project Info */}
                    <GlassCard p={6}>
                        <HStack spacing={8} flexWrap="wrap">
                            <VStack align="start" spacing={1}>
                                <Text fontSize="sm" color="text.secondary" fontWeight="semibold">
                                    Start Date
                                </Text>
                                <Text fontSize="md" color="text.main" fontWeight="medium">
                                    {new Date(project.startDate).toLocaleDateString()}
                                </Text>
                            </VStack>

                            {project.estimatedEndDate && (
                                <VStack align="start" spacing={1}>
                                    <Text fontSize="sm" color="text.secondary" fontWeight="semibold">
                                        Estimated Completion
                                    </Text>
                                    <Text fontSize="md" color="text.main" fontWeight="medium">
                                        {new Date(project.estimatedEndDate).toLocaleDateString()}
                                    </Text>
                                </VStack>
                            )}

                            {project.actualEndDate && (
                                <VStack align="start" spacing={1}>
                                    <Text fontSize="sm" color="text.secondary" fontWeight="semibold">
                                        Completed On
                                    </Text>
                                    <Text fontSize="md" color="text.main" fontWeight="medium">
                                        {new Date(project.actualEndDate).toLocaleDateString()}
                                    </Text>
                                </VStack>
                            )}
                        </HStack>
                    </GlassCard>

                    {/* Tabs */}
                    <GlassCard p={6}>
                        <Tabs colorScheme="brand">
                            <TabList>
                                <Tab fontWeight="semibold">Timeline</Tab>
                                <Tab fontWeight="semibold">Files</Tab>
                                <Tab fontWeight="semibold">Details</Tab>
                            </TabList>

                            <TabPanels>
                                {/* Timeline Tab */}
                                <TabPanel px={0}>
                                    <VStack spacing={6} align="stretch" mt={4}>
                                        <Heading size="md" color="text.main">
                                            Project Timeline
                                        </Heading>
                                        {timeline.length > 0 ? (
                                            <ProjectTimeline events={timeline} editable={false} />
                                        ) : (
                                            <Box textAlign="center" py={16}>
                                                <Icon viewBox="0 0 24 24" boxSize={16} color="gray.300" mb={4}>
                                                    <path fill="currentColor" d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                                                </Icon>
                                                <Text color="text.secondary" fontSize="lg" fontWeight="medium">
                                                    No timeline events yet
                                                </Text>
                                                <Text color="text.secondary" fontSize="sm" mt={2}>
                                                    Our team will add milestones as the project progresses
                                                </Text>
                                            </Box>
                                        )}
                                    </VStack>
                                </TabPanel>

                                {/* Files Tab */}
                                <TabPanel px={0}>
                                    <VStack spacing={8} align="stretch" mt={4}>
                                        <Box>
                                            <Heading size="md" color="text.main" mb={4}>
                                                Shared Files
                                            </Heading>
                                            <Text color="text.secondary" mb={6}>
                                                Upload files to share with our team or download files we've shared with you
                                            </Text>
                                            <FileUploadZone onFilesSelected={handleFilesSelected} />
                                        </Box>

                                        <Box>
                                            <Heading size="sm" color="text.main" mb={4}>
                                                Uploaded Files
                                            </Heading>
                                            <GlassCard p={12} textAlign="center">
                                                <Text color="text.secondary">
                                                    No files uploaded yet
                                                </Text>
                                            </GlassCard>
                                        </Box>
                                    </VStack>
                                </TabPanel>

                                {/* Details Tab */}
                                <TabPanel px={0}>
                                    <VStack spacing={6} align="stretch" mt={4}>
                                        <Heading size="md" color="text.main">
                                            Project Details
                                        </Heading>
                                        <VStack align="stretch" spacing={6}>
                                            <Box>
                                                <Text fontSize="sm" color="text.secondary" fontWeight="semibold" mb={2}>
                                                    Project Name
                                                </Text>
                                                <Text fontSize="md" color="text.main">
                                                    {project.name}
                                                </Text>
                                            </Box>

                                            <Box>
                                                <Text fontSize="sm" color="text.secondary" fontWeight="semibold" mb={2}>
                                                    Description
                                                </Text>
                                                <Text fontSize="md" color="text.main">
                                                    {project.description}
                                                </Text>
                                            </Box>

                                            <Box>
                                                <Text fontSize="sm" color="text.secondary" fontWeight="semibold" mb={2}>
                                                    Status
                                                </Text>
                                                <StatusBadge status={project.status} />
                                            </Box>

                                            {project.budget && (
                                                <Box>
                                                    <Text fontSize="sm" color="text.secondary" fontWeight="semibold" mb={2}>
                                                        Budget
                                                    </Text>
                                                    <Text fontSize="md" color="text.main" fontWeight="bold">
                                                        ${project.budget.toLocaleString()}
                                                    </Text>
                                                </Box>
                                            )}
                                        </VStack>
                                    </VStack>
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </GlassCard>

                    {/* Completion Message */}
                    {project.status === 'completed' && (
                        <GlassCard p={10} textAlign="center" bg="green.50">
                            <VStack spacing={6}>
                                <Box bg="green.100" p={4} rounded="full" display="inline-block">
                                    <Icon viewBox="0 0 24 24" boxSize={16} color="green.600">
                                        <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                    </Icon>
                                </Box>
                                <Heading size="lg" color="green.700">
                                    Project Completed! 🎉
                                </Heading>
                                <Text color="green.600" fontSize="lg">
                                    Thank you for working with DREAMdvpr. We hope you love the results!
                                </Text>
                                <Text fontSize="sm" color="text.secondary">
                                    All project files and deliverables are available in the Files tab.
                                </Text>
                            </VStack>
                        </GlassCard>
                    )}
                </VStack>
            </Container>
        </Box>
    );
}

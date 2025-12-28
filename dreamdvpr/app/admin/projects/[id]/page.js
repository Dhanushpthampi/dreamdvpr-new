'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import {
    Box, Container, Heading, Text, VStack, HStack, Tabs, TabList, TabPanels, Tab, TabPanel,
    Spinner, Icon, Button, Input, Textarea, Select, useToast, Modal, ModalOverlay, ModalContent,
    ModalHeader, ModalBody, ModalFooter, ModalCloseButton, useDisclosure
} from '@chakra-ui/react';
import GlassCard from '../../../components/GlassCard';
import StatusBadge from '../../../components/StatusBadge';
import ProjectTimeline from '../../../components/ProjectTimeline';

export default function AdminProjectDetail() {
    const { data: session } = useSession();
    const router = useRouter();
    const params = useParams();
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const projectId = params.id;
    const [project, setProject] = useState(null);
    const [timeline, setTimeline] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newEvent, setNewEvent] = useState({
        title: '',
        description: '',
        status: 'pending',
        dueDate: '',
    });

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
            }
        } catch (error) {
            console.error('Error fetching project:', error);
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
            console.error('Error fetching timeline:', error);
        }
    };

    const handleUpdateStatus = async (newStatus) => {
        try {
            const res = await fetch(`/api/projects/${projectId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                toast({
                    title: 'Status updated',
                    status: 'success',
                    duration: 3000,
                });
                fetchProject();
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleAddTimelineEvent = async () => {
        if (!newEvent.title) {
            toast({
                title: 'Title is required',
                status: 'error',
                duration: 3000,
            });
            return;
        }

        try {
            const res = await fetch('/api/timeline', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...newEvent,
                    projectId,
                    order: timeline.length,
                }),
            });

            if (res.ok) {
                toast({
                    title: 'Timeline event added',
                    status: 'success',
                    duration: 3000,
                });
                setNewEvent({ title: '', description: '', status: 'pending', dueDate: '' });
                onClose();
                fetchTimeline();
            }
        } catch (error) {
            console.error('Error adding timeline event:', error);
        }
    };

    const handleEventClick = async (event) => {
        const newStatus = prompt(`Update status for "${event.title}"\n\nOptions: pending, in-progress, completed, needs-action, paid`, event.status);

        if (newStatus && ['pending', 'in-progress', 'completed', 'needs-action', 'paid'].includes(newStatus)) {
            try {
                const res = await fetch(`/api/timeline/${event._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: newStatus }),
                });

                if (res.ok) {
                    toast({
                        title: 'Event updated',
                        status: 'success',
                        duration: 3000,
                    });
                    fetchTimeline();
                }
            } catch (error) {
                console.error('Error updating event:', error);
            }
        }
    };

    if (loading) {
        return (
            <Box minH="100vh" bg="bg.app" display="flex" alignItems="center" justifyContent="center">
                <Spinner size="xl" color="brand.500" />
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
                            onClick={() => router.push('/admin')}
                            leftIcon={
                                <Icon viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                                </Icon>
                            }
                        >
                            Back to Dashboard
                        </Button>
                        <HStack spacing={4}>
                            <StatusBadge status={project.status} />
                            <Select
                                value={project.status}
                                onChange={(e) => handleUpdateStatus(e.target.value)}
                                maxW="200px"
                                size="sm"
                            >
                                <option value="onboarding">Onboarding</option>
                                <option value="in-progress">In Progress</option>
                                <option value="on-hold">On Hold</option>
                                <option value="completed">Completed</option>
                            </Select>
                        </HStack>
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
                            Client: {project.client?.name} ({project.client?.email})
                        </Text>
                    </Box>

                    {/* Project Info */}
                    <GlassCard p={6}>
                        <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
                            <Box>
                                <Text fontSize="sm" color="text.secondary" fontWeight="semibold" mb={1}>
                                    Start Date
                                </Text>
                                <Text fontSize="md" color="text.main" fontWeight="medium">
                                    {new Date(project.startDate).toLocaleDateString()}
                                </Text>
                            </Box>
                            <Box>
                                <Text fontSize="sm" color="text.secondary" fontWeight="semibold" mb={1}>
                                    Status
                                </Text>
                                <StatusBadge status={project.status} />
                            </Box>
                            <Box>
                                <Text fontSize="sm" color="text.secondary" fontWeight="semibold" mb={1}>
                                    Description
                                </Text>
                                <Text fontSize="md" color="text.main">
                                    {project.description}
                                </Text>
                            </Box>
                        </SimpleGrid>
                    </GlassCard>

                    {/* Tabs */}
                    <GlassCard p={6}>
                        <Tabs colorScheme="brand">
                            <TabList>
                                <Tab fontWeight="semibold">Timeline Management</Tab>
                                <Tab fontWeight="semibold">Files</Tab>
                                <Tab fontWeight="semibold">Settings</Tab>
                            </TabList>

                            <TabPanels>
                                {/* Timeline Tab */}
                                <TabPanel px={0}>
                                    <VStack spacing={6} align="stretch" mt={4}>
                                        <HStack justify="space-between">
                                            <Heading size="md" color="text.main">
                                                Project Timeline
                                            </Heading>
                                            <Button
                                                bg="brand.500"
                                                color="white"
                                                size="sm"
                                                onClick={onOpen}
                                                _hover={{ bg: 'brand.600' }}
                                            >
                                                + Add Event
                                            </Button>
                                        </HStack>

                                        {timeline.length > 0 ? (
                                            <ProjectTimeline events={timeline} editable={true} onEventClick={handleEventClick} />
                                        ) : (
                                            <Box textAlign="center" py={12}>
                                                <Text color="text.secondary">No timeline events yet. Add one to get started!</Text>
                                            </Box>
                                        )}
                                    </VStack>
                                </TabPanel>

                                {/* Files Tab */}
                                <TabPanel>
                                    <Box textAlign="center" py={12}>
                                        <Text color="text.secondary">File management coming soon</Text>
                                    </Box>
                                </TabPanel>

                                {/* Settings Tab */}
                                <TabPanel>
                                    <VStack spacing={4} align="stretch" mt={4}>
                                        <Box>
                                            <Text fontSize="sm" fontWeight="semibold" mb={2}>Project Name</Text>
                                            <Input value={project.name} isReadOnly />
                                        </Box>
                                        <Box>
                                            <Text fontSize="sm" fontWeight="semibold" mb={2}>Description</Text>
                                            <Textarea value={project.description} isReadOnly rows={4} />
                                        </Box>
                                        <Button colorScheme="red" variant="outline">
                                            Delete Project
                                        </Button>
                                    </VStack>
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </GlassCard>
                </VStack>
            </Container>

            {/* Add Event Modal */}
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add Timeline Event</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={4}>
                            <Box w="full">
                                <Text fontSize="sm" fontWeight="semibold" mb={2}>Title *</Text>
                                <Input
                                    placeholder="e.g., Design Phase Complete"
                                    value={newEvent.title}
                                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                />
                            </Box>
                            <Box w="full">
                                <Text fontSize="sm" fontWeight="semibold" mb={2}>Description</Text>
                                <Textarea
                                    placeholder="Event description..."
                                    value={newEvent.description}
                                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                                    rows={3}
                                />
                            </Box>
                            <Box w="full">
                                <Text fontSize="sm" fontWeight="semibold" mb={2}>Status</Text>
                                <Select
                                    value={newEvent.status}
                                    onChange={(e) => setNewEvent({ ...newEvent, status: e.target.value })}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                    <option value="needs-action">Needs Action</option>
                                    <option value="paid">Paid</option>
                                </Select>
                            </Box>
                            <Box w="full">
                                <Text fontSize="sm" fontWeight="semibold" mb={2}>Due Date</Text>
                                <Input
                                    type="date"
                                    value={newEvent.dueDate}
                                    onChange={(e) => setNewEvent({ ...newEvent, dueDate: e.target.value })}
                                />
                            </Box>
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button bg="brand.500" color="white" onClick={handleAddTimelineEvent} _hover={{ bg: 'brand.600' }}>
                            Add Event
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
}

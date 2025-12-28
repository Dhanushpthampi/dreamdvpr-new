'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Box, Container, Heading, Text, VStack, HStack, Icon, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, useDisclosure } from '@chakra-ui/react';
import GlassCard from '../../components/GlassCard';
import ThemedInput from '../../components/ThemedInput';
import MeetingScheduler from '../../components/MeetingScheduler';

export default function NewProjectPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [profileLoading, setProfileLoading] = useState(true);
    const [profileCompleted, setProfileCompleted] = useState(false);
    const [projectData, setProjectData] = useState({
        name: '',
        description: '',
    });
    const [projectId, setProjectId] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (status === 'authenticated') {
            checkProfileCompletion();
        }
    }, [status]);

    const checkProfileCompletion = async () => {
        try {
            const res = await fetch('/api/user/profile');
            if (res.ok) {
                const data = await res.json();
                setProfileCompleted(data.user?.onboardingCompleted || false);
                if (!data.user?.onboardingCompleted) {
                    onOpen();
                }
            }
        } catch (error) {
            console.error('Error checking profile:', error);
        } finally {
            setProfileLoading(false);
        }
    };

    const validateProjectDetails = () => {
        const newErrors = {};
        if (!projectData.name.trim()) newErrors.name = 'Project name is required';
        if (!projectData.description.trim()) newErrors.description = 'Project description is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCreateProject = async () => {
        if (!validateProjectDetails()) return;

        setLoading(true);
        try {
            const res = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(projectData),
            });

            const data = await res.json();

            if (res.ok) {
                setProjectId(data.projectId);
                setStep(2);
            } else {
                alert(data.error || 'Failed to create project');
            }
        } catch (error) {
            console.error('Create project error:', error);
            alert('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleScheduleMeeting = async (meetingData) => {
        setLoading(true);
        try {
            const res = await fetch('/api/meetings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    projectId,
                    type: 'strategy',
                    scheduledDate: meetingData.date,
                    scheduledTime: meetingData.time,
                    duration: 60,
                }),
            });

            if (res.ok) {
                setStep(3);
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to schedule meeting');
            }
        } catch (error) {
            console.error('Schedule meeting error:', error);
            alert('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (status === 'loading' || profileLoading) {
        return (
            <Box minH="100vh" bg="bg.app" display="flex" alignItems="center" justifyContent="center">
                <Text>Loading...</Text>
            </Box>
        );
    }

    return (
        <Box minH="100vh" bg="bg.app">
            {/* Profile Completion Modal */}
            <Modal isOpen={isOpen} onClose={() => {}} closeOnOverlayClick={false} closeOnEsc={false}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Complete Your Profile First</ModalHeader>
                    <ModalBody>
                        <VStack spacing={4} align="stretch">
                            <Text color="text.secondary">
                                Before creating a project, please complete your profile setup. This helps us better understand your needs and provide personalized service.
                            </Text>
                            <Box bg="brand.50" p={4} rounded="lg">
                                <Text fontSize="sm" fontWeight="semibold" mb={2}>What you'll need:</Text>
                                <VStack align="start" spacing={1} fontSize="sm" color="text.secondary">
                                    <Text>• Company name</Text>
                                    <Text>• Industry</Text>
                                    <Text>• Contact information</Text>
                                </VStack>
                            </Box>
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={() => router.push('/client')}>
                            Cancel
                        </Button>
                        <Button
                            bg="brand.500"
                            color="white"
                            onClick={() => {
                                onClose();
                                router.push('/client/onboarding');
                            }}
                            _hover={{ bg: 'brand.600' }}
                        >
                            Complete Profile
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Header */}
            <Box bg="white" borderBottom="1px" borderColor="gray.200" py={4}>
                <Container maxW="container.xl">
                    <HStack justify="space-between">
                        <Heading size="lg" color="text.main">Start a New Project</Heading>
                        <Button variant="ghost" onClick={() => router.push('/client')}>
                            ← Back to Dashboard
                        </Button>
                    </HStack>
                </Container>
            </Box>

            <Container maxW="container.lg" py={16}>
                <VStack spacing={10}>
                    {/* Step 1: Project Details */}
                    {step === 1 && (
                        <GlassCard p={10} w="full">
                            <VStack spacing={8} align="stretch">
                                <Box textAlign="center" mb={4}>
                                    <Box bg="brand.500" p={4} rounded="xl" display="inline-block" mb={6}>
                                        <Icon viewBox="0 0 24 24" boxSize={12} color="white">
                                            <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
                                        </Icon>
                                    </Box>
                                    <Heading size="lg" color="text.main" mb={2}>
                                        Tell us about your project
                                    </Heading>
                                    <Text color="text.secondary">
                                        Provide some basic information to get started
                                    </Text>
                                </Box>

                                <ThemedInput
                                    label="Project Name"
                                    placeholder="e.g., E-commerce Website Redesign"
                                    value={projectData.name}
                                    onChange={(e) => setProjectData({ ...projectData, name: e.target.value })}
                                    error={errors.name}
                                    required
                                />

                                <ThemedInput
                                    label="Project Description"
                                    type="textarea"
                                    placeholder="Describe what you want to build, your goals, and any specific requirements..."
                                    value={projectData.description}
                                    onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
                                    error={errors.description}
                                    required
                                    rows={6}
                                />

                                <Button
                                    bg="brand.500"
                                    color="white"
                                    size="lg"
                                    w="full"
                                    onClick={handleCreateProject}
                                    isLoading={loading}
                                    _hover={{ bg: 'brand.600' }}
                                >
                                    Continue to Schedule Meeting
                                </Button>
                            </VStack>
                        </GlassCard>
                    )}

                    {/* Step 2: Schedule Strategy Meeting */}
                    {step === 2 && (
                        <GlassCard p={10} w="full">
                            <VStack spacing={8} align="stretch">
                                <Box textAlign="center" mb={4}>
                                    <Box bg="gray.700" p={4} rounded="xl" display="inline-block" mb={6}>
                                        <Icon viewBox="0 0 24 24" boxSize={12} color="white">
                                            <path fill="currentColor" d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
                                        </Icon>
                                    </Box>
                                    <Heading size="lg" color="text.main" mb={2}>
                                        Schedule Your Strategy Meeting
                                    </Heading>
                                    <Text color="text.secondary">
                                        Let's discuss your project in detail
                                    </Text>
                                </Box>

                                <MeetingScheduler onSchedule={handleScheduleMeeting} />
                            </VStack>
                        </GlassCard>
                    )}

                    {/* Step 3: Confirmation */}
                    {step === 3 && (
                        <GlassCard p={12} w="full" textAlign="center">
                            <VStack spacing={8}>
                                <Box bg="green.50" p={4} rounded="full" display="inline-block">
                                    <Icon viewBox="0 0 24 24" boxSize={20} color="green.500">
                                        <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                    </Icon>
                                </Box>

                                <Heading size="xl" color="text.main">
                                    Project Created Successfully!
                                </Heading>

                                <Text fontSize="lg" color="text.secondary" maxW="2xl">
                                    We've received your project details and scheduled your strategy meeting.
                                    Our team will review your requirements and prepare for our discussion.
                                </Text>

                                <GlassCard p={6} w="full" bg="brand.50">
                                    <VStack align="start" spacing={3}>
                                        <Text fontSize="sm" color="text.main" fontWeight="semibold">
                                            What's Next?
                                        </Text>
                                        <VStack align="start" spacing={2}>
                                            <HStack>
                                                <Icon viewBox="0 0 24 24" boxSize={4} color="brand.500">
                                                    <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                                </Icon>
                                                <Text fontSize="sm" color="text.secondary">
                                                    Check your email for meeting confirmation
                                                </Text>
                                            </HStack>
                                            <HStack>
                                                <Icon viewBox="0 0 24 24" boxSize={4} color="brand.500">
                                                    <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                                </Icon>
                                                <Text fontSize="sm" color="text.secondary">
                                                    Prepare any materials you'd like to discuss
                                                </Text>
                                            </HStack>
                                            <HStack>
                                                <Icon viewBox="0 0 24 24" boxSize={4} color="brand.500">
                                                    <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                                </Icon>
                                                <Text fontSize="sm" color="text.secondary">
                                                    Track your project progress in the dashboard
                                                </Text>
                                            </HStack>
                                        </VStack>
                                    </VStack>
                                </GlassCard>

                                <HStack spacing={4} w="full" maxW="md">
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        flex={1}
                                        onClick={() => router.push(`/client/projects/${projectId}`)}
                                    >
                                        View Project
                                    </Button>
                                    <Button
                                        bg="brand.500"
                                        color="white"
                                        size="lg"
                                        flex={1}
                                        onClick={() => router.push('/client')}
                                        _hover={{ bg: 'brand.600' }}
                                    >
                                        Back to Dashboard
                                    </Button>
                                </HStack>
                            </VStack>
                        </GlassCard>
                    )}
                </VStack>
            </Container>
        </Box>
    );
}

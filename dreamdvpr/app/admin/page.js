'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
    Box, Container, Heading, Text, VStack, HStack, SimpleGrid, Icon, Spinner, Button,
    Table, Thead, Tbody, Tr, Th, Td, Badge, Tabs, TabList, TabPanels, Tab, TabPanel,
    Input, InputGroup, InputLeftElement, Modal, ModalOverlay, ModalContent, ModalHeader,
    ModalBody, ModalFooter, ModalCloseButton, useDisclosure, FormControl, FormLabel, useToast
} from '@chakra-ui/react';
import { AdminSidebarWrapper } from '../components/AdminSidebar';
import GlassCard from '../components/GlassCard';
import StatusBadge from '../components/StatusBadge';
import ThemedInput from '../components/ThemedInput';
import ThemedSelect from '../components/ThemedSelect';

const INDUSTRIES = [
    { value: 'ecommerce', label: 'E-commerce' },
    { value: 'saas', label: 'SaaS' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'finance', label: 'Finance' },
    { value: 'realestate', label: 'Real Estate' },
    { value: 'education', label: 'Education' },
    { value: 'technology', label: 'Technology' },
    { value: 'other', label: 'Other' },
];

export default function AdminDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [clients, setClients] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [creating, setCreating] = useState(false);

    const [newClient, setNewClient] = useState({
        name: '',
        email: '',
        password: '',
        company: '',
        industry: '',
        phone: '',
        website: '',
    });

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated') {
            if (session?.user?.role !== 'admin') {
                router.push('/login');
            } else {
                fetchData();
            }
        }
    }, [status, session, router]);

    const fetchData = async () => {
        try {
            const [clientsRes, projectsRes] = await Promise.all([
                fetch('/api/clients'),
                fetch('/api/projects')
            ]);

            const clientsData = await clientsRes.json();
            const projectsData = await projectsRes.json();

            setClients(clientsData.clients || []);
            setProjects(projectsData.projects || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateClient = async () => {
        if (!newClient.name || !newClient.email || !newClient.password) {
            toast({
                title: 'Missing required fields',
                description: 'Name, email, and password are required',
                status: 'error',
                duration: 3000,
            });
            return;
        }

        setCreating(true);
        try {
            const res = await fetch('/api/clients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...newClient,
                    role: 'client',
                    onboardingCompleted: true,
                }),
            });

            if (res.ok) {
                toast({
                    title: 'Client created successfully',
                    status: 'success',
                    duration: 3000,
                });
                setNewClient({
                    name: '',
                    email: '',
                    password: '',
                    company: '',
                    industry: '',
                    phone: '',
                    website: '',
                });
                onClose();
                fetchData();
            } else {
                const data = await res.json();
                toast({
                    title: 'Failed to create client',
                    description: data.error || 'An error occurred',
                    status: 'error',
                    duration: 3000,
                });
            }
        } catch (error) {
            console.error('Error creating client:', error);
            toast({
                title: 'Error',
                description: 'An error occurred while creating the client',
                status: 'error',
                duration: 3000,
            });
        } finally {
            setCreating(false);
        }
    };

    const filteredClients = clients.filter(client =>
        client.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.company?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredProjects = projects.filter(project =>
        project.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (status === 'loading' || loading) {
        return (
            <AdminSidebarWrapper>
                <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
                    <Spinner size="xl" color="brand.500" thickness="4px" />
                </Box>
            </AdminSidebarWrapper>
        );
    }

    const stats = {
        totalClients: clients.length,
        totalProjects: projects.length,
        activeProjects: projects.filter(p => p.status === 'in-progress').length,
        completedProjects: projects.filter(p => p.status === 'completed').length,
    };

    return (
        <AdminSidebarWrapper>
            <Container maxW="container.xl" py={8}>
                <VStack spacing={10} align="stretch">
                    {/* Header */}
                    <Box>
                        <Heading size="2xl" color="text.main" mb={2}>
                            Admin Dashboard
                        </Heading>
                        <Text color="text.secondary" fontSize="lg">
                            Manage clients, projects, and timelines
                        </Text>
                    </Box>

                    {/* Stats */}
                    <SimpleGrid columns={{ base: 2, md: 4 }} gap={6}>
                        <GlassCard p={6}>
                            <VStack align="start" spacing={2}>
                                <Text fontSize="sm" color="text.secondary" fontWeight="medium">
                                    Total Clients
                                </Text>
                                <Heading size="2xl" color="brand.500">
                                    {stats.totalClients}
                                </Heading>
                            </VStack>
                        </GlassCard>

                        <GlassCard p={6}>
                            <VStack align="start" spacing={2}>
                                <Text fontSize="sm" color="text.secondary" fontWeight="medium">
                                    Total Projects
                                </Text>
                                <Heading size="2xl" color="text.main">
                                    {stats.totalProjects}
                                </Heading>
                            </VStack>
                        </GlassCard>

                        <GlassCard p={6}>
                            <VStack align="start" spacing={2}>
                                <Text fontSize="sm" color="text.secondary" fontWeight="medium">
                                    Active Projects
                                </Text>
                                <Heading size="2xl" color="blue.500">
                                    {stats.activeProjects}
                                </Heading>
                            </VStack>
                        </GlassCard>

                        <GlassCard p={6}>
                            <VStack align="start" spacing={2}>
                                <Text fontSize="sm" color="text.secondary" fontWeight="medium">
                                    Completed
                                </Text>
                                <Heading size="2xl" color="green.500">
                                    {stats.completedProjects}
                                </Heading>
                            </VStack>
                        </GlassCard>
                    </SimpleGrid>

                    {/* Main Content */}
                    <GlassCard p={6}>
                        <Tabs colorScheme="brand">
                            <TabList mb={6}>
                                <Tab fontWeight="semibold">Clients</Tab>
                                <Tab fontWeight="semibold">Projects</Tab>
                            </TabList>

                            <TabPanels>
                                {/* Clients Tab */}
                                <TabPanel px={0}>
                                    <VStack spacing={6} align="stretch">
                                        <HStack justify="space-between">
                                            <InputGroup maxW="md">
                                                <InputLeftElement>
                                                    <Icon viewBox="0 0 24 24" color="gray.400">
                                                        <path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                                                    </Icon>
                                                </InputLeftElement>
                                                <Input
                                                    placeholder="Search clients..."
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                />
                                            </InputGroup>
                                            <Button
                                                bg="brand.500"
                                                color="white"
                                                _hover={{ bg: 'brand.600' }}
                                                onClick={onOpen}
                                                leftIcon={
                                                    <Icon viewBox="0 0 24 24">
                                                        <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                                                    </Icon>
                                                }
                                            >
                                                Add Client
                                            </Button>
                                        </HStack>

                                        <Box overflowX="auto">
                                            <Table variant="simple">
                                                <Thead>
                                                    <Tr>
                                                        <Th>Name</Th>
                                                        <Th>Email</Th>
                                                        <Th>Company</Th>
                                                        <Th>Industry</Th>
                                                        <Th>Projects</Th>
                                                        <Th>Actions</Th>
                                                    </Tr>
                                                </Thead>
                                                <Tbody>
                                                    {filteredClients.map((client) => {
                                                        const clientProjects = projects.filter(p => p.clientId === client._id);
                                                        return (
                                                            <Tr key={client._id} _hover={{ bg: 'gray.50' }}>
                                                                <Td fontWeight="medium">{client.name}</Td>
                                                                <Td color="text.secondary">{client.email}</Td>
                                                                <Td>{client.company || '-'}</Td>
                                                                <Td>
                                                                    {client.industry ? (
                                                                        <Badge colorScheme="blue">{client.industry}</Badge>
                                                                    ) : '-'}
                                                                </Td>
                                                                <Td>{clientProjects.length}</Td>
                                                                <Td>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        onClick={() => router.push(`/admin/clients/${client._id}`)}
                                                                    >
                                                                        View
                                                                    </Button>
                                                                </Td>
                                                            </Tr>
                                                        );
                                                    })}
                                                </Tbody>
                                            </Table>

                                            {filteredClients.length === 0 && (
                                                <Box textAlign="center" py={12}>
                                                    <Text color="text.secondary">No clients found</Text>
                                                </Box>
                                            )}
                                        </Box>
                                    </VStack>
                                </TabPanel>

                                {/* Projects Tab */}
                                <TabPanel px={0}>
                                    <VStack spacing={6} align="stretch">
                                        <InputGroup maxW="md">
                                            <InputLeftElement>
                                                <Icon viewBox="0 0 24 24" color="gray.400">
                                                    <path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                                                </Icon>
                                            </InputLeftElement>
                                            <Input
                                                placeholder="Search projects..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                        </InputGroup>

                                        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
                                            {filteredProjects.map((project) => (
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
                                                            <Heading size="sm" color="text.main" noOfLines={1}>
                                                                {project.name}
                                                            </Heading>
                                                            <StatusBadge status={project.status} size="sm" />
                                                        </HStack>

                                                        <Text fontSize="xs" color="text.secondary">
                                                            Client: {project.client?.name || 'Unknown'}
                                                        </Text>

                                                        <Text fontSize="sm" color="text.secondary" noOfLines={2}>
                                                            {project.description || 'No description'}
                                                        </Text>

                                                        <Button variant="outline" size="sm" w="full">
                                                            Manage →
                                                        </Button>
                                                    </VStack>
                                                </GlassCard>
                                            ))}
                                        </SimpleGrid>

                                        {filteredProjects.length === 0 && (
                                            <Box textAlign="center" py={12}>
                                                <Text color="text.secondary">No projects found</Text>
                                            </Box>
                                        )}
                                    </VStack>
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </GlassCard>
                </VStack>
            </Container>

            {/* Add Client Modal */}
            <Modal isOpen={isOpen} onClose={onClose} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add New Client</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={4}>
                            <ThemedInput
                                label="Full Name"
                                placeholder="John Doe"
                                value={newClient.name}
                                onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                                required
                            />
                            <ThemedInput
                                label="Email"
                                type="email"
                                placeholder="john@example.com"
                                value={newClient.email}
                                onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                                required
                            />
                            <ThemedInput
                                label="Password"
                                type="password"
                                placeholder="Enter password"
                                value={newClient.password}
                                onChange={(e) => setNewClient({ ...newClient, password: e.target.value })}
                                required
                            />
                            <ThemedInput
                                label="Company Name"
                                placeholder="Acme Inc."
                                value={newClient.company}
                                onChange={(e) => setNewClient({ ...newClient, company: e.target.value })}
                            />
                            <ThemedSelect
                                label="Industry"
                                placeholder="Select industry"
                                value={newClient.industry}
                                onChange={(e) => setNewClient({ ...newClient, industry: e.target.value })}
                                options={INDUSTRIES}
                            />
                            <ThemedInput
                                label="Phone"
                                type="tel"
                                placeholder="+1 (555) 123-4567"
                                value={newClient.phone}
                                onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                            />
                            <ThemedInput
                                label="Website"
                                type="url"
                                placeholder="https://example.com"
                                value={newClient.website}
                                onChange={(e) => setNewClient({ ...newClient, website: e.target.value })}
                            />
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            bg="brand.500"
                            color="white"
                            onClick={handleCreateClient}
                            isLoading={creating}
                            _hover={{ bg: 'brand.600' }}
                        >
                            Create Client
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </AdminSidebarWrapper>
    );
}

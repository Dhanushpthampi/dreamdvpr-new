'use client';

import { Box, VStack, HStack, Text, Icon, Avatar, Divider, useDisclosure, IconButton, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerBody } from '@chakra-ui/react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

const ClientSidebar = ({ isMobile = false, onClose }) => {
    const router = useRouter();
    const pathname = usePathname();
    const { data: session } = useSession();

    const menuItems = [
        {
            label: 'Dashboard',
            icon: (
                <path fill="currentColor" d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
            ),
            path: '/client',
        },
        {
            label: 'My Projects',
            icon: (
                <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
            ),
            path: '/client/projects',
        },
        {
            label: 'Start New Project',
            icon: (
                <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            ),
            path: '/client/new-project',
        },
        {
            label: 'My Profile',
            icon: (
                <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
            ),
            path: '/client/profile',
        },
        {
            label: 'Invoices',
            icon: (
                <path fill="currentColor" d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
            ),
            path: '/client/invoices',
            badge: 'Soon',
        },
        {
            label: 'Proposals',
            icon: (
                <path fill="currentColor" d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
            ),
            path: '/client/proposals',
            badge: 'Soon',
        },
    ];

    const handleNavigation = (path, badge) => {
        if (badge === 'Soon') {
            alert('This feature is coming soon!');
            return;
        }
        router.push(path);
        if (isMobile && onClose) onClose();
    };

    const isActive = (path) => {
        if (path === '/client') return pathname === '/client';
        return pathname.startsWith(path);
    };

    return (
        <VStack align="stretch" spacing={0} h="full">
            {/* Logo/Brand */}
            <Box p={6} borderBottom="1px" borderColor="gray.200">
                <HStack spacing={3}>
                    <Box bg="brand.500" p={2} rounded="lg">
                        <Icon viewBox="0 0 24 24" boxSize={6} color="white">
                            <path fill="currentColor" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                        </Icon>
                    </Box>
                    <VStack align="start" spacing={0}>
                        <Text fontWeight="bold" fontSize="lg" color="text.main">DREAMdvpr</Text>
                        <Text fontSize="xs" color="text.secondary">Client Portal</Text>
                    </VStack>
                </HStack>
            </Box>

            {/* Navigation */}
            <VStack align="stretch" spacing={1} p={4} flex={1}>
                {menuItems.map((item) => (
                    <HStack
                        key={item.path}
                        px={4}
                        py={3}
                        rounded="lg"
                        cursor="pointer"
                        bg={isActive(item.path) ? 'brand.50' : 'transparent'}
                        color={isActive(item.path) ? 'brand.600' : 'text.secondary'}
                        fontWeight={isActive(item.path) ? 'semibold' : 'medium'}
                        _hover={{ bg: isActive(item.path) ? 'brand.50' : 'gray.50' }}
                        transition="all 0.2s"
                        onClick={() => handleNavigation(item.path, item.badge)}
                    >
                        <Icon viewBox="0 0 24 24" boxSize={5}>
                            {item.icon}
                        </Icon>
                        <Text flex={1}>{item.label}</Text>
                        {item.badge && (
                            <Box bg="gray.200" px={2} py={0.5} rounded="full">
                                <Text fontSize="xs" color="text.secondary">{item.badge}</Text>
                            </Box>
                        )}
                    </HStack>
                ))}
            </VStack>

            <Divider />

            {/* User Profile */}
            <Box p={4}>
                <HStack
                    px={4}
                    py={3}
                    rounded="lg"
                    cursor="pointer"
                    _hover={{ bg: 'gray.50' }}
                    onClick={() => router.push('/api/auth/signout')}
                >
                    <Avatar size="sm" name={session?.user?.name} bg="brand.500" color="white" />
                    <VStack align="start" spacing={0} flex={1}>
                        <Text fontSize="sm" fontWeight="medium" color="text.main" noOfLines={1}>
                            {session?.user?.name}
                        </Text>
                        <Text fontSize="xs" color="text.secondary" noOfLines={1}>
                            {session?.user?.email}
                        </Text>
                    </VStack>
                    <Icon viewBox="0 0 24 24" boxSize={5} color="text.secondary">
                        <path fill="currentColor" d="M16 17v-3H9v-4h7V7l5 5-5 5M14 2a2 2 0 012 2v2h-2V4H5v16h9v-2h2v2a2 2 0 01-2 2H5a2 2 0 01-2-2V4a2 2 0 012-2h9z" />
                    </Icon>
                </HStack>
            </Box>
        </VStack>
    );
};

export const ClientSidebarWrapper = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <Box minH="100vh" bg="bg.app">
            {/* Mobile Header */}
            <Box
                display={{ base: 'block', lg: 'none' }}
                bg="white"
                borderBottom="1px"
                borderColor="gray.200"
                px={4}
                py={3}
            >
                <HStack justify="space-between">
                    <HStack spacing={3}>
                        <Box bg="brand.500" p={2} rounded="lg">
                            <Icon viewBox="0 0 24 24" boxSize={5} color="white">
                                <path fill="currentColor" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                            </Icon>
                        </Box>
                        <Text fontWeight="bold" fontSize="lg" color="text.main">DREAMdvpr</Text>
                    </HStack>
                    <IconButton
                        icon={
                            <Icon viewBox="0 0 24 24" boxSize={6}>
                                <path fill="currentColor" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
                            </Icon>
                        }
                        variant="ghost"
                        onClick={onOpen}
                        aria-label="Open menu"
                    />
                </HStack>
            </Box>

            {/* Desktop Sidebar */}
            <Box display={{ base: 'none', lg: 'block' }} position="fixed" left={0} top={0} bottom={0} w="280px" bg="white" borderRight="1px" borderColor="gray.200" zIndex={10}>
                <ClientSidebar />
            </Box>

            {/* Mobile Drawer */}
            <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerBody p={0}>
                        <ClientSidebar isMobile onClose={onClose} />
                    </DrawerBody>
                </DrawerContent>
            </Drawer>

            {/* Main Content */}
            <Box ml={{ base: 0, lg: '280px' }}>
                {children}
            </Box>
        </Box>
    );
};

export default ClientSidebar;

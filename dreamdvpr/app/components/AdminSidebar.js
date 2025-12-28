'use client';

import { Box, VStack, HStack, Text, Icon, Avatar, Divider, useDisclosure, IconButton, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerBody } from '@chakra-ui/react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

const AdminSidebar = ({ isMobile = false, onClose }) => {
    const router = useRouter();
    const pathname = usePathname();
    const { data: session } = useSession();

    const menuItems = [
        {
            label: 'Dashboard',
            icon: (
                <path fill="currentColor" d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
            ),
            path: '/admin',
        },
        // {
        //     label: 'Clients',
        //     icon: (
        //         <path fill="currentColor" d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
        //     ),
        //     path: '/admin/clients',
        // },
        // {
        //     label: 'Projects',
        //     icon: (
        //         <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
        //     ),
        //     path: '/admin/projects',
        // },
        {
            label: 'Content Management',
            icon: (
                <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
            ),
            path: '/admin/content',
        },
        {
            label: 'Blog Management',
            icon: (
                <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
            ),
            path: '/admin/blogs',
        },
        {
            label: 'Generate Invoice',
            icon: (
                <path fill="currentColor" d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
            ),
            path: '/admin/invoices',
            badge: 'Soon',
        },
        {
            label: 'Generate Proposal',
            icon: (
                <path fill="currentColor" d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
            ),
            path: '/admin/proposals',
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
        if (path === '/admin') return pathname === '/admin';
        return pathname.startsWith(path);
    };

    return (
        <VStack align="stretch" spacing={0} h="full">
            {/* Logo/Brand */}
            <Box p={6} borderBottom="1px" borderColor="gray.200">
                <HStack spacing={3}>
                    <Box bg="brand.500" p={2} rounded="lg">
                        <Icon viewBox="0 0 24 24" boxSize={6} color="white">
                            <path fill="currentColor" d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
                        </Icon>
                    </Box>
                    <VStack align="start" spacing={0}>
                        <Text fontWeight="bold" fontSize="lg" color="text.main">DREAMdvpr</Text>
                        <Text fontSize="xs" color="text.secondary">Admin Portal</Text>
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
                        position="relative"
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

export const AdminSidebarWrapper = ({ children }) => {
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
                                <path fill="currentColor" d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
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
                <AdminSidebar />
            </Box>

            {/* Mobile Drawer */}
            <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerBody p={0}>
                        <AdminSidebar isMobile onClose={onClose} />
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

export default AdminSidebar;

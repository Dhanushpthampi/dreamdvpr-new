'use client';

import {
  Box,
  VStack,
  HStack,
  Text,
  Icon,
  Avatar,
  Divider,
  useDisclosure,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
} from '@chakra-ui/react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useThemeColor } from '../lib/hooks';
import { hexToRgba } from '../lib/utils';

const ClientSidebar = ({ isMobile = false, onClose }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const brandColor = useThemeColor('--color-brand-500', '#00abad');

  const menuItems = [
    { label: 'Dashboard', path: '/client', icon: 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z' },
    { label: 'My Projects', path: '/client/projects', icon: 'M19 3H5c-1.1 0-2 .9-2 2v14z' },
    { label: 'Start New Project', path: '/client/new-project', icon: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z' },
    { label: 'My Profile', path: '/client/profile', icon: 'M12 2C6.48 2 2 6.48 2 12z' },
    { label: 'Invoices', path: '/client/invoices', badge: 'Soon', icon: 'M14 2H6c-1.1 0-1.99.9-1.99 2z' },
    { label: 'Proposals', path: '/client/proposals', badge: 'Soon', icon: 'M19 3h-4.18C14.4 1.84 13.3 1 12 1z' },
  ];

  const isActive = (path) =>
    path === '/client' ? pathname === path : pathname.startsWith(path);

  const handleNavigation = (path, badge) => {
    if (badge === 'Soon') return alert('Coming soon!');
    router.push(path);
    if (isMobile && onClose) onClose();
  };

  return (
    <VStack
      align="stretch"
      h="full"
      bg="transparent"
      backdropFilter="saturate(180%) blur(24px)"
      borderRight="1px solid"
      borderColor="whiteAlpha.300"
    >
      {/* Brand */}
      <Box p={6} borderBottom="1px solid" borderColor="whiteAlpha.300">
        <HStack spacing={3}>
          <Box bg="brand.500" p={2} rounded="lg">
            <Icon viewBox="0 0 24 24" boxSize={6} color="white">
              <path fill="currentColor" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12z" />
            </Icon>
          </Box>
          <VStack align="start" spacing={0}>
            <Text fontWeight="bold" color="text.main">DREAMdvpr</Text>
            <Text fontSize="xs" color="text.secondary">Client Portal</Text>
          </VStack>
        </HStack>
      </Box>

      {/* Nav */}
      <VStack align="stretch" p={4} spacing={1} flex={1}>
        {menuItems.map((item) => {
          const active = isActive(item.path);
          return (
            <HStack
              key={item.path}
              px={4}
              py={3}
              rounded="lg"
              cursor="pointer"
              bg={active ? hexToRgba(brandColor, 0.12) : 'transparent'}
              color={active ? 'brand.500' : 'text.secondary'}
              fontWeight={active ? 'semibold' : 'medium'}
              _hover={{ bg: hexToRgba(brandColor, 0.18) }}
              transition="all 0.2s ease"
              onClick={() => handleNavigation(item.path, item.badge)}
            >
              <Icon viewBox="0 0 24 24" boxSize={5}>
                <path fill="currentColor" d={item.icon} />
              </Icon>
              <Text flex={1}>{item.label}</Text>
              {item.badge && (
                <Box px={2} py={0.5} rounded="full" bg="whiteAlpha.300">
                  <Text fontSize="xs">{item.badge}</Text>
                </Box>
              )}
            </HStack>
          );
        })}
      </VStack>

      <Divider borderColor="whiteAlpha.300" />

      {/* User */}
      <Box p={4}>
        <HStack
          px={4}
          py={3}
          rounded="lg"
          cursor="pointer"
          _hover={{ bg: 'whiteAlpha.200' }}
          onClick={() => router.push('/api/auth/signout')}
        >
          <Avatar size="sm" name={session?.user?.name} />
          <VStack align="start" spacing={0} flex={1}>
            <Text fontSize="sm" fontWeight="medium">{session?.user?.name}</Text>
            <Text fontSize="xs" color="text.secondary">{session?.user?.email}</Text>
          </VStack>
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
        display={{ base: 'flex', lg: 'none' }}
        alignItems="center"
        justifyContent="space-between"
        px={4}
        py={3}
        backdropFilter="blur(20px)"
        borderBottom="1px solid"
        borderColor="whiteAlpha.300"
      >
        <Text fontWeight="bold">DREAMdvpr</Text>
        <IconButton
          variant="ghost"
          onClick={onOpen}
          icon={
            <Icon viewBox="0 0 24 24">
              <path fill="currentColor" d="M3 18h18v-2H3z" />
            </Icon>
          }
        />
      </Box>

      {/* Desktop */}
      <Box
        display={{ base: 'none', lg: 'block' }}
        position="fixed"
        left={0}
        top={0}
        bottom={0}
        w="280px"
        zIndex={10}
      >
        <ClientSidebar />
      </Box>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg="transparent" backdropFilter="blur(24px)">
          <DrawerCloseButton />
          <DrawerBody p={0}>
            <ClientSidebar isMobile onClose={onClose} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Content */}
      <Box ml={{ base: 0, lg: '280px' }}>
        {children}
      </Box>
    </Box>
  );
};

export default ClientSidebar;

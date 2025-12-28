'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Box, Container, Heading, Text, VStack, HStack, Spinner, Icon, Button, Badge } from '@chakra-ui/react';
import { ClientSidebarWrapper } from '../../components/ClientSidebar';
import GlassCard from '../../components/GlassCard';
import ThemedButton from '../../components/ThemedButton';

const INDUSTRIES = {
    'ecommerce': 'E-commerce',
    'saas': 'SaaS',
    'healthcare': 'Healthcare',
    'finance': 'Finance',
    'realestate': 'Real Estate',
    'education': 'Education',
    'technology': 'Technology',
    'other': 'Other',
};

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated') {
            if (session?.user?.role !== 'client') {
                router.push('/login');
            } else {
                fetchProfile();
            }
        }
    }, [status, session, router]);

    const fetchProfile = async () => {
        try {
            const res = await fetch('/api/user/profile');
            if (res.ok) {
                const data = await res.json();
                setProfile(data.user);
                
                // If profile is not completed, redirect to onboarding
                if (!data.user?.onboardingCompleted) {
                    router.push('/client/onboarding');
                }
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
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

    if (!profile) {
        return null;
    }

    return (
        <ClientSidebarWrapper>
            <Container maxW="container.xl" py={8}>
                <VStack spacing={8} align="stretch">
                    {/* Header */}
                    <HStack justify="space-between">
                        <Box>
                            <Heading size="2xl" color="text.main" mb={2}>
                                My Profile
                            </Heading>
                            <Text color="text.secondary" fontSize="lg">
                                View and manage your profile information
                            </Text>
                        </Box>
                        <ThemedButton
                            variant="outline"
                            onClick={() => router.push('/client/onboarding')}
                        >
                            Edit Profile
                        </ThemedButton>
                    </HStack>

                    {/* Profile Card */}
                    <GlassCard p={8}>
                        <VStack spacing={6} align="stretch">
                            {/* Personal Information */}
                            <Box>
                                <Heading size="md" color="text.main" mb={4}>
                                    Personal Information
                                </Heading>
                                <VStack spacing={4} align="stretch">
                                    <HStack justify="space-between" py={2} borderBottom="1px" borderColor="gray.100">
                                        <Text fontWeight="semibold" color="text.secondary">Name</Text>
                                        <Text color="text.main">{profile.name || 'Not provided'}</Text>
                                    </HStack>
                                    <HStack justify="space-between" py={2} borderBottom="1px" borderColor="gray.100">
                                        <Text fontWeight="semibold" color="text.secondary">Email</Text>
                                        <Text color="text.main">{profile.email || 'Not provided'}</Text>
                                    </HStack>
                                </VStack>
                            </Box>

                            {/* Business Information */}
                            <Box>
                                <Heading size="md" color="text.main" mb={4}>
                                    Business Information
                                </Heading>
                                <VStack spacing={4} align="stretch">
                                    <HStack justify="space-between" py={2} borderBottom="1px" borderColor="gray.100">
                                        <Text fontWeight="semibold" color="text.secondary">Company Name</Text>
                                        <Text color="text.main">{profile.company || 'Not provided'}</Text>
                                    </HStack>
                                    <HStack justify="space-between" py={2} borderBottom="1px" borderColor="gray.100">
                                        <Text fontWeight="semibold" color="text.secondary">Industry</Text>
                                        <Badge colorScheme="brand" px={3} py={1} rounded="full">
                                            {INDUSTRIES[profile.industry] || profile.industry || 'Not provided'}
                                        </Badge>
                                    </HStack>
                                    <HStack justify="space-between" py={2} borderBottom="1px" borderColor="gray.100">
                                        <Text fontWeight="semibold" color="text.secondary">Phone Number</Text>
                                        <Text color="text.main">{profile.phone || 'Not provided'}</Text>
                                    </HStack>
                                    <HStack justify="space-between" py={2}>
                                        <Text fontWeight="semibold" color="text.secondary">Website</Text>
                                        {profile.website ? (
                                            <Button
                                                as="a"
                                                href={profile.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                variant="link"
                                                color="brand.500"
                                                rightIcon={
                                                    <Icon viewBox="0 0 24 24" boxSize={4}>
                                                        <path fill="currentColor" d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
                                                    </Icon>
                                                }
                                            >
                                                {profile.website}
                                            </Button>
                                        ) : (
                                            <Text color="text.secondary">Not provided</Text>
                                        )}
                                    </HStack>
                                </VStack>
                            </Box>

                            {/* Status */}
                            <Box>
                                <Heading size="md" color="text.main" mb={4}>
                                    Profile Status
                                </Heading>
                                <HStack spacing={3}>
                                    <Badge
                                        colorScheme={profile.onboardingCompleted ? 'green' : 'yellow'}
                                        px={4}
                                        py={2}
                                        rounded="full"
                                        fontSize="sm"
                                    >
                                        {profile.onboardingCompleted ? '✓ Profile Complete' : '⚠ Profile Incomplete'}
                                    </Badge>
                                    {profile.onboardingCompleted && (
                                        <Text fontSize="sm" color="text.secondary">
                                            Your profile is complete and you can create projects
                                        </Text>
                                    )}
                                </HStack>
                            </Box>
                        </VStack>
                    </GlassCard>
                </VStack>
            </Container>
        </ClientSidebarWrapper>
    );
}

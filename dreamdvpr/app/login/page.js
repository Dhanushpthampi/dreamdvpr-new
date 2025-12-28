'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
    Box, Container, Heading, Text, VStack, HStack, Input, Button, FormControl, FormLabel, Icon, Alert, AlertIcon
} from '@chakra-ui/react';
import Link from 'next/link';
import GlassCard from '../components/GlassCard';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await signIn('credentials', {
                redirect: false,
                email,
                password,
            });

            if (result?.error) {
                setError('Invalid email or password');
            } else {
                // Get session to check role
                const res = await fetch('/api/auth/session');
                const session = await res.json();

                if (session?.user?.role === 'admin') {
                    router.push('/admin');
                } else {
                    router.push('/client');
                }
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box minH="100vh" bg="bg.app" display="flex" alignItems="center" justifyContent="center" py={12}>
            <Container maxW="md">
                <VStack spacing={8}>
                    {/* Back to Home Link */}
                    <Box alignSelf="flex-start" mb={-4}>
                        <Link href="/" style={{ textDecoration: 'none' }}>
                            <HStack spacing={2} color="text.secondary" _hover={{ color: 'brand.500' }} transition="color 0.2s">
                                <Icon viewBox="0 0 24 24" boxSize={5}>
                                    <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                                </Icon>
                                <Text fontWeight="medium">Back to Home</Text>
                            </HStack>
                        </Link>
                    </Box>

                    {/* Logo/Brand */}
                    <VStack spacing={4} textAlign="center">
                        <Box bg="brand.500" p={4} rounded="xl" display="inline-block">
                            <Icon viewBox="0 0 24 24" boxSize={12} color="white">
                                <path fill="currentColor" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                            </Icon>
                        </Box>
                        <VStack spacing={2}>
                            <Heading size="2xl" color="text.main">Welcome Back</Heading>
                            <Text color="text.secondary" fontSize="lg">
                                Sign in to your DREAMdvpr account
                            </Text>
                        </VStack>
                    </VStack>

                    {/* Login Form */}
                    <GlassCard p={8} w="full">
                        <form onSubmit={handleSubmit}>
                            <VStack spacing={6}>
                                {error && (
                                    <Alert status="error" rounded="lg">
                                        <AlertIcon />
                                        {error}
                                    </Alert>
                                )}

                                <FormControl isRequired>
                                    <FormLabel fontWeight="semibold" color="text.main">Email</FormLabel>
                                    <Input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        size="lg"
                                        bg="white"
                                        border="1px solid"
                                        borderColor="gray.300"
                                        _hover={{ borderColor: 'brand.400' }}
                                        _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)' }}
                                    />
                                </FormControl>

                                <FormControl isRequired>
                                    <FormLabel fontWeight="semibold" color="text.main">Password</FormLabel>
                                    <Input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        size="lg"
                                        bg="white"
                                        border="1px solid"
                                        borderColor="gray.300"
                                        _hover={{ borderColor: 'brand.400' }}
                                        _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)' }}
                                    />
                                </FormControl>

                                <Button
                                    type="submit"
                                    bg="brand.500"
                                    color="white"
                                    size="lg"
                                    w="full"
                                    isLoading={loading}
                                    _hover={{ bg: 'brand.600' }}
                                    _active={{ bg: 'brand.700' }}
                                >
                                    Sign In
                                </Button>
                            </VStack>
                        </form>
                    </GlassCard>

                    {/* Test Credentials */}
                    <GlassCard p={6} w="full" bg="blue.50">
                        <VStack align="start" spacing={3}>
                            <HStack>
                                <Icon viewBox="0 0 24 24" boxSize={5} color="blue.600">
                                    <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                </Icon>
                                <Text fontWeight="semibold" color="blue.800">Test Credentials</Text>
                            </HStack>
                            <VStack align="start" spacing={2} fontSize="sm" color="blue.700" w="full">
                                <Box>
                                    <Text fontWeight="medium">Admin Account:</Text>
                                    <Text>Email: admin@dreamdvpr.com</Text>
                                    <Text>Password: admin123</Text>
                                </Box>
                                <Box>
                                    <Text fontWeight="medium">Client Account:</Text>
                                    <Text>Email: client@dreamdvpr.com</Text>
                                    <Text>Password: client123</Text>
                                </Box>
                            </VStack>
                        </VStack>
                    </GlassCard>
                </VStack>
            </Container>
        </Box>
    );
}

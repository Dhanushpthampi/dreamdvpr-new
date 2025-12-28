'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Box, Container, Heading, Text, VStack, HStack, Progress, Icon, Button, Spinner } from '@chakra-ui/react';
import GlassCard from '../../components/GlassCard';
import ThemedInput from '../../components/ThemedInput';
import ThemedSelect from '../../components/ThemedSelect';

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

export default function OnboardingPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [checkingProfile, setCheckingProfile] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        company: '',
        industry: '',
        phone: '',
        website: '',
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (status === 'authenticated') {
            checkProfile();
        }
    }, [status]);

    const checkProfile = async () => {
        try {
            const res = await fetch('/api/user/profile');
            if (res.ok) {
                const data = await res.json();
                // Pre-fill form with existing data
                if (data.user) {
                    setFormData({
                        company: data.user.company || '',
                        industry: data.user.industry || '',
                        phone: data.user.phone || '',
                        website: data.user.website || '',
                    });
                    setIsEditing(data.user.onboardingCompleted || false);
                }
            }
        } catch (error) {
            console.error('Error checking profile:', error);
        } finally {
            setCheckingProfile(false);
        }
    };

    const totalSteps = 2;
    const progress = (step / totalSteps) * 100;

    const validateStep1 = () => {
        const newErrors = {};
        if (!formData.company.trim()) newErrors.company = 'Company name is required';
        if (!formData.industry) newErrors.industry = 'Please select an industry';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors = {};
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (step === 1 && validateStep1()) {
            setStep(2);
            setErrors({});
        }
    };

    const handleBack = () => {
        setStep(step - 1);
        setErrors({});
    };

    const handleSubmit = async () => {
        if (!validateStep2()) return;

        setLoading(true);
        try {
            const res = await fetch('/api/onboarding', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                router.push('/client/profile');
            } else {
                alert(data.error || 'Failed to save profile');
            }
        } catch (error) {
            console.error('Onboarding error:', error);
            alert('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (checkingProfile || status === 'loading') {
        return (
            <Box minH="100vh" bg="bg.app" display="flex" alignItems="center" justifyContent="center">
                <Spinner size="xl" color="brand.500" thickness="4px" />
            </Box>
        );
    }

    return (
        <Box minH="100vh" bg="bg.app">
            {/* Header */}
            <Box bg="white" borderBottom="1px" borderColor="gray.200" py={4}>
                <Container maxW="container.xl">
                    <HStack justify="space-between">
                        <Heading size="lg" color="text.main">DREAMdvpr</Heading>
                        <Button variant="ghost" onClick={() => router.push('/client')}>
                            Skip for now
                        </Button>
                    </HStack>
                </Container>
            </Box>

            <Container maxW="container.md" py={16}>
                <VStack spacing={10}>
                    {/* Header */}
                    <Box textAlign="center">
                        <Heading size="2xl" color="text.main" mb={4}>
                            {isEditing ? 'Edit Your Profile' : "Welcome to DREAMdvpr! 🎉"}
                        </Heading>
                        <Text color="text.secondary" fontSize="lg">
                            {isEditing ? 'Update your profile information' : "Let's get to know you better"}
                        </Text>
                    </Box>

                    {/* Progress */}
                    <GlassCard p={6} w="full">
                        <VStack spacing={3}>
                            <HStack justify="space-between" w="full">
                                <Text fontSize="sm" fontWeight="semibold" color="text.main">
                                    Step {step} of {totalSteps}
                                </Text>
                                <Text fontSize="sm" color="text.secondary">
                                    {progress.toFixed(0)}% Complete
                                </Text>
                            </HStack>
                            <Progress value={progress} w="full" colorScheme="brand" rounded="full" size="sm" />
                        </VStack>
                    </GlassCard>

                    {/* Form */}
                    <GlassCard p={10} w="full">
                        <VStack spacing={8} align="stretch">
                            {step === 1 && (
                                <>
                                    <Box textAlign="center" mb={4}>
                                        <Box bg="brand.500" p={4} rounded="xl" display="inline-block" mb={6}>
                                            <Icon viewBox="0 0 24 24" boxSize={12} color="white">
                                                <path fill="currentColor" d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" />
                                            </Icon>
                                        </Box>
                                        <Heading size="lg" color="text.main" mb={2}>
                                            Tell us about your business
                                        </Heading>
                                        <Text color="text.secondary">
                                            This helps us tailor our services to your needs
                                        </Text>
                                    </Box>

                                    <ThemedInput
                                        label="Company Name"
                                        placeholder="Enter your company name"
                                        value={formData.company}
                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                        error={errors.company}
                                        required
                                    />

                                    <ThemedSelect
                                        label="Industry"
                                        placeholder="Select your industry"
                                        value={formData.industry}
                                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                                        options={INDUSTRIES}
                                        error={errors.industry}
                                        required
                                    />

                                    <Button
                                        bg="brand.500"
                                        color="white"
                                        size="lg"
                                        w="full"
                                        onClick={handleNext}
                                        _hover={{ bg: 'brand.600' }}
                                    >
                                        Continue
                                    </Button>
                                </>
                            )}

                            {step === 2 && (
                                <>
                                    <Box textAlign="center" mb={4}>
                                        <Box bg="gray.700" p={4} rounded="xl" display="inline-block" mb={6}>
                                            <Icon viewBox="0 0 24 24" boxSize={12} color="white">
                                                <path fill="currentColor" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                                            </Icon>
                                        </Box>
                                        <Heading size="lg" color="text.main" mb={2}>
                                            Contact Information
                                        </Heading>
                                        <Text color="text.secondary">
                                            How can we reach you?
                                        </Text>
                                    </Box>

                                    <ThemedInput
                                        label="Phone Number"
                                        type="tel"
                                        placeholder="+1 (555) 123-4567"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        error={errors.phone}
                                        required
                                    />

                                    <ThemedInput
                                        label="Website (Optional)"
                                        type="url"
                                        placeholder="https://yourwebsite.com"
                                        value={formData.website}
                                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                    />

                                    <HStack spacing={4}>
                                        <Button variant="outline" size="lg" flex={1} onClick={handleBack}>
                                            Back
                                        </Button>
                                        <Button
                                            bg="brand.500"
                                            color="white"
                                            size="lg"
                                            flex={1}
                                            onClick={handleSubmit}
                                            isLoading={loading}
                                            _hover={{ bg: 'brand.600' }}
                                        >
                                            {isEditing ? 'Save Changes' : 'Complete Setup'}
                                        </Button>
                                    </HStack>
                                </>
                            )}
                        </VStack>
                    </GlassCard>
                </VStack>
            </Container>
        </Box>
    );
}

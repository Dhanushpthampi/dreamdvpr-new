'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
    Box, Container, Heading, Text, VStack, HStack, Button, Spinner, useToast,
    Tabs, TabList, TabPanels, Tab, TabPanel, FormControl, FormLabel, Textarea,
    IconButton, Divider, Input, Select, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, SimpleGrid
} from '@chakra-ui/react';
import { Icon } from '@chakra-ui/react';
import { AdminSidebarWrapper } from '../../components/AdminSidebar';
import GlassCard from '../../components/GlassCard';
import ThemedInput from '../../components/ThemedInput';

export default function ContentManagementPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const toast = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [content, setContent] = useState({
        hero: {
            title: '',
            titleHighlight: '',
            subtitle: '',
            ctaText: '',
        },
        services: {
            title: '',
            subtitle: '',
            items: [],
        },
        theme: {
            colors: {
                brand500: '#00abad',
                brand600: '#008c8e',
                accent500: '#ff0000ff',
                bgApp: '#f5f5f7',
                bgSecondary: '#ffffff',
                textMain: '#1d1d1f',
                textSecondary: '#86868b',
            },
            fonts: {
                heading: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
                body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
            },
            borderRadius: 'xl',
            logo: '',
        },
        whyChooseUs: {
            title: '',
            titleHighlight: '',
            subtitle: '',
            points: [],
        },
        comparison: {
            title: '',
            subtitle: '',
            traditionalPoints: [],
            ourPoints: [],
        },
        faq: {
            title: '',
            subtitle: '',
            items: [],
        },
        cta: {
            title: '',
            subtitle: '',
            buttonText: '',
            points: [],
        },
    });

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated') {
            if (session?.user?.role !== 'admin') {
                router.push('/login');
            } else {
                fetchContent();
            }
        }
    }, [status, session, router]);

    const fetchContent = async () => {
        try {
            const res = await fetch('/api/content', { cache: 'no-store' });
            const data = await res.json();
            if (data.content) {
                // Ensure theme is initialized
                const contentWithTheme = {
                    ...data.content,
                    theme: data.content.theme || {
                        colors: {
                            brand500: '#00abad',
                            brand600: '#008c8e',
                            accent500: '#ff0000ff',
                            bgApp: '#f5f5f7',
                            bgSecondary: '#ffffff',
                            textMain: '#1d1d1f',
                            textSecondary: '#86868b',
                        },
                        fonts: {
                            heading: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
                            body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
                        },
                        borderRadius: 'xl',
                        logo: '',
                    },
                };
                setContent(contentWithTheme);
            }
        } catch (error) {
            console.error('Error fetching content:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/content', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(content),
            });

            if (res.ok) {
                toast({
                    title: 'Content saved',
                    description: 'Homepage content has been updated successfully',
                    status: 'success',
                    duration: 3000,
                });
                // Trigger theme update immediately with the new theme data
                if (content.theme) {
                    // Update localStorage for cross-tab sync
                    if (typeof window !== 'undefined' && window.localStorage) {
                        localStorage.setItem('theme-updated', JSON.stringify(content.theme));
                    }
                    
                    // Dispatch event for same-tab update
                    window.dispatchEvent(new CustomEvent('theme-updated', { detail: content.theme }));
                    
                    // Trigger storage event manually for same-tab (storage event only fires in other tabs)
                    const storageEvent = new StorageEvent('storage', {
                        key: 'theme-updated',
                        newValue: JSON.stringify(content.theme),
                    });
                    window.dispatchEvent(storageEvent);
                }
                
                // Reload only once after save to get fresh server-rendered content
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                throw new Error('Failed to save content');
            }
        } catch (error) {
            console.error('Error saving content:', error);
            toast({
                title: 'Error',
                description: 'Failed to save content',
                status: 'error',
                duration: 3000,
            });
        } finally {
            setSaving(false);
        }
    };

    if (status === 'loading' || loading) {
        return (
            <AdminSidebarWrapper>
                <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
                    <Spinner size="xl" color="brand.500" thickness="4px" />
                </Box>
            </AdminSidebarWrapper>
        );
    }

    return (
        <AdminSidebarWrapper>
            <Container maxW="container.xl" py={8}>
                <VStack spacing={8} align="stretch">
                    <HStack justify="space-between">
                        <Box>
                            <Heading size="2xl" color="text.main" mb={2}>
                                Content Management
                            </Heading>
                            <Text color="text.secondary" fontSize="lg">
                                Edit homepage content and sections
                            </Text>
                        </Box>
                        <Button
                            bg="brand.500"
                            color="white"
                            onClick={handleSave}
                            isLoading={saving}
                            _hover={{ bg: 'brand.600' }}
                        >
                            Save Changes
                        </Button>
                    </HStack>

                    <GlassCard p={6}>
                        <Tabs colorScheme="brand">
                            <TabList>
                                <Tab>Hero Section</Tab>
                                <Tab>Services</Tab>
                                <Tab>Why Choose Us</Tab>
                                <Tab>Comparison</Tab>
                                <Tab>FAQ</Tab>
                                <Tab>CTA Section</Tab>
                                <Tab>Theme</Tab>
                            </TabList>

                            <TabPanels>
                                <TabPanel>
                                    <VStack spacing={4} align="stretch">
                                        <ThemedInput
                                            label="Title"
                                            value={content.hero.title}
                                            onChange={(e) => setContent({
                                                ...content,
                                                hero: { ...content.hero, title: e.target.value }
                                            })}
                                        />
                                        <ThemedInput
                                            label="Title Highlight (text to highlight in brand color)"
                                            value={content.hero.titleHighlight || ''}
                                            onChange={(e) => setContent({
                                                ...content,
                                                hero: { ...content.hero, titleHighlight: e.target.value }
                                            })}
                                        />
                                        <ThemedInput
                                            label="Subtitle"
                                            type="textarea"
                                            value={content.hero.subtitle}
                                            onChange={(e) => setContent({
                                                ...content,
                                                hero: { ...content.hero, subtitle: e.target.value }
                                            })}
                                            rows={3}
                                        />
                                        <ThemedInput
                                            label="CTA Button Text"
                                            value={content.hero.ctaText}
                                            onChange={(e) => setContent({
                                                ...content,
                                                hero: { ...content.hero, ctaText: e.target.value }
                                            })}
                                        />
                                    </VStack>
                                </TabPanel>

                                <TabPanel>
                                    <VStack spacing={4} align="stretch">
                                        <ThemedInput
                                            label="Title"
                                            value={content.services.title}
                                            onChange={(e) => setContent({
                                                ...content,
                                                services: { ...content.services, title: e.target.value }
                                            })}
                                        />
                                        <ThemedInput
                                            label="Subtitle"
                                            value={content.services.subtitle}
                                            onChange={(e) => setContent({
                                                ...content,
                                                services: { ...content.services, subtitle: e.target.value }
                                            })}
                                        />
                                        <Divider />
                                        <Box>
                                            <HStack justify="space-between" mb={3}>
                                                <Text fontWeight="semibold">Service Items</Text>
                                                <Button
                                                    size="sm"
                                                    onClick={() => setContent({
                                                        ...content,
                                                        services: {
                                                            ...content.services,
                                                            items: [...(content.services.items || []), {
                                                                title: '',
                                                                description: '',
                                                                colSpan: 1,
                                                                rowSpan: 1,
                                                                iconColor: 'brand.500',
                                                            }]
                                                        }
                                                    })}
                                                >
                                                    Add Service
                                                </Button>
                                            </HStack>
                                            <VStack spacing={4} align="stretch">
                                                {(content.services.items || []).map((item, index) => (
                                                    <Box key={index} p={4} border="1px" borderColor="gray.200" rounded="lg">
                                                        <VStack spacing={3} align="stretch">
                                                            <HStack justify="space-between">
                                                                <Text fontWeight="semibold">Service #{index + 1}</Text>
                                                                <IconButton
                                                                    icon={
                                                                        <Icon viewBox="0 0 24 24">
                                                                            <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                                                                        </Icon>
                                                                    }
                                                                    onClick={() => {
                                                                        const newItems = content.services.items.filter((_, i) => i !== index);
                                                                        setContent({
                                                                            ...content,
                                                                            services: { ...content.services, items: newItems }
                                                                        });
                                                                    }}
                                                                    aria-label="Remove service"
                                                                    size="sm"
                                                                />
                                                            </HStack>
                                                            <ThemedInput
                                                                label="Title"
                                                                value={item.title}
                                                                onChange={(e) => {
                                                                    const newItems = [...(content.services.items || [])];
                                                                    newItems[index] = { ...newItems[index], title: e.target.value };
                                                                    setContent({
                                                                        ...content,
                                                                        services: { ...content.services, items: newItems }
                                                                    });
                                                                }}
                                                            />
                                                            <ThemedInput
                                                                label="Description"
                                                                type="textarea"
                                                                value={item.description}
                                                                onChange={(e) => {
                                                                    const newItems = [...(content.services.items || [])];
                                                                    newItems[index] = { ...newItems[index], description: e.target.value };
                                                                    setContent({
                                                                        ...content,
                                                                        services: { ...content.services, items: newItems }
                                                                    });
                                                                }}
                                                                rows={2}
                                                            />
                                                            <HStack>
                                                                <FormControl>
                                                                    <FormLabel>Column Span</FormLabel>
                                                                    <NumberInput
                                                                        value={item.colSpan || 1}
                                                                        min={1}
                                                                        max={3}
                                                                        onChange={(valueString) => {
                                                                            const newItems = [...(content.services.items || [])];
                                                                            newItems[index] = { ...newItems[index], colSpan: parseInt(valueString) || 1 };
                                                                            setContent({
                                                                                ...content,
                                                                                services: { ...content.services, items: newItems }
                                                                            });
                                                                        }}
                                                                    >
                                                                        <NumberInputField />
                                                                        <NumberInputStepper>
                                                                            <NumberIncrementStepper />
                                                                            <NumberDecrementStepper />
                                                                        </NumberInputStepper>
                                                                    </NumberInput>
                                                                </FormControl>
                                                                <FormControl>
                                                                    <FormLabel>Row Span</FormLabel>
                                                                    <NumberInput
                                                                        value={item.rowSpan || 1}
                                                                        min={1}
                                                                        max={3}
                                                                        onChange={(valueString) => {
                                                                            const newItems = [...(content.services.items || [])];
                                                                            newItems[index] = { ...newItems[index], rowSpan: parseInt(valueString) || 1 };
                                                                            setContent({
                                                                                ...content,
                                                                                services: { ...content.services, items: newItems }
                                                                            });
                                                                        }}
                                                                    >
                                                                        <NumberInputField />
                                                                        <NumberInputStepper>
                                                                            <NumberIncrementStepper />
                                                                            <NumberDecrementStepper />
                                                                        </NumberInputStepper>
                                                                    </NumberInput>
                                                                </FormControl>
                                                                <FormControl>
                                                                    <FormLabel>Icon Color</FormLabel>
                                                                    <Input
                                                                        type="text"
                                                                        value={item.iconColor || 'brand.500'}
                                                                        onChange={(e) => {
                                                                            const newItems = [...(content.services.items || [])];
                                                                            newItems[index] = { ...newItems[index], iconColor: e.target.value };
                                                                            setContent({
                                                                                ...content,
                                                                                services: { ...content.services, items: newItems }
                                                                            });
                                                                        }}
                                                                        placeholder="brand.500"
                                                                    />
                                                                </FormControl>
                                                            </HStack>
                                                        </VStack>
                                                    </Box>
                                                ))}
                                            </VStack>
                                        </Box>
                                    </VStack>
                                </TabPanel>

                                <TabPanel>
                                    <VStack spacing={4} align="stretch">
                                        <ThemedInput
                                            label="Title"
                                            value={content.whyChooseUs.title}
                                            onChange={(e) => setContent({
                                                ...content,
                                                whyChooseUs: { ...content.whyChooseUs, title: e.target.value }
                                            })}
                                        />
                                        <ThemedInput
                                            label="Title Highlight"
                                            value={content.whyChooseUs.titleHighlight || ''}
                                            onChange={(e) => setContent({
                                                ...content,
                                                whyChooseUs: { ...content.whyChooseUs, titleHighlight: e.target.value }
                                            })}
                                        />
                                        <ThemedInput
                                            label="Subtitle"
                                            type="textarea"
                                            value={content.whyChooseUs.subtitle}
                                            onChange={(e) => setContent({
                                                ...content,
                                                whyChooseUs: { ...content.whyChooseUs, subtitle: e.target.value }
                                            })}
                                            rows={3}
                                        />
                                        <Divider />
                                        <Box>
                                            <HStack justify="space-between" mb={3}>
                                                <Text fontWeight="semibold">Points</Text>
                                                <Button
                                                    size="sm"
                                                    onClick={() => setContent({
                                                        ...content,
                                                        whyChooseUs: {
                                                            ...content.whyChooseUs,
                                                            points: [...(content.whyChooseUs.points || []), '']
                                                        }
                                                    })}
                                                >
                                                    Add Point
                                                </Button>
                                            </HStack>
                                            <VStack spacing={3} align="stretch">
                                                {(content.whyChooseUs.points || []).map((point, index) => (
                                                    <HStack key={index}>
                                                        <ThemedInput
                                                            value={point}
                                                            onChange={(e) => {
                                                                const newPoints = [...(content.whyChooseUs.points || [])];
                                                                newPoints[index] = e.target.value;
                                                                setContent({
                                                                    ...content,
                                                                    whyChooseUs: { ...content.whyChooseUs, points: newPoints }
                                                                });
                                                            }}
                                                            placeholder="Enter point"
                                                        />
                                                        <IconButton
                                                            icon={
                                                                <Icon viewBox="0 0 24 24">
                                                                    <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                                                                </Icon>
                                                            }
                                                            onClick={() => {
                                                                const newPoints = content.whyChooseUs.points.filter((_, i) => i !== index);
                                                                setContent({
                                                                    ...content,
                                                                    whyChooseUs: { ...content.whyChooseUs, points: newPoints }
                                                                });
                                                            }}
                                                            aria-label="Remove point"
                                                        />
                                                    </HStack>
                                                ))}
                                            </VStack>
                                        </Box>
                                    </VStack>
                                </TabPanel>

                                <TabPanel>
                                    <VStack spacing={4} align="stretch">
                                        <ThemedInput
                                            label="Title"
                                            value={content.comparison.title}
                                            onChange={(e) => setContent({
                                                ...content,
                                                comparison: { ...content.comparison, title: e.target.value }
                                            })}
                                        />
                                        <ThemedInput
                                            label="Subtitle"
                                            value={content.comparison.subtitle}
                                            onChange={(e) => setContent({
                                                ...content,
                                                comparison: { ...content.comparison, subtitle: e.target.value }
                                            })}
                                        />
                                        <Divider />
                                        <Box>
                                            <HStack justify="space-between" mb={3}>
                                                <Text fontWeight="semibold">Traditional Agencies Points</Text>
                                                <Button
                                                    size="sm"
                                                    onClick={() => setContent({
                                                        ...content,
                                                        comparison: {
                                                            ...content.comparison,
                                                            traditionalPoints: [...(content.comparison.traditionalPoints || []), '']
                                                        }
                                                    })}
                                                >
                                                    Add Point
                                                </Button>
                                            </HStack>
                                            <VStack spacing={3} align="stretch">
                                                {(content.comparison.traditionalPoints || []).map((point, index) => (
                                                    <HStack key={index}>
                                                        <ThemedInput
                                                            value={point}
                                                            onChange={(e) => {
                                                                const newPoints = [...(content.comparison.traditionalPoints || [])];
                                                                newPoints[index] = e.target.value;
                                                                setContent({
                                                                    ...content,
                                                                    comparison: { ...content.comparison, traditionalPoints: newPoints }
                                                                });
                                                            }}
                                                            placeholder="Enter point"
                                                        />
                                                        <IconButton
                                                            icon={
                                                                <Icon viewBox="0 0 24 24">
                                                                    <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                                                                </Icon>
                                                            }
                                                            onClick={() => {
                                                                const newPoints = content.comparison.traditionalPoints.filter((_, i) => i !== index);
                                                                setContent({
                                                                    ...content,
                                                                    comparison: { ...content.comparison, traditionalPoints: newPoints }
                                                                });
                                                            }}
                                                            aria-label="Remove point"
                                                        />
                                                    </HStack>
                                                ))}
                                            </VStack>
                                        </Box>
                                        <Divider />
                                        <Box>
                                            <HStack justify="space-between" mb={3}>
                                                <Text fontWeight="semibold">Our Points</Text>
                                                <Button
                                                    size="sm"
                                                    onClick={() => setContent({
                                                        ...content,
                                                        comparison: {
                                                            ...content.comparison,
                                                            ourPoints: [...(content.comparison.ourPoints || []), '']
                                                        }
                                                    })}
                                                >
                                                    Add Point
                                                </Button>
                                            </HStack>
                                            <VStack spacing={3} align="stretch">
                                                {(content.comparison.ourPoints || []).map((point, index) => (
                                                    <HStack key={index}>
                                                        <ThemedInput
                                                            value={point}
                                                            onChange={(e) => {
                                                                const newPoints = [...(content.comparison.ourPoints || [])];
                                                                newPoints[index] = e.target.value;
                                                                setContent({
                                                                    ...content,
                                                                    comparison: { ...content.comparison, ourPoints: newPoints }
                                                                });
                                                            }}
                                                            placeholder="Enter point"
                                                        />
                                                        <IconButton
                                                            icon={
                                                                <Icon viewBox="0 0 24 24">
                                                                    <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                                                                </Icon>
                                                            }
                                                            onClick={() => {
                                                                const newPoints = content.comparison.ourPoints.filter((_, i) => i !== index);
                                                                setContent({
                                                                    ...content,
                                                                    comparison: { ...content.comparison, ourPoints: newPoints }
                                                                });
                                                            }}
                                                            aria-label="Remove point"
                                                        />
                                                    </HStack>
                                                ))}
                                            </VStack>
                                        </Box>
                                    </VStack>
                                </TabPanel>

                                <TabPanel>
                                    <VStack spacing={4} align="stretch">
                                        <ThemedInput
                                            label="Title"
                                            value={content.faq.title}
                                            onChange={(e) => setContent({
                                                ...content,
                                                faq: { ...content.faq, title: e.target.value }
                                            })}
                                        />
                                        <ThemedInput
                                            label="Subtitle"
                                            value={content.faq.subtitle}
                                            onChange={(e) => setContent({
                                                ...content,
                                                faq: { ...content.faq, subtitle: e.target.value }
                                            })}
                                        />
                                        <Divider />
                                        <Box>
                                            <HStack justify="space-between" mb={3}>
                                                <Text fontWeight="semibold">FAQ Items</Text>
                                                <Button
                                                    size="sm"
                                                    onClick={() => setContent({
                                                        ...content,
                                                        faq: {
                                                            ...content.faq,
                                                            items: [...(content.faq.items || []), { question: '', answer: '' }]
                                                        }
                                                    })}
                                                >
                                                    Add FAQ
                                                </Button>
                                            </HStack>
                                            <VStack spacing={4} align="stretch">
                                                {(content.faq.items || []).map((item, index) => (
                                                    <Box key={index} p={4} border="1px" borderColor="gray.200" rounded="lg">
                                                        <VStack spacing={3} align="stretch">
                                                            <HStack justify="space-between">
                                                                <Text fontWeight="semibold">FAQ #{index + 1}</Text>
                                                                <IconButton
                                                                    icon={
                                                                        <Icon viewBox="0 0 24 24">
                                                                            <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                                                                        </Icon>
                                                                    }
                                                                    onClick={() => {
                                                                        const newItems = content.faq.items.filter((_, i) => i !== index);
                                                                        setContent({
                                                                            ...content,
                                                                            faq: { ...content.faq, items: newItems }
                                                                        });
                                                                    }}
                                                                    aria-label="Remove FAQ"
                                                                    size="sm"
                                                                />
                                                            </HStack>
                                                            <ThemedInput
                                                                label="Question"
                                                                value={item.question}
                                                                onChange={(e) => {
                                                                    const newItems = [...(content.faq.items || [])];
                                                                    newItems[index] = { ...newItems[index], question: e.target.value };
                                                                    setContent({
                                                                        ...content,
                                                                        faq: { ...content.faq, items: newItems }
                                                                    });
                                                                }}
                                                            />
                                                            <ThemedInput
                                                                label="Answer"
                                                                type="textarea"
                                                                value={item.answer}
                                                                onChange={(e) => {
                                                                    const newItems = [...(content.faq.items || [])];
                                                                    newItems[index] = { ...newItems[index], answer: e.target.value };
                                                                    setContent({
                                                                        ...content,
                                                                        faq: { ...content.faq, items: newItems }
                                                                    });
                                                                }}
                                                                rows={3}
                                                            />
                                                        </VStack>
                                                    </Box>
                                                ))}
                                            </VStack>
                                        </Box>
                                    </VStack>
                                </TabPanel>

                                <TabPanel>
                                    <VStack spacing={4} align="stretch">
                                        <ThemedInput
                                            label="Title"
                                            value={content.cta.title}
                                            onChange={(e) => setContent({
                                                ...content,
                                                cta: { ...content.cta, title: e.target.value }
                                            })}
                                        />
                                        <ThemedInput
                                            label="Subtitle"
                                            value={content.cta.subtitle}
                                            onChange={(e) => setContent({
                                                ...content,
                                                cta: { ...content.cta, subtitle: e.target.value }
                                            })}
                                        />
                                        <ThemedInput
                                            label="Button Text"
                                            value={content.cta.buttonText}
                                            onChange={(e) => setContent({
                                                ...content,
                                                cta: { ...content.cta, buttonText: e.target.value }
                                            })}
                                        />
                                        <Divider />
                                        <Box>
                                            <HStack justify="space-between" mb={3}>
                                                <Text fontWeight="semibold">Points/Features</Text>
                                                <Button
                                                    size="sm"
                                                    onClick={() => setContent({
                                                        ...content,
                                                        cta: {
                                                            ...content.cta,
                                                            points: [...(content.cta.points || []), '']
                                                        }
                                                    })}
                                                >
                                                    Add Point
                                                </Button>
                                            </HStack>
                                            <VStack spacing={3} align="stretch">
                                                {(content.cta.points || []).map((point, index) => (
                                                    <HStack key={index}>
                                                        <ThemedInput
                                                            value={point}
                                                            onChange={(e) => {
                                                                const newPoints = [...(content.cta.points || [])];
                                                                newPoints[index] = e.target.value;
                                                                setContent({
                                                                    ...content,
                                                                    cta: { ...content.cta, points: newPoints }
                                                                });
                                                            }}
                                                            placeholder="Enter point/feature"
                                                        />
                                                        <IconButton
                                                            icon={
                                                                <Icon viewBox="0 0 24 24">
                                                                    <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                                                                </Icon>
                                                            }
                                                            onClick={() => {
                                                                const newPoints = content.cta.points.filter((_, i) => i !== index);
                                                                setContent({
                                                                    ...content,
                                                                    cta: { ...content.cta, points: newPoints }
                                                                });
                                                            }}
                                                            aria-label="Remove point"
                                                        />
                                                    </HStack>
                                                ))}
                                            </VStack>
                                        </Box>
                                    </VStack>
                                </TabPanel>

                                <TabPanel>
                                    <VStack spacing={6} align="stretch">
                                        <Box>
                                            <Heading size="md" mb={4}>Colors</Heading>
                                            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                                                <FormControl>
                                                    <FormLabel>Brand Primary</FormLabel>
                                                    <HStack>
                                                        <Input
                                                            type="color"
                                                            value={content.theme?.colors?.brand500 || '#00abad'}
                                                            onChange={(e) => setContent({
                                                                ...content,
                                                                theme: {
                                                                    ...content.theme,
                                                                    colors: { ...content.theme?.colors, brand500: e.target.value }
                                                                }
                                                            })}
                                                            w="60px"
                                                            h="40px"
                                                            p={1}
                                                        />
                                                        <Input
                                                            value={content.theme?.colors?.brand500 || '#00abad'}
                                                            onChange={(e) => setContent({
                                                                ...content,
                                                                theme: {
                                                                    ...content.theme,
                                                                    colors: { ...content.theme?.colors, brand500: e.target.value }
                                                                }
                                                            })}
                                                        />
                                                    </HStack>
                                                </FormControl>
                                                <FormControl>
                                                    <FormLabel>Brand Secondary</FormLabel>
                                                    <HStack>
                                                        <Input
                                                            type="color"
                                                            value={content.theme?.colors?.brand600 || '#008c8e'}
                                                            onChange={(e) => setContent({
                                                                ...content,
                                                                theme: {
                                                                    ...content.theme,
                                                                    colors: { ...content.theme?.colors, brand600: e.target.value }
                                                                }
                                                            })}
                                                            w="60px"
                                                            h="40px"
                                                            p={1}
                                                        />
                                                        <Input
                                                            value={content.theme?.colors?.brand600 || '#008c8e'}
                                                            onChange={(e) => setContent({
                                                                ...content,
                                                                theme: {
                                                                    ...content.theme,
                                                                    colors: { ...content.theme?.colors, brand600: e.target.value }
                                                                }
                                                            })}
                                                        />
                                                    </HStack>
                                                </FormControl>
                                                <FormControl>
                                                    <FormLabel>Text Main</FormLabel>
                                                    <HStack>
                                                        <Input
                                                            type="color"
                                                            value={content.theme?.colors?.textMain || '#1d1d1f'}
                                                            onChange={(e) => setContent({
                                                                ...content,
                                                                theme: {
                                                                    ...content.theme,
                                                                    colors: { ...content.theme?.colors, textMain: e.target.value }
                                                                }
                                                            })}
                                                            w="60px"
                                                            h="40px"
                                                            p={1}
                                                        />
                                                        <Input
                                                            value={content.theme?.colors?.textMain || '#1d1d1f'}
                                                            onChange={(e) => setContent({
                                                                ...content,
                                                                theme: {
                                                                    ...content.theme,
                                                                    colors: { ...content.theme?.colors, textMain: e.target.value }
                                                                }
                                                            })}
                                                        />
                                                    </HStack>
                                                </FormControl>
                                                <FormControl>
                                                    <FormLabel>Text Secondary</FormLabel>
                                                    <HStack>
                                                        <Input
                                                            type="color"
                                                            value={content.theme?.colors?.textSecondary || '#86868b'}
                                                            onChange={(e) => setContent({
                                                                ...content,
                                                                theme: {
                                                                    ...content.theme,
                                                                    colors: { ...content.theme?.colors, textSecondary: e.target.value }
                                                                }
                                                            })}
                                                            w="60px"
                                                            h="40px"
                                                            p={1}
                                                        />
                                                        <Input
                                                            value={content.theme?.colors?.textSecondary || '#86868b'}
                                                            onChange={(e) => setContent({
                                                                ...content,
                                                                theme: {
                                                                    ...content.theme,
                                                                    colors: { ...content.theme?.colors, textSecondary: e.target.value }
                                                                }
                                                            })}
                                                        />
                                                    </HStack>
                                                </FormControl>
                                                <FormControl>
                                                    <FormLabel>Background Primary</FormLabel>
                                                    <HStack>
                                                        <Input
                                                            type="color"
                                                            value={content.theme?.colors?.bgApp || '#f5f5f7'}
                                                            onChange={(e) => setContent({
                                                                ...content,
                                                                theme: {
                                                                    ...content.theme,
                                                                    colors: { ...content.theme?.colors, bgApp: e.target.value }
                                                                }
                                                            })}
                                                            w="60px"
                                                            h="40px"
                                                            p={1}
                                                        />
                                                        <Input
                                                            value={content.theme?.colors?.bgApp || '#f5f5f7'}
                                                            onChange={(e) => setContent({
                                                                ...content,
                                                                theme: {
                                                                    ...content.theme,
                                                                    colors: { ...content.theme?.colors, bgApp: e.target.value }
                                                                }
                                                            })}
                                                        />
                                                    </HStack>
                                                </FormControl>
                                                <FormControl>
                                                    <FormLabel>Background Secondary</FormLabel>
                                                    <HStack>
                                                        <Input
                                                            type="color"
                                                            value={content.theme?.colors?.bgSecondary || '#ffffff'}
                                                            onChange={(e) => setContent({
                                                                ...content,
                                                                theme: {
                                                                    ...content.theme,
                                                                    colors: { ...content.theme?.colors, bgSecondary: e.target.value }
                                                                }
                                                            })}
                                                            w="60px"
                                                            h="40px"
                                                            p={1}
                                                        />
                                                        <Input
                                                            value={content.theme?.colors?.bgSecondary || '#ffffff'}
                                                            onChange={(e) => setContent({
                                                                ...content,
                                                                theme: {
                                                                    ...content.theme,
                                                                    colors: { ...content.theme?.colors, bgSecondary: e.target.value }
                                                                }
                                                            })}
                                                        />
                                                    </HStack>
                                                </FormControl>
                                                <FormControl>
                                                    <FormLabel>Accent</FormLabel>
                                                    <HStack>
                                                        <Input
                                                            type="color"
                                                            value={content.theme?.colors?.accent500 || '#ff0000ff'}
                                                            onChange={(e) => setContent({
                                                                ...content,
                                                                theme: {
                                                                    ...content.theme,
                                                                    colors: { ...content.theme?.colors, accent500: e.target.value }
                                                                }
                                                            })}
                                                            w="60px"
                                                            h="40px"
                                                            p={1}
                                                        />
                                                        <Input
                                                            value={content.theme?.colors?.accent500 || '#ff0000ff'}
                                                            onChange={(e) => setContent({
                                                                ...content,
                                                                theme: {
                                                                    ...content.theme,
                                                                    colors: { ...content.theme?.colors, accent500: e.target.value }
                                                                }
                                                            })}
                                                        />
                                                    </HStack>
                                                </FormControl>
                                            </SimpleGrid>
                                        </Box>
                                        <Divider />
                                        <Box>
                                            <Heading size="md" mb={4}>Fonts</Heading>
                                            <VStack spacing={4} align="stretch">
                                                <FormControl>
                                                    <FormLabel>Heading Font</FormLabel>
                                                    <Input
                                                        value={content.theme?.fonts?.heading || ''}
                                                        onChange={(e) => setContent({
                                                            ...content,
                                                            theme: {
                                                                ...content.theme,
                                                                fonts: { ...content.theme?.fonts, heading: e.target.value }
                                                            }
                                                        })}
                                                        placeholder="e.g., -apple-system, BlinkMacSystemFont, 'Segoe UI'"
                                                    />
                                                </FormControl>
                                                <FormControl>
                                                    <FormLabel>Body Font</FormLabel>
                                                    <Input
                                                        value={content.theme?.fonts?.body || ''}
                                                        onChange={(e) => setContent({
                                                            ...content,
                                                            theme: {
                                                                ...content.theme,
                                                                fonts: { ...content.theme?.fonts, body: e.target.value }
                                                            }
                                                        })}
                                                        placeholder="e.g., -apple-system, BlinkMacSystemFont, 'Segoe UI'"
                                                    />
                                                </FormControl>
                                            </VStack>
                                        </Box>
                                        <Divider />
                                        <Box>
                                            <Heading size="md" mb={4}>Other Settings</Heading>
                                            <VStack spacing={4} align="stretch">
                                                <FormControl>
                                                    <FormLabel>Border Radius</FormLabel>
                                                    <Select
                                                        value={content.theme?.borderRadius || 'xl'}
                                                        onChange={(e) => setContent({
                                                            ...content,
                                                            theme: { ...content.theme, borderRadius: e.target.value }
                                                        })}
                                                    >
                                                        <option value="none">None</option>
                                                        <option value="sm">Small</option>
                                                        <option value="md">Medium</option>
                                                        <option value="lg">Large</option>
                                                        <option value="xl">Extra Large</option>
                                                        <option value="2xl">2X Large</option>
                                                        <option value="full">Full (Circle)</option>
                                                    </Select>
                                                </FormControl>
                                                <FormControl>
                                                    <FormLabel>Logo URL</FormLabel>
                                                    <Input
                                                        value={content.theme?.logo || ''}
                                                        onChange={(e) => setContent({
                                                            ...content,
                                                            theme: { ...content.theme, logo: e.target.value }
                                                        })}
                                                        placeholder="https://example.com/logo.png"
                                                    />
                                                </FormControl>
                                            </VStack>
                                        </Box>
                                    </VStack>
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </GlassCard>
                </VStack>
            </Container>
        </AdminSidebarWrapper>
    );
}

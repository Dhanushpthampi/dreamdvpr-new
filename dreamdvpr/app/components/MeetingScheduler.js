'use client';

import { useState } from 'react';
import { Box, VStack, HStack, Text, Grid, GridItem, Heading, SimpleGrid } from '@chakra-ui/react';
import ThemedButton from './ThemedButton';
import GlassCard from './GlassCard';

/**
 * Meeting scheduler component with calendar and time slots
 * @param {Object} props
 * @param {function} props.onSchedule - Callback when meeting is scheduled
 * @param {Array} props.availableSlots - Available time slots
 */
const MeetingScheduler = ({ onSchedule, availableSlots = [] }) => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);

    // Generate next 14 days
    const generateDates = () => {
        const dates = [];
        const today = new Date();

        for (let i = 1; i <= 14; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);

            // Skip weekends
            if (date.getDay() !== 0 && date.getDay() !== 6) {
                dates.push(date);
            }
        }

        return dates;
    };

    // Default time slots (9 AM - 5 PM, 1-hour slots)
    const defaultTimeSlots = [
        '09:00 AM', '10:00 AM', '11:00 AM',
        '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
    ];

    const timeSlots = availableSlots.length > 0 ? availableSlots : defaultTimeSlots;
    const dates = generateDates();

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
        });
    };

    const handleSchedule = () => {
        if (selectedDate && selectedTime && onSchedule) {
            onSchedule({
                date: selectedDate,
                time: selectedTime,
            });
        }
    };

    return (
        <VStack spacing={6} align="stretch">
            {/* Date Selection */}
            <Box>
                <Heading size="sm" mb={4} color="gray.700">
                    Select a Date
                </Heading>
                <Grid
                    templateColumns="repeat(auto-fill, minmax(120px, 1fr))"
                    gap={3}
                >
                    {dates.map((date, index) => {
                        const dateStr = date.toISOString().split('T')[0];
                        const isSelected = selectedDate === dateStr;

                        return (
                            <GridItem key={index}>
                                <GlassCard
                                    p={3}
                                    hover={true}
                                    onClick={() => setSelectedDate(dateStr)}
                                    bg={isSelected ? 'brand.500' : 'rgba(255, 255, 255, 0.4)'}
                                    borderColor={isSelected ? 'brand.600' : 'rgba(255, 255, 255, 0.8)'}
                                    textAlign="center"
                                    cursor="pointer"
                                >
                                    <Text
                                        fontSize="xs"
                                        fontWeight="semibold"
                                        color={isSelected ? 'white' : 'gray.600'}
                                        mb={1}
                                    >
                                        {date.toLocaleDateString('en-US', { weekday: 'short' })}
                                    </Text>
                                    <Text
                                        fontSize="lg"
                                        fontWeight="bold"
                                        color={isSelected ? 'white' : 'gray.800'}
                                    >
                                        {date.getDate()}
                                    </Text>
                                    <Text
                                        fontSize="xs"
                                        color={isSelected ? 'white' : 'gray.600'}
                                    >
                                        {date.toLocaleDateString('en-US', { month: 'short' })}
                                    </Text>
                                </GlassCard>
                            </GridItem>
                        );
                    })}
                </Grid>
            </Box>

            {/* Time Selection */}
            {selectedDate && (
                <Box>
                    <Heading size="sm" mb={4} color="gray.700">
                        Select a Time
                    </Heading>
                    <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={3}>
                        {timeSlots.map((time, index) => {
                            const isSelected = selectedTime === time;

                            return (
                                <GlassCard
                                    key={index}
                                    p={3}
                                    hover={true}
                                    onClick={() => setSelectedTime(time)}
                                    bg={isSelected ? 'brand.500' : 'rgba(255, 255, 255, 0.4)'}
                                    borderColor={isSelected ? 'brand.600' : 'rgba(255, 255, 255, 0.8)'}
                                    textAlign="center"
                                    cursor="pointer"
                                >
                                    <Text
                                        fontWeight="semibold"
                                        color={isSelected ? 'white' : 'gray.800'}
                                    >
                                        {time}
                                    </Text>
                                </GlassCard>
                            );
                        })}
                    </SimpleGrid>
                </Box>
            )}

            {/* Confirmation */}
            {selectedDate && selectedTime && (
                <GlassCard p={4}>
                    <VStack spacing={3}>
                        <Text fontWeight="semibold" color="gray.700">
                            Selected Meeting Time:
                        </Text>
                        <Text fontSize="lg" fontWeight="bold" color="brand.600">
                            {formatDate(new Date(selectedDate))} at {selectedTime}
                        </Text>
                        <ThemedButton
                            variant="primary"
                            size="lg"
                            w="full"
                            onClick={handleSchedule}
                        >
                            Confirm Meeting
                        </ThemedButton>
                    </VStack>
                </GlassCard>
            )}
        </VStack>
    );
};

export default MeetingScheduler;

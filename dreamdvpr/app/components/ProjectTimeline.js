'use client';

import { Box, VStack, HStack, Text, Heading, Icon } from '@chakra-ui/react';
import StatusBadge from './StatusBadge';

/**
 * Project timeline visualization component
 * @param {Object} props
 * @param {Array} props.events - Array of timeline events
 * @param {boolean} props.editable - Whether timeline is editable (admin view)
 * @param {function} props.onEventClick - Callback when event is clicked
 */
const ProjectTimeline = ({ events = [], editable = false, onEventClick }) => {
    const getStatusColor = (status) => {
        const colors = {
            pending: 'yellow.400',
            'in-progress': 'blue.500',
            completed: 'green.500',
            'needs-action': 'red.500',
            paid: 'purple.500',
        };
        return colors[status] || 'gray.400';
    };

    const getStatusIcon = (status) => {
        if (status === 'completed') {
            return (
                <Icon viewBox="0 0 24 24" boxSize={6}>
                    <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </Icon>
            );
        }
        return (
            <Icon viewBox="0 0 24 24" boxSize={6}>
                <path fill="currentColor" d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
            </Icon>
        );
    };

    const formatDate = (date) => {
        if (!date) return 'No date set';
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    if (events.length === 0) {
        return (
            <Box textAlign="center" py={8}>
                <Text color="gray.500">No timeline events yet</Text>
            </Box>
        );
    }

    return (
        <VStack align="stretch" spacing={0} position="relative">
            {/* Vertical line */}
            <Box
                position="absolute"
                left="19px"
                top="30px"
                bottom="30px"
                w="2px"
                bg="gray.200"
                zIndex={0}
            />

            {events.map((event, index) => (
                <HStack
                    key={event._id || index}
                    align="start"
                    spacing={4}
                    position="relative"
                    py={4}
                    cursor={editable ? 'pointer' : 'default'}
                    onClick={() => editable && onEventClick && onEventClick(event)}
                    _hover={editable ? { bg: 'rgba(0, 171, 173, 0.05)' } : {}}
                    rounded="lg"
                    px={2}
                    transition="all 0.2s"
                >
                    {/* Status indicator */}
                    <Box
                        position="relative"
                        zIndex={1}
                        bg="white"
                        p={1}
                        rounded="full"
                    >
                        <Box
                            color={getStatusColor(event.status)}
                            bg={`${getStatusColor(event.status)}20`}
                            rounded="full"
                            p={2}
                        >
                            {getStatusIcon(event.status)}
                        </Box>
                    </Box>

                    {/* Event content */}
                    <VStack
                        align="start"
                        flex={1}
                        spacing={2}
                        bg="rgba(255, 255, 255, 0.4)"
                        backdropFilter="blur(10px)"
                        p={4}
                        rounded="lg"
                        border="1px solid"
                        borderColor="rgba(255, 255, 255, 0.8)"
                    >
                        <HStack justify="space-between" w="full">
                            <Heading size="sm" color="gray.800">
                                {event.title}
                            </Heading>
                            <StatusBadge status={event.status} size="sm" />
                        </HStack>

                        {event.description && (
                            <Text fontSize="sm" color="gray.700">
                                {event.description}
                            </Text>
                        )}

                        <HStack spacing={4} fontSize="xs" color="gray.600">
                            <HStack>
                                <Icon viewBox="0 0 24 24" boxSize={4}>
                                    <path
                                        fill="currentColor"
                                        d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"
                                    />
                                </Icon>
                                <Text>Due: {formatDate(event.dueDate)}</Text>
                            </HStack>

                            {event.completedDate && (
                                <HStack>
                                    <Icon viewBox="0 0 24 24" boxSize={4} color="green.500">
                                        <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                    </Icon>
                                    <Text>Completed: {formatDate(event.completedDate)}</Text>
                                </HStack>
                            )}
                        </HStack>
                    </VStack>
                </HStack>
            ))}
        </VStack>
    );
};

export default ProjectTimeline;

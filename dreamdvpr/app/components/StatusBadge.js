'use client';

import { Badge } from '@chakra-ui/react';

/**
 * Status badge component with color-coded statuses
 * @param {Object} props
 * @param {string} props.status - Status type
 * @param {string} props.size - Badge size: 'sm' | 'md' | 'lg'
 */
const StatusBadge = ({ status, size = 'md', ...rest }) => {
    const statusConfig = {
        pending: {
            colorScheme: 'yellow',
            label: 'Pending',
        },
        'in-progress': {
            colorScheme: 'blue',
            label: 'In Progress',
        },
        completed: {
            colorScheme: 'green',
            label: 'Completed',
        },
        'needs-action': {
            colorScheme: 'red',
            label: 'Needs Action',
        },
        paid: {
            colorScheme: 'purple',
            label: 'Paid',
        },
        scheduled: {
            colorScheme: 'cyan',
            label: 'Scheduled',
        },
        cancelled: {
            colorScheme: 'gray',
            label: 'Cancelled',
        },
        'on-hold': {
            colorScheme: 'orange',
            label: 'On Hold',
        },
        onboarding: {
            colorScheme: 'teal',
            label: 'Onboarding',
        },
    };

    const config = statusConfig[status] || { colorScheme: 'gray', label: status };

    return (
        <Badge
            colorScheme={config.colorScheme}
            fontSize={size === 'sm' ? 'xs' : size === 'lg' ? 'md' : 'sm'}
            px={3}
            py={1}
            rounded="full"
            fontWeight="semibold"
            textTransform="capitalize"
            {...rest}
        >
            {config.label}
        </Badge>
    );
};

export default StatusBadge;

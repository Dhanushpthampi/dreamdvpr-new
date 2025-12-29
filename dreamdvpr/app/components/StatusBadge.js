'use client';

/**
 * Status badge component with color-coded statuses
 * @param {Object} props
 * @param {string} props.status - Status type
 * @param {string} props.size - Badge size: 'sm' | 'md' | 'lg'
 */
const StatusBadge = ({ status, size = 'md', className = '', ...rest }) => {
    const statusConfig = {
        pending: {
            bg: 'bg-yellow-100',
            text: 'text-yellow-800',
            label: 'Pending',
        },
        'in-progress': {
            bg: 'bg-blue-100',
            text: 'text-blue-800',
            label: 'In Progress',
        },
        completed: {
            bg: 'bg-green-100',
            text: 'text-green-800',
            label: 'Completed',
        },
        'needs-action': {
            bg: 'bg-red-100',
            text: 'text-red-800',
            label: 'Needs Action',
        },
        paid: {
            bg: 'bg-purple-100',
            text: 'text-purple-800',
            label: 'Paid',
        },
        scheduled: {
            bg: 'bg-cyan-100',
            text: 'text-cyan-800',
            label: 'Scheduled',
        },
        cancelled: {
            bg: 'bg-gray-100',
            text: 'text-gray-800',
            label: 'Cancelled',
        },
        'on-hold': {
            bg: 'bg-orange-100',
            text: 'text-orange-800',
            label: 'On Hold',
        },
        onboarding: {
            bg: 'bg-teal-100',
            text: 'text-teal-800',
            label: 'Onboarding',
        },
    };

    const config = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: status };
    const sizeClass = size === 'sm' ? 'text-xs px-2 py-1' : size === 'lg' ? 'text-base px-4 py-1.5' : 'text-sm px-3 py-1';

    return (
        <span
            className={`${config.bg} ${config.text} ${sizeClass} rounded-full font-semibold capitalize inline-block ${className}`}
            {...rest}
        >
            {config.label}
        </span>
    );
};

export default StatusBadge;

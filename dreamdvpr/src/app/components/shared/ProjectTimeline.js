'use client';

import StatusBadge from '@/app/components/ui/StatusBadge';

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
            pending: '#fbbf24',
            'in-progress': '#3b82f6',
            completed: '#10b981',
            'needs-action': '#ef4444',
            paid: '#a855f7',
        };
        return colors[status] || '#9ca3af';
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
            <div className="text-center py-8">
                <p style={{ color: '#86868b' }}>No timeline events yet</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col relative">
            {/* Vertical line */}
            <div
                className="absolute left-[19px] top-[30px] bottom-[30px] w-0.5 bg-gray-200 z-0"
            />

            {events.map((event, index) => (
                <div
                    key={event._id || index}
                    className={`flex items-start gap-4 relative py-4 px-2 rounded-lg transition-all duration-200 ${editable ? 'cursor-pointer hover:bg-[#e53e3e]/5' : ''
                        }`}
                    onClick={() => editable && onEventClick && onEventClick(event)}
                >
                    {/* Status indicator */}
                    <div className="relative z-10 bg-white p-1 rounded-full flex-shrink-0">
                        <div
                            className="rounded-full p-2 flex items-center justify-center"
                            style={{
                                color: getStatusColor(event.status),
                                backgroundColor: `${getStatusColor(event.status)}20`,
                            }}
                        >
                            {event.status === 'completed' ? (
                                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                </svg>
                            ) : (
                                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                                </svg>
                            )}
                        </div>
                    </div>

                    {/* Event content */}
                    <div className="flex-1 bg-white/40 backdrop-blur-[10px] p-4 rounded-lg border border-white/80">
                        <div className="flex justify-between items-start w-full mb-2">
                            <h3 className="text-base font-semibold" style={{ color: '#1d1d1f' }}>
                                {event.title}
                            </h3>
                            <StatusBadge status={event.status} size="sm" />
                        </div>

                        {event.description && (
                            <p className="text-sm mb-3" style={{ color: '#4b5563' }}>
                                {event.description}
                            </p>
                        )}

                        <div className="flex gap-4 text-xs" style={{ color: '#6b7280' }}>
                            <div className="flex items-center gap-1">
                                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
                                </svg>
                                <span>Due: {formatDate(event.dueDate)}</span>
                            </div>

                            {event.completedDate && (
                                <div className="flex items-center gap-1" style={{ color: '#10b981' }}>
                                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                    </svg>
                                    <span>Completed: {formatDate(event.completedDate)}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProjectTimeline;

'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { AdminSidebarWrapper } from '../../../components/AdminSidebar';
import GlassCard from '../../../components/GlassCard';
import StatusBadge from '../../../components/StatusBadge';
import ProjectTimeline from '../../../components/ProjectTimeline';

export default function AdminProjectDetail() {
    const { data: session } = useSession();
    const router = useRouter();
    const params = useParams();
    const [toast, setToast] = useState(null);

    const projectId = params.id;
    const [project, setProject] = useState(null);
    const [timeline, setTimeline] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('timeline');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [newEvent, setNewEvent] = useState({
        title: '',
        description: '',
        status: 'pending',
        dueDate: '',
    });

    const showToast = (title, description, type = 'success') => {
        setToast({ title, description, type });
        setTimeout(() => setToast(null), 3000);
    };

    useEffect(() => {
        if (projectId) {
            fetchProject();
            fetchTimeline();
        }
    }, [projectId]);

    const fetchProject = async () => {
        try {
            const res = await fetch(`/api/projects/${projectId}`);
            const data = await res.json();
            if (res.ok) {
                setProject(data.project);
            }
        } catch (error) {
            console.error('Error fetching project:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTimeline = async () => {
        try {
            const res = await fetch(`/api/timeline?projectId=${projectId}`);
            const data = await res.json();
            if (res.ok) {
                setTimeline(data.events || []);
            }
        } catch (error) {
            console.error('Error fetching timeline:', error);
        }
    };

    const handleUpdateStatus = async (newStatus) => {
        try {
            const res = await fetch(`/api/projects/${projectId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                showToast('Status updated', '', 'success');
                fetchProject();
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleAddTimelineEvent = async () => {
        if (!newEvent.title) {
            showToast('Title is required', '', 'error');
            return;
        }

        try {
            const res = await fetch('/api/timeline', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...newEvent,
                    projectId,
                    order: timeline.length,
                }),
            });

            if (res.ok) {
                showToast('Timeline event added', '', 'success');
                setNewEvent({ title: '', description: '', status: 'pending', dueDate: '' });
                setIsModalOpen(false);
                fetchTimeline();
            }
        } catch (error) {
            console.error('Error adding timeline event:', error);
        }
    };

    const handleEventClick = (event) => {
        setEditingEvent({ ...event });
        setIsEditModalOpen(true);
    };

    const handleUpdateTimelineEvent = async () => {
        if (!editingEvent || !editingEvent.title) {
            showToast('Title is required', '', 'error');
            return;
        }

        try {
            const res = await fetch(`/api/timeline/${editingEvent._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: editingEvent.title,
                    description: editingEvent.description,
                    status: editingEvent.status,
                    dueDate: editingEvent.dueDate,
                }),
            });

            if (res.ok) {
                showToast('Event updated', '', 'success');
                setEditingEvent(null);
                setIsEditModalOpen(false);
                fetchTimeline();
            } else {
                showToast('Error', 'Failed to update event', 'error');
            }
        } catch (error) {
            console.error('Error updating event:', error);
            showToast('Error', 'Failed to update event', 'error');
        }
    };

    const handleDeleteEvent = async (eventId) => {
        if (!window.confirm('Are you sure you want to delete this timeline event?')) return;

        try {
            const res = await fetch(`/api/timeline/${eventId}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                showToast('Event deleted', '', 'success');
                fetchTimeline();
            } else {
                showToast('Error', 'Failed to delete event', 'error');
            }
        } catch (error) {
            console.error('Error deleting event:', error);
            showToast('Error', 'Failed to delete event', 'error');
        }
    };

    if (loading) {
        return (
            <AdminSidebarWrapper>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-t-[#00abad] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
                </div>
            </AdminSidebarWrapper>
        );
    }

    if (!project) return null;

    return (
        <AdminSidebarWrapper>
            <div className="container mx-auto max-w-7xl px-4 py-8">
                <div className="flex flex-col gap-8">
                    {/* Project Header */}
                    <div className="flex justify-between items-start flex-wrap gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-4 mb-4">
                                <button
                                    onClick={() => router.push('/admin')}
                                    className="flex items-center gap-2 text-gray-600 hover:text-[#00abad] transition-colors"
                                >
                                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                                        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                                    </svg>
                                    Back to Dashboard
                                </button>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-2" style={{ color: '#1d1d1f' }}>
                                {project.name}
                            </h1>
                            <p className="text-lg" style={{ color: '#86868b' }}>
                                Client: {project.client?.name} ({project.client?.email})
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <StatusBadge status={project.status} />
                            <select
                                value={project.status}
                                onChange={(e) => handleUpdateStatus(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00abad] text-sm"
                            >
                                <option value="onboarding">Onboarding</option>
                                <option value="in-progress">In Progress</option>
                                <option value="on-hold">On Hold</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                    </div>

                    {/* Project Info */}
                    <GlassCard p={6}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <p className="text-sm font-semibold mb-1" style={{ color: '#86868b' }}>
                                    Start Date
                                </p>
                                <p className="text-base font-medium" style={{ color: '#1d1d1f' }}>
                                    {new Date(project.startDate).toLocaleDateString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-semibold mb-1" style={{ color: '#86868b' }}>
                                    Status
                                </p>
                                <StatusBadge status={project.status} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold mb-1" style={{ color: '#86868b' }}>
                                    Description
                                </p>
                                <p className="text-base" style={{ color: '#1d1d1f' }}>
                                    {project.description}
                                </p>
                            </div>
                        </div>
                    </GlassCard>

                    {/* Tabs */}
                    <GlassCard p={6}>
                        {/* Tab Navigation */}
                        <div className="mb-6 border-b border-gray-200">
                            <div className="flex gap-4">
                                {['timeline', 'files', 'settings'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-4 py-2 font-semibold transition-colors capitalize ${
                                            activeTab === tab
                                                ? 'text-[#00abad] border-b-2 border-[#00abad]'
                                                : 'text-gray-600 hover:text-[#00abad]'
                                        }`}
                                    >
                                        {tab === 'timeline' ? 'Timeline Management' : tab === 'files' ? 'Files' : 'Settings'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tab Panels */}
                        <div>
                            {/* Timeline Tab */}
                            {activeTab === 'timeline' && (
                                <div className="flex flex-col gap-6 mt-4">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-xl font-bold" style={{ color: '#1d1d1f' }}>
                                            Project Timeline
                                        </h2>
                                        <button
                                            onClick={() => setIsModalOpen(true)}
                                            className="px-4 py-2 bg-[#00abad] text-white rounded-lg hover:bg-[#008c8e] transition-colors text-sm flex items-center gap-2"
                                        >
                                            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                                                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                                            </svg>
                                            Add Event
                                        </button>
                                    </div>

                                    {timeline.length > 0 ? (
                                        <div className="space-y-4">
                                            <ProjectTimeline events={timeline} editable={true} onEventClick={handleEventClick} />
                                            <div className="text-sm" style={{ color: '#86868b' }}>
                                                💡 Click on any timeline event to edit it
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <p style={{ color: '#86868b' }}>No timeline events yet. Add one to get started!</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Files Tab */}
                            {activeTab === 'files' && (
                                <div className="text-center py-12">
                                    <p style={{ color: '#86868b' }}>File management coming soon</p>
                                </div>
                            )}

                            {/* Settings Tab */}
                            {activeTab === 'settings' && (
                                <div className="flex flex-col gap-4 mt-4">
                                    <div>
                                        <p className="text-sm font-semibold mb-2">Project Name</p>
                                        <input
                                            type="text"
                                            value={project.name}
                                            readOnly
                                            className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold mb-2">Description</p>
                                        <textarea
                                            value={project.description}
                                            readOnly
                                            rows={4}
                                            className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg"
                                        />
                                    </div>
                                    <button className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors">
                                        Delete Project
                                    </button>
                                </div>
                            )}
                        </div>
                    </GlassCard>
                </div>
            </div>

            {/* Toast Notification */}
            {toast && (
                <div className={`fixed top-4 right-4 px-6 py-4 rounded-lg shadow-lg z-[3000] ${
                    toast.type === 'error' ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-green-50 border border-green-200 text-green-700'
                }`}>
                    <div className="flex items-center gap-2">
                        {toast.type === 'error' ? (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        )}
                        <div>
                            <p className="font-semibold">{toast.title}</p>
                            {toast.description && <p className="text-sm">{toast.description}</p>}
                        </div>
                    </div>
                </div>
            )}

            {/* Add Event Modal */}
            {isModalOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 z-[2000]"
                        onClick={() => setIsModalOpen(false)}
                    />
                    <div className="fixed inset-0 flex items-center justify-center z-[2001] p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                                <h2 className="text-2xl font-bold" style={{ color: '#1d1d1f' }}>Add Timeline Event</h2>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                                    </svg>
                                </button>
                            </div>
                            <div className="p-6">
                                <div className="flex flex-col gap-4">
                                    <div>
                                        <p className="text-sm font-semibold mb-2">Title *</p>
                                        <input
                                            type="text"
                                            placeholder="e.g., Design Phase Complete"
                                            value={newEvent.title}
                                            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00abad]"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold mb-2">Description</p>
                                        <textarea
                                            placeholder="Event description..."
                                            value={newEvent.description}
                                            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                                            rows={3}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00abad]"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold mb-2">Status</p>
                                        <select
                                            value={newEvent.status}
                                            onChange={(e) => setNewEvent({ ...newEvent, status: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00abad]"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="in-progress">In Progress</option>
                                            <option value="completed">Completed</option>
                                            <option value="needs-action">Needs Action</option>
                                            <option value="paid">Paid</option>
                                        </select>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold mb-2">Due Date</p>
                                        <input
                                            type="date"
                                            value={newEvent.dueDate}
                                            onChange={(e) => setNewEvent({ ...newEvent, dueDate: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00abad]"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddTimelineEvent}
                                    className="px-4 py-2 bg-[#00abad] text-white rounded-lg hover:bg-[#008c8e] transition-colors"
                                >
                                    Add Event
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Edit Event Modal */}
            {isEditModalOpen && editingEvent && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 z-[2000]"
                        onClick={() => {
                            setIsEditModalOpen(false);
                            setEditingEvent(null);
                        }}
                    />
                    <div className="fixed inset-0 flex items-center justify-center z-[2001] p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                                <h2 className="text-2xl font-bold" style={{ color: '#1d1d1f' }}>Edit Timeline Event</h2>
                                <button
                                    onClick={() => {
                                        setIsEditModalOpen(false);
                                        setEditingEvent(null);
                                    }}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                                    </svg>
                                </button>
                            </div>
                            <div className="p-6">
                                <div className="flex flex-col gap-4">
                                    <div>
                                        <p className="text-sm font-semibold mb-2">Title *</p>
                                        <input
                                            type="text"
                                            placeholder="e.g., Design Phase Complete"
                                            value={editingEvent.title}
                                            onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00abad]"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold mb-2">Description</p>
                                        <textarea
                                            placeholder="Event description..."
                                            value={editingEvent.description || ''}
                                            onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                                            rows={3}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00abad]"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold mb-2">Status</p>
                                        <select
                                            value={editingEvent.status}
                                            onChange={(e) => setEditingEvent({ ...editingEvent, status: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00abad]"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="in-progress">In Progress</option>
                                            <option value="completed">Completed</option>
                                            <option value="needs-action">Needs Action</option>
                                            <option value="paid">Paid</option>
                                        </select>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold mb-2">Due Date</p>
                                        <input
                                            type="date"
                                            value={editingEvent.dueDate ? editingEvent.dueDate.split('T')[0] : ''}
                                            onChange={(e) => setEditingEvent({ ...editingEvent, dueDate: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00abad]"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
                                <button
                                    onClick={() => handleDeleteEvent(editingEvent._id)}
                                    className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    Delete
                                </button>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => {
                                            setIsEditModalOpen(false);
                                            setEditingEvent(null);
                                        }}
                                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleUpdateTimelineEvent}
                                        className="px-4 py-2 bg-[#00abad] text-white rounded-lg hover:bg-[#008c8e] transition-colors"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </AdminSidebarWrapper>
    );
}

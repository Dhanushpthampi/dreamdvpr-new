'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { ClientSidebarWrapper } from '@/app/components/client/ClientSidebar';
import GlassCard from '@/app/components/ui/GlassCard';
import StatusBadge from '@/app/components/ui/StatusBadge';
import ProjectTimeline from '@/app/components/shared/ProjectTimeline';
import FileUploadZone from '@/app/components/shared/FileUploadZone';

export default function ProjectDetailPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const params = useParams();
    const projectId = params.id;

    const [project, setProject] = useState(null);
    const [timeline, setTimeline] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('timeline');

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
            } else {
                alert(data.error || 'Failed to fetch project');
                router.push('/client');
            }
        } catch (error) {
            console.error('Fetch project error:', error);
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
            console.error('Fetch timeline error:', error);
        }
    };

    const handleFilesSelected = (files) => {
        console.log('Files selected:', files);
        alert('File upload will be implemented in the next phase');
    };

    if (loading) {
        return (
            <ClientSidebarWrapper>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-t-[#00abad] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
                </div>
            </ClientSidebarWrapper>
        );
    }

    if (!project) return null;

    return (
        <ClientSidebarWrapper>
            <div className="container mx-auto max-w-7xl px-4 py-8">
                <div className="flex flex-col gap-8">
                    {/* Project Header */}
                    <div className="flex justify-between items-start flex-wrap gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-4 mb-4">
                                <button
                                    onClick={() => router.push('/client')}
                                    className="flex items-center gap-2 text-gray-600 hover:text-[#00abad] transition-colors"
                                >
                                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                                        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                                    </svg>
                                    Back to Dashboard
                                </button>
                                <StatusBadge status={project.status} />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-2" style={{ color: '#1d1d1f' }}>
                                {project.name}
                            </h1>
                            <p className="text-lg" style={{ color: '#86868b' }}>
                                {project.description}
                            </p>
                        </div>
                    </div>

                    {/* Project Info */}
                    <GlassCard p={6}>
                        <div className="flex gap-8 flex-wrap">
                            <div className="flex flex-col items-start gap-1">
                                <p className="text-sm font-semibold" style={{ color: '#86868b' }}>
                                    Start Date
                                </p>
                                <p className="text-base font-medium" style={{ color: '#1d1d1f' }}>
                                    {new Date(project.startDate).toLocaleDateString()}
                                </p>
                            </div>

                            {project.estimatedEndDate && (
                                <div className="flex flex-col items-start gap-1">
                                    <p className="text-sm font-semibold" style={{ color: '#86868b' }}>
                                        Estimated Completion
                                    </p>
                                    <p className="text-base font-medium" style={{ color: '#1d1d1f' }}>
                                        {new Date(project.estimatedEndDate).toLocaleDateString()}
                                    </p>
                                </div>
                            )}

                            {project.actualEndDate && (
                                <div className="flex flex-col items-start gap-1">
                                    <p className="text-sm font-semibold" style={{ color: '#86868b' }}>
                                        Completed On
                                    </p>
                                    <p className="text-base font-medium" style={{ color: '#1d1d1f' }}>
                                        {new Date(project.actualEndDate).toLocaleDateString()}
                                    </p>
                                </div>
                            )}
                        </div>
                    </GlassCard>

                    {/* Tabs */}
                    <GlassCard p={6}>
                        {/* Tab Navigation */}
                        <div className="mb-6 border-b border-gray-200">
                            <div className="flex gap-4">
                                {['timeline', 'files', 'details'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-4 py-2 font-semibold transition-colors capitalize ${activeTab === tab
                                                ? 'text-[#00abad] border-b-2 border-[#00abad]'
                                                : 'text-gray-600 hover:text-[#00abad]'
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tab Panels */}
                        <div>
                            {/* Timeline Tab */}
                            {activeTab === 'timeline' && (
                                <div className="flex flex-col gap-6 mt-4">
                                    <h2 className="text-xl font-bold" style={{ color: '#1d1d1f' }}>
                                        Project Timeline
                                    </h2>
                                    {timeline.length > 0 ? (
                                        <ProjectTimeline events={timeline} editable={false} />
                                    ) : (
                                        <div className="text-center py-16">
                                            <svg viewBox="0 0 24 24" className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="currentColor">
                                                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                                            </svg>
                                            <p className="text-lg font-medium mb-2" style={{ color: '#86868b' }}>
                                                No timeline events yet
                                            </p>
                                            <p className="text-sm" style={{ color: '#86868b' }}>
                                                Our team will add milestones as the project progresses
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Files Tab */}
                            {activeTab === 'files' && (
                                <div className="flex flex-col gap-8 mt-4">
                                    <div>
                                        <h2 className="text-xl font-bold mb-4" style={{ color: '#1d1d1f' }}>
                                            Shared Files
                                        </h2>
                                        <p className="mb-6" style={{ color: '#86868b' }}>
                                            Upload files to share with our team or download files we've shared with you
                                        </p>
                                        <FileUploadZone onFilesSelected={handleFilesSelected} />
                                    </div>

                                    <div>
                                        <h3 className="text-base font-semibold mb-4" style={{ color: '#1d1d1f' }}>
                                            Uploaded Files
                                        </h3>
                                        <GlassCard p={12} className="text-center">
                                            <p style={{ color: '#86868b' }}>
                                                No files uploaded yet
                                            </p>
                                        </GlassCard>
                                    </div>
                                </div>
                            )}

                            {/* Details Tab */}
                            {activeTab === 'details' && (
                                <div className="flex flex-col gap-6 mt-4">
                                    <h2 className="text-xl font-bold" style={{ color: '#1d1d1f' }}>
                                        Project Details
                                    </h2>
                                    <div className="flex flex-col gap-6">
                                        <div>
                                            <p className="text-sm font-semibold mb-2" style={{ color: '#86868b' }}>
                                                Project Name
                                            </p>
                                            <p style={{ color: '#1d1d1f' }}>
                                                {project.name}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-sm font-semibold mb-2" style={{ color: '#86868b' }}>
                                                Description
                                            </p>
                                            <p style={{ color: '#1d1d1f' }}>
                                                {project.description}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-sm font-semibold mb-2" style={{ color: '#86868b' }}>
                                                Status
                                            </p>
                                            <StatusBadge status={project.status} />
                                        </div>

                                        {project.budget && (
                                            <div>
                                                <p className="text-sm font-semibold mb-2" style={{ color: '#86868b' }}>
                                                    Budget
                                                </p>
                                                <p className="text-base font-bold" style={{ color: '#1d1d1f' }}>
                                                    ${project.budget.toLocaleString()}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </GlassCard>

                    {/* Completion Message */}
                    {project.status === 'completed' && (
                        <GlassCard p={10} className="text-center bg-green-50">
                            <div className="flex flex-col items-center gap-6">
                                <div className="bg-green-100 p-4 rounded-full inline-block">
                                    <svg viewBox="0 0 24 24" className="w-16 h-16 text-green-600" fill="currentColor">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-green-700">
                                    Project Completed! 🎉
                                </h2>
                                <p className="text-lg text-green-600">
                                    Thank you for working with DREAMdvpr. We hope you love the results!
                                </p>
                                <p className="text-sm" style={{ color: '#86868b' }}>
                                    All project files and deliverables are available in the Files tab.
                                </p>
                            </div>
                        </GlassCard>
                    )}
                </div>
            </div>
        </ClientSidebarWrapper>
    );
}

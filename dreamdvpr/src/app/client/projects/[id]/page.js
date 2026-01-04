'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { ClientSidebarWrapper } from '@/app/components/client/ClientSidebar';
import GlassCard from '@/app/components/ui/GlassCard';
import StatusBadge from '@/app/components/ui/StatusBadge';
import ProjectTimeline from '@/app/components/shared/ProjectTimeline';
import FileExplorer from '@/app/components/shared/FileExplorer';

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
                    {/* Project Header / Hero */}
                    <div className="animate-in fade-in slide-in-from-top-6 duration-1000">
                        <div className="overflow-hidden bg-white border border-gray-200 rounded-3xl shadow-xl">
                            <div className="relative p-8 md:p-12">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#00abad]/5 to-transparent pointer-events-none" />
                                <div className="relative flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
                                    <div className="flex-1 space-y-6">
                                        <div className="flex items-center gap-4 mb-2">
                                            <button
                                                onClick={() => router.push('/client/projects')}
                                                className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-[#00abad] transition-colors"
                                            >
                                                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                                                    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                                                </svg>
                                                Back to Projects
                                            </button>
                                            <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">•</span>
                                            <StatusBadge status={project.status} size="sm" />
                                        </div>

                                        <div className="space-y-4">
                                            <h1 className="text-4xl md:text-5xl font-black text-[#1d1d1f] leading-none tracking-tight">
                                                {project.name}
                                            </h1>
                                            <p className="text-gray-500 text-lg font-medium leading-relaxed max-w-3xl">
                                                {project.description || 'Tracking detailed milestones and deliverables for this mission.'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Inception</p>
                                            <p className="text-lg font-black text-[#1d1d1f]">{new Date(project.startDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</p>
                                        </div>
                                        {project.status === 'completed' && (
                                            <>
                                                <div className="w-px h-12 bg-gray-200" />
                                                <div className="text-right">
                                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Completed</p>
                                                    <p className="text-lg font-black text-green-600">{new Date(project.actualEndDate || project.updatedAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Content Tabs */}
                    <GlassCard p={0} className="overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        <div className="border-b border-gray-100 px-8 pt-6 flex gap-4 md:gap-8 overflow-x-auto no-scrollbar">
                            {[
                                { id: 'timeline', label: 'Timeline', icon: 'M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z' },
                                { id: 'files', label: 'Deliverables', icon: 'M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z' },
                                { id: 'details', label: 'Project Info', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`pb-4 px-2 flex items-center gap-2 border-b-2 transition-all font-bold text-sm whitespace-nowrap ${activeTab === tab.id
                                        ? 'border-[#00abad] text-[#00abad]'
                                        : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                                >
                                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                                        <path d={tab.icon} />
                                    </svg>
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="p-8">
                            {activeTab === 'timeline' && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-xl font-bold text-[#1d1d1f]">Project Milestones</h3>
                                        <p className="text-xs font-medium text-gray-400">Chronological Roadmap</p>
                                    </div>
                                    {timeline.length > 0 ? (
                                        <ProjectTimeline events={timeline} editable={false} />
                                    ) : (
                                        <div className="text-center py-20 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                                            <p className="text-gray-400 font-medium italic">Our team is mapping out your project milestones...</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'files' && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-xl font-bold text-[#1d1d1f]">Shared Deliverables</h3>
                                        <p className="text-xs font-medium text-gray-400">Assets & Documentation</p>
                                    </div>
                                    <FileExplorer projectId={project._id} />
                                </div>
                            )}

                            {activeTab === 'details' && (
                                <div className="space-y-8">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-xl font-bold text-[#1d1d1f]">Technical Summary</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-6">
                                            <div>
                                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1.5 focus:outline-none">Identifier</p>
                                                <p className="text-sm font-bold text-[#1d1d1f] flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-gray-200" />
                                                    {project._id}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1.5">Project Scope</p>
                                                <p className="text-sm font-medium text-gray-600 leading-relaxed">
                                                    {project.description || 'Global objectives for this engagement.'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs font-bold text-gray-500">Project Status</span>
                                                <StatusBadge status={project.status} size="sm" />
                                            </div>
                                            <div className="h-px bg-gray-200" />
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs font-bold text-gray-500">Kickoff Date</span>
                                                <span className="text-xs font-bold text-[#1d1d1f]">{new Date(project.startDate).toLocaleDateString()}</span>
                                            </div>
                                            {project.budget && (
                                                <>
                                                    <div className="h-px bg-gray-200" />
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-xs font-bold text-gray-500">Budget Allocated</span>
                                                        <span className="text-xs font-bold text-[#1d1d1f]">${project.budget.toLocaleString()}</span>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </GlassCard>

                    {/* Completion Message */}
                    {project.status === 'completed' && (
                        <div className="animate-in zoom-in duration-1000">
                            <GlassCard p={10} className="text-center bg-green-50/50 border-green-100">
                                <div className="flex flex-col items-center gap-6">
                                    <div className="bg-green-100/50 p-4 rounded-full inline-block">
                                        <svg viewBox="0 0 24 24" className="w-16 h-16 text-green-600" fill="currentColor">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-2xl font-black text-green-700 tracking-tight">
                                        Mission Accomplished 🎉
                                    </h2>
                                    <p className="text-lg text-green-600 font-medium max-w-xl">
                                        This project has been successfully finalized. All assets and documentation are archived in the Deliverables tab.
                                    </p>
                                </div>
                            </GlassCard>
                        </div>
                    )}
                </div>
            </div>
        </ClientSidebarWrapper>
    );
}

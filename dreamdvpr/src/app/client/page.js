'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ClientSidebarWrapper } from '@/app/components/client/ClientSidebar';
import GlassCard from '@/app/components/ui/GlassCard';
import StatusBadge from '@/app/components/ui/StatusBadge';
import ProjectTimeline from '@/app/components/shared/ProjectTimeline';
import FileExplorer from '@/app/components/shared/FileExplorer';

export default function ClientDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [projects, setProjects] = useState([]);
    const [timeline, setTimeline] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('timeline');

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated') {
            if (session?.user?.role !== 'client') {
                router.push('/login');
            } else {
                fetchData();
            }
        }
    }, [status, session, router]);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/projects');
            const data = await res.json();
            const projList = data.projects || [];
            setProjects(projList);

            // Fetch timeline for active project
            const activeProj = projList.find(p => ['in-progress', 'pending', 'onboarding'].includes(p.status.toLowerCase()));
            if (activeProj) {
                const timeRes = await fetch(`/api/timeline?projectId=${activeProj._id}`);
                const timeData = await timeRes.json();
                if (timeRes.ok) {
                    setTimeline(timeData.events || []);
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (status === 'loading' || loading) {
        return (
            <ClientSidebarWrapper>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-t-[#1d1d1f] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
                </div>
            </ClientSidebarWrapper>
        );
    }

    return (
        <ClientSidebarWrapper>
            <div className="container mx-auto max-w-7xl px-4 py-8">
                <div className="flex flex-col gap-8">
                    {/* Main Content */}
                    {(() => {
                        const activeProject = projects.find(p => ['in-progress', 'pending', 'onboarding'].includes(p.status.toLowerCase()));

                        if (!activeProject) return (
                            <div className="animate-in fade-in slide-in-from-top-4 duration-700 space-y-8">
                                <div>
                                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2" style={{ color: '#1d1d1f' }}>
                                        Hello, {session?.user?.name.split(' ')[0]}
                                    </h1>
                                    <p className="text-xl font-medium text-gray-400">Welcome back to your project portal.</p>
                                </div>
                                <GlassCard p={12} className="text-center">
                                    <div className="max-w-xl mx-auto space-y-6">
                                        <div className="w-20 h-20 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg viewBox="0 0 24 24" className="w-10 h-10 text-black" fill="currentColor">
                                                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                                            </svg>
                                        </div>
                                        <h2 className="text-2xl font-bold text-[#1d1d1f]">Ready to start something new?</h2>
                                        <p className="text-gray-500">
                                            Schedule a strategy session with our team to discuss your next mission or explore how we can help you grow.
                                        </p>
                                        <button
                                            onClick={() => router.push('/client/schedule')}
                                            className="px-8 py-4 bg-[#10b981] text-white rounded-2xl font-black hover:opacity-90 transition-all shadow-xl shadow-[#10b981]/20"
                                        >
                                            Schedule Mission
                                        </button>
                                    </div>
                                </GlassCard>
                            </div>
                        );

                        return (
                            <div className="space-y-8 animate-in fade-in slide-in-from-top-6 duration-1000">
                                {/* Hero Project Overview */}
                                <div className="overflow-hidden bg-white border border-gray-200 rounded-3xl shadow-xl">
                                    <div className="relative p-8 md:p-12">
                                        <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-transparent pointer-events-none" />
                                        <div className="relative flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
                                            <div className="flex-1 space-y-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/5 border border-black/10 rounded-full text-black text-[10px] font-black uppercase tracking-widest">
                                                        <span className="relative flex h-2 w-2">
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-40"></span>
                                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-black"></span>
                                                        </span>
                                                        Active Engagement
                                                    </div>
                                                    <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">•</span>
                                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Updated {new Date(activeProject.updatedAt).toLocaleDateString()}</span>
                                                </div>

                                                <div className="space-y-4">
                                                    <h2 className="text-4xl md:text-5xl font-black text-[#1d1d1f] leading-none tracking-tight">
                                                        {activeProject.name}
                                                    </h2>
                                                    <p className="text-gray-500 text-lg font-medium leading-relaxed max-w-3xl">
                                                        {activeProject.description || 'Your project is moving forward. Check the latest updates and milestones below.'}
                                                    </p>
                                                </div>

                                            </div>

                                            <div className="flex items-center gap-6 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                                                <div className="text-right">
                                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Status</p>
                                                    <StatusBadge status={activeProject.status} size="lg" />
                                                </div>
                                                <div className="w-px h-12 bg-gray-200" />
                                                <div className="text-right">
                                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Inception</p>
                                                    <p className="text-lg font-black text-[#1d1d1f]">{new Date(activeProject.startDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Detailed Tabs View */}
                                <GlassCard p={0} className="overflow-hidden">
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
                                                    ? 'border-[#e53e3e] text-[#e53e3e]'
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
                                                <FileExplorer projectId={activeProject._id} />
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
                                                                {activeProject._id}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1.5">Project Scope</p>
                                                            <p className="text-sm font-medium text-gray-600 leading-relaxed">
                                                                {activeProject.description || 'Global objectives for this engagement.'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-xs font-bold text-gray-500">Project Status</span>
                                                            <StatusBadge status={activeProject.status} size="sm" />
                                                        </div>
                                                        <div className="h-px bg-gray-200" />
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-xs font-bold text-gray-500">Kickoff Date</span>
                                                            <span className="text-xs font-bold text-[#1d1d1f]">{new Date(activeProject.startDate).toLocaleDateString()}</span>
                                                        </div>
                                                        {activeProject.budget && (
                                                            <>
                                                                <div className="h-px bg-gray-200" />
                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-xs font-bold text-gray-500">Budget Allocated</span>
                                                                    <span className="text-xs font-bold text-[#1d1d1f]">${activeProject.budget.toLocaleString()}</span>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </GlassCard>
                            </div>
                        );
                    })()}
                </div>
            </div>
        </ClientSidebarWrapper>
    );
}

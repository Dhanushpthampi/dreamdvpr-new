'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ClientSidebarWrapper } from '@/app/components/client/ClientSidebar';
import GlassCard from '@/app/components/ui/GlassCard';
import StatusBadge from '@/app/components/ui/StatusBadge';

export default function ClientProjectsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated') {
            if (session?.user?.role !== 'client') {
                router.push('/login');
            } else {
                fetchProjects();
            }
        }
    }, [status, session, router]);

    const fetchProjects = async () => {
        try {
            const res = await fetch('/api/projects');
            const data = await res.json();
            setProjects(data.projects || []);
        } catch (error) {
            console.error('Error fetching projects:', error);
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

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const activeProjects = projects.filter(p => ['in-progress', 'pending', 'onboarding'].includes(p.status.toLowerCase()));
    const recentProjects = projects.filter(p =>
        !activeProjects.find(ap => ap._id === p._id) &&
        new Date(p.updatedAt) > thirtyDaysAgo
    );
    const allProjects = projects.filter(p =>
        !activeProjects.find(ap => ap._id === p._id) &&
        !recentProjects.find(rp => rp._id === p._id)
    );

    const ProjectCard = ({ project, size = 'md' }) => (
        <GlassCard
            p={size === 'lg' ? 8 : 6}
            onClick={() => router.push(`/client/projects/${project._id}`)}
            className={`cursor-pointer transition-all hover:scale-[1.01] ${size === 'lg' ? 'border-[#1d1d1f]/20 bg-[#1d1d1f]/5' : ''}`}
        >
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <h3 className={`${size === 'lg' ? 'text-2xl' : 'text-lg'} font-bold text-[#1d1d1f] line-clamp-1`}>
                            {project.name}
                        </h3>
                        {size === 'lg' && (
                            <p className="text-sm font-medium text-gray-400">Project ID: {project._id}</p>
                        )}
                    </div>
                    <StatusBadge status={project.status} size={size === 'lg' ? 'lg' : 'sm'} />
                </div>

                <p className={`text-gray-500 font-medium leading-relaxed ${size === 'lg' ? 'text-base' : 'text-sm'} line-clamp-2`}>
                    {project.description || 'No description provided.'}
                </p>

                <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
                        </svg>
                        <span>Initiated {new Date(project.startDate).toLocaleDateString()}</span>
                    </div>
                    <button className={`font-bold transition-colors ${size === 'lg' ? 'text-[#1d1d1f]' : 'text-sm text-gray-400 hover:text-[#1d1d1f]'}`}>
                        {size === 'lg' ? 'Open Dashboard →' : 'View →'}
                    </button>
                </div>
            </div>
        </GlassCard>
    );

    return (
        <ClientSidebarWrapper>
            <div className="container mx-auto max-w-7xl px-4 py-8">
                <div className="space-y-12">
                    {/* Header */}
                    <div className="flex justify-between items-end">
                        <div>
                            <h1 className="text-4xl font-black text-[#1d1d1f] tracking-tight">My Projects</h1>
                            <p className="text-gray-400 font-medium">Manage and track all your missions.</p>
                        </div>
                    </div>

                    {projects.length === 0 ? (
                        <GlassCard p={16} className="text-center">
                            <div className="max-w-md mx-auto space-y-6">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg viewBox="0 0 24 24" className="w-10 h-10 text-gray-300" fill="currentColor">
                                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-[#1d1d1f]">No missions yet</h2>
                                <p className="text-gray-500">
                                    Once our team launches your project, it will appear here for tracking and collaboration.
                                </p>
                                <button
                                    onClick={() => router.push('/client/schedule')}
                                    className="px-8 py-4 bg-[#1d1d1f] text-white rounded-2xl font-black hover:bg-black transition-all"
                                >
                                    Schedule Kickoff Call
                                </button>
                            </div>
                        </GlassCard>
                    ) : (
                        <div className="space-y-16">
                            {/* Recent Projects (Active + Recently Updated) */}
                            {(() => {
                                const activeAndRecent = [...activeProjects, ...recentProjects];
                                if (activeAndRecent.length === 0) return null;
                                return (
                                    <section className="space-y-6">
                                        <div className="flex items-center gap-3 px-2">
                                            <div className="w-2 h-2 rounded-full bg-[#1d1d1f] animate-pulse" />
                                            <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">Recent Project</h2>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {activeAndRecent.map(p => (
                                                <ProjectCard key={p._id} project={p} />
                                            ))}
                                        </div>
                                    </section>
                                );
                            })()}

                            {/* All Projects */}
                            {allProjects.length > 0 && (
                                <section className="space-y-6">
                                    <div className="flex items-center gap-3 px-2">
                                        <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">All Projects</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-80">
                                        {allProjects.map(p => (
                                            <ProjectCard key={p._id} project={p} />
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </ClientSidebarWrapper>
    );
}

'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ClientSidebarWrapper } from '../../components/ClientSidebar';
import GlassCard from '../../components/GlassCard';
import StatusBadge from '../../components/StatusBadge';

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
                    <div className="w-12 h-12 border-4 border-t-[#00abad] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
                </div>
            </ClientSidebarWrapper>
        );
    }

    return (
        <ClientSidebarWrapper>
            <div className="container mx-auto max-w-7xl px-4 py-8">
                <div className="flex flex-col gap-8">
                    {/* Header */}
                    <div className="flex justify-between items-center flex-wrap gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: '#1d1d1f' }}>
                                My Projects
                            </h1>
                            <p style={{ color: '#86868b' }}>
                                View and manage all your projects
                            </p>
                        </div>
                        <button
                            onClick={() => router.push('/client/new-project')}
                            className="px-4 py-2 bg-[#00abad] text-white rounded-lg hover:bg-[#008c8e] transition-colors flex items-center gap-2"
                        >
                            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                            </svg>
                            New Project
                        </button>
                    </div>

                    {/* Projects Grid */}
                    {projects.length === 0 ? (
                        <GlassCard p={16} className="text-center">
                            <div className="flex flex-col items-center gap-6">
                                <svg viewBox="0 0 24 24" className="w-20 h-20 text-gray-300" fill="currentColor">
                                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
                                </svg>
                                <h2 className="text-2xl font-bold" style={{ color: '#1d1d1f' }}>No projects yet</h2>
                                <p className="text-lg" style={{ color: '#86868b' }}>
                                    Start your first project to get started!
                                </p>
                                <button
                                    onClick={() => router.push('/client/new-project')}
                                    className="px-6 py-3 bg-[#00abad] text-white rounded-lg hover:bg-[#008c8e] transition-colors text-lg"
                                >
                                    Start New Project
                                </button>
                            </div>
                        </GlassCard>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.map((project) => (
                                <GlassCard
                                    key={project._id}
                                    p={6}
                                    onClick={() => router.push(`/client/projects/${project._id}`)}
                                    className="cursor-pointer"
                                >
                                    <div className="flex flex-col items-start gap-4">
                                        <div className="flex justify-between items-center w-full">
                                            <h3 className="text-lg font-semibold line-clamp-1" style={{ color: '#1d1d1f' }}>
                                                {project.name}
                                            </h3>
                                            <StatusBadge status={project.status} size="sm" />
                                        </div>

                                        <p className="text-sm line-clamp-3" style={{ color: '#86868b' }}>
                                            {project.description || 'No description'}
                                        </p>

                                        <div className="flex items-center gap-2 text-xs w-full" style={{ color: '#86868b' }}>
                                            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                                                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
                                            </svg>
                                            <span>
                                                Started {new Date(project.startDate).toLocaleDateString()}
                                            </span>
                                        </div>

                                        <button className="w-full px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                                            View Project →
                                        </button>
                                    </div>
                                </GlassCard>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </ClientSidebarWrapper>
    );
}

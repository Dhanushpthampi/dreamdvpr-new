'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ClientSidebarWrapper } from '@/app/components/client/ClientSidebar';
import GlassCard from '@/app/components/ui/GlassCard';
import StatusBadge from '@/app/components/ui/StatusBadge';

export default function ClientDashboard() {
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
                <div className="flex flex-col gap-10">
                    {/* Welcome Section */}
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-2" style={{ color: '#1d1d1f' }}>
                            Welcome back, {session?.user?.name}!
                        </h1>
                        <p className="text-lg" style={{ color: '#86868b' }}>
                            Here's what's happening with your projects
                        </p>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <GlassCard p={6}>
                            <div className="flex flex-col items-start gap-3">
                                <div className="bg-[#00abad] p-3 rounded-xl">
                                    <svg viewBox="0 0 24 24" className="w-8 h-8 text-white" fill="currentColor">
                                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
                                    </svg>
                                </div>
                                <div className="flex flex-col items-start gap-1">
                                    <p className="text-sm font-medium" style={{ color: '#86868b' }}>
                                        Total Projects
                                    </p>
                                    <h2 className="text-3xl font-bold" style={{ color: '#1d1d1f' }}>
                                        {projects.length}
                                    </h2>
                                </div>
                            </div>
                        </GlassCard>

                        <GlassCard p={6}>
                            <div className="flex flex-col items-start gap-3">
                                <div className="bg-blue-500 p-3 rounded-xl">
                                    <svg viewBox="0 0 24 24" className="w-8 h-8 text-white" fill="currentColor">
                                        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                                    </svg>
                                </div>
                                <div className="flex flex-col items-start gap-1">
                                    <p className="text-sm font-medium" style={{ color: '#86868b' }}>
                                        In Progress
                                    </p>
                                    <h2 className="text-3xl font-bold" style={{ color: '#1d1d1f' }}>
                                        {projects.filter(p => p.status === 'in-progress').length}
                                    </h2>
                                </div>
                            </div>
                        </GlassCard>

                        <GlassCard p={6}>
                            <div className="flex flex-col items-start gap-3">
                                <div className="bg-green-500 p-3 rounded-xl">
                                    <svg viewBox="0 0 24 24" className="w-8 h-8 text-white" fill="currentColor">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                    </svg>
                                </div>
                                <div className="flex flex-col items-start gap-1">
                                    <p className="text-sm font-medium" style={{ color: '#86868b' }}>
                                        Completed
                                    </p>
                                    <h2 className="text-3xl font-bold" style={{ color: '#1d1d1f' }}>
                                        {projects.filter(p => p.status === 'completed').length}
                                    </h2>
                                </div>
                            </div>
                        </GlassCard>
                    </div>

                    {/* Recent Projects */}
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold" style={{ color: '#1d1d1f' }}>
                                Recent Projects
                            </h2>
                            <button
                                onClick={() => router.push('/client/projects')}
                                className="text-[#00abad] font-medium cursor-pointer hover:underline transition-all"
                            >
                                View All →
                            </button>
                        </div>

                        {projects.length === 0 ? (
                            <GlassCard p={12} className="text-center">
                                <div className="flex flex-col items-center gap-4">
                                    <svg viewBox="0 0 24 24" className="w-16 h-16 text-gray-300" fill="currentColor">
                                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
                                    </svg>
                                    <h3 className="text-lg font-semibold" style={{ color: '#1d1d1f' }}>No projects yet</h3>
                                    <p style={{ color: '#86868b' }}>
                                        Start your first project to get started!
                                    </p>
                                </div>
                            </GlassCard>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {projects.slice(0, 6).map((project) => (
                                    <GlassCard
                                        key={project._id}
                                        p={6}
                                        onClick={() => router.push(`/client/projects/${project._id}`)}
                                        className="cursor-pointer"
                                    >
                                        <div className="flex flex-col items-start gap-4">
                                            <div className="flex justify-between items-center w-full">
                                                <h3 className="text-base font-semibold line-clamp-1" style={{ color: '#1d1d1f' }}>
                                                    {project.name}
                                                </h3>
                                                <StatusBadge status={project.status} size="sm" />
                                            </div>

                                            <p className="text-sm line-clamp-2" style={{ color: '#86868b' }}>
                                                {project.description || 'No description'}
                                            </p>

                                            <div className="flex items-center gap-2 text-xs" style={{ color: '#86868b' }}>
                                                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                                                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
                                                </svg>
                                                <span>
                                                    {new Date(project.startDate).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </GlassCard>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ClientSidebarWrapper>
    );
}

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
                    {/* Hero Section / Active Project */}
                    {(() => {
                        const activeProject = projects.find(p => ['in-progress', 'pending', 'onboarding'].includes(p.status.toLowerCase()));
                        if (!activeProject) return (
                            <div className="animate-in fade-in slide-in-from-top-4 duration-700">
                                <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2" style={{ color: '#1d1d1f' }}>
                                    Hello, {session?.user?.name.split(' ')[0]}
                                </h1>
                                <p className="text-xl font-medium text-gray-400">Welcome back to your project portal.</p>
                            </div>
                        );

                        return (
                            <div className="relative group animate-in fade-in slide-in-from-top-6 duration-1000">
                                <div className="overflow-hidden bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all">
                                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />
                                    <div className="relative p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6">
                                        <div className="flex-1 space-y-4 text-center md:text-left">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-50 border border-gray-200 rounded-full text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                                                <span className="relative flex h-1.5 w-1.5">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00abad] opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#00abad]"></span>
                                                </span>
                                                Active Project
                                            </div>
                                            <h2 className="text-3xl md:text-4xl font-black text-[#1d1d1f] leading-tight">
                                                {activeProject.name}
                                            </h2>
                                            <p className="text-gray-500 text-base max-w-xl font-medium line-clamp-2">
                                                {activeProject.description || 'Your project is moving forward. Check the latest updates and milestones here.'}
                                            </p>
                                            <div className="flex flex-wrap gap-4 pt-2 justify-center md:justify-start">
                                                <button
                                                    onClick={() => router.push(`/client/projects/${activeProject._id}`)}
                                                    className="px-6 py-3 bg-[#1d1d1f] text-white rounded-xl font-bold text-sm hover:bg-black transition-all active:scale-95 shadow-lg shadow-black/10"
                                                >
                                                    Track Progress & Files
                                                </button>
                                                <div className="flex items-center gap-3 px-5 py-3 bg-white border border-gray-100 rounded-xl">
                                                    <div className="flex flex-col">
                                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Current Status</span>
                                                        <span className="font-bold text-sm text-[#00abad] px-3 py-1 rounded-md bg-[#00abad]/10 uppercase tracking-wide">
                                                            {activeProject.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="hidden lg:block relative w-32 h-32 opacity-10">
                                            <svg viewBox="0 0 24 24" className="w-full h-full text-[#00abad]" fill="currentColor">
                                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })()}

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                            { label: 'Total Projects', value: projects.length, color: '#008c8e', icon: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z' },
                            { label: 'In Progress', value: projects.filter(p => ['in-progress', 'In Progress'].includes(p.status)).length, color: '#2563eb', icon: 'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z' },
                            { label: 'Completed', value: projects.filter(p => p.status === 'completed').length, color: '#059669', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' },
                            { label: 'Completion Rate', value: `${projects.length > 0 ? Math.round((projects.filter(p => p.status === 'completed').length / projects.length) * 100) : 0}%`, color: '#7c3aed', icon: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z' }
                        ].map((stat, i) => (
                            <div key={i} className="relative p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all group overflow-hidden">
                                <div className="flex flex-col gap-1 relative z-10">
                                    <p className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400">{stat.label}</p>
                                    <h2 className="text-4xl font-black" style={{ color: stat.color }}>{stat.value}</h2>
                                </div>
                                <div className="absolute right-[-10px] bottom-[-10px] opacity-[0.05] group-hover:scale-110 transition-transform duration-500" style={{ color: stat.color }}>
                                    <svg viewBox="0 0 24 24" className="w-20 h-20" fill="currentColor">
                                        <path d={stat.icon} />
                                    </svg>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Analytics Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <GlassCard p={8} className="lg:col-span-3">
                            <h3 className="text-xl font-bold mb-8">Status Breakdown</h3>
                            <div className="flex flex-col items-center gap-8 md:flex-row md:justify-around">
                                <div className="relative w-48 h-48 rounded-full border-[15px] border-gray-50 flex items-center justify-center shadow-inner">
                                    <div className="text-center">
                                        <p className="text-3xl font-black">{projects.length}</p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Total</p>
                                    </div>
                                    <svg viewBox="0 0 36 36" className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none drop-shadow-md">
                                        <path
                                            className="text-[#00abad] fill-none stroke-current"
                                            strokeWidth="3.5"
                                            strokeDasharray={`${(projects.filter(p => ['in-progress', 'In Progress'].includes(p.status)).length / (projects.length || 1)) * 100}, 100`}
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        />
                                    </svg>
                                </div>
                                <div className="w-full md:flex-1 max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {[
                                        { label: 'In Progress', count: projects.filter(p => ['in-progress', 'In Progress'].includes(p.status)).length, color: '#00abad' },
                                        { label: 'Completed', count: projects.filter(p => ['completed', 'Completed'].includes(p.status)).length, color: '#10b981' },
                                        { label: 'Pending', count: projects.filter(p => ['pending', 'onboarding', 'Pending', 'Onboarding'].includes(p.status)).length, color: '#f59e0b' }
                                    ].map(item => (
                                        <div key={item.label} className="group flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 hover:border-[#00abad]/20 transition-all shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="w-3 h-3 rounded-full shadow-sm group-hover:scale-125 transition-transform" style={{ backgroundColor: item.color }} />
                                                <span className="text-sm font-bold text-gray-700">{item.label}</span>
                                            </div>
                                            <span className="text-xl font-black text-[#1d1d1f]">{item.count}</span>
                                        </div>
                                    ))}
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

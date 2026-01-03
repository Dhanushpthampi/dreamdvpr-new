'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AdminSidebarWrapper } from '@/app/components/admin/AdminSidebar';
import GlassCard from '@/app/components/ui/GlassCard';
import StatusBadge from '@/app/components/ui/StatusBadge';

export default function ProjectsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated') {
            if (session?.user?.role !== 'admin') {
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

    const filteredProjects = projects.filter(project =>
        project.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.client?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (status === 'loading' || loading) {
        return (
            <AdminSidebarWrapper>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-t-[#00abad] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
                </div>
            </AdminSidebarWrapper>
        );
    }

    return (
        <AdminSidebarWrapper>
            <div className="container mx-auto max-w-7xl px-4 py-8">
                <div className="flex flex-col gap-8">
                    <div className="flex justify-between items-end">
                        <div>
                            <h1 className="text-4xl font-bold mb-2" style={{ color: '#1d1d1f' }}>Projects</h1>
                            <p style={{ color: '#86868b' }}>Monitor and manage all active client engagements</p>
                        </div>
                    </div>

                    <div className="relative max-w-md">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search projects by name or client..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white/60 border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00abad] transition-all"
                        />
                    </div>

                    {filteredProjects.length === 0 ? (
                        <GlassCard p={10} className="text-center">
                            <div className="text-5xl mb-4">🚀</div>
                            <h3 className="text-xl font-bold mb-2" style={{ color: '#1d1d1f' }}>No projects found</h3>
                            <p style={{ color: '#86868b' }}>When clients create projects, they will appear here correctly.</p>
                        </GlassCard>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProjects.map((project) => (
                                <GlassCard
                                    key={project._id}
                                    p={0}
                                    className="overflow-hidden hover:shadow-xl transition-all cursor-pointer group border border-gray-100 hover:border-[#00abad]/30 shadow-sm"
                                    onClick={() => router.push(`/admin/projects/${project._id}`)}
                                >
                                    <div className="p-5 flex flex-col h-full">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="bg-[#00abad]/10 p-2 rounded-lg group-hover:bg-[#00abad] transition-colors">
                                                <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#00abad] group-hover:text-white" fill="currentColor">
                                                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
                                                </svg>
                                            </div>
                                            <StatusBadge status={project.status} size="sm" />
                                        </div>

                                        <h3 className="text-lg font-bold mb-0.5 group-hover:text-[#00abad] transition-colors line-clamp-1" style={{ color: '#1d1d1f' }}>
                                            {project.name}
                                        </h3>
                                        <p className="text-xs font-semibold mb-3" style={{ color: '#86868b' }}>
                                            {project.client?.name || 'Unknown Client'}
                                        </p>

                                        <p className="text-xs line-clamp-2 mb-4 flex-grow" style={{ color: '#86868b', lineHeight: '1.5' }}>
                                            {project.description || 'No detailed description provided for this engagement.'}
                                        </p>

                                        <div className="pt-3 border-t border-gray-50 flex justify-between items-center mt-auto">
                                            <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">
                                                {new Date(project.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                            <div className="text-[#00abad] font-bold text-xs flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                                Manage
                                                <svg viewBox="0 0 24 24" className="w-3 h-3" fill="currentColor">
                                                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </GlassCard>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AdminSidebarWrapper>
    );
}

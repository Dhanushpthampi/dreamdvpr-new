'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { AdminSidebarWrapper } from '../../../components/AdminSidebar';
import GlassCard from '../../../components/GlassCard';
import StatusBadge from '../../../components/StatusBadge';

export default function AdminClientDetail() {
    const { data: session } = useSession();
    const router = useRouter();
    const params = useParams();

    const clientId = params.id;
    const [client, setClient] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (clientId) {
            fetchClient();
            fetchProjects();
        }
    }, [clientId]);

    const fetchClient = async () => {
        try {
            const res = await fetch(`/api/clients/${clientId}`);
            const data = await res.json();
            if (res.ok) {
                setClient(data.client);
            }
        } catch (error) {
            console.error('Error fetching client:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchProjects = async () => {
        try {
            const res = await fetch('/api/projects');
            const data = await res.json();
            if (res.ok) {
                const clientProjects = data.projects.filter(p => p.clientId === clientId);
                setProjects(clientProjects);
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
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

    if (!client) return null;

    return (
        <AdminSidebarWrapper>
            <div className="container mx-auto max-w-7xl px-4 py-8">
                <div className="flex flex-col gap-8">
                    {/* Client Header */}
                    <div>
                        <button
                            onClick={() => router.push('/admin')}
                            className="flex items-center gap-2 text-gray-600 hover:text-[#00abad] transition-colors mb-4"
                        >
                            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                            </svg>
                            Back to Dashboard
                        </button>
                        <h1 className="text-4xl md:text-5xl font-bold mb-2" style={{ color: '#1d1d1f' }}>
                            {client.name}
                        </h1>
                        <p className="text-lg" style={{ color: '#86868b' }}>
                            {client.email}
                        </p>
                    </div>

                    {/* Client Info */}
                    <GlassCard p={6}>
                        <h2 className="text-xl font-bold mb-6" style={{ color: '#1d1d1f' }}>Client Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm font-semibold mb-1" style={{ color: '#86868b' }}>
                                    Company
                                </p>
                                <p className="text-base" style={{ color: '#1d1d1f' }}>
                                    {client.company || 'Not provided'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-semibold mb-1" style={{ color: '#86868b' }}>
                                    Industry
                                </p>
                                {client.industry ? (
                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                                        {client.industry}
                                    </span>
                                ) : (
                                    <p className="text-base" style={{ color: '#1d1d1f' }}>Not provided</p>
                                )}
                            </div>
                            <div>
                                <p className="text-sm font-semibold mb-1" style={{ color: '#86868b' }}>
                                    Phone
                                </p>
                                <p className="text-base" style={{ color: '#1d1d1f' }}>
                                    {client.phone || 'Not provided'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-semibold mb-1" style={{ color: '#86868b' }}>
                                    Website
                                </p>
                                <p className="text-base" style={{ color: '#1d1d1f' }}>
                                    {client.website || 'Not provided'}
                                </p>
                            </div>
                        </div>
                    </GlassCard>

                    {/* Projects */}
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold" style={{ color: '#1d1d1f' }}>
                                Projects ({projects.length})
                            </h2>
                            <button
                                onClick={() => alert('Create project for client - coming soon')}
                                className="px-4 py-2 bg-[#00abad] text-white rounded-lg hover:bg-[#008c8e] transition-colors text-sm flex items-center gap-2"
                            >
                                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                                </svg>
                                New Project
                            </button>
                        </div>

                        {projects.length === 0 ? (
                            <GlassCard p={12} className="text-center">
                                <p style={{ color: '#86868b' }}>No projects yet</p>
                            </GlassCard>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {projects.map((project) => (
                                    <GlassCard
                                        key={project._id}
                                        p={6}
                                        onClick={() => router.push(`/admin/projects/${project._id}`)}
                                        className="cursor-pointer"
                                    >
                                        <div className="flex flex-col items-start gap-4">
                                            <div className="flex justify-between items-center w-full">
                                                <h3 className="text-lg font-semibold line-clamp-1" style={{ color: '#1d1d1f' }}>
                                                    {project.name}
                                                </h3>
                                                <StatusBadge status={project.status} size="sm" />
                                            </div>

                                            <p className="text-sm line-clamp-2" style={{ color: '#86868b' }}>
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
                                                Manage Project →
                                            </button>
                                        </div>
                                    </GlassCard>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminSidebarWrapper>
    );
}

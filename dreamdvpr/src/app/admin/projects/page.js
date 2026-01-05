'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AdminSidebarWrapper } from '@/app/components/admin/AdminSidebar';
import GlassCard from '@/app/components/ui/GlassCard';
import StatusBadge from '@/app/components/ui/StatusBadge';
import ThemedInput from '@/app/components/ui/ThemedInput';
import ThemedSelect from '@/app/components/ui/ThemedSelect';

export default function ProjectsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [projects, setProjects] = useState([]);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [creating, setCreating] = useState(false);
    const [toast, setToast] = useState(null);

    const [newProject, setNewProject] = useState({
        name: '',
        description: '',
        clientId: '',
    });

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated') {
            if (session?.user?.role !== 'admin') {
                router.push('/login');
            } else {
                fetchData();
            }
        }
    }, [status, session, router]);

    const showToast = (title, type = 'success') => {
        setToast({ title, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchData = async () => {
        try {
            const [projRes, clientRes] = await Promise.all([
                fetch('/api/projects'),
                fetch('/api/clients')
            ]);
            const projData = await projRes.json();
            const clientData = await clientRes.json();

            setProjects(projData.projects || []);
            setClients(clientData.clients || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProject = async () => {
        if (!newProject.name || !newProject.clientId) {
            showToast('Please fill required fields', 'error');
            return;
        }

        setCreating(true);
        try {
            const res = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProject),
            });

            if (res.ok) {
                showToast('Project created successfully');
                setIsModalOpen(false);
                setNewProject({ name: '', description: '', clientId: '' });
                fetchData();
            } else {
                const data = await res.json();
                showToast(data.error || 'Failed to create project', 'error');
            }
        } catch (error) {
            console.error('Error creating project:', error);
            showToast('An error occurred', 'error');
        } finally {
            setCreating(false);
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
                    <div className="w-12 h-12 border-4 border-t-[#1d1d1f] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
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
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-6 py-2 bg-[#1d1d1f] text-white rounded-xl hover:bg-black transition-all flex items-center gap-2 font-semibold shadow-lg shadow-[#1d1d1f]/20 group"
                        >
                            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" fill="currentColor">
                                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                            </svg>
                            Create Project
                        </button>
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
                            className="w-full pl-10 pr-4 py-3 bg-white/60 border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1d1d1f] transition-all"
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
                                    className="overflow-hidden hover:shadow-xl transition-all cursor-pointer group border border-gray-100 hover:border-[#1d1d1f]/30 shadow-sm"
                                    onClick={() => router.push(`/admin/projects/${project._id}`)}
                                >
                                    <div className="p-5 flex flex-col h-full">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="bg-[#e53e3e]/10 p-2 rounded-lg group-hover:bg-[#e53e3e] transition-colors">
                                                <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#e53e3e] group-hover:text-white" fill="currentColor">
                                                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
                                                </svg>
                                            </div>
                                            <StatusBadge status={project.status} size="sm" />
                                        </div>

                                        <h3 className="text-lg font-bold mb-0.5 group-hover:text-[#1d1d1f] transition-colors line-clamp-1" style={{ color: '#1d1d1f' }}>
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
                                            <div className="text-[#1d1d1f] font-bold text-xs flex items-center gap-1 group-hover:translate-x-1 transition-transform">
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

            {/* Create Project Modal */}
            {isModalOpen && (
                <>
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[2000]" onClick={() => setIsModalOpen(false)} />
                    <div className="fixed inset-0 flex items-center justify-center z-[2001] p-4 pointer-events-none">
                        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-xl w-full flex flex-col pointer-events-auto scale-in">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <h2 className="text-2xl font-bold" style={{ color: '#1d1d1f' }}>Create New Project</h2>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                                    </svg>
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                <ThemedSelect
                                    label="Select Client"
                                    value={newProject.clientId}
                                    onChange={(e) => setNewProject({ ...newProject, clientId: e.target.value })}
                                    options={clients.map(c => ({ value: c._id, label: `${c.name} (${c.company})` }))}
                                    required
                                />
                                <ThemedInput
                                    label="Project Name"
                                    value={newProject.name}
                                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                                    placeholder="e.g., Website Redesign"
                                    required
                                />
                                <ThemedInput
                                    label="Description"
                                    type="textarea"
                                    rows={4}
                                    value={newProject.description}
                                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                    placeholder="Summarize the project goals and scope..."
                                />
                            </div>
                            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                                <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 rounded-xl font-semibold text-gray-500 hover:bg-gray-100">Cancel</button>
                                <button
                                    onClick={handleCreateProject}
                                    disabled={creating}
                                    className="px-8 py-2 bg-[#1d1d1f] text-white rounded-xl font-bold hover:bg-black transition-all disabled:opacity-50"
                                >
                                    {creating ? 'Creating...' : 'Start Project'}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Toast */}
            {toast && (
                <div className={`fixed bottom-8 right-8 px-6 py-4 rounded-xl shadow-2xl z-[3000] text-white animate-in slide-in-from-bottom-4 ${toast.type === 'error' ? 'bg-red-500' : 'bg-[#1d1d1f]'}`}>
                    {toast.title}
                </div>
            )}
        </AdminSidebarWrapper>
    );
}

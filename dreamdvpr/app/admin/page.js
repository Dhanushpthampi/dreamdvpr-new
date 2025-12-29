'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AdminSidebarWrapper } from '../components/AdminSidebar';
import GlassCard from '../components/GlassCard';
import StatusBadge from '../components/StatusBadge';
import ThemedInput from '../components/ThemedInput';
import ThemedSelect from '../components/ThemedSelect';

const INDUSTRIES = [
    { value: 'ecommerce', label: 'E-commerce' },
    { value: 'saas', label: 'SaaS' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'finance', label: 'Finance' },
    { value: 'realestate', label: 'Real Estate' },
    { value: 'education', label: 'Education' },
    { value: 'technology', label: 'Technology' },
    { value: 'other', label: 'Other' },
];

export default function AdminDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [clients, setClients] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [creating, setCreating] = useState(false);
    const [activeTab, setActiveTab] = useState('clients');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [toast, setToast] = useState(null);

    const [newClient, setNewClient] = useState({
        name: '',
        email: '',
        password: '',
        company: '',
        industry: '',
        phone: '',
        website: '',
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

    const showToast = (title, description, type = 'success') => {
        setToast({ title, description, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchData = async () => {
        try {
            const [clientsRes, projectsRes] = await Promise.all([
                fetch('/api/clients'),
                fetch('/api/projects')
            ]);

            const clientsData = await clientsRes.json();
            const projectsData = await projectsRes.json();

            setClients(clientsData.clients || []);
            setProjects(projectsData.projects || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateClient = async () => {
        if (!newClient.name || !newClient.email || !newClient.password) {
            showToast('Missing required fields', 'Name, email, and password are required', 'error');
            return;
        }

        setCreating(true);
        try {
            const res = await fetch('/api/clients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...newClient,
                    role: 'client',
                    onboardingCompleted: true,
                }),
            });

            if (res.ok) {
                showToast('Client created successfully', '', 'success');
                setNewClient({
                    name: '',
                    email: '',
                    password: '',
                    company: '',
                    industry: '',
                    phone: '',
                    website: '',
                });
                setIsModalOpen(false);
                fetchData();
            } else {
                const data = await res.json();
                showToast('Failed to create client', data.error || 'An error occurred', 'error');
            }
        } catch (error) {
            console.error('Error creating client:', error);
            showToast('Error', 'An error occurred while creating the client', 'error');
        } finally {
            setCreating(false);
        }
    };

    const filteredClients = clients.filter(client =>
        client.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.company?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredProjects = projects.filter(project =>
        project.name?.toLowerCase().includes(searchQuery.toLowerCase())
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

    const stats = {
        totalClients: clients.length,
        totalProjects: projects.length,
        activeProjects: projects.filter(p => p.status === 'in-progress').length,
        completedProjects: projects.filter(p => p.status === 'completed').length,
    };

    return (
        <AdminSidebarWrapper>
            <div className="container mx-auto max-w-7xl px-4 py-8">
                <div className="flex flex-col gap-10">
                    {/* Header */}
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-2" style={{ color: '#1d1d1f' }}>
                            Admin Dashboard
                        </h1>
                        <p className="text-lg" style={{ color: '#86868b' }}>
                            Manage clients, projects, and timelines
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-2 md:gap-6">
                        <GlassCard p={3} className="md:p-6">
                            <div className="flex flex-col items-start gap-1 md:gap-2">
                                <p className="text-[10px] md:text-sm font-medium" style={{ color: '#86868b' }}>
                                    Total Clients
                                </p>
                                <h2 className="text-lg md:text-3xl font-bold text-[#00abad]">
                                    {stats.totalClients}
                                </h2>
                            </div>
                        </GlassCard>

                        <GlassCard p={3} className="md:p-6">
                            <div className="flex flex-col items-start gap-1 md:gap-2">
                                <p className="text-[10px] md:text-sm font-medium" style={{ color: '#86868b' }}>
                                    Total Projects
                                </p>
                                <h2 className="text-lg md:text-3xl font-bold" style={{ color: '#1d1d1f' }}>
                                    {stats.totalProjects}
                                </h2>
                            </div>
                        </GlassCard>

                        <GlassCard p={3} className="md:p-6">
                            <div className="flex flex-col items-start gap-1 md:gap-2">
                                <p className="text-[10px] md:text-sm font-medium" style={{ color: '#86868b' }}>
                                    Active Projects
                                </p>
                                <h2 className="text-lg md:text-3xl font-bold text-blue-500">
                                    {stats.activeProjects}
                                </h2>
                            </div>
                        </GlassCard>

                        <GlassCard p={3} className="md:p-6">
                            <div className="flex flex-col items-start gap-1 md:gap-2">
                                <p className="text-[10px] md:text-sm font-medium" style={{ color: '#86868b' }}>
                                    Completed
                                </p>
                                <h2 className="text-lg md:text-3xl font-bold text-green-500">
                                    {stats.completedProjects}
                                </h2>
                            </div>
                        </GlassCard>
                    </div>

                    {/* Main Content */}
                    <GlassCard p={6}>
                        {/* Tabs */}
                        <div className="mb-6 border-b border-gray-200">
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setActiveTab('clients')}
                                    className={`px-4 py-2 font-semibold transition-colors ${
                                        activeTab === 'clients'
                                            ? 'text-[#00abad] border-b-2 border-[#00abad]'
                                            : 'text-gray-600 hover:text-[#00abad]'
                                    }`}
                                >
                                    Clients
                                </button>
                                <button
                                    onClick={() => setActiveTab('projects')}
                                    className={`px-4 py-2 font-semibold transition-colors ${
                                        activeTab === 'projects'
                                            ? 'text-[#00abad] border-b-2 border-[#00abad]'
                                            : 'text-gray-600 hover:text-[#00abad]'
                                    }`}
                                >
                                    Projects
                                </button>
                            </div>
                        </div>

                        {/* Clients Tab */}
                        {activeTab === 'clients' && (
                            <div className="flex flex-col gap-6">
                                <div className="flex justify-between items-center flex-wrap gap-4">
                                    <div className="relative flex-1 max-w-md">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                                                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Search clients..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 bg-white/60 border border-white/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00abad] focus:border-[#00abad]"
                                        />
                                    </div>
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="px-4 py-2 bg-[#00abad] text-white rounded-lg hover:bg-[#008c8e] transition-colors flex items-center gap-2"
                                    >
                                        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                                            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                                        </svg>
                                        Add Client
                                    </button>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-200">
                                                <th className="text-left py-3 px-4 font-semibold text-sm" style={{ color: '#1d1d1f' }}>Name</th>
                                                <th className="text-left py-3 px-4 font-semibold text-sm" style={{ color: '#1d1d1f' }}>Email</th>
                                                <th className="text-left py-3 px-4 font-semibold text-sm" style={{ color: '#1d1d1f' }}>Company</th>
                                                <th className="text-left py-3 px-4 font-semibold text-sm" style={{ color: '#1d1d1f' }}>Industry</th>
                                                <th className="text-left py-3 px-4 font-semibold text-sm" style={{ color: '#1d1d1f' }}>Projects</th>
                                                <th className="text-left py-3 px-4 font-semibold text-sm" style={{ color: '#1d1d1f' }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredClients.map((client) => {
                                                const clientProjects = projects.filter(p => p.clientId === client._id);
                                                return (
                                                    <tr key={client._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                        <td className="py-3 px-4 font-medium">{client.name}</td>
                                                        <td className="py-3 px-4" style={{ color: '#86868b' }}>{client.email}</td>
                                                        <td className="py-3 px-4">{client.company || '-'}</td>
                                                        <td className="py-3 px-4">
                                                            {client.industry ? (
                                                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                                                                    {client.industry}
                                                                </span>
                                                            ) : '-'}
                                                        </td>
                                                        <td className="py-3 px-4">{clientProjects.length}</td>
                                                        <td className="py-3 px-4">
                                                            <button
                                                                onClick={() => router.push(`/admin/clients/${client._id}`)}
                                                                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                                                            >
                                                                View
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>

                                    {filteredClients.length === 0 && (
                                        <div className="text-center py-12">
                                            <p style={{ color: '#86868b' }}>No clients found</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Projects Tab */}
                        {activeTab === 'projects' && (
                            <div className="flex flex-col gap-6">
                                <div className="relative max-w-md">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                                            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search projects..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 bg-white/60 border border-white/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00abad] focus:border-[#00abad]"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredProjects.map((project) => (
                                        <GlassCard
                                            key={project._id}
                                            p={6}
                                            onClick={() => router.push(`/admin/projects/${project._id}`)}
                                            className="cursor-pointer"
                                        >
                                            <div className="flex flex-col items-start gap-4">
                                                <div className="flex justify-between items-center w-full">
                                                    <h3 className="text-base font-semibold line-clamp-1" style={{ color: '#1d1d1f' }}>
                                                        {project.name}
                                                    </h3>
                                                    <StatusBadge status={project.status} size="sm" />
                                                </div>

                                                <p className="text-xs" style={{ color: '#86868b' }}>
                                                    Client: {project.client?.name || 'Unknown'}
                                                </p>

                                                <p className="text-sm line-clamp-2" style={{ color: '#86868b' }}>
                                                    {project.description || 'No description'}
                                                </p>

                                                <button className="w-full px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                                                    Manage →
                                                </button>
                                            </div>
                                        </GlassCard>
                                    ))}
                                </div>

                                {filteredProjects.length === 0 && (
                                    <div className="text-center py-12">
                                        <p style={{ color: '#86868b' }}>No projects found</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </GlassCard>
                </div>
            </div>

            {/* Toast Notification */}
            {toast && (
                <div className={`fixed top-4 right-4 px-6 py-4 rounded-lg shadow-lg z-[3000] ${
                    toast.type === 'error' ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-green-50 border border-green-200 text-green-700'
                }`}>
                    <div className="flex items-center gap-2">
                        {toast.type === 'error' ? (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        )}
                        <div>
                            <p className="font-semibold">{toast.title}</p>
                            {toast.description && <p className="text-sm">{toast.description}</p>}
                        </div>
                    </div>
                </div>
            )}

            {/* Add Client Modal */}
            {isModalOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 z-[2000]"
                        onClick={() => setIsModalOpen(false)}
                    />
                    <div className="fixed inset-0 flex items-center justify-center z-[2001] p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                                <h2 className="text-2xl font-bold" style={{ color: '#1d1d1f' }}>Add New Client</h2>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                                    </svg>
                                </button>
                            </div>
                            <div className="p-6">
                                <div className="flex flex-col gap-4">
                                    <ThemedInput
                                        label="Full Name"
                                        placeholder="John Doe"
                                        value={newClient.name}
                                        onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                                        required
                                    />
                                    <ThemedInput
                                        label="Email"
                                        type="email"
                                        placeholder="john@example.com"
                                        value={newClient.email}
                                        onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                                        required
                                    />
                                    <ThemedInput
                                        label="Password"
                                        type="password"
                                        placeholder="Enter password"
                                        value={newClient.password}
                                        onChange={(e) => setNewClient({ ...newClient, password: e.target.value })}
                                        required
                                    />
                                    <ThemedInput
                                        label="Company Name"
                                        placeholder="Acme Inc."
                                        value={newClient.company}
                                        onChange={(e) => setNewClient({ ...newClient, company: e.target.value })}
                                    />
                                    <ThemedSelect
                                        label="Industry"
                                        placeholder="Select industry"
                                        value={newClient.industry}
                                        onChange={(e) => setNewClient({ ...newClient, industry: e.target.value })}
                                        options={INDUSTRIES}
                                    />
                                    <ThemedInput
                                        label="Phone"
                                        type="tel"
                                        placeholder="+1 (555) 123-4567"
                                        value={newClient.phone}
                                        onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                                    />
                                    <ThemedInput
                                        label="Website"
                                        type="url"
                                        placeholder="https://example.com"
                                        value={newClient.website}
                                        onChange={(e) => setNewClient({ ...newClient, website: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreateClient}
                                    disabled={creating}
                                    className="px-4 py-2 bg-[#00abad] text-white rounded-lg hover:bg-[#008c8e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {creating ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        'Create Client'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </AdminSidebarWrapper>
    );
}

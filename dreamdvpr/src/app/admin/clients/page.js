'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AdminSidebarWrapper } from '@/app/components/admin/AdminSidebar';
import GlassCard from '@/app/components/ui/GlassCard';
import ThemedInput from '@/app/components/ui/ThemedInput';
import ThemedSelect from '@/app/components/ui/ThemedSelect';

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

export default function ClientsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [creating, setCreating] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [toast, setToast] = useState(null);

    const [editingClient, setEditingClient] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [clientToDelete, setClientToDelete] = useState(null);

    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [projectClient, setProjectClient] = useState(null);
    const [quickProject, setQuickProject] = useState({ name: '', description: '' });

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
                fetchClients();
            }
        }
    }, [status, session, router]);

    const showToast = (title, description, type = 'success') => {
        setToast({ title, description, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchClients = async () => {
        try {
            const res = await fetch('/api/clients');
            const data = await res.json();
            setClients(data.clients || []);
        } catch (error) {
            console.error('Error fetching clients:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateOrUpdateClient = async () => {
        const isEdit = !!editingClient;
        if (!newClient.name || !newClient.email || (!isEdit && !newClient.password)) {
            showToast('Missing required fields', 'Name, email, and password are required', 'error');
            return;
        }

        setCreating(true);
        try {
            const url = isEdit ? `/api/clients/${editingClient._id}` : '/api/clients';
            const method = isEdit ? 'PUT' : 'POST';

            const payload = { ...newClient };
            if (!isEdit) {
                payload.role = 'client';
                payload.onboardingCompleted = true;
            } else if (!payload.password) {
                delete payload.password; // Don't update password if not provided in edit mode
            }

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                showToast(isEdit ? 'Client updated successfully' : 'Client created successfully', '', 'success');
                resetForm();
                setIsModalOpen(false);
                fetchClients();
            } else {
                const data = await res.json();
                showToast(isEdit ? 'Failed to update client' : 'Failed to create client', data.error || 'An error occurred', 'error');
            }
        } catch (error) {
            console.error('Error saving client:', error);
            showToast('Error', 'An error occurred while saving the client', 'error');
        } finally {
            setCreating(false);
        }
    };

    const handleDeleteClient = async () => {
        if (!clientToDelete) return;
        setCreating(true);
        try {
            const res = await fetch(`/api/clients/${clientToDelete._id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                showToast('Client deleted successfully', '', 'success');
                setIsDeleteModalOpen(false);
                setClientToDelete(null);
                fetchClients();
            } else {
                const data = await res.json();
                showToast('Failed to delete client', data.error || 'An error occurred', 'error');
            }
        } catch (error) {
            console.error('Error deleting client:', error);
            showToast('Error', 'An error occurred while deleting the client', 'error');
        } finally {
            setCreating(false);
        }
    };

    const handleQuickProject = async () => {
        if (!quickProject.name || !projectClient) return;

        setCreating(true);
        try {
            const res = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...quickProject,
                    clientId: projectClient._id
                }),
            });

            if (res.ok) {
                showToast('Project created successfully');
                setIsProjectModalOpen(false);
                setQuickProject({ name: '', description: '' });
                setProjectClient(null);
            } else {
                showToast('Failed to create project', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showToast('An error occurred', 'error');
        } finally {
            setCreating(false);
        }
    };

    const resetForm = () => {
        setNewClient({
            name: '',
            email: '',
            password: '',
            company: '',
            industry: '',
            phone: '',
            website: '',
        });
        setEditingClient(null);
    };

    const openEditModal = (client) => {
        setEditingClient(client);
        setNewClient({
            name: client.name || '',
            email: client.email || '',
            password: '', // Password stays empty unless changing
            company: client.company || '',
            industry: client.industry || '',
            phone: client.phone || '',
            website: client.website || '',
        });
        setIsModalOpen(true);
    };

    const filteredClients = clients.filter(client =>
        client.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.company?.toLowerCase().includes(searchQuery.toLowerCase())
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
                <div className="flex flex-col gap-6">
                    <div className="flex justify-between items-end">
                        <div>
                            <h1 className="text-4xl font-bold mb-2" style={{ color: '#1d1d1f' }}>Clients</h1>
                            <p style={{ color: '#86868b' }}>Manage your client base and onboarding status</p>
                        </div>
                        <button
                            onClick={() => { resetForm(); setIsModalOpen(true); }}
                            className="px-6 py-2 bg-[#1d1d1f] text-white rounded-xl hover:bg-black transition-all flex items-center gap-2 font-semibold shadow-lg shadow-[#1d1d1f]/20 group"
                        >
                            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" fill="currentColor">
                                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                            </svg>
                            Add Client
                        </button>
                    </div>

                    <GlassCard p={0} className="overflow-hidden">
                        <div className="p-6 border-b border-white/20 bg-white/40">
                            <div className="relative max-w-md">
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
                                    className="w-full pl-10 pr-4 py-2.5 bg-white/60 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1d1d1f] focus:border-[#1d1d1f] transition-all"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-white/40 border-b border-gray-100/50">
                                        <th className="text-left py-4 px-6 font-semibold text-sm" style={{ color: '#1d1d1f' }}>Name</th>
                                        <th className="text-left py-4 px-6 font-semibold text-sm" style={{ color: '#1d1d1f' }}>Email</th>
                                        <th className="text-left py-4 px-6 font-semibold text-sm" style={{ color: '#1d1d1f' }}>Company</th>
                                        <th className="text-left py-4 px-6 font-semibold text-sm" style={{ color: '#1d1d1f' }}>Industry</th>
                                        <th className="text-right py-4 px-6 font-semibold text-sm" style={{ color: '#1d1d1f' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredClients.map((client) => (
                                        <tr key={client._id} className="border-b border-gray-100/30 hover:bg-white/30 transition-colors">
                                            <td className="py-4 px-6 font-medium">{client.name}</td>
                                            <td className="py-4 px-6 text-sm" style={{ color: '#86868b' }}>{client.email}</td>
                                            <td className="py-4 px-6 text-sm font-semibold text-[#1d1d1f]">{client.company || '-'}</td>
                                            <td className="py-4 px-6">
                                                {client.industry ? (
                                                    <span className="px-2 py-1 bg-[#1d1d1f]/10 text-[#1d1d1f] rounded text-[10px] uppercase font-bold tracking-wider">
                                                        {client.industry}
                                                    </span>
                                                ) : '-'}
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => openEditModal(client)}
                                                        className="p-2 text-[#1d1d1f] hover:bg-[#1d1d1f]/10 rounded-lg transition-all"
                                                        title="Edit Client"
                                                    >
                                                        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => { setClientToDelete(client); setIsDeleteModalOpen(true); }}
                                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                        title="Delete Client"
                                                    >
                                                        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => { setProjectClient(client); setIsProjectModalOpen(true); }}
                                                        className="px-4 py-1.5 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-all text-xs font-bold"
                                                    >
                                                        Quick Project
                                                    </button>
                                                    <button
                                                        onClick={() => router.push(`/admin/clients/${client._id}`)}
                                                        className="px-4 py-1.5 bg-[#1d1d1f] text-white rounded-lg hover:bg-black transition-all text-xs font-bold"
                                                    >
                                                        Manage
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {filteredClients.length === 0 && (
                                <div className="text-center py-20 bg-white/20">
                                    <div className="text-4xl mb-4">👥</div>
                                    <h3 className="text-lg font-bold mb-1" style={{ color: '#1d1d1f' }}>No Clients Found</h3>
                                    <p style={{ color: '#86868b' }}>Try searching for someone else or add a new client.</p>
                                </div>
                            )}
                        </div>
                    </GlassCard>
                </div>
            </div>

            {/* Toast Notification */}
            {toast && (
                <div className={`fixed bottom-8 right-8 px-6 py-4 rounded-2xl shadow-2xl z-[3000] animate-in slide-in-from-bottom-4 ${toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-[#1d1d1f] text-white'
                    }`}>
                    <div className="flex items-center gap-3">
                        <p className="font-bold">{toast.title}</p>
                    </div>
                </div>
            )}

            {/* Add/Edit Client Modal */}
            {isModalOpen && (
                <>
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[2000]" onClick={() => { setIsModalOpen(false); resetForm(); }} />
                    <div className="fixed inset-0 flex items-center justify-center z-[2001] p-4 pointer-events-none">
                        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-hidden flex flex-col pointer-events-auto scale-in">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <h2 className="text-2xl font-bold" style={{ color: '#1d1d1f' }}>{editingClient ? 'Edit Client' : 'Add New Client'}</h2>
                                <button onClick={() => { setIsModalOpen(false); resetForm(); }} className="p-2 hover:bg-gray-100 rounded-lg">
                                    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /></svg>
                                </button>
                            </div>
                            <div className="p-6 overflow-y-auto space-y-4">
                                <ThemedInput label="Full Name" value={newClient.name} onChange={(e) => setNewClient({ ...newClient, name: e.target.value })} required />
                                <ThemedInput label="Email" type="email" value={newClient.email} onChange={(e) => setNewClient({ ...newClient, email: e.target.value })} required />
                                <ThemedInput
                                    label={editingClient ? "New Password (leave blank to keep current)" : "Password"}
                                    type="password"
                                    value={newClient.password}
                                    onChange={(e) => setNewClient({ ...newClient, password: e.target.value })}
                                    required={!editingClient}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <ThemedInput label="Company" value={newClient.company} onChange={(e) => setNewClient({ ...newClient, company: e.target.value })} />
                                    <ThemedSelect label="Industry" value={newClient.industry} onChange={(e) => setNewClient({ ...newClient, industry: e.target.value })} options={INDUSTRIES} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <ThemedInput label="Phone" type="tel" value={newClient.phone} onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })} />
                                    <ThemedInput label="Website" type="url" value={newClient.website} onChange={(e) => setNewClient({ ...newClient, website: e.target.value })} />
                                </div>
                            </div>
                            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                                <button onClick={() => { setIsModalOpen(false); resetForm(); }} className="px-6 py-2 rounded-xl font-semibold text-gray-500 hover:bg-gray-100 transition-all">Cancel</button>
                                <button
                                    onClick={handleCreateOrUpdateClient}
                                    disabled={creating}
                                    className="px-8 py-2 bg-[#1d1d1f] text-white rounded-xl font-bold hover:bg-black transition-all disabled:opacity-50"
                                >
                                    {creating ? 'Saving...' : editingClient ? 'Update Client' : 'Register Client'}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <>
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[2000]" onClick={() => setIsDeleteModalOpen(false)} />
                    <div className="fixed inset-0 flex items-center justify-center z-[2001] p-4 pointer-events-none">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 pointer-events-auto scale-in">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg viewBox="0 0 24 24" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Client?</h3>
                                <p className="text-gray-500 mb-8">
                                    Are you sure you want to delete <strong>{clientToDelete?.name}</strong>? This action cannot be undone and will remove all associated data.
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setIsDeleteModalOpen(false)}
                                        className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDeleteClient}
                                        disabled={creating}
                                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all disabled:opacity-50"
                                    >
                                        {creating ? 'Deleting...' : 'Delete Client'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Quick Project Modal */}
            {isProjectModalOpen && (
                <>
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[2000]" onClick={() => setIsProjectModalOpen(false)} />
                    <div className="fixed inset-0 flex items-center justify-center z-[2001] p-4 pointer-events-none">
                        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-lg w-full flex flex-col pointer-events-auto scale-in">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-bold" style={{ color: '#1d1d1f' }}>Quick Project Launch</h2>
                                    <p className="text-xs text-gray-400">For {projectClient?.name}</p>
                                </div>
                                <button onClick={() => setIsProjectModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /></svg>
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                <ThemedInput
                                    label="Project Name"
                                    value={quickProject.name}
                                    onChange={(e) => setQuickProject({ ...quickProject, name: e.target.value })}
                                    required
                                />
                                <ThemedInput
                                    label="Description"
                                    type="textarea"
                                    rows={3}
                                    value={quickProject.description}
                                    onChange={(e) => setQuickProject({ ...quickProject, description: e.target.value })}
                                />
                            </div>
                            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                                <button onClick={() => setIsProjectModalOpen(false)} className="px-6 py-2 rounded-xl font-semibold text-gray-500 hover:bg-gray-100 transition-all">Cancel</button>
                                <button
                                    onClick={handleQuickProject}
                                    disabled={creating}
                                    className="px-8 py-2 bg-[#1d1d1f] text-white rounded-xl font-bold hover:bg-black transition-all disabled:opacity-50"
                                >
                                    {creating ? 'Starting...' : 'Launch Project'}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </AdminSidebarWrapper>
    );
}


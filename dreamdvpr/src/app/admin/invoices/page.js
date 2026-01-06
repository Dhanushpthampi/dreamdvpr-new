'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AdminSidebarWrapper } from '@/app/components/admin/AdminSidebar';
import GlassCard from '@/app/components/ui/GlassCard';
import ThemedInput from '@/app/components/ui/ThemedInput';
import ThemedSelect from '@/app/components/ui/ThemedSelect';
import StatusBadge from '@/app/components/ui/StatusBadge';

export default function AdminInvoicesPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [invoices, setInvoices] = useState([]);
    const [clients, setClients] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [creating, setCreating] = useState(false);
    const [toast, setToast] = useState(null);

    const [newInvoice, setNewInvoice] = useState({
        clientId: '',
        projectId: '',
        amount: '',
        description: '',
        dueDate: '',
        invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
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
            const [invRes, clientRes, projectRes] = await Promise.all([
                fetch('/api/invoices'),
                fetch('/api/clients'),
                fetch('/api/projects')
            ]);

            const invData = await invRes.json();
            const clientData = await clientRes.json();
            const projectData = await projectRes.json();

            setInvoices(invData.invoices || []);
            setClients(clientData.clients || []);
            setProjects(projectData.projects || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateInvoice = async () => {
        if (!newInvoice.clientId || !newInvoice.amount || !newInvoice.dueDate) {
            showToast('Please fill all required fields', 'error');
            return;
        }

        setCreating(true);
        try {
            const res = await fetch('/api/invoices', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newInvoice),
            });

            if (res.ok) {
                showToast('Invoice created successfully');
                setIsModalOpen(false);
                setNewInvoice({
                    clientId: '',
                    projectId: '',
                    amount: '',
                    description: '',
                    dueDate: '',
                    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
                });
                fetchData();
            } else {
                const data = await res.json();
                showToast(data.error || 'Failed to create invoice', 'error');
            }
        } catch (error) {
            console.error('Error creating invoice:', error);
            showToast('An error occurred', 'error');
        } finally {
            setCreating(false);
        }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            const res = await fetch(`/api/invoices/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                showToast('Status updated successfully');
                fetchData();
            } else {
                showToast('Failed to update status', 'error');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            showToast('An error occurred', 'error');
        }
    };

    const handleDeleteInvoice = async (id) => {
        if (!confirm('Are you sure you want to delete this invoice?')) return;

        try {
            const res = await fetch(`/api/invoices/${id}`, { method: 'DELETE' });
            if (res.ok) {
                showToast('Invoice deleted');
                fetchData();
            }
        } catch (error) {
            console.error('Error deleting invoice:', error);
        }
    };

    if (status === 'loading' || loading) {
        return (
            <AdminSidebarWrapper>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-t-black border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
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
                            <h1 className="text-4xl font-bold mb-2" style={{ color: '#1d1d1f' }}>Invoices</h1>
                            <p style={{ color: '#86868b' }}>Generate and track client billings</p>
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-6 py-2 bg-[#1d1d1f] text-white rounded-xl hover:bg-black transition-all flex items-center gap-2 font-semibold shadow-lg shadow-[#1d1d1f]/20"
                        >
                            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                            </svg>
                            Create Invoice
                        </button>
                    </div>

                    <GlassCard p={0} className="overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-white/40 border-b border-gray-100/50">
                                        <th className="text-left py-4 px-6 font-semibold text-sm">Invoice #</th>
                                        <th className="text-left py-4 px-6 font-semibold text-sm">Client</th>
                                        <th className="text-left py-4 px-6 font-semibold text-sm">Amount</th>
                                        <th className="text-left py-4 px-6 font-semibold text-sm">Due Date</th>
                                        <th className="text-left py-4 px-6 font-semibold text-sm">Status</th>
                                        <th className="text-right py-4 px-6 font-semibold text-sm">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoices.map((invoice) => (
                                        <tr key={invoice._id} className="border-b border-gray-100/30 hover:bg-white/30 transition-colors">
                                            <td className="py-4 px-6 font-bold">{invoice.invoiceNumber}</td>
                                            <td className="py-4 px-6">
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{invoice.client?.name}</span>
                                                    <span className="text-xs text-gray-400">{invoice.project?.name || 'General Project'}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 font-black text-[#10b981]">${invoice.amount.toLocaleString()}</td>
                                            <td className="py-4 px-6 text-sm">{new Date(invoice.dueDate).toLocaleDateString()}</td>
                                            <td className="py-4 px-6">
                                                <select
                                                    value={invoice.status}
                                                    onChange={(e) => handleUpdateStatus(invoice._id, e.target.value)}
                                                    className="bg-gray-50 border border-gray-200 text-gray-900 text-xs rounded-lg focus:ring-black focus:border-black block w-full p-2"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="paid">Paid</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleDeleteInvoice(invoice._id)}
                                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                        title="Delete Invoice"
                                                    >
                                                        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {invoices.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="py-20 text-center text-gray-400">No invoices generated yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </GlassCard>
                </div>
            </div>

            {/* Create Invoice Modal */}
            {isModalOpen && (
                <>
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[2000]" onClick={() => setIsModalOpen(false)} />
                    <div className="fixed inset-0 flex items-center justify-center z-[2001] p-4 pointer-events-none">
                        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-xl w-full flex flex-col pointer-events-auto scale-in">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <h2 className="text-2xl font-bold" style={{ color: '#1d1d1f' }}>Generate New Invoice</h2>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                                    </svg>
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                <ThemedSelect
                                    label="Select Client"
                                    value={newInvoice.clientId}
                                    onChange={(e) => setNewInvoice({ ...newInvoice, clientId: e.target.value })}
                                    options={clients.map(c => ({ value: c._id, label: `${c.name} (${c.company})` }))}
                                    required
                                />
                                <ThemedSelect
                                    label="Select Project (Optional)"
                                    value={newInvoice.projectId}
                                    onChange={(e) => setNewInvoice({ ...newInvoice, projectId: e.target.value })}
                                    options={projects.filter(p => p.clientId === newInvoice.clientId).map(p => ({ value: p._id, label: p.name }))}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <ThemedInput
                                        label="Amount ($)"
                                        type="number"
                                        value={newInvoice.amount}
                                        onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })}
                                        required
                                    />
                                    <ThemedInput
                                        label="Due Date"
                                        type="date"
                                        value={newInvoice.dueDate}
                                        onChange={(e) => setNewInvoice({ ...newInvoice, dueDate: e.target.value })}
                                        required
                                    />
                                </div>
                                <ThemedInput
                                    label="Description/Notes"
                                    type="textarea"
                                    rows={3}
                                    value={newInvoice.description}
                                    onChange={(e) => setNewInvoice({ ...newInvoice, description: e.target.value })}
                                />
                            </div>
                            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                                <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 rounded-xl font-semibold text-gray-500 hover:bg-gray-100">Cancel</button>
                                <button
                                    onClick={handleCreateInvoice}
                                    disabled={creating}
                                    className="px-8 py-2 bg-[#1d1d1f] text-white rounded-xl font-bold hover:bg-black transition-all disabled:opacity-50"
                                >
                                    {creating ? 'Generating...' : 'Issue Invoice'}
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

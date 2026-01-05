'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ClientSidebarWrapper } from '@/app/components/client/ClientSidebar';
import GlassCard from '@/app/components/ui/GlassCard';
import StatusBadge from '@/app/components/ui/StatusBadge';

export default function ClientInvoicesPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated') {
            fetchInvoices();
        }
    }, [status, router]);

    const fetchInvoices = async () => {
        try {
            const res = await fetch('/api/invoices');
            const data = await res.json();
            setInvoices(data.invoices || []);
        } catch (error) {
            console.error('Error fetching invoices:', error);
        } finally {
            setLoading(false);
        }
    };

    if (status === 'loading' || loading) {
        return (
            <ClientSidebarWrapper>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-t-black border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
                </div>
            </ClientSidebarWrapper>
        );
    }

    return (
        <ClientSidebarWrapper>
            <div className="container mx-auto max-w-7xl px-4 py-8">
                <div className="flex flex-col gap-8">
                    <div>
                        <h1 className="text-4xl font-bold mb-2" style={{ color: '#1d1d1f' }}>My Invoices</h1>
                        <p style={{ color: '#86868b' }}>Track your billing and payment history</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <GlassCard p={6} className="bg-black/5 border-black/5">
                            <p className="text-xs font-bold uppercase tracking-widest text-[#1d1d1f] opacity-40 mb-1">Total Outstanding</p>
                            <h2 className="text-4xl font-black text-gray-900">
                                ${invoices.filter(i => i.status === 'pending').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
                            </h2>
                        </GlassCard>
                        <GlassCard p={6}>
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Paid Invoices</p>
                            <h2 className="text-4xl font-black text-gray-400">
                                {invoices.filter(i => i.status === 'paid').length}
                            </h2>
                        </GlassCard>
                        <GlassCard p={6}>
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Total Invested</p>
                            <h2 className="text-4xl font-black text-gray-400">
                                ${invoices.filter(i => i.status === 'paid').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
                            </h2>
                        </GlassCard>
                    </div>

                    <GlassCard p={0} className="overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-white/40 border-b border-gray-100/50">
                                        <th className="text-left py-4 px-6 font-semibold text-sm">Invoice #</th>
                                        <th className="text-left py-4 px-6 font-semibold text-sm">Project</th>
                                        <th className="text-left py-4 px-6 font-semibold text-sm">Amount</th>
                                        <th className="text-left py-4 px-6 font-semibold text-sm">Due Date</th>
                                        <th className="text-left py-4 px-6 font-semibold text-sm">Status</th>
                                        <th className="text-right py-4 px-6 font-semibold text-sm">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoices.map((invoice) => (
                                        <tr key={invoice._id} className="border-b border-gray-100/30 hover:bg-white/30 transition-colors">
                                            <td className="py-4 px-6 font-bold">{invoice.invoiceNumber}</td>
                                            <td className="py-4 px-6 font-medium">{invoice.project?.name || 'General Services'}</td>
                                            <td className="py-4 px-6 font-black text-[#10b981]">${invoice.amount.toLocaleString()}</td>
                                            <td className="py-4 px-6 text-sm">{new Date(invoice.dueDate).toLocaleDateString()}</td>
                                            <td className="py-4 px-6">
                                                <StatusBadge status={invoice.status} size="sm" />
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                {invoice.status === 'pending' ? (
                                                    <span className="text-xs font-bold text-[#f59e0b] bg-[#f59e0b]/10 px-3 py-1 rounded-full">
                                                        Payment Pending
                                                    </span>
                                                ) : (
                                                    <span className="text-xs font-bold text-gray-400">No Action Needed</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {invoices.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="py-20 text-center text-gray-400">No invoices found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </GlassCard>
                </div>
            </div>
        </ClientSidebarWrapper>
    );
}

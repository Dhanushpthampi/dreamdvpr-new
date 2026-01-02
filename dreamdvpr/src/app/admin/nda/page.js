'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AdminSidebarWrapper } from '@/app/components/admin/AdminSidebar';
import GlassCard from '@/app/components/ui/GlassCard';
import NdaGenerator from '@/app/components/admin/NdaGenerator';

export default function NdaPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [clients, setClients] = useState([]);

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

    const fetchData = async () => {
        try {
            const clientsRes = await fetch('/api/clients');
            const clientsData = await clientsRes.json();
            setClients(clientsData.clients || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
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

    return (
        <AdminSidebarWrapper>
            <div className="container mx-auto max-w-5xl px-4 py-8">
                <div className="flex flex-col gap-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-2 text-[#1d1d1f]">Generate NDA</h1>
                        <p className="text-[#86868b]">Create Non-Disclosure Agreements for your clients.</p>
                    </div>

                    <GlassCard p={8}>
                        <NdaGenerator
                            clients={clients}
                        />
                    </GlassCard>
                </div>
            </div>
        </AdminSidebarWrapper>
    );
}

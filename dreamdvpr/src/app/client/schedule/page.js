'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ClientSidebarWrapper } from '@/app/components/client/ClientSidebar';
import CalendlyScheduler from '@/app/components/shared/CalendlyScheduler';
import GlassCard from '@/app/components/ui/GlassCard';

export default function SchedulePage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated' && session?.user?.role !== 'client') {
            router.push('/login');
        }
    }, [status, session]);

    if (status === 'loading') return null;

    return (
        <ClientSidebarWrapper>
            <div className="container mx-auto max-w-5xl px-4 py-12">
                <div className="flex flex-col gap-8">
                    <div className="text-center space-y-3">
                        <h1 className="text-4xl font-black text-[#1d1d1f] tracking-tight">Schedule Your Strategy Session</h1>
                        <p className="text-gray-500 font-medium max-w-2xl mx-auto">
                            Book a 1-on-1 meeting with our team to discuss your project roadmap, review progress, or explore new solutions.
                        </p>
                    </div>

                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        <CalendlyScheduler />
                    </div>

                    <div className="flex justify-center gap-6 text-xs font-bold text-gray-400 uppercase tracking-widest mt-8">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#00abad]" />
                            Automated Invites
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#00abad]" />
                            Calendar Sync
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#00abad]" />
                            Zoom/Meet Links
                        </div>
                    </div>
                </div>
            </div>
        </ClientSidebarWrapper>
    );
}

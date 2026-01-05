'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AdminSidebarWrapper } from '@/app/components/admin/AdminSidebar';
import GlassCard from '@/app/components/ui/GlassCard';
import StatusBadge from '@/app/components/ui/StatusBadge';

export default function AnalyticsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [stats, setStats] = useState({ clients: 0, projects: 0, active: 0, completed: 0 });
    const [logs, setLogs] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated') {
            if (session?.user?.role !== 'admin') {
                router.push('/login');
            } else {
                fetchDashboardData();
            }
        }
    }, [status, session, router]);

    const fetchDashboardData = async () => {
        try {
            const [clientsRes, projectsRes, logsRes] = await Promise.all([
                fetch('/api/clients'),
                fetch('/api/projects'),
                fetch('/api/admin/logs')
            ]);

            const clientsData = await clientsRes.json();
            const projectsData = await projectsRes.json();
            const logsData = await logsRes.json();

            const pList = projectsData.projects || [];
            setProjects(pList);
            setStats({
                clients: (clientsData.clients || []).length,
                projects: pList.length,
                active: pList.filter(p => p.status === 'in-progress').length,
                completed: pList.filter(p => p.status === 'completed').length
            });
            setLogs(logsData.logs || []);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

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
                <div className="flex flex-col gap-10">
                    {/* Header */}
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-2" style={{ color: '#1d1d1f' }}>
                            Platform Analytics
                        </h1>
                        <p className="text-lg" style={{ color: '#86868b' }}>
                            Real-time monitoring and business performance
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: 'Total Clients', value: stats.clients, color: '#1d1d1f' },
                            { label: 'Total Projects', value: stats.projects, color: '#1d1d1f' },
                            { label: 'Active Tasks', value: stats.active, color: '#3b82f6' },
                            { label: 'Success Rate', value: `${stats.projects > 0 ? Math.round((stats.completed / stats.projects) * 100) : 0}%`, color: '#10b981' }
                        ].map((s, idx) => (
                            <GlassCard key={idx} p={6} className="relative overflow-hidden group">
                                <div className="flex flex-col gap-1">
                                    <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#86868b' }}>{s.label}</p>
                                    <h2 className="text-3xl font-black" style={{ color: s.color }}>{s.value}</h2>
                                </div>
                                <div className="absolute -right-2 -bottom-2 opacity-5 translate-y-2 group-hover:translate-y-0 transition-transform">
                                    <svg viewBox="0 0 24 24" className="w-16 h-16" fill="currentColor">
                                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
                                    </svg>
                                </div>
                            </GlassCard>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Charts Area */}
                        <div className="lg:col-span-2 space-y-8">
                            <GlassCard p={8}>
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-xl font-bold">Project Status Distribution</h3>
                                </div>
                                <div className="flex items-center gap-12 flex-wrap md:flex-nowrap">
                                    <div className="relative w-48 h-48 rounded-full border-[16px] border-gray-100 flex items-center justify-center">
                                        <div className="text-center">
                                            <p className="text-3xl font-bold">{stats.projects}</p>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase italic">Total</p>
                                        </div>
                                        {/* Simple CSS Donut Visualization */}
                                        <svg viewBox="0 0 36 36" className="absolute inset-0 w-full h-full -rotate-90">
                                            <path
                                                className="text-[#1d1d1f] fill-none stroke-current"
                                                strokeWidth="2"
                                                strokeDasharray={`${(stats.active / (stats.projects || 1)) * 100}, 100`}
                                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            />
                                        </svg>
                                    </div>
                                    <div className="flex-1 grid grid-cols-1 gap-4">
                                        {[
                                            { label: 'In Progress', count: stats.active, color: '#1d1d1f' },
                                            { label: 'Completed', count: stats.completed, color: '#10b981' },
                                            { label: 'Pending', count: stats.projects - stats.active - stats.completed, color: '#f59e0b' }
                                        ].map(item => (
                                            <div key={item.label} className="flex items-center justify-between p-3 bg-white/40 rounded-xl border border-white/60">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                                    <span className="text-sm font-semibold">{item.label}</span>
                                                </div>
                                                <span className="font-bold">{item.count}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </GlassCard>

                            <GlassCard p={8}>
                                <h3 className="text-xl font-bold mb-6">Volume & Growth</h3>
                                <div className="h-48 flex items-end gap-2 px-2">
                                    {/* Mock Bar Chart for Visual Polish */}
                                    {[40, 70, 45, 90, 65, 85, 100, 60, 75, 55, 80, 95].map((h, i) => (
                                        <div key={i} className="flex-1 bg-[#10b981]/10 rounded-t-lg group relative cursor-help" style={{ height: `${h}%` }}>
                                            <div className="absolute inset-0 bg-[#10b981] opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg" />
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
                                    <span>Jan</span>
                                    <span>Dec</span>
                                </div>
                            </GlassCard>
                        </div>

                        {/* Recent Activity Logs */}
                        <div className="lg:col-span-1">
                            <GlassCard p={0} className="h-full flex flex-col overflow-hidden">
                                <div className="p-6 border-b border-white/20 bg-white/40 sticky top-0 z-10">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-bold">Activity Monitor</h3>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                            <span className="text-[10px] font-bold text-gray-500 uppercase italic">Live logs</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1 overflow-y-auto max-h-[700px] p-6 space-y-6">
                                    {logs.length === 0 ? (
                                        <div className="text-center py-20">
                                            <p className="text-gray-400 italic">No recent activity detected.</p>
                                        </div>
                                    ) : (
                                        logs.map((log, idx) => (
                                            <div key={idx} className="flex gap-4 group">
                                                <div className="flex flex-col items-center">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-sm transition-transform group-hover:scale-110 ${log.type === 'error' ? 'bg-red-500 text-white' :
                                                        log.type === 'success' ? 'bg-green-500 text-white' :
                                                            'bg-[#1d1d1f] text-white'
                                                        }`}>
                                                        {log.userName?.charAt(0) || 'S'}
                                                    </div>
                                                    {idx !== logs.length - 1 && <div className="w-px flex-1 bg-gray-200 my-2" />}
                                                </div>
                                                <div className="flex-1 pt-0.5">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <p className="text-sm font-bold text-[#1d1d1f]">{log.action}</p>
                                                        <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap">
                                                            {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-500 leading-relaxed">
                                                        <span className="font-semibold text-gray-700">{log.userName}</span> {log.details}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
                                    <button className="text-xs font-bold text-[#1d1d1f] hover:underline">View Historical Archives →</button>
                                </div>
                            </GlassCard>
                        </div>
                    </div>
                </div>
            </div>
        </AdminSidebarWrapper>
    );
}

'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AdminSidebarWrapper } from '@/app/components/admin/AdminSidebar';
import GlassCard from '@/app/components/ui/GlassCard';

export default function LandingAnalyticsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [analyticsData, setAnalyticsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dateRange, setDateRange] = useState('30daysAgo');

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated') {
            if (session?.user?.role !== 'admin') {
                router.push('/login');
            } else {
                fetchAnalyticsData();
            }
        }
    }, [status, session, router, dateRange]);

    const fetchAnalyticsData = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`/api/analytics/ga-data?startDate=${dateRange}&endDate=today`);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch analytics data');
            }

            const data = await response.json();
            setAnalyticsData(data);
        } catch (error) {
            console.error('Error fetching analytics data:', error);
            setError(error.message);
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

    if (error) {
        return (
            <AdminSidebarWrapper>
                <div className="container mx-auto max-w-7xl px-4 py-8">
                    <GlassCard p={8}>
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Analytics</h2>
                            <p className="text-gray-600">{error}</p>
                            <p className="text-sm text-gray-500 mt-4">
                                Please make sure you have configured the GA_PROPERTY_ID in your environment variables
                                and that your service account has access to Google Analytics Data API.
                            </p>
                            <button
                                onClick={fetchAnalyticsData}
                                className="mt-6 px-6 py-2 bg-[#c53030] text-white rounded-lg hover:bg-[#c53030] transition-colors"
                            >
                                Retry
                            </button>
                        </div>
                    </GlassCard>
                </div>
            </AdminSidebarWrapper>
        );
    }

    const formatNumber = (num) => {
        return new Intl.NumberFormat().format(num);
    };

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}m ${secs}s`;
    };

    return (
        <AdminSidebarWrapper>
            <div className="container mx-auto max-w-7xl px-4 py-8">
                <div className="flex flex-col gap-10">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-2" style={{ color: '#1d1d1f' }}>
                                Landing Page Analytics
                            </h1>
                            <p className="text-lg" style={{ color: '#86868b' }}>
                                Real-time insights from Google Analytics
                            </p>
                        </div>

                        {/* Date Range Selector */}
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#c53030]"
                        >
                            <option value="7daysAgo">Last 7 days</option>
                            <option value="30daysAgo">Last 30 days</option>
                            <option value="90daysAgo">Last 90 days</option>
                        </select>
                    </div>

                    {/* Summary Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {[
                            { label: 'Active Users', value: formatNumber(analyticsData?.summary?.activeUsers || 0), color: '#c53030' },
                            { label: 'Sessions', value: formatNumber(analyticsData?.summary?.sessions || 0), color: '#1d1d1f' },
                            { label: 'Page Views', value: formatNumber(analyticsData?.summary?.pageViews || 0), color: '#3b82f6' },
                            { label: 'Bounce Rate', value: `${analyticsData?.summary?.bounceRate || 0}%`, color: '#f59e0b' },
                            { label: 'Avg. Duration', value: formatDuration(analyticsData?.summary?.avgSessionDuration || 0), color: '#10b981' },
                        ].map((stat, idx) => (
                            <GlassCard key={idx} p={6} className="relative overflow-hidden group">
                                <div className="flex flex-col gap-1">
                                    <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#86868b' }}>
                                        {stat.label}
                                    </p>
                                    <h2 className="text-2xl md:text-3xl font-black" style={{ color: stat.color }}>
                                        {stat.value}
                                    </h2>
                                </div>
                            </GlassCard>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Page Views Over Time */}
                        <GlassCard p={8} className="lg:col-span-2">
                            <h3 className="text-xl font-bold mb-6">Page Views Over Time</h3>
                            <div className="h-64 flex items-end gap-1 px-2">
                                {analyticsData?.pageViewsOverTime?.slice(-30).map((item, i) => {
                                    const maxViews = Math.max(...analyticsData.pageViewsOverTime.map(d => d.pageViews));
                                    const height = (item.pageViews / maxViews) * 100;
                                    return (
                                        <div
                                            key={i}
                                            className="flex-1 bg-[#c53030]/20 rounded-t-lg group relative cursor-help hover:bg-[#c53030]/40 transition-colors"
                                            style={{ height: `${height}%`, minHeight: '4px' }}
                                            title={`${item.date}: ${formatNumber(item.pageViews)} views`}
                                        >
                                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                                {formatNumber(item.pageViews)}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="flex justify-between mt-4 text-xs font-medium text-gray-400">
                                <span>{analyticsData?.pageViewsOverTime?.[0]?.date || 'Start'}</span>
                                <span>{analyticsData?.pageViewsOverTime?.[analyticsData.pageViewsOverTime.length - 1]?.date || 'End'}</span>
                            </div>
                        </GlassCard>

                        {/* Traffic Sources */}
                        <GlassCard p={8}>
                            <h3 className="text-xl font-bold mb-6">Top Traffic Sources</h3>
                            <div className="space-y-4">
                                {analyticsData?.trafficSources?.length > 0 ? (
                                    analyticsData.trafficSources.map((source, idx) => {
                                        const totalSessions = analyticsData.trafficSources.reduce((sum, s) => sum + s.sessions, 0);
                                        const percentage = ((source.sessions / totalSessions) * 100).toFixed(1);
                                        return (
                                            <div key={idx} className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <div className="flex justify-between mb-1">
                                                        <span className="text-sm font-semibold capitalize">{source.source}</span>
                                                        <span className="text-sm text-gray-600">{formatNumber(source.sessions)}</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className="bg-[#c53030] h-2 rounded-full transition-all"
                                                            style={{ width: `${percentage}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className="text-gray-400 text-center py-8">No traffic data available</p>
                                )}
                            </div>
                        </GlassCard>

                        {/* Device Categories */}
                        <GlassCard p={8}>
                            <h3 className="text-xl font-bold mb-6">Devices</h3>
                            <div className="space-y-4">
                                {analyticsData?.devices?.length > 0 ? (
                                    analyticsData.devices.map((device, idx) => {
                                        const totalSessions = analyticsData.devices.reduce((sum, d) => sum + d.sessions, 0);
                                        const percentage = ((device.sessions / totalSessions) * 100).toFixed(1);
                                        const colors = ['#c53030', '#3b82f6', '#10b981', '#f59e0b'];
                                        return (
                                            <div key={idx} className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colors[idx % colors.length]}20` }}>
                                                    <span className="text-xl font-bold" style={{ color: colors[idx % colors.length] }}>
                                                        {percentage}%
                                                    </span>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-semibold capitalize">{device.category}</p>
                                                    <p className="text-sm text-gray-500">{formatNumber(device.sessions)} sessions</p>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className="text-gray-400 text-center py-8">No device data available</p>
                                )}
                            </div>
                        </GlassCard>

                        {/* Top Pages */}
                        <GlassCard p={8} className="lg:col-span-2">
                            <h3 className="text-xl font-bold mb-6">Top Pages</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-3 px-4 font-bold text-sm text-gray-600">Page Path</th>
                                            <th className="text-right py-3 px-4 font-bold text-sm text-gray-600">Page Views</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {analyticsData?.topPages?.length > 0 ? (
                                            analyticsData.topPages.map((page, idx) => (
                                                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                    <td className="py-3 px-4 font-mono text-sm">{page.path}</td>
                                                    <td className="py-3 px-4 text-right font-bold">{formatNumber(page.views)}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="2" className="text-center py-8 text-gray-400">No page data available</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </GlassCard>
                    </div>
                </div>
            </div>
        </AdminSidebarWrapper>
    );
}

'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ClientSidebarWrapper } from '@/app/components/client/ClientSidebar';
import GlassCard from '@/app/components/ui/GlassCard';

const INDUSTRIES = {
    'ecommerce': 'E-commerce',
    'saas': 'SaaS',
    'healthcare': 'Healthcare',
    'finance': 'Finance',
    'realestate': 'Real Estate',
    'education': 'Education',
    'technology': 'Technology',
    'other': 'Other',
};

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated') {
            if (session?.user?.role !== 'client') {
                router.push('/login');
            } else {
                fetchProfile();
            }
        }
    }, [status, session, router]);

    const fetchProfile = async () => {
        try {
            const res = await fetch('/api/user/profile');
            if (res.ok) {
                const data = await res.json();
                setProfile(data.user);

                // If profile is not completed, redirect to onboarding
                if (!data.user?.onboardingCompleted) {
                    router.push('/client/onboarding');
                }
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    if (status === 'loading' || loading) {
        return (
            <ClientSidebarWrapper>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-t-[#00abad] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
                </div>
            </ClientSidebarWrapper>
        );
    }

    if (!profile) {
        return null;
    }

    return (
        <ClientSidebarWrapper>
            <div className="container mx-auto max-w-7xl px-4 py-8">
                <div className="flex flex-col gap-8">
                    {/* Header */}
                    <div className="flex justify-between items-center flex-wrap gap-4">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-2" style={{ color: '#1d1d1f' }}>
                                My Profile
                            </h1>
                            <p className="text-lg" style={{ color: '#86868b' }}>
                                View and manage your profile information
                            </p>
                        </div>
                        <button
                            onClick={() => router.push('/client/onboarding')}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Edit Profile
                        </button>
                    </div>

                    {/* Profile Card */}
                    <GlassCard p={8}>
                        <div className="flex flex-col gap-6">
                            {/* Personal Information */}
                            <div>
                                <h2 className="text-xl font-bold mb-4" style={{ color: '#1d1d1f' }}>
                                    Personal Information
                                </h2>
                                <div className="flex flex-col gap-4">
                                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                        <p className="font-semibold" style={{ color: '#86868b' }}>Name</p>
                                        <p style={{ color: '#1d1d1f' }}>{profile.name || 'Not provided'}</p>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                        <p className="font-semibold" style={{ color: '#86868b' }}>Email</p>
                                        <p style={{ color: '#1d1d1f' }}>{profile.email || 'Not provided'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Business Information */}
                            <div>
                                <h2 className="text-xl font-bold mb-4" style={{ color: '#1d1d1f' }}>
                                    Business Information
                                </h2>
                                <div className="flex flex-col gap-4">
                                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                        <p className="font-semibold" style={{ color: '#86868b' }}>Company Name</p>
                                        <p style={{ color: '#1d1d1f' }}>{profile.company || 'Not provided'}</p>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                        <p className="font-semibold" style={{ color: '#86868b' }}>Industry</p>
                                        <span className="px-3 py-1 bg-[#00abad]/10 text-[#00abad] rounded-full text-sm font-semibold">
                                            {INDUSTRIES[profile.industry] || profile.industry || 'Not provided'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                        <p className="font-semibold" style={{ color: '#86868b' }}>Phone Number</p>
                                        <p style={{ color: '#1d1d1f' }}>{profile.phone || 'Not provided'}</p>
                                    </div>
                                    <div className="flex justify-between items-center py-2">
                                        <p className="font-semibold" style={{ color: '#86868b' }}>Website</p>
                                        {profile.website ? (
                                            <a
                                                href={profile.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[#00abad] hover:underline flex items-center gap-1"
                                            >
                                                {profile.website}
                                                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                                                    <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
                                                </svg>
                                            </a>
                                        ) : (
                                            <p style={{ color: '#86868b' }}>Not provided</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Status */}
                            <div>
                                <h2 className="text-xl font-bold mb-4" style={{ color: '#1d1d1f' }}>
                                    Profile Status
                                </h2>
                                <div className="flex items-center gap-3">
                                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${profile.onboardingCompleted
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {profile.onboardingCompleted ? '✓ Profile Complete' : '⚠ Profile Incomplete'}
                                    </span>
                                    {profile.onboardingCompleted && (
                                        <p className="text-sm" style={{ color: '#86868b' }}>
                                            Your profile is complete and you can create projects
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                </div>
            </div>
        </ClientSidebarWrapper>
    );
}

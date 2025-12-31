'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ClientSidebarWrapper } from '@/app/components/client/ClientSidebar';
import GlassCard from '@/app/components/ui/GlassCard';
import ThemedInput from '@/app/components/ui/ThemedInput';
import MeetingScheduler from '@/app/components/shared/MeetingScheduler';

export default function NewProjectPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [profileLoading, setProfileLoading] = useState(true);
    const [profileCompleted, setProfileCompleted] = useState(false);
    const [projectData, setProjectData] = useState({
        name: '',
        description: '',
    });
    const [projectId, setProjectId] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (status === 'authenticated') {
            checkProfileCompletion();
        }
    }, [status]);

    const checkProfileCompletion = async () => {
        try {
            const res = await fetch('/api/user/profile');
            if (res.ok) {
                const data = await res.json();
                setProfileCompleted(data.user?.onboardingCompleted || false);
                if (!data.user?.onboardingCompleted) {
                    setIsModalOpen(true);
                }
            }
        } catch (error) {
            console.error('Error checking profile:', error);
        } finally {
            setProfileLoading(false);
        }
    };

    const validateProjectDetails = () => {
        const newErrors = {};
        if (!projectData.name.trim()) newErrors.name = 'Project name is required';
        if (!projectData.description.trim()) newErrors.description = 'Project description is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCreateProject = async () => {
        if (!validateProjectDetails()) return;

        setLoading(true);
        try {
            const res = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(projectData),
            });

            const data = await res.json();

            if (res.ok) {
                setProjectId(data.projectId);
                setStep(2);
            } else {
                alert(data.error || 'Failed to create project');
            }
        } catch (error) {
            console.error('Create project error:', error);
            alert('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleScheduleMeeting = async (meetingData) => {
        setLoading(true);
        try {
            const res = await fetch('/api/meetings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    projectId,
                    type: 'strategy',
                    scheduledDate: meetingData.date,
                    scheduledTime: meetingData.time,
                    duration: 60,
                }),
            });

            if (res.ok) {
                setStep(3);
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to schedule meeting');
            }
        } catch (error) {
            console.error('Schedule meeting error:', error);
            alert('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (status === 'loading' || profileLoading) {
        return (
            <ClientSidebarWrapper>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-t-[#00abad] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
                </div>
            </ClientSidebarWrapper>
        );
    }

    return (
        <ClientSidebarWrapper>
            {/* Profile Completion Modal */}
            {isModalOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 z-[2000]"
                        onClick={() => { }}
                    />
                    <div className="fixed inset-0 flex items-center justify-center z-[2001] p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-2xl font-bold" style={{ color: '#1d1d1f' }}>Complete Your Profile First</h2>
                            </div>
                            <div className="p-6">
                                <div className="flex flex-col gap-4">
                                    <p style={{ color: '#86868b' }}>
                                        Before creating a project, please complete your profile setup. This helps us better understand your needs and provide personalized service.
                                    </p>
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <p className="text-sm font-semibold mb-2">What you'll need:</p>
                                        <div className="flex flex-col items-start gap-1 text-sm" style={{ color: '#86868b' }}>
                                            <p>• Company name</p>
                                            <p>• Industry</p>
                                            <p>• Contact information</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                                <button
                                    onClick={() => router.push('/client')}
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        router.push('/client/onboarding');
                                    }}
                                    className="px-4 py-2 bg-[#00abad] text-white rounded-lg hover:bg-[#008c8e] transition-colors"
                                >
                                    Complete Profile
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            <div className="container mx-auto max-w-4xl px-4 py-16">
                <div className="flex flex-col gap-10">
                    {/* Step 1: Project Details */}
                    {step === 1 && (
                        <GlassCard p={10} className="w-full">
                            <div className="flex flex-col gap-8">
                                <div className="text-center mb-4">
                                    <div className="bg-[#00abad] p-4 rounded-xl inline-block mb-6">
                                        <svg viewBox="0 0 24 24" className="w-12 h-12 text-white" fill="currentColor">
                                            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-2xl font-bold mb-2" style={{ color: '#1d1d1f' }}>
                                        Tell us about your project
                                    </h2>
                                    <p style={{ color: '#86868b' }}>
                                        Provide some basic information to get started
                                    </p>
                                </div>

                                <ThemedInput
                                    label="Project Name"
                                    placeholder="e.g., E-commerce Website Redesign"
                                    value={projectData.name}
                                    onChange={(e) => setProjectData({ ...projectData, name: e.target.value })}
                                    error={errors.name}
                                    required
                                />

                                <ThemedInput
                                    label="Project Description"
                                    type="textarea"
                                    placeholder="Describe what you want to build, your goals, and any specific requirements..."
                                    value={projectData.description}
                                    onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
                                    error={errors.description}
                                    required
                                    rows={6}
                                />

                                <button
                                    onClick={handleCreateProject}
                                    disabled={loading}
                                    className="w-full px-4 py-3 bg-[#00abad] text-white rounded-lg hover:bg-[#008c8e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg font-medium flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        'Continue to Schedule Meeting'
                                    )}
                                </button>
                            </div>
                        </GlassCard>
                    )}

                    {/* Step 2: Schedule Strategy Meeting */}
                    {step === 2 && (
                        <GlassCard p={10} className="w-full">
                            <div className="flex flex-col gap-8">
                                <div className="text-center mb-4">
                                    <div className="bg-gray-700 p-4 rounded-xl inline-block mb-6">
                                        <svg viewBox="0 0 24 24" className="w-12 h-12 text-white" fill="currentColor">
                                            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-2xl font-bold mb-2" style={{ color: '#1d1d1f' }}>
                                        Schedule Your Strategy Meeting
                                    </h2>
                                    <p style={{ color: '#86868b' }}>
                                        Let's discuss your project in detail
                                    </p>
                                </div>

                                <MeetingScheduler onSchedule={handleScheduleMeeting} />
                            </div>
                        </GlassCard>
                    )}

                    {/* Step 3: Confirmation */}
                    {step === 3 && (
                        <GlassCard p={12} className="w-full text-center">
                            <div className="flex flex-col items-center gap-8">
                                <div className="bg-green-50 p-4 rounded-full inline-block">
                                    <svg viewBox="0 0 24 24" className="w-20 h-20 text-green-500" fill="currentColor">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                    </svg>
                                </div>

                                <h2 className="text-4xl font-bold" style={{ color: '#1d1d1f' }}>
                                    Project Created Successfully!
                                </h2>

                                <p className="text-lg max-w-2xl" style={{ color: '#86868b' }}>
                                    We've received your project details and scheduled your strategy meeting.
                                    Our team will review your requirements and prepare for our discussion.
                                </p>

                                <GlassCard p={6} className="w-full bg-blue-50">
                                    <div className="flex flex-col items-start gap-3">
                                        <p className="text-sm font-semibold" style={{ color: '#1d1d1f' }}>
                                            What's Next?
                                        </p>
                                        <div className="flex flex-col items-start gap-2">
                                            <div className="flex items-center gap-2">
                                                <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#00abad]" fill="currentColor">
                                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                                </svg>
                                                <p className="text-sm" style={{ color: '#86868b' }}>
                                                    Check your email for meeting confirmation
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#00abad]" fill="currentColor">
                                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                                </svg>
                                                <p className="text-sm" style={{ color: '#86868b' }}>
                                                    Prepare any materials you'd like to discuss
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#00abad]" fill="currentColor">
                                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                                </svg>
                                                <p className="text-sm" style={{ color: '#86868b' }}>
                                                    Track your project progress in the dashboard
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </GlassCard>

                                <div className="flex gap-4 w-full max-w-md">
                                    <button
                                        onClick={() => router.push(`/client/projects/${projectId}`)}
                                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-lg font-medium"
                                    >
                                        View Project
                                    </button>
                                    <button
                                        onClick={() => router.push('/client')}
                                        className="flex-1 px-4 py-3 bg-[#00abad] text-white rounded-lg hover:bg-[#008c8e] transition-colors text-lg font-medium"
                                    >
                                        Back to Dashboard
                                    </button>
                                </div>
                            </div>
                        </GlassCard>
                    )}
                </div>
            </div>
        </ClientSidebarWrapper>
    );
}

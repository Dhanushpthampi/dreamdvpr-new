'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
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

export default function OnboardingPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [checkingProfile, setCheckingProfile] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        company: '',
        industry: '',
        phone: '',
        website: '',
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (status === 'authenticated') {
            checkProfile();
        }
    }, [status]);

    const checkProfile = async () => {
        try {
            const res = await fetch('/api/user/profile');
            if (res.ok) {
                const data = await res.json();
                // Pre-fill form with existing data
                if (data.user) {
                    setFormData({
                        company: data.user.company || '',
                        industry: data.user.industry || '',
                        phone: data.user.phone || '',
                        website: data.user.website || '',
                    });
                    setIsEditing(data.user.onboardingCompleted || false);
                }
            }
        } catch (error) {
            console.error('Error checking profile:', error);
        } finally {
            setCheckingProfile(false);
        }
    };

    const totalSteps = 2;
    const progress = (step / totalSteps) * 100;

    const validateStep1 = () => {
        const newErrors = {};
        if (!formData.company.trim()) newErrors.company = 'Company name is required';
        if (!formData.industry) newErrors.industry = 'Please select an industry';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors = {};
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (step === 1 && validateStep1()) {
            setStep(2);
            setErrors({});
        }
    };

    const handleBack = () => {
        setStep(step - 1);
        setErrors({});
    };

    const handleSubmit = async () => {
        if (!validateStep2()) return;

        setLoading(true);
        try {
            const res = await fetch('/api/onboarding', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                router.push('/client/profile');
            } else {
                alert(data.error || 'Failed to save profile');
            }
        } catch (error) {
            console.error('Onboarding error:', error);
            alert('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (checkingProfile || status === 'loading') {
        return (
            <div className="min-h-screen static-theme flex items-center justify-center" style={{ backgroundColor: '#f5f5f7' }}>
                <div className="w-12 h-12 border-4 border-t-black border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen static-theme" style={{ backgroundColor: '#f5f5f7' }}>
            {/* Header */}
            <div className="bg-white border-b border-gray-200 py-4">
                <div className="container mx-auto max-w-7xl px-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold" style={{ color: '#1d1d1f' }}>REDgravity</h1>
                        <button
                            onClick={() => router.push('/client')}
                            className="px-4 py-2 text-gray-600 hover:text-black transition-colors"
                        >
                            Skip for now
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto max-w-3xl px-4 py-16">
                <div className="flex flex-col gap-10">
                    {/* Header */}
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#1d1d1f' }}>
                            {isEditing ? 'Edit Your Profile' : "Welcome to REDgravity! 🎉"}
                        </h1>
                        <p className="text-lg" style={{ color: '#86868b' }}>
                            {isEditing ? 'Update your profile information' : "Let's get to know you better"}
                        </p>
                    </div>

                    {/* Progress */}
                    <GlassCard p={6} className="w-full">
                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-center w-full">
                                <p className="text-sm font-semibold" style={{ color: '#1d1d1f' }}>
                                    Step {step} of {totalSteps}
                                </p>
                                <p className="text-sm" style={{ color: '#86868b' }}>
                                    {progress.toFixed(0)}% Complete
                                </p>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-black h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    </GlassCard>

                    {/* Form */}
                    <GlassCard p={10} className="w-full">
                        <div className="flex flex-col gap-8">
                            {step === 1 && (
                                <>
                                    <div className="text-center mb-4">
                                        <div className="bg-[#1d1d1f] p-4 rounded-xl inline-block mb-6">
                                            <svg viewBox="0 0 24 24" className="w-12 h-12 text-white" fill="currentColor">
                                                <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" />
                                            </svg>
                                        </div>
                                        <h2 className="text-2xl font-bold mb-2" style={{ color: '#1d1d1f' }}>
                                            Tell us about your business
                                        </h2>
                                        <p style={{ color: '#86868b' }}>
                                            This helps us tailor our services to your needs
                                        </p>
                                    </div>

                                    <ThemedInput
                                        label="Company Name"
                                        placeholder="Enter your company name"
                                        value={formData.company}
                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                        error={errors.company}
                                        required
                                    />

                                    <ThemedSelect
                                        label="Industry"
                                        placeholder="Select your industry"
                                        value={formData.industry}
                                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                                        options={INDUSTRIES}
                                        error={errors.industry}
                                        required
                                    />

                                    <button
                                        onClick={handleNext}
                                        className="w-full px-4 py-3 bg-[#1d1d1f] text-white rounded-lg hover:bg-black transition-colors text-lg font-medium"
                                    >
                                        Continue
                                    </button>
                                </>
                            )}

                            {step === 2 && (
                                <>
                                    <div className="text-center mb-4">
                                        <div className="bg-gray-700 p-4 rounded-xl inline-block mb-6">
                                            <svg viewBox="0 0 24 24" className="w-12 h-12 text-white" fill="currentColor">
                                                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                                            </svg>
                                        </div>
                                        <h2 className="text-2xl font-bold mb-2" style={{ color: '#1d1d1f' }}>
                                            Contact Information
                                        </h2>
                                        <p style={{ color: '#86868b' }}>
                                            How can we reach you?
                                        </p>
                                    </div>

                                    <ThemedInput
                                        label="Phone Number"
                                        type="tel"
                                        placeholder="+1 (555) 123-4567"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        error={errors.phone}
                                        required
                                    />

                                    <ThemedInput
                                        label="Website (Optional)"
                                        type="url"
                                        placeholder="https://yourwebsite.com"
                                        value={formData.website}
                                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                    />

                                    <div className="flex gap-4">
                                        <button
                                            onClick={handleBack}
                                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-lg font-medium"
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={handleSubmit}
                                            disabled={loading}
                                            className="flex-1 px-4 py-3 bg-[#1d1d1f] text-white rounded-lg hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg font-medium flex items-center justify-center gap-2"
                                        >
                                            {loading ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                    Saving...
                                                </>
                                            ) : (
                                                isEditing ? 'Save Changes' : 'Complete Setup'
                                            )}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}

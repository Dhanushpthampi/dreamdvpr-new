'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await signIn('credentials', {
                redirect: false,
                email,
                password,
            });

            if (result?.error) {
                setError('Invalid email or password');
            } else {
                // Get session to check role
                const res = await fetch('/api/auth/session');
                const session = await res.json();

                if (session?.user?.role === 'admin') {
                    router.push('/admin');
                } else {
                    router.push('/client');
                }
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 static-theme" style={{ backgroundColor: '#f5f5f7' }}>
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#1d1d1f]/5 via-transparent to-[#1d1d1f]/10" />

            <div className="container max-w-md relative z-10">
                <div className="flex flex-col gap-8">
                    {/* Back to Home Link */}
                    <div className="self-start -mb-4">
                        <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-[#1d1d1f] transition-colors duration-200 no-underline">
                            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                            </svg>
                            <span className="font-medium">Back to Home</span>
                        </Link>
                    </div>

                    <div className="flex flex-col items-center gap-4 text-center">
                        <div className="bg-[#e53e3e]/10 p-4 rounded-xl inline-block">
                            <svg viewBox="0 0 24 24" className="w-12 h-12 text-[#e53e3e]" fill="currentColor">
                                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                            </svg>
                        </div>
                        <div className="flex flex-col gap-2">
                            <h1 className="text-4xl font-bold tracking-tight">
                                <span className="text-[#e53e3e]">RE<span style={{ display: 'inline-block', transform: 'scaleX(-1)' }}>D</span></span>
                                <span className="text-[#1d1d1f]">gravity</span>
                            </h1>
                            <p className="text-lg" style={{ color: '#86868b' }}>
                                Sign in to your account
                            </p>
                        </div>
                    </div>

                    {/* Login Form */}
                    <div className="glass-card p-8 w-full rounded-2xl">
                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-6">
                                {error && (
                                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                        {error}
                                    </div>
                                )}

                                <div>
                                    <label className="block font-semibold mb-2 text-[#374151]">Email Address</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e53e3e]/20 focus:border-[#e53e3e]/50 transition-all font-medium text-[#1d1d1f]"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block font-semibold mb-2 text-[#374151]">Password</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e53e3e]/20 focus:border-[#e53e3e]/50 transition-all font-medium text-[#1d1d1f]"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full px-4 py-3 bg-[#1d1d1f] text-white rounded-lg font-medium hover:bg-black active:bg-black transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Signing in...
                                        </>
                                    ) : (
                                        'Sign In'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Test Credentials */}
                    {/* <div className="glass-card p-6 w-full rounded-xl bg-blue-50/80">
                        <div className="flex flex-col items-start gap-3">
                            <div className="flex items-center gap-2">
                                <svg viewBox="0 0 24 24" className="w-5 h-5 text-blue-600" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                </svg>
                                <span className="font-semibold text-blue-800">Test Credentials</span>
                            </div>
                            <div className="flex flex-col items-start gap-2 text-sm text-blue-700 w-full">
                                <div>
                                    <p className="font-medium">Admin Account:</p>
                                    <p>Email: admin@REDgravity.com</p>
                                    <p>Password: admin123</p>
                                </div>
                                <div>
                                    <p className="font-medium">Client Account:</p>
                                    <p>Email: client@REDgravity.com</p>
                                    <p>Password: client123</p>
                                </div>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    );
}

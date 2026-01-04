'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/admin/clients');
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7]">
            <div className="w-12 h-12 border-4 border-t-[#00abad] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
        </div>
    );
}


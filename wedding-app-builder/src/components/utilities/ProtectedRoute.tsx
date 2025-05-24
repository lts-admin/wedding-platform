'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/log-in');
        }
    }, [user, loading, router]);

    if (loading) return <div className="text-center py-10">Loading...</div>;

    return <>{children}</>;
}

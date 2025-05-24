"use client";
import AppInfo from "@/components/mobile/AppInfo"; // adjust path if needed
import ProtectedRoute from '@/components/utilities/ProtectedRoute';

export default function AppInfoPage() {
    return (
        <ProtectedRoute>
            <AppInfo />
        </ProtectedRoute>
    );

}

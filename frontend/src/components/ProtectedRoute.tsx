"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    // Public routes that don't require authentication
    const publicRoutes = ["/", "/login", "/signup"];

    useEffect(() => {
        if (!loading) {
            // If not authenticated and trying to access protected route
            if (!user && !publicRoutes.includes(pathname)) {
                router.push("/login");
            }

            // If authenticated but no organizations, redirect to onboarding
            if (user && !user.organizations?.length && pathname !== "/onboarding") {
                router.push("/onboarding");
            }

            // If authenticated and trying to access public routes, redirect to dashboard
            if (user && publicRoutes.includes(pathname)) {
                router.push("/dashboard");
            }
        }
    }, [user, loading, pathname, router]);

    // Show loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#020817]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-brand animate-spin" />
                    <p className="text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    // Show nothing while redirecting
    if (!loading && !user && !publicRoutes.includes(pathname)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#020817]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-brand animate-spin" />
                    <p className="text-gray-400">Redirecting...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}

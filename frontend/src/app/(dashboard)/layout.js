"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import MobileNav from "@/components/layout/MobileNav";
import useAuthStore from "@/store/authStore";
import { ROUTES, AUTH_ROUTES } from "@/constants/routes";
import { Spinner } from "@/components/ui/Spinner";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const { user, isAuthenticated, checkAuth } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      await checkAuth();
      setLoading(false);
    };
    initAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(ROUTES.LOGIN);
    }
  }, [loading, isAuthenticated, router]);

  if (loading || !isAuthenticated) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <Spinner size="lg" text="Authenticating..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar for Desktop */}
      <Sidebar />

      {/* Mobile Navigation Sidebar */}
      <MobileNav />

      <div className="lg:pl-[260px] flex flex-col min-h-screen">
        {/* Topbar */}
        <Topbar />

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 max-w-[1600px] mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

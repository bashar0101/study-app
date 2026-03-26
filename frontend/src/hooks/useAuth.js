"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import { ROUTES } from "@/constants/routes";

export default function useAuth({ requireAuth = false, redirectTo } = {}) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, fetchUser } = useAuthStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (isLoading) return;

    if (requireAuth && !isAuthenticated) {
      router.replace(redirectTo || ROUTES.LOGIN);
    }
  }, [isLoading, isAuthenticated, requireAuth, redirectTo, router]);

  return { user, isAuthenticated, isLoading };
}

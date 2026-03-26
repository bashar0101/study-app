"use client";

import useAuth from "@/hooks/useAuth";
import { FullPageSpinner } from "@/components/ui/Spinner";

export default function ProtectedRoute({ children }) {
  const { isLoading, isAuthenticated } = useAuth({ requireAuth: true });

  if (isLoading || !isAuthenticated) {
    return <FullPageSpinner />;
  }

  return children;
}

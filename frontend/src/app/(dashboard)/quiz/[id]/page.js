"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";

export default function QuizSessionPage() {
  const { id } = useParams();
  const router = useRouter();

  // Quiz sessions are handled inline on the /quiz page.
  // If someone navigates here directly, redirect to results.
  useEffect(() => {
    router.replace(ROUTES.RESULTS(id));
  }, [id, router]);

  return null;
}

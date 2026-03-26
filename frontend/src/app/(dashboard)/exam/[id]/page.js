"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";

export default function ExamSessionPage() {
  const { id } = useParams();
  const router = useRouter();

  // Exam sessions are handled inline on the /exam page.
  // If someone navigates here directly, redirect to results.
  useEffect(() => {
    router.replace(ROUTES.RESULTS(id));
  }, [id, router]);

  return null;
}

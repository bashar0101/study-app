"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { GraduationCap, CheckCircle, XCircle, Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";
import useAuthStore from "@/store/authStore";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { verifyEmail } = useAuthStore();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    const verify = async () => {
      try {
        await verifyEmail(token);
        setStatus("success");
      } catch {
        setStatus("error");
      }
    };

    verify();
  }, [token, verifyEmail]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
      {status === "loading" && (
        <>
          <Loader2 className="h-12 w-12 text-indigo-500 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Verifying your email...</h2>
          <p className="text-sm text-gray-500">This will just take a moment.</p>
        </>
      )}

      {status === "success" && (
        <>
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Email Verified!</h2>
          <p className="text-sm text-gray-500 mb-6">
            Your email has been verified. You can now sign in.
          </p>
          <Link href={ROUTES.LOGIN}>
            <Button className="w-full">Go to Sign In</Button>
          </Link>
        </>
      )}

      {status === "error" && (
        <>
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Verification Failed</h2>
          <p className="text-sm text-gray-500 mb-6">
            The verification link is invalid or has expired.
          </p>
          <Link href={ROUTES.LOGIN}>
            <Button variant="outline" className="w-full">Back to Sign In</Button>
          </Link>
        </>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-8">
          <GraduationCap className="h-8 w-8 text-indigo-500" />
          <span className="text-2xl font-bold text-gray-900">StudyAI</span>
        </Link>

        <Suspense
          fallback={
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
              <Loader2 className="h-12 w-12 text-indigo-500 animate-spin mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Loading...</h2>
            </div>
          }
        >
          <VerifyEmailContent />
        </Suspense>
      </div>
    </div>
  );
}

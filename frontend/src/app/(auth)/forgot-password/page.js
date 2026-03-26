"use client";

import { useState } from "react";
import { GraduationCap, Mail, ArrowLeft, CheckCircle } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import useAuthStore from "@/store/authStore";
import { forgotPasswordSchema } from "@/lib/validators";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuthStore();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const result = forgotPasswordSchema.safeParse({ email });
    if (!result.success) {
      setError(result.error.errors[0]?.message);
      return;
    }

    setLoading(true);
    try {
      await forgotPassword(result.data.email);
      setSent(true);
    } catch {
      // Error handled by API interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <GraduationCap className="h-8 w-8 text-indigo-500" />
            <span className="text-2xl font-bold text-gray-900">StudyAI</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
          <p className="text-sm text-gray-500 mt-1">
            Enter your email to receive a password reset link
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          {sent ? (
            <div className="text-center py-4">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Check your email</h2>
              <p className="text-sm text-gray-500 mb-6">
                We&apos;ve sent a password reset link to <strong>{email}</strong>
              </p>
              <Link href={ROUTES.LOGIN}>
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-9 h-4 w-4 text-gray-400" />
                <Input
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  error={error}
                  className="pl-10"
                />
              </div>

              <Button type="submit" loading={loading} className="w-full">
                Send Reset Link
              </Button>

              <div className="text-center">
                <Link
                  href={ROUTES.LOGIN}
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  <ArrowLeft className="h-3 w-3 inline mr-1" />
                  Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

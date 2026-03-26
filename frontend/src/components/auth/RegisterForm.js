"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import useAuthStore from "@/store/authStore";
import { registerSchema } from "@/lib/validators";
import { ROUTES } from "@/constants/routes";
import toast from "react-hot-toast";

export default function RegisterForm() {
  const router = useRouter();
  const { register } = useAuthStore();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const result = registerSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors = {};
      const issues = result.error.issues || [];
      issues.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      await register(result.data);
      toast.success("Account created! Check your email to verify.");
      router.push(ROUTES.LOGIN);
    } catch {
      // Error handled by API interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <User className="absolute left-3 top-9 h-4 w-4 text-gray-400" />
        <Input
          label="Full Name"
          name="name"
          placeholder="John Doe"
          value={form.name}
          onChange={handleChange}
          error={errors.name}
          className="pl-10"
        />
      </div>

      <div className="relative">
        <Mail className="absolute left-3 top-9 h-4 w-4 text-gray-400" />
        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          className="pl-10"
        />
      </div>

      <div className="relative">
        <Lock className="absolute left-3 top-9 h-4 w-4 text-gray-400" />
        <Input
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Min 8 characters"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          className="pl-10 pr-10"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      <div className="relative">
        <Lock className="absolute left-3 top-9 h-4 w-4 text-gray-400" />
        <Input
          label="Confirm Password"
          name="confirmPassword"
          type={showPassword ? "text" : "password"}
          placeholder="Confirm your password"
          value={form.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          className="pl-10"
        />
      </div>

      <Button type="submit" loading={loading} className="w-full">
        Create Account
      </Button>

      <p className="text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link href={ROUTES.LOGIN} className="text-indigo-600 hover:text-indigo-500 font-medium">
          Sign in
        </Link>
      </p>
    </form>
  );
}

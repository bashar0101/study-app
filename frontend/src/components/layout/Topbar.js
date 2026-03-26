"use client";

import { useRouter } from "next/navigation";
import { Menu, LogOut, User } from "lucide-react";
import useAuthStore from "@/store/authStore";
import useUiStore from "@/store/uiStore";
import { ROUTES } from "@/constants/routes";

export default function Topbar() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { toggleMobileSidebar } = useUiStore();

  const handleLogout = async () => {
    await logout();
    router.push(ROUTES.LOGIN);
  };

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-6">
      {/* Mobile menu button */}
      <button
        onClick={toggleMobileSidebar}
        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <Menu className="h-5 w-5 text-gray-600" />
      </button>

      {/* Spacer for desktop */}
      <div className="hidden lg:block" />

      {/* Right side */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm">
          <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
            <User className="h-4 w-4 text-indigo-600" />
          </div>
          <span className="hidden sm:block text-gray-700 font-medium">
            {user?.name || "Student"}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
          title="Logout"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}

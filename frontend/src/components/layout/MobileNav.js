"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, GraduationCap, LayoutDashboard, BookOpen, HelpCircle, ClipboardCheck, BarChart3, History, User } from "lucide-react";
import useUiStore from "@/store/uiStore";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";

const navItems = [
  { label: "Dashboard", href: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: "Study", href: ROUTES.STUDY, icon: BookOpen },
  { label: "Quiz", href: ROUTES.QUIZ, icon: HelpCircle },
  { label: "Exam", href: ROUTES.EXAM, icon: ClipboardCheck },
  { label: "Analytics", href: ROUTES.ANALYTICS, icon: BarChart3 },
  { label: "History", href: ROUTES.HISTORY, icon: History },
  { label: "Profile", href: ROUTES.PROFILE, icon: User },
];

export default function MobileNav() {
  const pathname = usePathname();
  const { mobileSidebarOpen, closeMobileSidebar } = useUiStore();

  if (!mobileSidebarOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50"
        onClick={closeMobileSidebar}
      />

      {/* Drawer */}
      <div className="fixed left-0 top-0 h-full w-[280px] bg-white shadow-xl animate-slide-in">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-7 w-7 text-indigo-500" />
            <span className="text-xl font-bold text-gray-900">StudyAI</span>
          </div>
          <button
            onClick={closeMobileSidebar}
            className="p-1 rounded-lg hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <nav className="px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== ROUTES.DASHBOARD && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobileSidebar}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive ? "text-indigo-500" : "text-gray-400")} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

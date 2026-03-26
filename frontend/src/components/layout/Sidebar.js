"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  HelpCircle,
  ClipboardCheck,
  BarChart3,
  History,
  User,
  GraduationCap,
} from "lucide-react";
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

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-[260px] h-screen bg-white border-r border-gray-200 fixed left-0 top-0 z-30">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-100">
        <GraduationCap className="h-7 w-7 text-indigo-500" />
        <span className="text-xl font-bold text-gray-900">StudyAI</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== ROUTES.DASHBOARD && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
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

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-100">
        <p className="text-xs text-gray-400">StudyAI v1.0</p>
      </div>
    </aside>
  );
}

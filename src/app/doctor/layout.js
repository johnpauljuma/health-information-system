"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, Bell, User, X, LayoutDashboard, Users, ClipboardList, FileBarChart, Settings } from "lucide-react";
import { supabase } from "../../../lib/supabase";

export default function DoctorLayout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const navigation = [
    { name: "Dashboard", href: "/doctor", icon: LayoutDashboard, current: pathname === "/doctor" },
    { name: "Programs", href: "/doctor/programs", icon: ClipboardList, current: pathname.startsWith("/doctor/programs") },
    { name: "Clients", href: "/doctor/clients", icon: Users, current: pathname.startsWith("/doctor/clients") },
    { name: "Enrolments", href: "/doctor/enrolments", icon: FileBarChart, current: pathname.startsWith("/doctor/enrolments") },
    { name: "Settings", href: "/doctor/settings", icon: Settings, current: pathname.startsWith("/doctor/settings") },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      {/* Top Navbar */}
      <header className="w-full bg-blue-700 text-white flex items-center justify-between h-16 px-6 shadow-md fixed top-0 left-0 right-0 z-10">
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold">HealthSys</span>
        </div>

        <div className="flex items-center space-x-6">
          <button className="md:hidden" onClick={toggleSidebar}>
            <Menu size={24} />
          </button>

          <button className="relative hidden md:block">
            <Bell size={20} />
            <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="hidden md:flex items-center space-x-2">
            <User size={24} />
            <span className="text-sm">Dr. John Doe</span>
          </div>
        </div>
      </header>

      {/* Spacer for navbar */}
      <div className="h-16"></div>

      {/* Main Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className={`bg-white w-64 p-4 shadow-md fixed md:static inset-y-0 left-0 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-200 z-20 h-[calc(100vh-4rem)] md:h-auto md:sticky md:top-16`}>
          <div className="flex items-center justify-between mb-6 md:hidden">
            <h1 className="text-2xl font-bold text-blue-700">HealthSys</h1>
            <button onClick={toggleSidebar}>
              <X size={24} />
            </button>
          </div>
          <nav className="space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-2 rounded-md text-gray-700 hover:bg-blue-100 hover:text-blue-700 ${item.current ? "bg-blue-100 text-blue-700 font-semibold" : ""}`}
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Page Content */}
        <main className="flex-1 p-6 md:ml-0 bg-gray-100 overflow-y-auto h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
}
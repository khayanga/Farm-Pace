"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Toaster } from "sonner";
import { usePathname } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Navbar from "@/components/dashboard/Navbar";

function GlobalLoader() {
  const { status } = useSession();
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    if (status === "loading") {
      const timeout = setTimeout(() => setShowLoader(true), 200);
      return () => clearTimeout(timeout);
    } else {
      setShowLoader(false);
    }
  }, [status]);

  if (!showLoader) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/70 z-50">
      <div className="flex flex-col items-center gap-2 text-gray-700">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-green-500 rounded-full animate-spin" />
      </div>
    </div>
  );
}

export default function Providers({ children, session }) {
  const pathname = usePathname();

  
   const authRoutes = ["/signin", "/signup"];
  const showDashboardLayout = !authRoutes.includes(pathname);

  return (
    <SessionProvider session={session}>
      <GlobalLoader />
      <Toaster />
      {showDashboardLayout ? (
        <SidebarProvider>
          <AppSidebar />
          <main className="flex-1 flex flex-col gap-4 max-w-full">
            <Navbar />
            {children}
          </main>
        </SidebarProvider>
      ) : (
        <main>{children}</main>
      )}
    </SessionProvider>
  );
}

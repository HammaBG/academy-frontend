"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { Loader } from "@/components/ui/Loader";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);
  const { user, isAuthenticated, isAuthLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (useAuthStore.persist.hasHydrated()) {
      setIsHydrated(true);
      return;
    }
    const unsubFinish = useAuthStore.persist.onFinishHydration(() => {
      setIsHydrated(true);
    });
    return () => {
      unsubFinish();
    };
  }, []);

  useEffect(() => {
    if (isHydrated && !isAuthLoading && (!isAuthenticated || user?.role !== 'admin')) {
      router.push("/");
    }
  }, [isHydrated, user, isAuthenticated, isAuthLoading, router]);

  if (!isHydrated || isAuthLoading || !isAuthenticated || user?.role !== 'admin') {
    return <Loader fullscreen size="lg" />;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen bg-gray-100 flex-1 w-full" dir="ltr">
         {/* Admin Sidebar Component on Right */}
         <AdminSidebar />
         
         {/* Main Content Pane */}
         <main className="flex-1 overflow-auto flex flex-col items-stretch bg-gray-50">
            {/* Admin Header */}
            <header className="h-16 w-full flex items-center px-4 bg-white border-b border-gray-200 shrink-0 sticky top-0 z-10 shadow-sm">
               <SidebarTrigger className="text-[#8b3d6f] scale-125" />
            </header>
            
            {/* Dashboard Content */}
            <div className="p-6 md:p-8 w-full flex-1">
               {children}
            </div>
         </main>
      </div>
    </SidebarProvider>
  );
}

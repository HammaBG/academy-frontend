"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { InstructorSidebar } from "@/components/instructor/InstructorSidebar"
import { Loader } from "@/components/ui/Loader";

export default function InstructorLayout({ children }: { children: React.ReactNode }) {
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
    if (isHydrated && !isAuthLoading && (!isAuthenticated || user?.role !== 'instructor')) {
      router.push("/");
    }
  }, [isHydrated, user, isAuthenticated, isAuthLoading, router]);

  if (!isHydrated || isAuthLoading || !isAuthenticated || user?.role !== 'instructor') {
    return <Loader fullscreen size="lg" />;
  }

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen bg-gray-100 flex-1 w-full" dir="ltr">
         <InstructorSidebar />
         
         <main className="flex-1 overflow-auto flex flex-col items-stretch bg-gray-50">
            <header className="h-16 w-full flex items-center px-4 bg-white border-b border-gray-200 shrink-0 sticky top-0 z-10 shadow-sm">
               <SidebarTrigger className="text-[#0d7377] scale-125" />
            </header>
            
            <div className="p-6 md:p-8 w-full flex-1">
               {children}
            </div>
         </main>
      </div>
    </SidebarProvider>
  );
}

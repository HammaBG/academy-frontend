"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { InstructorSidebar } from "@/components/instructor/InstructorSidebar"

export default function InstructorLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isAuthLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthLoading && (!isAuthenticated || user?.role !== 'instructor')) {
      router.push("/");
    }
  }, [user, isAuthenticated, isAuthLoading, router]);

  if (isAuthLoading || !isAuthenticated || user?.role !== 'instructor') {
    return <div className="min-h-screen flex items-center justify-center text-[#0d7377] font-bold text-xl">Checking permissions...</div>;
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

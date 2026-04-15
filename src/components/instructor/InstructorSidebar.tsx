"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Home, LayoutDashboard, BookOpen, LogOut } from "lucide-react"
import Link from "next/link"
import { useAuthStore } from "@/store/auth"

export function InstructorSidebar() {
  const { user, logout } = useAuthStore()

  const items = [
    { title: "Dashboard", url: "/instructor/dashboard", icon: LayoutDashboard },
    { title: "My Courses", url: "/instructor/courses", icon: BookOpen },
  ]

  return (
    <Sidebar side="left">
      <SidebarHeader className="p-4 bg-[#0d7377] text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-md flex items-center justify-center font-bold text-lg border border-white/40">
             {user?.first_name ? user.first_name[0] : "I"}
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-[15px]">Instructor Panel</span>
            <span className="text-xs text-white/80 font-medium">{user?.first_name ?? 'Instructor'} {user?.last_name ?? ''}</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-gray-50 pt-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-500 font-bold mb-2 uppercase tracking-wider text-[10px]">Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    render={<Link href={item.url} />}
                    className="hover:bg-gray-200 transition-colors py-5"
                  >
                    <div className="flex gap-4 text-left text-[14px] font-bold text-[#0a3d3f] items-center w-full uppercase tracking-tighter">
                      <item.icon className="h-5 w-5 text-[#0d7377]" />
                      <span>{item.title}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 bg-gray-50 border-t border-gray-200">
         <SidebarMenuButton onClick={logout} className="flex gap-4 text-red-600 hover:bg-red-50 hover:text-red-700 font-bold items-center cursor-pointer py-4 transition-colors">
            <LogOut className="h-5 w-5" />
            <span className="text-[14px] uppercase">Logout</span>
         </SidebarMenuButton>
         <SidebarMenuButton 
            render={<Link href="/" />}
            className="mt-2 py-4 hover:bg-gray-200 transition-colors"
          >
            <div className="flex gap-4 font-bold text-gray-600 items-center w-full">
              <Home className="h-5 w-5 text-gray-500" />
              <span className="text-[14px] uppercase">Return to shop</span>
            </div>
         </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  )
}

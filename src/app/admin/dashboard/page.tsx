"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, CreditCard, Activity } from "lucide-react";
import { useAuthStore } from "@/store/auth";

export default function AdminDashboardPage() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
         <h1 className="text-3xl font-extrabold text-[#2c1a4d]">Welcome back, {user?.first_name}! 👋</h1>
         <p className="text-gray-500 font-medium mt-2">Here is an overview of your academy's performance and key metrics today.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 pt-2">
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-extrabold text-gray-700 uppercase tracking-tighter">Total Students</CardTitle>
            <Users className="h-5 w-5 text-[#8b3d6f]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-[#2c1a4d]">1,245</div>
            <p className="text-xs font-bold text-green-600 mt-2 flex items-center gap-1">
               <Activity className="w-3 h-3"/>
               +12% vs last month
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-extrabold text-gray-700 uppercase tracking-tighter">Monthly Revenue</CardTitle>
            <CreditCard className="h-5 w-5 text-[#fbad26]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-[#2c1a4d]">$14,500</div>
            <p className="text-xs font-bold text-green-600 mt-2 flex items-center gap-1">
               <Activity className="w-3 h-3"/>
               +8% vs last month
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-extrabold text-gray-700 uppercase tracking-tighter">Active Courses</CardTitle>
            <BookOpen className="h-5 w-5 text-[#3ab795]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-[#2c1a4d]">24</div>
            <p className="text-xs font-bold text-gray-500 mt-2 lowercase">
               3 new courses this week
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mt-8">
         <Card className="shadow-sm border-gray-200">
            <CardHeader>
               <CardTitle className="font-extrabold text-[#2c1a4d] uppercase tracking-tight">Recent Enrollments</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-[#8b3d6f]">S</div>
                     <div>
                        <p className="text-sm font-bold text-[#2c1a4d]">Sarah Ahmed</p>
                        <p className="text-xs text-gray-500">Enrolled in Full Diploma</p>
                     </div>
                  </div>
                  <span className="text-xs font-bold text-gray-400">2h ago</span>
               </div>
               <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-[#8b3d6f]">K</div>
                     <div>
                        <p className="text-sm font-bold text-[#2c1a4d]">Khaled Mohamed</p>
                        <p className="text-xs text-gray-500">App Development Course</p>
                     </div>
                  </div>
                  <span className="text-xs font-bold text-gray-400">5h ago</span>
               </div>
               <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-[#8b3d6f]">A</div>
                     <div>
                        <p className="text-sm font-bold text-[#2c1a4d]">Ali Al-Dousari</p>
                        <p className="text-xs text-gray-500">Advanced Marketing course</p>
                     </div>
                  </div>
                  <span className="text-xs font-bold text-gray-400">Yesterday</span>
               </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}

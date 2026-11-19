"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, CreditCard, Newspaper } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { useArticleStore } from "@/store/article";
import { useCourseStore } from "@/store/course";
import { useFormStore } from "@/store/form";
import type { IForm } from "@/store/form";
import { useEffect } from "react";
import Link from "next/link";


export default function AdminDashboardPage() {
  const { user, token, users, getAllUsers } = useAuthStore();
  const { articles, getAllArticles } = useArticleStore();
  const { courses, getAllCourses } = useCourseStore();
  const { forms, fetchForms } = useFormStore();

  useEffect(() => {
    if (token) {
      getAllArticles(token);
      getAllCourses(token);
      fetchForms(token);
    }
    getAllUsers();
  }, [token, getAllArticles, getAllCourses, fetchForms, getAllUsers]);

  const totalStudents = users.filter((student) => {
    const role = student.role || (student as { user_metadata?: { role?: string } }).user_metadata?.role;
    return role === "user";
  }).length;
  const activeCourses = courses.filter((course) => course.status).length;
  const recentUsers = [...users]
    .filter((student) => {
      const role = student.role || (student as { user_metadata?: { role?: string } }).user_metadata?.role;
      return role === "user";
    })
    .sort((a, b) => {
      const firstDate = (a as typeof a & { created_at?: string; createdAt?: string }).created_at ||
        (a as typeof a & { created_at?: string; createdAt?: string }).createdAt;
      const secondDate = (b as typeof b & { created_at?: string; createdAt?: string }).created_at ||
        (b as typeof b & { created_at?: string; createdAt?: string }).createdAt;
      if (!firstDate || !secondDate) return 0;
      return new Date(secondDate).getTime() - new Date(firstDate).getTime();
    })
    .slice(0, 3);
  const recentForms = [...forms]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString(undefined, { day: "numeric", month: "short" });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
         <h1 className="text-3xl font-extrabold text-[#2c1a4d]">Welcome back, {user?.first_name}! 👋</h1>
         <p className="text-gray-500 font-medium mt-2">Here is an overview of your academy&apos;s performance and key metrics today.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 pt-2">
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-extrabold text-gray-700 uppercase tracking-tighter">Total Students</CardTitle>
            <Users className="h-5 w-5 text-[#8b3d6f]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-[#2c1a4d]">{totalStudents}</div>
            <p className="text-xs font-bold text-gray-500 mt-2">Registered student accounts</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-extrabold text-gray-700 uppercase tracking-tighter">Monthly Revenue</CardTitle>
            <CreditCard className="h-5 w-5 text-[#fbad26]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-[#2c1a4d]">0 TND</div>
            <p className="text-xs font-bold text-gray-500 mt-2">No revenue recorded</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-extrabold text-gray-700 uppercase tracking-tighter">Active Courses</CardTitle>
            <BookOpen className="h-5 w-5 text-[#3ab795]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-[#2c1a4d]">{activeCourses}</div>
            <p className="text-xs font-bold text-gray-500 mt-2">Currently published courses</p>
          </CardContent>
        </Card>

        <Link href="/admin/articles" className="block transition-transform hover:scale-[1.01] active:scale-[0.99]">
          <Card className="shadow-sm border-gray-200 hover:border-[#8b3d6f] hover:shadow-md transition-all cursor-pointer group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-extrabold text-gray-700 uppercase tracking-tighter group-hover:text-[#8b3d6f] transition-colors">Total Articles</CardTitle>
              <Newspaper className="h-5 w-5 text-[#8b3d6f]" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-[#2c1a4d]">{articles.length}</div>
              <p className="text-xs font-bold text-gray-500 mt-2 lowercase">
                Published and drafts
              </p>
            </CardContent>
          </Card>
        </Link>

      </div>

      <div className="grid gap-6 md:grid-cols-2 mt-8">
         <Card className="shadow-sm border-gray-200">
            <CardHeader>
               <CardTitle className="font-extrabold text-[#2c1a4d] uppercase tracking-tight">Recent Users</CardTitle>
            </CardHeader>
            <CardContent>
               {recentUsers.length > 0 ? recentUsers.map((student) => {
                 const name = `${student.first_name || ""} ${student.last_name || ""}`.trim() || student.email;
                 return (
                   <div key={student.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                     <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-[#8b3d6f]">
                         {name.charAt(0).toUpperCase()}
                       </div>
                       <div>
                         <p className="text-sm font-bold text-[#2c1a4d]">{name}</p>
                         <p className="text-xs text-gray-500">Student account</p>
                       </div>
                     </div>
                   </div>
                 );
               }) : (
                 <p className="py-6 text-sm text-gray-500">No students found.</p>
               )}
            </CardContent>
         </Card>

         <Card className="shadow-sm border-gray-200">
            <CardHeader>
               <CardTitle className="font-extrabold text-[#2c1a4d] uppercase tracking-tight">Recent Course Forms</CardTitle>
            </CardHeader>
            <CardContent>
               {recentForms.length > 0 ? recentForms.map((form) => {
                 const delivery = (form as IForm & { deliveryMethod?: string }).deliveryMethod || form.address;
                 return (
                   <div key={form.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                     <div className="min-w-0">
                       <p className="truncate text-sm font-bold text-[#2c1a4d]">{form.fullName}</p>
                       <p className="truncate text-xs text-gray-500">{form.courseName}</p>
                       <p className="truncate text-xs text-gray-400">Delivery: {delivery}</p>
                     </div>
                     <span className="ml-3 shrink-0 text-xs font-bold text-gray-400">{formatDate(form.createdAt)}</span>
                   </div>
                 );
               }) : (
                 <p className="py-6 text-sm text-gray-500">No course forms found.</p>
               )}
            </CardContent>
         </Card>
      </div>
    </div>
  );
}

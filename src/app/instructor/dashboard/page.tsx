"use client";

import { useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, CheckCircle, FileEdit, Users, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { useCourseStore } from "@/store/course";
import Link from "next/link";

export default function InstructorDashboardPage() {
  const { user, token } = useAuthStore();
  const { courses, isLoading, getInstructorCourses } = useCourseStore();

  useEffect(() => {
    if (token) {
      getInstructorCourses(token);
    }
  }, [token, getInstructorCourses]);

  const stats = useMemo(() => {
    const published = courses.filter((c) => c.status);
    const drafts = courses.filter((c) => !c.status);
    const totalStudents = courses.reduce((sum, c) => sum + (c.purchased ?? 0), 0);

    return { published: published.length, drafts: drafts.length, totalStudents };
  }, [courses]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
         <h1 className="text-3xl font-extrabold text-[#0a3d3f]">Welcome back, {user?.first_name}! 👋</h1>
         <p className="text-gray-500 font-medium mt-2">Here&apos;s an overview of your courses and student engagement.</p>
      </div>

      {isLoading && courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32">
          <Loader2 className="w-10 h-10 text-[#0d7377] animate-spin mb-4" />
          <p className="text-[#0d7377] font-bold animate-pulse uppercase tracking-widest text-xs">Loading your data...</p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 pt-2">
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-extrabold text-gray-700 uppercase tracking-tighter">Total Courses</CardTitle>
                <BookOpen className="h-5 w-5 text-[#0d7377]" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-[#0a3d3f]">{courses.length}</div>
                <p className="text-xs font-bold text-gray-500 mt-2 lowercase">all your courses</p>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-extrabold text-gray-700 uppercase tracking-tighter">Published</CardTitle>
                <CheckCircle className="h-5 w-5 text-[#3ab795]" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-[#0a3d3f]">{stats.published}</div>
                <p className="text-xs font-bold text-green-600 mt-2 lowercase">live and available</p>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-extrabold text-gray-700 uppercase tracking-tighter">Drafts</CardTitle>
                <FileEdit className="h-5 w-5 text-[#f59e0b]" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-[#0a3d3f]">{stats.drafts}</div>
                <p className="text-xs font-bold text-orange-600 mt-2 lowercase">work in progress</p>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-extrabold text-gray-700 uppercase tracking-tighter">Total Students</CardTitle>
                <Users className="h-5 w-5 text-[#6366f1]" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-[#0a3d3f]">{stats.totalStudents}</div>
                <p className="text-xs font-bold text-gray-500 mt-2 lowercase">enrolled across all courses</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Courses */}
          <div className="grid gap-6 md:grid-cols-2 mt-4">
            <Card className="shadow-sm border-gray-200">
              <CardHeader>
                <CardTitle className="font-extrabold text-[#0a3d3f] uppercase tracking-tight">Your Courses</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {courses.length === 0 && (
                  <p className="text-gray-400 text-sm font-bold py-6 text-center">No courses assigned to you yet.</p>
                )}
                {courses.slice(0, 5).map((course) => (
                  <Link
                    key={course.id}
                    href={`/instructor/courses`}
                    className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 px-2 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                        {course.thumbnail?.url ? (
                          <img src={course.thumbnail.url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <BookOpen className="w-4 h-4 text-gray-300" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#0a3d3f] truncate max-w-[200px]">{course.name}</p>
                        <p className="text-xs text-gray-400">{course.purchased ?? 0} students</p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${
                      course.status 
                        ? 'bg-green-50 text-green-600 border border-green-100' 
                        : 'bg-orange-50 text-orange-600 border border-orange-100'
                    }`}>
                      {course.status ? 'Live' : 'Draft'}
                    </span>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

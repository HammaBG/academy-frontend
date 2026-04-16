"use client";

import { useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, CheckCircle, FileEdit, Users, Loader2, User, Save, Upload, Edit, X } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { useCourseStore } from "@/store/course";
import Link from "next/link";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function InstructorDashboardPage() {
  const { user, token, updateProfile, isDataLoading } = useAuthStore();
  const { courses, isLoading, getInstructorCourses } = useCourseStore();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [newTitle, setNewTitle] = useState(user?.title || "");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user?.title) {
      setNewTitle(user.title);
    }
  }, [user]);

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

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async () => {
    if (!token) return;
    try {
      await updateProfile({
        title: newTitle,
        avatar_url: avatarPreview || undefined
      }, token);
      toast.success("Profile updated successfully!");
      setIsEditingProfile(false);
      setAvatarPreview(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
           <h1 className="text-3xl font-extrabold text-[#0a3d3f]">Welcome back, {user?.first_name}! 👋</h1>
           <p className="text-gray-500 font-medium mt-2">Here&apos;s an overview of your courses and student engagement.</p>
        </div>
        {!isEditingProfile && (
           <Button 
             onClick={() => setIsEditingProfile(true)}
             variant="outline"
             className="border-[#0d7377] text-[#0d7377] hover:bg-[#0d7377]/5 font-bold gap-2 self-start md:self-auto"
           >
             <Edit className="w-4 h-4" />
             Edit Professional Profile
           </Button>
        )}
      </div>

      {isEditingProfile && (
        <Card className="shadow-xl border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
           <div className="bg-[#0d7377]/5 p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-[#0d7377] flex items-center justify-center text-white">
                    <User className="w-5 h-5" />
                 </div>
                 <h2 className="text-xl font-extrabold text-[#0a3d3f]">Your Professional Identity</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={() => { setIsEditingProfile(false); setAvatarPreview(null); }} className="text-gray-400 hover:text-red-500">
                 <X className="w-5 h-5" />
              </Button>
           </div>
           <CardContent className="p-8">
              <div className="grid md:grid-cols-3 gap-12 text-center md:text-left">
                  <div className="flex flex-col items-center gap-4">
                      <Label className="text-sm font-extrabold text-gray-500 uppercase tracking-widest mb-2">Display Photo</Label>
                      <div className="relative group">
                          <Avatar className="h-40 w-40 border-4 border-white shadow-2xl">
                             <AvatarImage src={avatarPreview || user?.avatar_url} className="object-cover" />
                             <AvatarFallback className="bg-gray-100 text-gray-400 text-4xl">
                                {user?.first_name?.[0]}
                             </AvatarFallback>
                          </Avatar>
                          <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-4 border-white"
                          >
                             <Upload className="w-8 h-8 mb-1" />
                             <span className="text-[10px] font-black uppercase tracking-tighter">Replace Photo</span>
                          </button>
                      </div>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleAvatarChange} 
                      />
                  </div>
                  
                  <div className="md:col-span-2 space-y-8">
                      <div className="grid gap-6">
                        <div className="space-y-2">
                           <Label htmlFor="firstName" className="text-xs font-black uppercase tracking-widest text-[#0d7377]">First Name</Label>
                           <Input id="firstName" value={user?.first_name} disabled className="bg-gray-50 border-gray-200 font-bold" />
                        </div>
                        <div className="space-y-2">
                           <Label htmlFor="title" className="text-xs font-black uppercase tracking-widest text-[#0d7377]">Professional Title</Label>
                           <Input 
                             id="title" 
                             value={newTitle} 
                             onChange={(e) => setNewTitle(e.target.value)} 
                             placeholder="e.g. Senior Arabic Language Designer" 
                             className="border-[#0d7377]/20 focus:border-[#0d7377] h-12 font-bold text-[#0a3d3f]" 
                           />
                           <p className="text-[10px] text-gray-400 font-medium">This title will be displayed next to your name on all your course cards.</p>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-3">
                         <Button 
                           variant="ghost" 
                           onClick={() => { setIsEditingProfile(false); setAvatarPreview(null); }}
                           className="font-bold text-gray-400"
                         >
                           Cancel Changes
                         </Button>
                         <Button 
                           onClick={handleUpdateProfile}
                           disabled={isDataLoading}
                           className="bg-[#0d7377] hover:bg-[#0a3d3f] text-white font-bold px-8 h-12 rounded-xl shadow-lg shadow-[#0d7377]/20 gap-2"
                         >
                           {isDataLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                           Update Professional Info
                         </Button>
                      </div>
                  </div>
              </div>
           </CardContent>
        </Card>
      )}

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

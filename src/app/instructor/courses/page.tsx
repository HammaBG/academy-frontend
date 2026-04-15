"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MoreHorizontal,
  Search,
  Edit,
  Loader2,
  BookOpen,
  ExternalLink,
} from "lucide-react";

import { useAuthStore } from "@/store/auth";
import { useCourseStore } from "@/store/course";

export default function InstructorCoursesPage() {
  const router = useRouter();
  const { token } = useAuthStore();
  const { courses, isLoading, error, getInstructorCourses } = useCourseStore();
  
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (token) {
      getInstructorCourses(token);
    }
  }, [token, getInstructorCourses]);

  const filteredCourses = (courses ?? []).filter(course => 
    course.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (id: string) => {
    router.push(`/instructor/courses/edit/${id}`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0a3d3f]">My Courses</h1>
          <p className="text-gray-500 font-medium mt-1">View and manage your assigned courses.</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-bold flex items-center gap-2">
          <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
          Error: {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
        <div className="p-4 border-b border-gray-100 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              placeholder="Search by course name..." 
              className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-all shadow-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {isLoading && <Loader2 className="w-5 h-5 text-[#0d7377] animate-spin" />}
        </div>

        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow className="border-b border-gray-100">
              <TableHead className="font-bold text-[#0a3d3f]">Course</TableHead>
              <TableHead className="font-bold text-[#0a3d3f]">Price</TableHead>
              <TableHead className="font-bold text-[#0a3d3f]">Level</TableHead>
              <TableHead className="font-bold text-[#0a3d3f]">Students</TableHead>
              <TableHead className="font-bold text-[#0a3d3f]">Status</TableHead>
              <TableHead className="font-bold text-[#0a3d3f] text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!isLoading && filteredCourses.map((course) => (
              <TableRow key={course.id} className="hover:bg-gray-50/50 transition-colors border-b border-gray-50">
                <TableCell>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg border border-gray-100 bg-gray-50 overflow-hidden shrink-0 flex items-center justify-center">
                      {course.thumbnail?.url ? (
                        <img src={course.thumbnail.url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <BookOpen className="w-5 h-5 text-gray-300" />
                      )}
                    </div>
                    <div className="flex flex-col max-w-[300px] md:max-w-[400px]">
                      <span className="font-bold text-[#0a3d3f] text-[15px] truncate">{course.name}</span>
                      <span className="text-[11px] text-gray-400 line-clamp-1">{course.short_description ?? "No description provided"}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-bold text-[#0a3d3f]">${course.price}</span>
                    {course.estimated_price ? (
                       <span className="text-[10px] text-gray-400 line-through">${course.estimated_price}</span>
                    ) : null}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 font-bold text-[11px] uppercase">
                    {course.level}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="font-bold text-[#0a3d3f]">{course.purchased ?? 0}</span>
                </TableCell>
                <TableCell>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${
                    course.status 
                      ? 'bg-green-50 text-green-600 border border-green-100' 
                      : 'bg-orange-50 text-orange-600 border border-orange-100'
                  }`}>
                    {course.status ? 'Published' : 'Draft'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger render={
                      <Button variant="ghost" className="h-9 w-9 p-0 hover:bg-gray-100 text-gray-400">
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    } />
                    <DropdownMenuContent align="end" className="w-56 font-bold shadow-xl border-gray-100 p-2">
                      <DropdownMenuGroup>
                        <DropdownMenuLabel className="text-gray-400 uppercase text-[10px] py-2 px-3 tracking-widest">Course Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleEdit(course.id)}
                          className="gap-3 py-2.5 px-3 hover:bg-gray-50 transition-colors cursor-pointer rounded-md"
                        >
                          <Edit className="w-4 h-4 text-blue-600" />
                          <span>Edit Course</span>
                        </DropdownMenuItem>
                        
                        <Link href={`/courses/${course.id}`} target="_blank">
                          <DropdownMenuItem className="gap-3 py-2.5 px-3 hover:bg-gray-50 transition-colors cursor-pointer rounded-md">
                            <ExternalLink className="w-4 h-4 text-purple-600" />
                            <span>Preview Online</span>
                          </DropdownMenuItem>
                        </Link>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {!isLoading && filteredCourses.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <BookOpen className="w-12 h-12 text-gray-100 mb-4" />
            <p className="text-gray-400 font-bold text-lg">No courses found</p>
            <p className="text-gray-300 text-sm">You don&apos;t have any courses assigned yet.</p>
          </div>
        )}

        {isLoading && courses.length === 0 && (
          <div className="flex flex-col items-center justify-center py-40">
            <Loader2 className="w-12 h-12 text-[#0d7377] animate-spin mb-4" />
            <p className="text-[#0d7377] font-bold animate-pulse uppercase tracking-widest text-xs">Loading your courses...</p>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState, useCallback } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MoreHorizontal,
  Search,
  Plus,
  Trash2,
  Edit,
  Loader2,
  BookOpen,
  ExternalLink,
  UserPlus,
  Check,
} from "lucide-react";

import { useAuthStore } from "@/store/auth";
import type { User } from "@/store/auth";
import { useCourseStore } from "@/store/course";
import type { Course } from "@/store/course";

export default function CoursesPage() {
  const router = useRouter();
  const { token, instructors, getInstructors } = useAuthStore();
  const { courses, isLoading, error, getAllCourses, deleteCourse, updateCourse } = useCourseStore();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [assignTarget, setAssignTarget] = useState<Course | null>(null);
  const [selectedInstructorId, setSelectedInstructorId] = useState<string | null>(null);
  const [instructorSearch, setInstructorSearch] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    if (token) {
      getAllCourses(token);
      getInstructors();
    }
  }, [token, getAllCourses, getInstructors]);

  const filteredCourses = (courses ?? []).filter(course => 
    course.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredInstructors = (instructors ?? []).filter((inst: User) => {
    const fullName = `${inst.first_name ?? ""} ${inst.last_name ?? ""}`.toLowerCase();
    return fullName.includes(instructorSearch.toLowerCase()) || inst.email.toLowerCase().includes(instructorSearch.toLowerCase());
  });

  const handleCreate = () => {
    router.push("/admin/courses/create");
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/courses/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    if (window.confirm("Are you sure you want to delete this course?")) {
      await deleteCourse(id, token);
    }
  };

  const openAssignDialog = useCallback((course: Course) => {
    setAssignTarget(course);
    const currentCreatorId = typeof course.creator === 'string' 
      ? course.creator 
      : course.creator?.id ?? null;
    setSelectedInstructorId(currentCreatorId);
    setInstructorSearch("");
    setAssignDialogOpen(true);
  }, []);

  const handleAssign = async () => {
    if (!token || !assignTarget || !selectedInstructorId) return;
    setIsAssigning(true);
    try {
      await updateCourse(assignTarget.id, { creator: selectedInstructorId }, token);
      await getAllCourses(token);
      setAssignDialogOpen(false);
      setAssignTarget(null);
    } catch (err) {
      console.error("Assign instructor error:", err);
    } finally {
      setIsAssigning(false);
    }
  };

  const getCreatorName = (course: Course): string => {
    if (!course.creator) return "Unassigned";
    if (typeof course.creator === 'string') return "Unknown";
    return `${course.creator.first_name ?? ""} ${course.creator.last_name ?? ""}`.trim() || "Unknown";
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#2c1a4d]">Course Management</h1>
          <p className="text-gray-500 font-medium mt-1">Create, structure and manage your academy courses.</p>
        </div>
        <Button 
          onClick={handleCreate}
          className="bg-[#8b3d6f] hover:bg-[#7c3663] text-white font-bold gap-2"
        >
          <Plus className="w-4 h-4" />
          Create New Course
        </Button>
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
          {isLoading && <Loader2 className="w-5 h-5 text-[#8b3d6f] animate-spin" />}
        </div>

        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow className="border-b border-gray-100">
              <TableHead className="font-bold text-[#2c1a4d]">Course</TableHead>
              <TableHead className="font-bold text-[#2c1a4d]">Instructor</TableHead>
              <TableHead className="font-bold text-[#2c1a4d]">Price</TableHead>
              <TableHead className="font-bold text-[#2c1a4d]">Level</TableHead>
              <TableHead className="font-bold text-[#2c1a4d]">Status</TableHead>
              <TableHead className="font-bold text-[#2c1a4d] text-right">Action</TableHead>
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
                    <div className="flex flex-col max-w-[250px] md:max-w-[350px]">
                      <span className="font-bold text-[#2c1a4d] text-[15px] truncate">{course.name}</span>
                      <span className="text-[11px] text-gray-400 line-clamp-1">{course.short_description || "No description provided"}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {course.creator && typeof course.creator !== 'string' && course.creator.avatar_url ? (
                      <img src={course.creator.avatar_url} alt="" className="w-7 h-7 rounded-full object-cover border border-gray-200" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-400">
                        {getCreatorName(course)[0] ?? "?"}
                      </div>
                    )}
                    <span className="text-sm font-semibold text-[#2c1a4d]">{getCreatorName(course)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-bold text-[#2c1a4d]">${course.price}</span>
                    {course.estimated_price && (
                       <span className="text-[10px] text-gray-400 line-through">${course.estimated_price}</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 font-bold text-[11px] uppercase">
                    {course.level}
                  </span>
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

                        <DropdownMenuItem 
                          onClick={() => openAssignDialog(course)}
                          className="gap-3 py-2.5 px-3 hover:bg-gray-50 transition-colors cursor-pointer rounded-md"
                        >
                          <UserPlus className="w-4 h-4 text-teal-600" />
                          <span>Assign Instructor</span>
                        </DropdownMenuItem>
                        
                        <Link href={`/courses/${course.id}`} target="_blank">
                          <DropdownMenuItem className="gap-3 py-2.5 px-3 hover:bg-gray-50 transition-colors cursor-pointer rounded-md">
                            <ExternalLink className="w-4 h-4 text-purple-600" />
                            <span>Preview Online</span>
                          </DropdownMenuItem>
                        </Link>

                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDelete(course.id)}
                          className="gap-3 py-2.5 px-3 hover:bg-red-50 text-red-600 focus:text-red-700 transition-colors cursor-pointer rounded-md mt-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete Permanent</span>
                        </DropdownMenuItem>
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
            <p className="text-gray-300 text-sm">Launch your first course today</p>
          </div>
        )}

        {isLoading && courses.length === 0 && (
          <div className="flex flex-col items-center justify-center py-40">
            <Loader2 className="w-12 h-12 text-[#8b3d6f] animate-spin mb-4" />
            <p className="text-[#8b3d6f] font-bold animate-pulse uppercase tracking-widest text-xs">Accessing course catalog...</p>
          </div>
        )}
      </div>

      {/* Assign Instructor Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-extrabold text-[#2c1a4d]">
              Assign Instructor
            </DialogTitle>
            <DialogDescription>
              Select an instructor to assign to <strong className="text-[#2c1a4d]">{assignTarget?.name}</strong>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search instructors..."
                className="pl-10 bg-gray-50 border-gray-200"
                value={instructorSearch}
                onChange={(e) => setInstructorSearch(e.target.value)}
              />
            </div>

            <div className="max-h-[240px] overflow-y-auto space-y-1 rounded-lg border border-gray-100 p-1">
              {filteredInstructors.length === 0 && (
                <p className="text-center text-gray-400 text-sm py-6 font-bold">No instructors found</p>
              )}
              {filteredInstructors.map((inst: User) => {
                const isSelected = selectedInstructorId === inst.id;
                return (
                  <button
                    key={inst.id}
                    type="button"
                    onClick={() => setSelectedInstructorId(inst.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#8b3d6f]/10 border border-[#8b3d6f]/30"
                        : "hover:bg-gray-50 border border-transparent"
                    }`}
                  >
                    {inst.avatar_url ? (
                      <img src={inst.avatar_url} alt="" className="w-9 h-9 rounded-full object-cover border border-gray-200" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center font-bold text-sm text-[#8b3d6f]">
                        {inst.first_name?.[0] ?? "?"}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#2c1a4d] truncate">
                        {inst.first_name} {inst.last_name}
                      </p>
                      <p className="text-[11px] text-gray-400 truncate">{inst.email}</p>
                    </div>
                    {isSelected && (
                      <Check className="w-5 h-5 text-[#8b3d6f] shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAssignDialogOpen(false)}
              className="font-bold"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAssign}
              disabled={!selectedInstructorId || isAssigning}
              className="bg-[#8b3d6f] hover:bg-[#7c3663] text-white font-bold gap-2"
            >
              {isAssigning ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

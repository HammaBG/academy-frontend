"use client";

import { Course } from "@/store/course";
import { 
  Star, 
  Users, 
  BookOpen, 
  Clock, 
  ChevronDown, 
  PlayCircle,
  CheckCircle2,
  Info,
  User,
  MessageSquare
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface CourseDetailsContentProps {
  course: Course;
}

export function CourseDetailsContent({ course }: CourseDetailsContentProps) {
  const [openSection, setOpenSection] = useState<number | null>(0);

  return (
    <div className="space-y-12">
      {/* Header Info */}
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {course.categories.split(",").map((cat, i) => (
            <span key={i} className="px-3 py-1 bg-[#8b3d6f]/20 text-[#ff6ba6] text-[10px] font-black uppercase tracking-widest rounded-full border border-[#8b3d6f]/30">
              {cat.trim()}
            </span>
          ))}
        </div>
        
        <h1 className="text-4xl md:text-5xl font-black leading-tight">
          {course.name}
        </h1>
        
        <p className="text-xl text-zinc-400 font-medium leading-relaxed">
          {course.short_description}
        </p>

        <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            <div className="flex text-[#fbad26]">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className={cn("w-4 h-4 fill-current", s > (course.ratings || 0) && "opacity-20")} />
              ))}
            </div>
            <span className="text-sm font-bold text-white">({course.ratings || 0})</span>
          </div>
          
          <div className="flex items-center gap-2 text-zinc-400">
            <Users className="w-4 h-4" />
            <span className="text-sm font-bold">{course.purchased || 0} Students enrolled</span>
          </div>

          <div className="flex items-center gap-2 text-zinc-400">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-bold">Updated {course.created_at ? new Date(course.created_at).toLocaleDateString() : 'Recently'}</span>
          </div>
        </div>
      </div>

      {/* Video Preview / Banner */}
      <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 group cursor-pointer shadow-2xl">
         {course.thumbnail?.url ? (
           <img src={course.thumbnail.url} alt={course.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
         ) : (
           <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
              <BookOpen className="w-20 h-20 text-white/5" />
           </div>
         )}
         <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-100 group-hover:bg-black/20 transition-all">
            <div className="w-20 h-20 bg-[#fbad26] rounded-full flex items-center justify-center shadow-2xl scale-100 group-hover:scale-110 transition-transform">
               <PlayCircle className="w-10 h-10 text-[#211] ml-1" />
            </div>
         </div>
         <div className="absolute bottom-6 left-6 right-6 p-4 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
            <p className="text-sm font-bold text-white text-center">Click to preview course introduction</p>
         </div>
      </div>

      {/* Description */}
      <div className="space-y-6">
         <h2 className="text-2xl font-black flex items-center gap-3">
            <Info className="w-6 h-6 text-[#fbad26]" /> 
            About this Course
         </h2>
         <div className="prose prose-invert max-w-none text-zinc-400 font-medium leading-[1.8]">
            {course.description.split('\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
         </div>
      </div>

      {/* What you'll learn */}
      <div className="bg-white/5 rounded-3xl p-8 border border-white/10 space-y-6">
         <h2 className="text-2xl font-black">What you'll learn</h2>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {course.benefits.map((benefit, i) => (
              <div key={i} className="flex gap-3">
                 <CheckCircle2 className="w-5 h-5 text-[#3ab795] shrink-0 mt-0.5" />
                 <span className="text-zinc-300 font-medium">{benefit.title}</span>
              </div>
            ))}
         </div>
      </div>

      {/* Syllabus */}
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black">Course Content</h2>
            <span className="text-sm font-bold text-zinc-500">{course.course_data?.length || 0} Sections</span>
         </div>
         
         <div className="space-y-4">
            {course.course_data?.map((section, idx) => (
               <div key={idx} className="border border-white/5 rounded-2xl overflow-hidden bg-white/[0.02]">
                  <button 
                    onClick={() => setOpenSection(openSection === idx ? null : idx)}
                    className="w-full p-6 flex items-center justify-between hover:bg-white/[0.04] transition-colors"
                  >
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center">
                           <PlayCircle className="w-5 h-5 text-zinc-500" />
                        </div>
                        <div className="text-left">
                           <h3 className="font-black text-white">{section.video_section}</h3>
                           <p className="text-xs text-zinc-500 font-bold">{section.title}</p>
                        </div>
                     </div>
                     <ChevronDown className={cn("w-5 h-5 text-zinc-500 transition-transform", openSection === idx && "rotate-180")} />
                  </button>
                  {openSection === idx && (
                    <div className="p-6 pt-0 border-t border-white/5 animate-in slide-in-from-top-2 duration-300">
                       <p className="text-zinc-400 text-sm leading-relaxed mb-4">{section.description}</p>
                       <div className="px-4 py-3 bg-black/20 rounded-xl border border-white/5 flex items-center justify-between">
                          <span className="text-xs font-bold text-zinc-500">Video Content</span>
                          <span className="text-xs font-bold text-zinc-300">Preview Available</span>
                       </div>
                    </div>
                  )}
               </div>
            ))}
         </div>
      </div>

      {/* Prerequisites */}
      <div className="space-y-6">
         <h2 className="text-2xl font-black">Requirements</h2>
         <ul className="list-disc list-inside space-y-3 text-zinc-400 font-medium font-outfit">
            {course.prerequisites.map((pre, i) => (
              <li key={i}>{pre.title}</li>
            ))}
         </ul>
      </div>

      {/* Instructor Section */}
      <div className="pt-12 border-t border-white/5 space-y-8">
         <h2 className="text-2xl font-black flex items-center gap-3">
            <User className="w-6 h-6 text-[#fbad26]" />
            About the Instructor
         </h2>
         <div className="bg-white/5 p-8 rounded-3xl border border-white/10 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
            <div className="w-24 h-24 rounded-2xl bg-zinc-900 border border-white/10 shrink-0 overflow-hidden shadow-2xl">
               {course.creator?.avatar_url ? (
                  <img src={course.creator.avatar_url} alt="" className="w-full h-full object-cover" />
               ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-700">
                     <User className="w-12 h-12" />
                  </div>
               )}
            </div>
            <div className="space-y-3">
               <h3 className="text-xl font-black text-white">{course.creator?.first_name} {course.creator?.last_name || "Academy Expert"}</h3>
               <p className="text-sm font-bold text-[#ff6ba6] uppercase tracking-widest">{course.creator?.title || "Senior Course Content Specialist"}</p>
               <p className="text-zinc-400 text-sm leading-relaxed max-w-xl">
                  {course.creator?.bio || "Expert educator with over 10 years of experience in the field. Dedicated to providing high-quality educational content and helping students achieve their career goals."}
               </p>
               <div className="pt-4 flex flex-wrap justify-center md:justify-start gap-4">
                  <div className="flex items-center gap-1.5 text-[11px] font-black text-white/40 uppercase tracking-tighter">
                     <Users className="w-3.5 h-3.5" /> 12k Students
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-black text-white/40 uppercase tracking-tighter">
                     <PlayCircle className="w-3.5 h-3.5" /> 14 Courses
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Reviews Section */}
      <div className="pt-12 border-t border-white/5 space-y-8 pb-20">
         <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black flex items-center gap-3">
               <MessageSquare className="w-6 h-6 text-[#fbad26]" />
               Student Feedback
            </h2>
            <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
               <span className="text-2xl font-black text-[#fbad26]">{course.ratings || "0.0"}</span>
               <div className="flex text-[#fbad26]">
                  <Star className="w-4 h-4 fill-current" />
               </div>
            </div>
         </div>

         {(!course.reviews || course.reviews.length === 0) ? (
            <div className="py-20 text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
               <p className="text-zinc-500 font-bold">No reviews yet. Be the first to share your thoughts!</p>
            </div>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {course.reviews.map((review, i) => (
                  <div key={i} className="bg-white/[0.02] p-6 rounded-2xl border border-white/5 space-y-4">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center text-xs font-black">
                           {review.user?.avatar ? <img src={review.user.avatar} className="rounded-lg" /> : review.user?.name?.[0] || 'U'}
                        </div>
                        <div>
                           <p className="text-sm font-black text-white">{review.user?.name || "Student"}</p>
                           <div className="flex text-[#fbad26] scale-75 origin-left">
                              {[1, 2, 3, 4, 5].map((s) => (
                                 <Star key={s} className={cn("w-3 h-3 fill-current", s > (review.rating || 0) && "opacity-20")} />
                              ))}
                           </div>
                        </div>
                     </div>
                     <p className="text-xs text-zinc-400 font-medium leading-relaxed italic">
                        "{review.comment}"
                     </p>
                  </div>
               ))}
            </div>
         )}
      </div>
    </div>
  );
}

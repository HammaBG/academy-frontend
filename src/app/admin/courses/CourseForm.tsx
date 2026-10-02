"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCategoryStore } from "@/store/category";
import { useAuthStore } from "@/store/auth";
import { Course, ICourseData, ILink } from "@/store/course";
import { 
  Plus, 
  Trash2, 
  Video, 
  Link as LinkIcon, 
  Settings, 
  BookOpen, 
  CheckCircle, 
  ArrowRight,
  Save,
  Loader2,
  X,
  Image as ImageIcon,
  Upload,
  Check,
  AlertCircle,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import * as UpChunk from "@mux/upchunk";
import { API_ENDPOINTS } from "@/config/api";

interface CourseFormProps {
  course?: Course | null;
  onSubmit: (data: Partial<Course>) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export function CourseForm({ course, onSubmit, onCancel, isLoading }: CourseFormProps) {
  const { token } = useAuthStore();
  const { categories, getAllCategories } = useCategoryStore();
  const [activeTab, setActiveTab] = useState<"general" | "syllabus" | "details" | "test">("general");
  const [formData, setFormData] = useState<Partial<Course>>({
    name: "",
    description: "",
    short_description: "",
    price: 0,
    estimated_price: 0,
    categories: "",
    tags: "",
    level: "Beginner",
    demo_url: "",
    status: false,
    ready: false,
    url: "",
    benefits: [{ title: "" }],
    prerequisites: [{ title: "" }],
    course_data: [],
    thumbnail: { public_id: "", url: "" }
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      getAllCategories(token);
    }
  }, [token, getAllCategories]);

  useEffect(() => {
    if (course) {
      setFormData(course);
      setImagePreview(course.thumbnail?.url || null);
    }
  }, [course]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let finalValue: any = value;
    
    if (type === "checkbox") {
      finalValue = (e.target as HTMLInputElement).checked;
    } else if (type === "number") {
      finalValue = value === "" ? 0 : Number(value);
    }
    
    setFormData((prev) => ({ ...prev, [name]: finalValue }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData(prev => ({
          ...prev,
          thumbnail: { ...prev.thumbnail!, url: result } // In a real app, you'd upload this or set the file
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Dynamic List Helpers
  const handleListChange = (index: number, value: string, type: "benefits" | "prerequisites") => {
    const newList = [...(formData[type] || [])];
    newList[index] = { title: value };
    setFormData({ ...formData, [type]: newList });
  };

  const addListItem = (type: "benefits" | "prerequisites") => {
    setFormData({ ...formData, [type]: [...(formData[type] || []), { title: "" }] });
  };

  const removeListItem = (index: number, type: "benefits" | "prerequisites") => {
    const newList = (formData[type] || []).filter((_, i) => i !== index);
    setFormData({ ...formData, [type]: newList });
  };

  interface SectionGroup {
    section_title: string;
    lessons: ICourseData[];
  }

  const [sectionGroups, setSectionGroups] = useState<SectionGroup[]>([]);
  const [collapsedSections, setCollapsedSections] = useState<{ [secIdx: number]: boolean }>({});

  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [uploadingLesson, setUploadingLesson] = useState<{ [key: string]: boolean }>({});
  const [uploadingDemo, setUploadingDemo] = useState(false);
  const [demoProgress, setDemoProgress] = useState(0);

  // Helper to convert flat course_data to grouped sections
  const groupCourseData = (courseData?: ICourseData[]): SectionGroup[] => {
    if (!courseData || courseData.length === 0) return [];

    const map = new Map<string, ICourseData[]>();
    for (const item of courseData) {
      const secTitle = (item.video_section || "Section 1").trim();
      if (!map.has(secTitle)) {
        map.set(secTitle, []);
      }
      map.get(secTitle)!.push(item);
    }

    return Array.from(map.entries()).map(([section_title, lessons]) => ({
      section_title,
      lessons,
    }));
  };

  // Helper to flatten grouped sections into course_data
  const flattenSectionGroups = (groups: SectionGroup[]): ICourseData[] => {
    const flat: ICourseData[] = [];
    groups.forEach((group) => {
      const secTitle = group.section_title.trim() || "Untitled Section";
      group.lessons.forEach((lesson) => {
        flat.push({
          ...lesson,
          video_section: secTitle,
        });
      });
    });
    return flat;
  };

  // Initialize or update section groups when course changes
  useEffect(() => {
    if (course) {
      setFormData(course);
      setImagePreview(course.thumbnail?.url || null);
      setSectionGroups(groupCourseData(course.course_data));
    }
  }, [course]);

  // Section Group Handlers
  const addSectionGroup = () => {
    const newGroupIndex = sectionGroups.length + 1;
    const newGroup: SectionGroup = {
      section_title: `Section ${newGroupIndex}`,
      lessons: [
        {
          title: "",
          description: "",
          video_url: "",
          video_section: `Section ${newGroupIndex}`,
          video_length: 0,
          video_thumbnail: {},
          video_player: "",
          links: [],
          suggestion: "",
        },
      ],
    };
    setSectionGroups((prev) => [...prev, newGroup]);
  };

  const updateSectionTitle = (secIdx: number, newTitle: string) => {
    setSectionGroups((prev) => {
      const updated = [...prev];
      updated[secIdx] = {
        ...updated[secIdx],
        section_title: newTitle,
        lessons: updated[secIdx].lessons.map((l) => ({ ...l, video_section: newTitle })),
      };
      return updated;
    });
  };

  const removeSectionGroup = (secIdx: number) => {
    setSectionGroups((prev) => prev.filter((_, i) => i !== secIdx));
  };

  const toggleCollapseSection = (secIdx: number) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [secIdx]: !prev[secIdx],
    }));
  };

  // Lesson Handlers inside a Section Group
  const addLessonToSection = (secIdx: number) => {
    setSectionGroups((prev) => {
      const updated = [...prev];
      const targetSec = updated[secIdx];
      const newLesson: ICourseData = {
        title: "",
        description: "",
        video_url: "",
        video_section: targetSec.section_title,
        video_length: 0,
        video_thumbnail: {},
        video_player: "",
        links: [],
        suggestion: "",
      };
      updated[secIdx] = {
        ...targetSec,
        lessons: [...targetSec.lessons, newLesson],
      };
      return updated;
    });
  };

  const updateLesson = (secIdx: number, lessonIdx: number, data: Partial<ICourseData>) => {
    setSectionGroups((prev) => {
      const updated = [...prev];
      const targetSec = updated[secIdx];
      const updatedLessons = [...targetSec.lessons];
      updatedLessons[lessonIdx] = { ...updatedLessons[lessonIdx], ...data };
      updated[secIdx] = {
        ...targetSec,
        lessons: updatedLessons,
      };
      return updated;
    });
  };

  const removeLesson = (secIdx: number, lessonIdx: number) => {
    setSectionGroups((prev) => {
      const updated = [...prev];
      const targetSec = updated[secIdx];
      const updatedLessons = targetSec.lessons.filter((_, i) => i !== lessonIdx);
      updated[secIdx] = {
        ...targetSec,
        lessons: updatedLessons,
      };
      return updated;
    });
  };

  const handleUploadDemoToMux = async (file: File) => {
    if (!token) {
      toast.error("You must be logged in to upload video");
      return;
    }

    try {
      setUploadingDemo(true);
      setDemoProgress(0);

      const res = await fetch(`${API_ENDPOINTS.courses}/mux/upload-url`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const json = await res.json();
      if (!res.ok || !json.data?.url) {
        throw new Error(json.message || "Failed to create Mux upload link");
      }

      const { url: uploadUrl, id: uploadId } = json.data;

      const upload = UpChunk.createUpload({
        endpoint: uploadUrl,
        file,
        chunkSize: 5120,
      });

      upload.on("progress", (progressDetail: any) => {
        setDemoProgress(Math.round(progressDetail.detail));
      });

      upload.on("error", () => {
        toast.error("Demo video upload failed.");
        setUploadingDemo(false);
      });

      upload.on("success", async () => {
        toast.success("Upload finished! Processing demo video on Mux...");
        setDemoProgress(100);

        let attempts = 0;
        const checkInterval = setInterval(async () => {
          attempts++;
          try {
            const checkRes = await fetch(`${API_ENDPOINTS.courses}/mux/asset/${uploadId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const checkData = await checkRes.json();
            const playbackId = checkData?.data?.playbackId;

            if (playbackId) {
              clearInterval(checkInterval);
              setFormData((prev) => ({ ...prev, demo_url: playbackId }));
              setUploadingDemo(false);
              toast.success("Demo video ready to stream with Mux!");
            } else if (attempts >= 30) {
              clearInterval(checkInterval);
              setUploadingDemo(false);
            }
          } catch (e) {
            console.error("Error polling demo asset:", e);
          }
        }, 2500);
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to start demo upload");
      setUploadingDemo(false);
    }
  };

  const handleUploadLessonToMux = async (file: File, secIdx: number, lessonIdx: number) => {
    if (!token) {
      toast.error("You must be logged in to upload video");
      return;
    }

    const lessonKey = `${secIdx}-${lessonIdx}`;

    try {
      setUploadingLesson((prev) => ({ ...prev, [lessonKey]: true }));
      setUploadProgress((prev) => ({ ...prev, [lessonKey]: 0 }));

      // 1. Request Direct Upload URL from Backend
      const res = await fetch(`${API_ENDPOINTS.courses}/mux/upload-url`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const json = await res.json();
      if (!res.ok || !json.data?.url) {
        throw new Error(json.message || "Failed to create Mux upload link");
      }

      const { url: uploadUrl, id: uploadId } = json.data;

      // 2. Upload video in chunks via UpChunk directly to Mux
      const upload = UpChunk.createUpload({
        endpoint: uploadUrl,
        file,
        chunkSize: 5120, // 5MB chunks
      });

      upload.on("progress", (progressDetail: any) => {
        const percent = Math.round(progressDetail.detail);
        setUploadProgress((prev) => ({ ...prev, [lessonKey]: percent }));
      });

      upload.on("error", (err: any) => {
        console.error("Mux UpChunk error:", err);
        toast.error("Video upload failed. Please try again.");
        setUploadingLesson((prev) => ({ ...prev, [lessonKey]: false }));
      });

      upload.on("success", async () => {
        toast.success("Upload finished! Processing video on Mux...");
        setUploadProgress((prev) => ({ ...prev, [lessonKey]: 100 }));

        // 3. Poll for Mux asset readiness & playback ID
        let attempts = 0;
        const maxAttempts = 30; // ~60 seconds max
        const checkInterval = setInterval(async () => {
          attempts++;
          try {
            const checkRes = await fetch(`${API_ENDPOINTS.courses}/mux/asset/${uploadId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const checkData = await checkRes.json();
            const playbackId = checkData?.data?.playbackId;
            const assetStatus = checkData?.data?.assetStatus;
            const duration = checkData?.data?.duration;

            if (playbackId) {
              clearInterval(checkInterval);
              updateLesson(secIdx, lessonIdx, {
                video_url: playbackId,
                video_length: duration ? Math.round(duration) : undefined,
                video_player: "mux",
              });
              setUploadingLesson((prev) => ({ ...prev, [lessonKey]: false }));
              toast.success("Video ready to stream with Mux!");
            } else if (assetStatus === "errored" || attempts >= maxAttempts) {
              clearInterval(checkInterval);
              setUploadingLesson((prev) => ({ ...prev, [lessonKey]: false }));
              if (assetStatus === "errored") {
                toast.error("Mux encountered an error processing this video.");
              } else {
                toast.info("Video is still encoding on Mux. Playback will be available shortly.");
              }
            }
          } catch (e) {
            console.error("Error polling Mux asset:", e);
          }
        }, 2500);
      });
    } catch (err: any) {
      console.error("Mux upload handler error:", err);
      toast.error(err.message || "Failed to start upload");
      setUploadingLesson((prev) => ({ ...prev, [lessonKey]: false }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const flattenedCourseData = flattenSectionGroups(sectionGroups);
    onSubmit({
      ...formData,
      course_data: flattenedCourseData,
    });
  };

  return (
    <div className="flex flex-col h-full bg-gray-50/50">
      {/* Tab Switcher */}
      <div className="flex p-4 gap-2 bg-white border-b border-gray-100 sticky top-0 z-10 overflow-x-auto">
        {[
          { id: "general", label: "General Info", icon: BookOpen },
          { id: "syllabus", label: "Syllabus / Content", icon: Video },
          { id: "details", label: "Extra Details", icon: CheckCircle },
          { id: "test", label: "Live Settings", icon: Settings },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all shrink-0",
              activeTab === tab.id 
                ? "bg-[#8b3d6f] text-white shadow-lg shadow-purple-200 scale-105" 
                : "bg-white text-gray-500 hover:bg-gray-100 border border-gray-100"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex-1 p-8 overflow-y-auto">
        {activeTab === "general" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-6">
                 <div className="space-y-2">
                   <Label className="text-[#2c1a4d] font-bold">Course Title</Label>
                   <Input name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Master React in 30 Days" required />
                 </div>
                 <div className="space-y-2">
                   <Label className="text-[#2c1a4d] font-bold">Custom URL Slug (Optional)</Label>
                   <Input
                     name="url"
                     value={formData.url || ""}
                     onChange={handleChange}
                     placeholder="e.g. master-react-in-30-days"
                   />
                   <p className="text-[11px] text-gray-400 font-mono">
                     Link: /courses/{formData.url || "auto-generated-slug"}
                   </p>
                 </div>
                 <div className="space-y-2">
                   <Label className="text-[#2c1a4d] font-bold">Short Description</Label>
                   <Textarea name="short_description" value={formData.short_description} onChange={handleChange} placeholder="A catchy summary for calculations..." className="min-h-[100px]" required />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[#2c1a4d] font-bold">Price ($)</Label>
                      <Input type="number" name="price" value={formData.price} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[#2c1a4d] font-bold">Estimated Price ($)</Label>
                      <Input type="number" name="estimated_price" value={formData.estimated_price} onChange={handleChange} />
                    </div>
                 </div>
               </div>
               
               <div className="space-y-6">
                   <div className="space-y-2">
                      <Label className="text-[#2c1a4d] font-bold">Course Thumbnail</Label>
                      <div className="relative group aspect-video rounded-2xl border-2 border-dashed border-gray-200 bg-white flex flex-col items-center justify-center overflow-hidden transition-all hover:border-[#8b3d6f] hover:bg-purple-50/30">
                        {imagePreview ? (
                          <>
                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                               <Button type="button" variant="destructive" size="icon" onClick={() => setImagePreview(null)}>
                                  <X className="w-4 h-4" />
                               </Button>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center gap-2">
                             <ImageIcon className="w-12 h-12 text-gray-300" />
                             <span className="text-sm font-bold text-gray-400">Upload Banner Image</span>
                          </div>
                        )}
                        <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                      </div>
                   </div>
                   <div className="space-y-2">
                     <Label className="text-[#2c1a4d] font-bold">Category</Label>
                     <select 
                       name="categories" 
                       value={formData.categories} 
                       onChange={handleChange}
                       className="w-full h-10 px-3 rounded-md border border-gray-200 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-[#8b3d6f]"
                       required
                     >
                       <option value="">Select a category</option>
                       {categories.map((cat) => (
                         <option key={cat.id} value={cat.name}>
                           {cat.name}
                         </option>
                       ))}
                     </select>
                   </div>
               </div>
             </div>
             
             <div className="space-y-2">
                <Label className="text-[#2c1a4d] font-bold">Full Course Description</Label>
                <Textarea name="description" value={formData.description} onChange={handleChange} className="min-h-[200px]" placeholder="Explain what your course is about in detail..." required />
             </div>
          </div>
        )}

        {activeTab === "details" && (
           <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                <div className="flex items-center justify-between mb-2">
                   <h3 className="text-lg font-extrabold text-[#2c1a4d]">What students will learn</h3>
                  <Button type="button" variant="outline" size="sm" onClick={() => addListItem("benefits")} className="font-bold gap-2">
                    <Plus className="w-4 h-4" /> Add Benefit
                  </Button>
                </div>
                {formData.benefits?.map((benefit, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Input value={benefit.title} onChange={(e) => handleListChange(idx, e.target.value, "benefits")} placeholder="Define a benefit..." />
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeListItem(idx, "benefits")} className="text-red-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                <div className="flex items-center justify-between mb-2">
                   <h3 className="text-lg font-extrabold text-[#2c1a4d]">Prerequisites</h3>
                  <Button type="button" variant="outline" size="sm" onClick={() => addListItem("prerequisites")} className="font-bold gap-2">
                    <Plus className="w-4 h-4" /> Add Prerequisite
                  </Button>
                </div>
                {formData.prerequisites?.map((pre, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Input value={pre.title} onChange={(e) => handleListChange(idx, e.target.value, "prerequisites")} placeholder="e.g. Basic knowledge of JS" />
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeListItem(idx, "prerequisites")} className="text-red-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
           </div>
        )}

        {activeTab === "syllabus" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-extrabold text-[#2c1a4d]">Curriculum & Section Management</h3>
                <p className="text-xs text-gray-500 font-medium">Create sections / chapters and organize multiple lessons & videos under each section.</p>
              </div>
              <Button type="button" onClick={addSectionGroup} className="bg-[#8b3d6f] hover:bg-[#7c3663] text-white font-bold gap-2">
                <Plus className="w-4 h-4" /> Add New Section
              </Button>
            </div>

            {sectionGroups.map((group, secIdx) => {
              const isCollapsed = collapsedSections[secIdx];
              return (
                <div key={secIdx} className="bg-white rounded-2xl border-2 border-purple-100/80 overflow-hidden shadow-sm transition-all hover:border-[#8b3d6f]/40">
                  {/* Section Header */}
                  <div className="bg-gradient-to-r from-purple-50/70 to-pink-50/30 p-4 border-b border-purple-100/70 flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 mr-4">
                      <span className="w-8 h-8 rounded-xl bg-[#8b3d6f] text-white flex items-center justify-center font-black text-sm shrink-0 shadow-sm shadow-purple-200">
                        {secIdx + 1}
                      </span>
                      <div className="flex-1">
                        <Input
                          value={group.section_title}
                          onChange={(e) => updateSectionTitle(secIdx, e.target.value)}
                          className="font-extrabold bg-transparent border-none focus-visible:ring-1 focus-visible:ring-[#8b3d6f] text-[#2c1a4d] p-1.5 h-auto text-base sm:text-lg max-w-md rounded-lg"
                          placeholder={`Section ${secIdx + 1} Title (e.g., Chapter 1: Foundations)`}
                        />
                        <p className="text-[11px] text-gray-400 font-semibold px-1.5">
                          {group.lessons.length} {group.lessons.length === 1 ? "Lesson" : "Lessons"} in this section
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addLessonToSection(secIdx)}
                        className="bg-white border-purple-200 text-[#8b3d6f] hover:bg-purple-50 font-bold text-xs gap-1.5 h-9"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Lesson
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleCollapseSection(secIdx)}
                        className="text-gray-500 hover:text-[#8b3d6f] h-9 w-9"
                        title={isCollapsed ? "Expand Section" : "Collapse Section"}
                      >
                        <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", isCollapsed ? "" : "rotate-180")} />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSectionGroup(secIdx)}
                        className="text-gray-400 hover:text-red-600 h-9 w-9"
                        title="Delete entire section"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Section Content: Nested Lessons */}
                  {!isCollapsed && (
                    <div className="p-4 sm:p-6 space-y-4 bg-gray-50/30">
                      {group.lessons.map((lesson, lessonIdx) => {
                        const lessonKey = `${secIdx}-${lessonIdx}`;
                        const isUploading = uploadingLesson[lessonKey];
                        const progress = uploadProgress[lessonKey] || 0;

                        return (
                          <div
                            key={lessonIdx}
                            className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-sm space-y-4 hover:border-purple-200 transition-colors"
                          >
                            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                              <div className="flex items-center gap-2.5">
                                <span className="w-6 h-6 rounded-md bg-purple-100 text-[#8b3d6f] font-bold text-xs flex items-center justify-center">
                                  {secIdx + 1}.{lessonIdx + 1}
                                </span>
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Lesson Details</span>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeLesson(secIdx, lessonIdx)}
                                className="text-gray-400 hover:text-red-600 h-7 px-2 text-xs font-bold gap-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Remove Lesson
                              </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                              <div className="space-y-3">
                                <div className="space-y-1.5">
                                  <Label className="text-[#2c1a4d] font-bold text-xs uppercase tracking-wider">
                                    Lesson Title
                                  </Label>
                                  <Input
                                    value={lesson.title}
                                    onChange={(e) => updateLesson(secIdx, lessonIdx, { title: e.target.value })}
                                    placeholder="e.g. 01 - Installing Next.js & TypeScript"
                                  />
                                </div>

                                <div className="space-y-1.5">
                                  <div className="flex items-center justify-between">
                                    <Label className="text-[#2c1a4d] font-bold text-xs uppercase tracking-wider">
                                      Lesson Video (Mux Stream)
                                    </Label>
                                    {lesson.video_url && (
                                      <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                                        <Check className="w-3 h-3" /> Ready
                                      </span>
                                    )}
                                  </div>

                                  {/* Direct Upload to Mux Button & Drag Zone */}
                                  <div className="relative border-2 border-dashed border-gray-200 hover:border-[#8b3d6f] transition-all rounded-xl p-3 bg-gray-50/60 flex flex-col items-center justify-center text-center gap-2 group cursor-pointer">
                                    <input
                                      type="file"
                                      accept="video/*"
                                      disabled={isUploading}
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleUploadLessonToMux(file, secIdx, lessonIdx);
                                      }}
                                      className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
                                    />

                                    {isUploading ? (
                                      <div className="w-full space-y-2 py-1">
                                        <div className="flex items-center justify-between text-xs font-bold text-[#8b3d6f]">
                                          <span className="flex items-center gap-1.5">
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading to Mux...
                                          </span>
                                          <span>{progress}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                                          <div
                                            className="bg-[#8b3d6f] h-full transition-all duration-300 rounded-full"
                                            style={{ width: `${progress}%` }}
                                          />
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="flex items-center gap-2 py-1">
                                        <div className="w-8 h-8 rounded-lg bg-purple-50 text-[#8b3d6f] flex items-center justify-center group-hover:scale-110 transition-transform">
                                          <Upload className="w-4 h-4" />
                                        </div>
                                        <div className="text-left">
                                          <p className="text-xs font-bold text-[#2c1a4d]">
                                            {lesson.video_url ? "Replace Video (Upload to Mux)" : "Upload Video to Mux"}
                                          </p>
                                          <p className="text-[10px] text-gray-400">Click or drop MP4, MOV, WEBM</p>
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  {/* Or paste direct Mux Playback ID / Video URL */}
                                  <div className="flex items-center gap-2 pt-1">
                                    <div className="bg-gray-100 p-2 rounded-lg flex items-center justify-center shrink-0">
                                      <Video className="w-4 h-4 text-[#8b3d6f]" />
                                    </div>
                                    <Input
                                      value={lesson.video_url}
                                      onChange={(e) => updateLesson(secIdx, lessonIdx, { video_url: e.target.value })}
                                      placeholder="Or paste Mux Playback ID / video URL"
                                      className="text-xs h-9"
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-3">
                                <div className="space-y-1.5">
                                  <Label className="text-[#2c1a4d] font-bold text-xs uppercase tracking-wider">
                                    Lesson Description / Notes
                                  </Label>
                                  <Textarea
                                    value={lesson.description}
                                    onChange={(e) => updateLesson(secIdx, lessonIdx, { description: e.target.value })}
                                    className="min-h-[120px] text-xs"
                                    placeholder="Briefly explain what this lesson covers..."
                                  />
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="flex-1 space-y-1">
                                    <Label className="text-[#2c1a4d] font-bold text-[11px] uppercase tracking-wider">
                                      Duration in seconds (Optional)
                                    </Label>
                                    <Input
                                      type="number"
                                      value={lesson.video_length || ""}
                                      onChange={(e) => updateLesson(secIdx, lessonIdx, { video_length: Number(e.target.value) || 0 })}
                                      placeholder="e.g. 600"
                                      className="h-8 text-xs"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => addLessonToSection(secIdx)}
                        className="w-full py-3 border-dashed border-2 border-purple-200 hover:border-[#8b3d6f] hover:bg-purple-50/50 text-[#8b3d6f] font-bold text-xs gap-2 rounded-xl"
                      >
                        <Plus className="w-4 h-4" /> Add Another Lesson to &ldquo;{group.section_title || `Section ${secIdx + 1}`}&rdquo;
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}

            {sectionGroups.length === 0 && (
              <div className="py-20 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-white space-y-3">
                <Video className="w-12 h-12 text-gray-200 mx-auto" />
                <p className="font-bold text-gray-500">No sections added yet</p>
                <p className="text-sm text-gray-400">Click &quot;Add New Section&quot; above to create chapters and lessons.</p>
                <Button type="button" onClick={addSectionGroup} className="bg-[#8b3d6f] hover:bg-[#7c3663] text-white font-bold gap-2">
                  <Plus className="w-4 h-4" /> Add First Section
                </Button>
              </div>
            )}
          </div>
        )}

        {activeTab === "test" && (
           <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 max-w-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-[#2c1a4d] font-bold">Course Level</Label>
                      <select 
                        name="level" 
                        value={formData.level} 
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-[#8b3d6f]"
                      >
                         <option>Beginner</option>
                         <option>Intermediate</option>
                         <option>Professional</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[#2c1a4d] font-bold">Tags</Label>
                      <Input name="tags" value={formData.tags} onChange={handleChange} placeholder="react, web, development" required />
                    </div>
                 </div>
                 <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-[#2c1a4d] font-bold text-xs uppercase tracking-wider">Demo / Teaser Video</Label>
                        {formData.demo_url && (
                          <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                            <Check className="w-3 h-3" /> Ready
                          </span>
                        )}
                      </div>

                      {/* Mux Upload Zone for Demo Video */}
                      <div className="relative border-2 border-dashed border-gray-200 hover:border-[#8b3d6f] transition-all rounded-xl p-3 bg-gray-50/60 flex flex-col items-center justify-center text-center gap-2 group cursor-pointer">
                        <input
                          type="file"
                          accept="video/*"
                          disabled={uploadingDemo}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleUploadDemoToMux(file);
                          }}
                          className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
                        />

                        {uploadingDemo ? (
                          <div className="w-full space-y-2 py-1">
                            <div className="flex items-center justify-between text-xs font-bold text-[#8b3d6f]">
                              <span className="flex items-center gap-1.5">
                                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading to Mux...
                              </span>
                              <span>{demoProgress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-[#8b3d6f] h-full transition-all duration-300 rounded-full"
                                style={{ width: `${demoProgress}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 py-1">
                            <div className="w-8 h-8 rounded-lg bg-purple-50 text-[#8b3d6f] flex items-center justify-center group-hover:scale-110 transition-transform">
                              <Upload className="w-4 h-4" />
                            </div>
                            <div className="text-left">
                              <p className="text-xs font-bold text-[#2c1a4d]">
                                {formData.demo_url ? "Replace Demo Video (Upload to Mux)" : "Upload Demo Video to Mux"}
                              </p>
                              <p className="text-[10px] text-gray-400">Click or drop MP4, MOV, WEBM</p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <div className="bg-gray-100 p-2 rounded-lg flex items-center justify-center shrink-0">
                          <Video className="w-4 h-4 text-[#8b3d6f]" />
                        </div>
                        <Input 
                          name="demo_url" 
                          value={formData.demo_url || ""} 
                          onChange={handleChange} 
                          placeholder="Or paste Mux Playback ID / video URL" 
                          className="text-xs h-9"
                        />
                      </div>
                    </div>
                    <div className="flex gap-8 pt-6">
                       <label className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" name="status" checked={formData.status} onChange={handleChange} className="w-5 h-5 accent-[#8b3d6f] rounded" />
                          <span className="font-bold text-[#2c1a4d]">Publish Online</span>
                       </label>
                       <label className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" name="ready" checked={formData.ready} onChange={handleChange} className="w-5 h-5 accent-[#8b3d6f] rounded" />
                          <span className="font-bold text-[#2c1a4d]">Mark as Ready</span>
                       </label>
                    </div>
                 </div>
              </div>
           </div>
        )}
      </form>

      {/* Persistence Bar */}
      <div className="p-6 bg-white border-t border-gray-100 flex items-center justify-between">
         <Button type="button" variant="ghost" onClick={onCancel} className="font-bold text-gray-400">
           Discard Changes
         </Button>
         <div className="flex items-center gap-3">
             <div className="text-right mr-4 hidden md:block">
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider font-mono">Status</p>
                <p className="text-xs font-bold text-[#8b3d6f]">{formData.status ? "LIVE PRODUCTION" : "LOCAL DRAFT"}</p>
             </div>
             <Button 
               onClick={handleSubmit} 
               disabled={isLoading}
               className="bg-[#8b3d6f] hover:bg-[#7c3663] text-white font-bold h-12 px-10 rounded-xl shadow-lg shadow-purple-100 flex gap-3"
             >
               {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
               {course ? "Update Course" : "Deploy New Course"}
             </Button>
         </div>
      </div>
    </div>
  );
}

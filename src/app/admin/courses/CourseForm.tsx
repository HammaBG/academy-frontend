"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Image as ImageIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CourseFormProps {
  course?: Course | null;
  onSubmit: (data: Partial<Course>) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export function CourseForm({ course, onSubmit, onCancel, isLoading }: CourseFormProps) {
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
    benefits: [{ title: "" }],
    prerequisites: [{ title: "" }],
    course_data: [],
    thumbnail: { public_id: "", url: "" }
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

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

  // Syllabus Helpers
  const addSection = () => {
    const newSection: ICourseData = {
      title: "",
      description: "",
      video_url: "",
      video_section: "Untitled Section",
      video_length: 0,
      video_thumbnail: {},
      video_player: "",
      links: [],
      suggestion: "",
    };
    setFormData({ ...formData, course_data: [...(formData.course_data || []), newSection] });
  };

  const updateSection = (index: number, data: Partial<ICourseData>) => {
    const newData = [...(formData.course_data || [])];
    newData[index] = { ...newData[index], ...data };
    setFormData({ ...formData, course_data: newData });
  };

  const removeSection = (index: number) => {
    const newData = (formData.course_data || []).filter((_, i) => i !== index);
    setFormData({ ...formData, course_data: newData });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
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
                   <Label className="text-[#2c1a4d] font-bold">Short Description</Label>
                   <Textarea name="short_description" value={formData.short_description} onChange={handleChange} placeholder="A catchy summary for calculations..." className="min-h-[100px]" />
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
                     <Label className="text-[#2c1a4d] font-bold">Categories (comma separated)</Label>
                     <Input name="categories" value={formData.categories} onChange={handleChange} placeholder="Development, Art, Business" />
                   </div>
               </div>
             </div>
             
             <div className="space-y-2">
                <Label className="text-[#2c1a4d] font-bold">Full Course Description</Label>
                <Textarea name="description" value={formData.description} onChange={handleChange} className="min-h-[200px]" placeholder="Explain what your course is about in detail..." />
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
               <h3 className="text-xl font-extrabold text-[#2c1a4d]">Curriculum Structure</h3>
               <Button type="button" onClick={addSection} className="bg-[#8b3d6f] hover:bg-[#7c3663] text-white font-bold gap-2">
                 <Plus className="w-4 h-4" /> Add New Section
               </Button>
            </div>

            {formData.course_data?.map((section, idx) => (
               <div key={idx} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm group">
                  <div className="bg-gray-50/50 p-4 border-b border-gray-100 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-[#8b3d6f] text-white flex items-center justify-center font-bold text-sm">{idx + 1}</span>
                        <Input 
                          value={section.video_section} 
                          onChange={(e) => updateSection(idx, { video_section: e.target.value })} 
                          className="font-extrabold bg-transparent border-none focus-visible:ring-0 text-[#2c1a4d] p-0 h-auto text-lg w-[300px]"
                          placeholder="Section Name"
                        />
                     </div>
                     <Button type="button" variant="ghost" size="icon" onClick={() => removeSection(idx)} className="text-gray-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                     </Button>
                  </div>
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                         <div className="space-y-2">
                            <Label className="text-[#2c1a4d] font-bold text-xs uppercase tracking-wider">Video Title</Label>
                            <Input value={section.title} onChange={(e) => updateSection(idx, { title: e.target.value })} placeholder="e.g. Introduction to React" />
                         </div>
                         <div className="space-y-2">
                            <Label className="text-[#2c1a4d] font-bold text-xs uppercase tracking-wider">Video URL / Provider ID</Label>
                            <div className="flex gap-2">
                               <div className="bg-gray-100 p-2 rounded-lg flex items-center justify-center">
                                  <Video className="w-5 h-5 text-[#8b3d6f]" />
                               </div>
                               <Input value={section.video_url} onChange={(e) => updateSection(idx, { video_url: e.target.value })} placeholder="YouTube, Vimeo or VdoCipher ID" />
                            </div>
                         </div>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-[#2c1a4d] font-bold text-xs uppercase tracking-wider">Short Description / Subtitle</Label>
                            <Textarea value={section.description} onChange={(e) => updateSection(idx, { description: e.target.value })} className="min-h-[100px]" placeholder="Briefly explain what this lesson covers..." />
                        </div>
                      </div>
                  </div>
               </div>
            ))}
            
            {(!formData.course_data || formData.course_data.length === 0) && (
               <div className="py-20 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-white">
                  <Video className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                  <p className="font-bold text-gray-400">No content sections yet</p>
                  <p className="text-sm text-gray-300">Click the button above to start building your course.</p>
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
                      <Input name="tags" value={formData.tags} onChange={handleChange} placeholder="react, web, development" />
                    </div>
                 </div>
                 <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-[#2c1a4d] font-bold">Demo Video URL</Label>
                      <Input name="demo_url" value={formData.demo_url} onChange={handleChange} placeholder="Public preview URL" />
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

"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Article } from "@/store/article";
import { Image as ImageIcon, X, Loader2, Save } from "lucide-react";
import { cn } from "@/lib/utils";

interface ArticleFormProps {
  article?: Article | null;
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export function ArticleForm({ article, onSubmit, onCancel, isLoading }: ArticleFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    status: "draft" as "draft" | "published",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title || "",
        excerpt: article.excerpt || "",
        content: article.content || "",
        status: article.status || "draft",
      });
      setImagePreview(article.image_url || null);
    }
  }, [article]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("excerpt", formData.excerpt);
    data.append("content", formData.content);
    data.append("status", formData.status);
    if (imageFile) {
      data.append("image", imageFile); // 'image' because the backend uses req.file
    }
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Article Title</Label>
          <Input
            id="title"
            name="title"
            placeholder="Enter article title..."
            value={formData.title}
            onChange={handleChange}
            required
            className="bg-white border-gray-200 focus:border-[#8b3d6f] focus:ring-1 focus:ring-[#8b3d6f]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="excerpt">Excerpt / Short Description</Label>
          <Textarea
            id="excerpt"
            name="excerpt"
            placeholder="A short summary of the article..."
            value={formData.excerpt}
            onChange={handleChange}
            className="bg-white border-gray-200 focus:border-[#8b3d6f] focus:ring-1 focus:ring-[#8b3d6f] min-h-[80px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Full Content</Label>
          <Textarea
            id="content"
            name="content"
            placeholder="Write your article content here..."
            value={formData.content}
            onChange={handleChange}
            required
            className="bg-white border-gray-200 focus:border-[#8b3d6f] focus:ring-1 focus:ring-[#8b3d6f] min-h-[300px]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#8b3d6f] transition-all font-medium h-10"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label>Cover Image</Label>
            <div className="flex items-center gap-4">
              <div 
                className={cn(
                  "relative w-24 h-24 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden bg-gray-50 transition-colors",
                  !imagePreview && "hover:border-[#8b3d6f] hover:bg-purple-50"
                )}
              >
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => { setImageFile(null); setImagePreview(null); }}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </>
                ) : (
                  <ImageIcon className="w-8 h-8 text-gray-300" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-500">Upload Image</span>
                <span className="text-[10px] text-gray-400">Recommended: 1200x630px</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="font-bold border-gray-200 text-gray-600 hover:bg-gray-50"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-[#8b3d6f] hover:bg-[#7c3663] text-white font-bold gap-2 min-w-[120px]"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {article ? "Update Article" : "Create Article"}
        </Button>
      </div>
    </form>
  );
}

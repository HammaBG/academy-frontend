"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Article } from "@/store/article";
import { useCategoryStore } from "@/store/category";
import { ArticleContentRenderer } from "@/components/ArticleContentRenderer";
import {
  Image as ImageIcon,
  X,
  Loader2,
  Save,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  Quote,
  Code,
  Link2,
  Eye,
  Edit3,
  Highlighter,
  Palette,
  AlignRight,
  AlignCenter,
  AlignLeft,
  Minus,
  Table as TableIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ArticleFormProps {
  article?: Article | null;
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export function ArticleForm({ article, onSubmit, onCancel, isLoading }: ArticleFormProps) {
  const { categories, getPublicCategories } = useCategoryStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    status: "draft" as "draft" | "published",
    category_id: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (categories.length === 0) {
      getPublicCategories();
    }
  }, [categories.length, getPublicCategories]);

  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title || "",
        excerpt: article.excerpt || "",
        content: article.content || "",
        status: article.status || "draft",
        category_id: article.category_id || article.category?.id || "",
      });
      setImagePreview(article.image_url || null);
    }
  }, [article]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const applyFormatting = (startTag: string, endTag: string = "", placeholder: string = "نص") => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setFormData((prev) => ({ ...prev, content: prev.content + `${startTag}${placeholder}${endTag}` }));
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = formData.content.substring(start, end) || placeholder;
    const replacement = `${startTag}${selected}${endTag}`;

    const newContent =
      formData.content.substring(0, start) +
      replacement +
      formData.content.substring(end);

    setFormData((prev) => ({ ...prev, content: newContent }));

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + startTag.length,
        start + startTag.length + selected.length
      );
    }, 0);
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
    if (formData.category_id) {
      data.append("category_id", formData.category_id);
      const selectedCat = categories.find((c) => c.id === formData.category_id);
      if (selectedCat) {
        if (selectedCat.name) data.append("category_name", selectedCat.name);
        if (selectedCat.color) data.append("category_color", selectedCat.color);
      }
    }
    if (imageFile) {
      data.append("image", imageFile);
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

        {/* Content Section with Formatting Toolbar & Preview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="content">Full Content</Label>
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setActiveTab("edit")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-md transition-all",
                  activeTab === "edit"
                    ? "bg-white text-[#8b3d6f] shadow-sm"
                    : "text-gray-500 hover:text-gray-800"
                )}
              >
                <Edit3 className="w-3.5 h-3.5" />
                Write
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("preview")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-md transition-all",
                  activeTab === "preview"
                    ? "bg-white text-[#8b3d6f] shadow-sm"
                    : "text-gray-500 hover:text-gray-800"
                )}
              >
                <Eye className="w-3.5 h-3.5" />
                Preview
              </button>
            </div>
          </div>

          {activeTab === "edit" ? (
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
              {/* Toolbar */}
              <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 border-b border-gray-200">
                {/* Headings */}
                <button
                  type="button"
                  title="Heading 1"
                  onClick={() => applyFormatting("<h1>", "</h1>", "العنوان الرئيسي H1")}
                  className="px-2 py-1 hover:bg-gray-200 rounded text-xs font-extrabold text-gray-700 transition-colors"
                >
                  H1
                </button>
                <button
                  type="button"
                  title="Heading 2"
                  onClick={() => applyFormatting("<h2>", "</h2>", "العنوان الفرعي H2")}
                  className="px-2 py-1 hover:bg-gray-200 rounded text-xs font-bold text-gray-700 transition-colors"
                >
                  H2
                </button>
                <button
                  type="button"
                  title="Heading 3"
                  onClick={() => applyFormatting("<h3>", "</h3>", "العنوان الفرعي H3")}
                  className="px-2 py-1 hover:bg-gray-200 rounded text-xs font-bold text-gray-700 transition-colors"
                >
                  H3
                </button>

                <div className="h-4 w-px bg-gray-300 mx-1" />

                {/* Text Formatting */}
                <button
                  type="button"
                  title="Bold"
                  onClick={() => applyFormatting("<b>", "</b>", "نص عريض")}
                  className="p-1.5 hover:bg-gray-200 rounded text-gray-700 transition-colors"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title="Italic"
                  onClick={() => applyFormatting("<i>", "</i>", "نص مائل")}
                  className="p-1.5 hover:bg-gray-200 rounded text-gray-700 transition-colors"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title="Underline (تسطير النص)"
                  onClick={() => applyFormatting("<u>", "</u>", "نص مسطّر")}
                  className="p-1.5 hover:bg-gray-200 rounded text-gray-700 transition-colors"
                >
                  <Underline className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title="Strikethrough (شطب النص)"
                  onClick={() => applyFormatting("<s>", "</s>", "نص مشطوب")}
                  className="p-1.5 hover:bg-gray-200 rounded text-gray-700 transition-colors"
                >
                  <Strikethrough className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title="Highlight (تمريز خلفية النص)"
                  onClick={() => applyFormatting('<mark style="background-color: #fef08a; padding: 2px 6px; border-radius: 4px;">', "</mark>", "نص مميّز")}
                  className="p-1.5 hover:bg-gray-200 rounded text-yellow-600 transition-colors"
                >
                  <Highlighter className="w-4 h-4" />
                </button>

                <div className="h-4 w-px bg-gray-300 mx-1" />

                {/* Text Colors */}
                <span className="text-[11px] font-bold text-gray-400 flex items-center gap-1 px-1">
                  <Palette className="w-3.5 h-3.5" />
                  ألوان:
                </span>
                <button
                  type="button"
                  title="Red Text"
                  onClick={() => applyFormatting('<span style="color: #ef4444;">', "</span>", "نص أحمر")}
                  className="w-5 h-5 rounded-full bg-red-500 hover:scale-110 transition-transform border border-white shadow-xs"
                />
                <button
                  type="button"
                  title="Blue Text"
                  onClick={() => applyFormatting('<span style="color: #3b82f6;">', "</span>", "نص أزرق")}
                  className="w-5 h-5 rounded-full bg-blue-500 hover:scale-110 transition-transform border border-white shadow-xs"
                />
                <button
                  type="button"
                  title="Green Text"
                  onClick={() => applyFormatting('<span style="color: #10b981;">', "</span>", "نص أخضر")}
                  className="w-5 h-5 rounded-full bg-emerald-500 hover:scale-110 transition-transform border border-white shadow-xs"
                />
                <button
                  type="button"
                  title="Purple (Brand) Text"
                  onClick={() => applyFormatting('<span style="color: #8b3d6f;">', "</span>", "نص بنفسجي")}
                  className="w-5 h-5 rounded-full bg-[#8b3d6f] hover:scale-110 transition-transform border border-white shadow-xs"
                />
                <button
                  type="button"
                  title="Amber Text"
                  onClick={() => applyFormatting('<span style="color: #f59e0b;">', "</span>", "نص برتقالي")}
                  className="w-5 h-5 rounded-full bg-amber-500 hover:scale-110 transition-transform border border-white shadow-xs"
                />

                <div className="h-4 w-px bg-gray-300 mx-1" />

                {/* Alignment */}
                <button
                  type="button"
                  title="Align Right"
                  onClick={() => applyFormatting('<div style="text-align: right;">\n', "\n</div>", "مكناسبة لليمين")}
                  className="p-1.5 hover:bg-gray-200 rounded text-gray-700 transition-colors"
                >
                  <AlignRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title="Align Center"
                  onClick={() => applyFormatting('<div style="text-align: center;">\n', "\n</div>", "توسط في المنتصف")}
                  className="p-1.5 hover:bg-gray-200 rounded text-gray-700 transition-colors"
                >
                  <AlignCenter className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title="Align Left"
                  onClick={() => applyFormatting('<div style="text-align: left;">\n', "\n</div>", "محاذاة لليسار")}
                  className="p-1.5 hover:bg-gray-200 rounded text-gray-700 transition-colors"
                >
                  <AlignLeft className="w-4 h-4" />
                </button>

                <div className="h-4 w-px bg-gray-300 mx-1" />

                {/* Structure / Extras */}
                <button
                  type="button"
                  title="Quote"
                  onClick={() => applyFormatting("<blockquote>", "</blockquote>", "اقتباس")}
                  className="p-1.5 hover:bg-gray-200 rounded text-gray-700 transition-colors"
                >
                  <Quote className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title="List"
                  onClick={() => applyFormatting("<ul>\n  <li>", "</li>\n</ul>", "عنصر قائمة")}
                  className="p-1.5 hover:bg-gray-200 rounded text-gray-700 transition-colors"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title="Code"
                  onClick={() => applyFormatting("<code>", "</code>", "كود")}
                  className="p-1.5 hover:bg-gray-200 rounded text-gray-700 transition-colors"
                >
                  <Code className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title="Link"
                  onClick={() => applyFormatting('<a href="https://example.com" target="_blank" rel="noopener noreferrer" style="color: #8b3d6f; text-decoration: underline;">', "</a>", "نص الرابط")}
                  className="p-1.5 hover:bg-gray-200 rounded text-gray-700 transition-colors"
                >
                  <Link2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title="Divider Line (فاصل)"
                  onClick={() => applyFormatting('<hr style="margin: 24px 0; border: 0; border-top: 1px solid #e5e7eb;" />\n', "", "")}
                  className="p-1.5 hover:bg-gray-200 rounded text-gray-700 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title="Insert Table (جدول)"
                  onClick={() => applyFormatting('<table style="width:100%; border-collapse:collapse; margin:16px 0; border: 1px solid #e5e7eb;">\n  <thead>\n    <tr style="background:#f9fafb;">\n      <th style="padding:10px; border:1px solid #e5e7eb; text-align:right;">عنوان 1</th>\n      <th style="padding:10px; border:1px solid #e5e7eb; text-align:right;">عنوان 2</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td style="padding:10px; border:1px solid #e5e7eb;">بيانات 1</td>\n      <td style="padding:10px; border:1px solid #e5e7eb;">بيانات 2</td>\n    </tr>\n  </tbody>\n</table>\n', "", "")}
                  className="p-1.5 hover:bg-gray-200 rounded text-gray-700 transition-colors"
                >
                  <TableIcon className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title="Code"
                  onClick={() => applyFormatting("<code>", "</code>", "كود")}
                  className="p-1.5 hover:bg-gray-200 rounded text-gray-700 transition-colors"
                >
                  <Code className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title="Link"
                  onClick={() => applyFormatting('<a href="https://example.com">', "</a>", "نص الرابط")}
                  className="p-1.5 hover:bg-gray-200 rounded text-gray-700 transition-colors"
                >
                  <Link2 className="w-4 h-4" />
                </button>
              </div>

              {/* Textarea */}
              <Textarea
                ref={textareaRef}
                id="content"
                name="content"
                placeholder="اكتب محتوى المقال هنا... يمكنك استخدام أزرار التنسيق أعلاه (H1, H2, H3, Bold, إلخ)"
                value={formData.content}
                onChange={handleChange}
                required
                dir="auto"
                className="bg-white border-0 focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[300px] p-4 text-base leading-relaxed"
              />
            </div>
          ) : (
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50 min-h-[300px] max-h-[500px] overflow-y-auto">
              {formData.content ? (
                <ArticleContentRenderer content={formData.content} />
              ) : (
                <p className="text-gray-400 text-sm italic text-center py-12">
                  No content written yet. Switch to "Write" tab to start composing.
                </p>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="category_id">Category</Label>
            <select
              id="category_id"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#8b3d6f] transition-all font-medium h-10"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

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

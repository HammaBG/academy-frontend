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
import {
  MoreHorizontal,
  Search,
  Plus,
  Trash2,
  Edit,
  Loader2,
  Newspaper,
  ExternalLink,
} from "lucide-react";

import { useAuthStore } from "@/store/auth";
import { useArticleStore, Article } from "@/store/article";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArticleForm } from "@/app/admin/articles/ArticleForm";
import { toast } from "sonner";

export default function InstructorArticlesPage() {
  const { token, user } = useAuthStore();
  const { articles, isLoading, error, getAllArticles, createArticle, updateArticle, deleteArticle } = useArticleStore();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);

  useEffect(() => {
    if (token) {
      getAllArticles(token);
    }
  }, [token, getAllArticles]);

  // Filter articles for this instructor if they are an instructor (admins can see all)
  const isOnlyInstructor = user?.role === 'instructor';
  const myArticles = (articles || []).filter(article => {
    if (isOnlyInstructor && article.author_id) {
      return article.author_id === user?.id;
    }
    return true;
  });

  const filteredArticles = myArticles.filter(article => 
    article.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    setCurrentArticle(null);
    setIsSheetOpen(true);
  };

  const handleEdit = (article: Article) => {
    setCurrentArticle(article);
    setIsSheetOpen(true);
  };

  const handleSubmit = async (formData: FormData) => {
    if (!token) return;
    
    try {
      if (currentArticle) {
        await updateArticle(currentArticle.id, formData, token);
        toast.success("تم تحديث المقال بنجاح");
      } else {
        await createArticle(formData, token);
        toast.success("تم إنشاء المقال بنجاح");
      }
      setIsSheetOpen(false);
      // Refresh articles list
      getAllArticles(token);
    } catch (err: any) {
      console.error("Submit error:", err);
      toast.error(err.message || "حدث خطأ أثناء حفظ المقال");
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    if (window.confirm("هل أنت متأكد من حذف هذا المقال نهائياً؟")) {
      try {
        await deleteArticle(id, token);
        toast.success("تم حذف المقال بنجاح");
        getAllArticles(token);
      } catch (err: any) {
        toast.error(err.message || "فشل حذف المقال");
      }
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-left" dir="ltr">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0d7377] flex items-center gap-3">
            <Newspaper className="w-8 h-8 text-[#0d7377]" />
            <span>My Articles</span>
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Write, publish and manage educational articles and posts for your students.
          </p>
        </div>
        <Button 
          onClick={handleCreate}
          className="bg-[#0d7377] hover:bg-[#095255] text-white font-bold gap-2 shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Write New Article
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-bold flex items-center gap-2">
          <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
          Error: {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden min-h-[400px]">
        <div className="p-4 border-b border-gray-100 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              placeholder="Search by title..." 
              className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-all text-xs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {isLoading && <Loader2 className="w-5 h-5 text-[#0d7377] animate-spin" />}
        </div>

        <Table>
          <TableHeader className="bg-gray-50/70">
            <TableRow>
              <TableHead className="font-bold text-xs text-[#2c1a4d]">Article</TableHead>
              <TableHead className="font-bold text-xs text-[#2c1a4d]">Category</TableHead>
              <TableHead className="font-bold text-xs text-[#2c1a4d]">Status</TableHead>
              <TableHead className="font-bold text-xs text-[#2c1a4d]">Created At</TableHead>
              <TableHead className="font-bold text-xs text-[#2c1a4d] text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!isLoading && filteredArticles.map((article) => (
              <TableRow key={article.id} className="hover:bg-gray-50/80 transition-colors border-b border-gray-50">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg border border-gray-100 bg-gray-50 overflow-hidden shrink-0 flex items-center justify-center">
                      {article.image_url ? (
                        <img src={article.image_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Newspaper className="w-5 h-5 text-gray-300" />
                      )}
                    </div>
                    <div className="flex flex-col max-w-[300px] md:max-w-[400px]">
                      <span className="font-bold text-gray-900 text-sm truncate">{article.title}</span>
                      <span className="text-[11px] text-gray-400 line-clamp-1">{article.excerpt || "No summary provided"}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {article.category_name || article.category?.name ? (
                    <span 
                      className="px-2.5 py-1 rounded-full text-[11px] font-bold border"
                      style={{ 
                        backgroundColor: (article.category_color || article.category?.color || '#0d7377') + '15',
                        color: article.category_color || article.category?.color || '#0d7377',
                        borderColor: (article.category_color || article.category?.color || '#0d7377') + '30',
                      }}
                    >
                      {article.category_name || article.category?.name}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400 font-medium">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${
                    article.status === 'published' 
                      ? 'bg-green-50 text-green-600 border border-green-100' 
                      : 'bg-orange-50 text-orange-600 border border-orange-100'
                  }`}>
                    {article.status}
                  </span>
                </TableCell>
                <TableCell className="text-gray-500 font-medium text-xs">
                   {article.created_at ? new Date(article.created_at).toLocaleDateString() : 'N/A'}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-9 w-9 p-0 hover:bg-gray-100 text-gray-400 cursor-pointer">
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 font-bold shadow-xl border-gray-100 p-2">
                      <DropdownMenuGroup>
                        <DropdownMenuLabel className="text-gray-400 uppercase text-[10px] py-2 px-3 tracking-widest">Article Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleEdit(article)}
                          className="gap-3 py-2.5 px-3 hover:bg-gray-50 transition-colors cursor-pointer rounded-md"
                        >
                          <Edit className="w-4 h-4 text-blue-600" />
                          <span>Edit Article</span>
                        </DropdownMenuItem>
                        
                        <Link href={`/articles/${article.url || article.id}`} target="_blank">
                          <DropdownMenuItem className="gap-3 py-2.5 px-3 hover:bg-gray-50 transition-colors cursor-pointer rounded-md">
                            <ExternalLink className="w-4 h-4 text-purple-600" />
                            <span>View Live</span>
                          </DropdownMenuItem>
                        </Link>

                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDelete(article.id)}
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
        
        {!isLoading && filteredArticles.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Newspaper className="w-12 h-12 text-gray-300 mb-4 opacity-40" />
            <p className="text-gray-500 font-bold text-base">No articles found</p>
            <p className="text-gray-400 text-xs mt-1">Start writing your first article to share knowledge with your students</p>
          </div>
        )}

        {isLoading && articles.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="w-10 h-10 text-[#0d7377] animate-spin mb-3" />
            <p className="text-[#0d7377] font-bold text-xs animate-pulse">Loading your articles...</p>
          </div>
        )}
      </div>

      <Dialog open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <DialogContent className="sm:max-w-5xl w-[95vw] max-h-[92vh] flex flex-col p-0 overflow-hidden bg-white shadow-2xl rounded-2xl border-0">
          <DialogHeader className="p-6 pb-4 border-b border-gray-100 bg-gray-50/50">
            <DialogTitle className="text-2xl font-extrabold text-[#0d7377]">
              {currentArticle ? "Edit Article" : "Write New Article"}
            </DialogTitle>
            <DialogDescription className="text-gray-500 font-medium text-xs">
              {currentArticle 
                ? "Update your article content, category, cover image and status." 
                : "Fill in the details below to write and publish a new article for your students."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-6 md:p-8">
            <ArticleForm 
              article={currentArticle} 
              onSubmit={handleSubmit} 
              onCancel={() => setIsSheetOpen(false)}
              isLoading={isLoading}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

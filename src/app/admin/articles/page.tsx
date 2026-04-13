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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ArticleForm } from "./ArticleForm";

export default function ArticlesPage() {
  const { token } = useAuthStore();
  const { articles, isLoading, error, getAllArticles, createArticle, updateArticle, deleteArticle } = useArticleStore();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);

  useEffect(() => {
    if (token) {
      getAllArticles(token);
    }
  }, [token, getAllArticles]);

  const filteredArticles = (articles || []).filter(article => 
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
      } else {
        await createArticle(formData, token);
      }
      setIsSheetOpen(false);
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    if (window.confirm("Are you sure you want to delete this article?")) {
      await deleteArticle(id, token);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#2c1a4d]">Article Management</h1>
          <p className="text-gray-500 font-medium mt-1">Write, publish and manage your academy blog posts.</p>
        </div>
        <Button 
          onClick={handleCreate}
          className="bg-[#8b3d6f] hover:bg-[#7c3663] text-white font-bold gap-2"
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

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[400px]">
        <div className="p-4 border-b border-gray-100 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              placeholder="Search by title..." 
              className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {isLoading && <Loader2 className="w-5 h-5 text-[#8b3d6f] animate-spin" />}
        </div>

        <Table>
          <TableHeader className="bg-gray-100/50">
            <TableRow>
              <TableHead className="font-bold text-[#2c1a4d]">Article</TableHead>
              <TableHead className="font-bold text-[#2c1a4d]">Status</TableHead>
              <TableHead className="font-bold text-[#2c1a4d]">Created At</TableHead>
              <TableHead className="font-bold text-[#2c1a4d] text-right">Action</TableHead>
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
                      <span className="font-bold text-[#2c1a4d] text-[15px] truncate">{article.title}</span>
                      <span className="text-[11px] text-gray-400 line-clamp-1">{article.excerpt || "No summary provided"}</span>
                    </div>
                  </div>
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
                <TableCell className="text-gray-500 font-bold text-[13px]">
                   {article.created_at ? new Date(article.created_at).toLocaleDateString() : 'N/A'}
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
                        <DropdownMenuLabel className="text-gray-400 uppercase text-[10px] py-2 px-3 tracking-widest">Article Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleEdit(article)}
                          className="gap-3 py-2.5 px-3 hover:bg-gray-50 transition-colors cursor-pointer rounded-md"
                        >
                          <Edit className="w-4 h-4 text-blue-600" />
                          <span>Edit Article</span>
                        </DropdownMenuItem>
                        
                        <Link href={`/articles/${article.id}`} target="_blank">
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
            <Newspaper className="w-12 h-12 text-gray-100 mb-4" />
            <p className="text-gray-400 font-bold text-lg">No articles found</p>
            <p className="text-gray-300 text-sm">Create your first article to see it here</p>
          </div>
        )}

        {isLoading && articles.length === 0 && (
          <div className="flex flex-col items-center justify-center py-40">
            <Loader2 className="w-12 h-12 text-[#8b3d6f] animate-spin mb-4" />
            <p className="text-[#8b3d6f] font-bold animate-pulse">Loading articles...</p>
          </div>
        )}
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="sm:max-w-2xl bg-white p-0">
          <div className="flex flex-col h-full">
            <SheetHeader className="p-6 border-b border-gray-100">
              <SheetTitle className="text-2xl font-extrabold text-[#2c1a4d]">
                {currentArticle ? "Edit Article" : "Write New Article"}
              </SheetTitle>
              <SheetDescription className="text-gray-500 font-medium">
                {currentArticle 
                  ? "Update your article content and status." 
                  : "Fill in the details below to create a new article for your academy."}
              </SheetDescription>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-6">
              <ArticleForm 
                article={currentArticle} 
                onSubmit={handleSubmit} 
                onCancel={() => setIsSheetOpen(false)}
                isLoading={isLoading}
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

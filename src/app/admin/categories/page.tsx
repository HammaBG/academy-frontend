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
import {
  MoreHorizontal,
  Search,
  Plus,
  Trash2,
  Edit,
  Loader2,
  Layers,
} from "lucide-react";

import { useAuthStore } from "@/store/auth";
import { useCategoryStore, Category } from "@/store/category";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CategoryForm } from "./CategoryForm";

export default function CategoriesPage() {
  const { token } = useAuthStore();
  const { categories, isLoading, error, getAllCategories, createCategory, updateCategory, deleteCategory } = useCategoryStore();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);

  useEffect(() => {
    if (token) {
      getAllCategories(token);
    }
  }, [token, getAllCategories]);

  const filteredCategories = (categories || []).filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    setCurrentCategory(null);
    setIsSheetOpen(true);
  };

  const handleEdit = (category: Category) => {
    setCurrentCategory(category);
    setIsSheetOpen(true);
  };

  const handleSubmit = async (data: { name: string }) => {
    if (!token) return;
    
    try {
      if (currentCategory) {
        await updateCategory(currentCategory.id, data, token);
      } else {
        await createCategory(data, token);
      }
      setIsSheetOpen(false);
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    if (window.confirm("Are you sure you want to delete this category?")) {
      await deleteCategory(id, token);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#2c1a4d]">Category Management</h1>
          <p className="text-gray-500 font-medium mt-1">Organize your courses and articles with categories.</p>
        </div>
        <Button 
          onClick={handleCreate}
          className="bg-[#8b3d6f] hover:bg-[#7c3663] text-white font-bold gap-2"
        >
          <Plus className="w-4 h-4" />
          Add New Category
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
              placeholder="Search by name..." 
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
              <TableHead className="font-bold text-[#2c1a4d]">Category Name</TableHead>
              <TableHead className="font-bold text-[#2c1a4d]">Created At</TableHead>
              <TableHead className="font-bold text-[#2c1a4d] text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!isLoading && filteredCategories.map((category) => (
              <TableRow key={category.id} className="hover:bg-gray-50/80 transition-colors border-b border-gray-50">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg border border-gray-100 bg-gray-50 flex items-center justify-center text-[#8b3d6f]">
                       <Layers className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-[#2c1a4d] text-[15px]">{category.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-500 font-bold text-[13px]">
                   {category.created_at ? new Date(category.created_at).toLocaleDateString() : 'N/A'}
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
                        <DropdownMenuLabel className="text-gray-400 uppercase text-[10px] py-2 px-3 tracking-widest">Category Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleEdit(category)}
                          className="gap-3 py-2.5 px-3 hover:bg-gray-50 transition-colors cursor-pointer rounded-md"
                        >
                          <Edit className="w-4 h-4 text-blue-600" />
                          <span>Edit Category</span>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDelete(category.id)}
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
        
        {!isLoading && filteredCategories.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Layers className="w-12 h-12 text-gray-100 mb-4" />
            <p className="text-gray-400 font-bold text-lg">No categories found</p>
            <p className="text-gray-300 text-sm">Add your first category to get started</p>
          </div>
        )}

        {isLoading && categories.length === 0 && (
          <div className="flex flex-col items-center justify-center py-40">
            <Loader2 className="w-12 h-12 text-[#8b3d6f] animate-spin mb-4" />
            <p className="text-[#8b3d6f] font-bold animate-pulse">Loading categories...</p>
          </div>
        )}
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="sm:max-w-md bg-white p-0">
          <div className="flex-1 flex flex-col h-full">
            <SheetHeader className="p-6 border-b border-gray-100">
              <SheetTitle className="text-2xl font-extrabold text-[#2c1a4d]">
                {currentCategory ? "Edit Category" : "Add New Category"}
              </SheetTitle>
              <SheetDescription className="text-gray-500 font-medium">
                {currentCategory 
                  ? "Update the name of this category." 
                  : "Enter a name for the new category."}
              </SheetDescription>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-6">
              <CategoryForm 
                category={currentCategory} 
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

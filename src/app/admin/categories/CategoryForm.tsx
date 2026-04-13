"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Category } from "@/store/category";
import { Loader2, Save } from "lucide-react";

interface CategoryFormProps {
  category?: Category | null;
  onSubmit: (data: { name: string }) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export function CategoryForm({ category, onSubmit, onCancel, isLoading }: CategoryFormProps) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (category) {
      setName(category.name || "");
    } else {
      setName("");
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ name });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Category Name</Label>
          <Input
            id="name"
            placeholder="Enter category name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="bg-white border-gray-200 focus:border-[#8b3d6f] focus:ring-1 focus:ring-[#8b3d6f]"
          />
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
          {category ? "Update Category" : "Create Category"}
        </Button>
      </div>
    </form>
  );
}

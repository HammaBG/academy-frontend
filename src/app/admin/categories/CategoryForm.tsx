"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Category } from "@/store/category";
import { Loader2, Save } from "lucide-react";

const PRESET_COLORS = [
  "#8b3d6f",
  "#2c1a4d",
  "#e11d48",
  "#d97706",
  "#059669",
  "#2563eb",
  "#7c3aed",
  "#db2777",
];

interface CategoryFormProps {
  category?: Category | null;
  onSubmit: (data: { name: string; image_url?: string; color?: string }) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export function CategoryForm({ category, onSubmit, onCancel, isLoading }: CategoryFormProps) {
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [color, setColor] = useState("#8b3d6f");

  useEffect(() => {
    if (category) {
      setName(category.name || "");
      setImageUrl(category.image_url || "");
      setColor(category.color || "#8b3d6f");
    } else {
      setName("");
      setImageUrl("");
      setColor("#8b3d6f");
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ name, image_url: imageUrl, color });
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
        <div className="space-y-2">
          <Label htmlFor="image_url">Category Image URL</Label>
          <Input
            id="image_url"
            placeholder="https://example.com/image.jpg"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="bg-white border-gray-200 focus:border-[#8b3d6f] focus:ring-1 focus:ring-[#8b3d6f]"
          />
          <p className="text-[10px] text-gray-400 font-medium italic">This image will be used as the background on the home page.</p>
        </div>
        <div className="space-y-3">
          <Label htmlFor="color">Category Theme Color</Label>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg border border-gray-200 overflow-hidden relative flex-shrink-0 cursor-pointer">
                <input
                  id="color"
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="absolute inset-0 w-[200%] h-[200%] -translate-x-[25%] -translate-y-[25%] cursor-pointer border-0 p-0"
                />
              </div>
              <Input
                id="color_hex"
                placeholder="#8b3d6f"
                value={color}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                    setColor(val);
                  }
                }}
                className="bg-white border-gray-200 focus:border-[#8b3d6f] focus:ring-1 focus:ring-[#8b3d6f] font-mono uppercase text-sm"
                maxLength={7}
                aria-label="Category Color Hex Code"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setColor(preset)}
                  className={`w-7 h-7 rounded-full border transition-all ${
                    color.toLowerCase() === preset.toLowerCase()
                      ? "ring-2 ring-offset-2 ring-[#8b3d6f] scale-110"
                      : "border-gray-200 hover:scale-105"
                  }`}
                  style={{ backgroundColor: preset }}
                  aria-label={`Select preset color ${preset}`}
                />
              ))}
            </div>
          </div>
          <p className="text-[10px] text-gray-400 font-medium italic">Choose a theme color for category badges, tags, and accent highlights.</p>
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

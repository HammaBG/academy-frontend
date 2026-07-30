"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  fullscreen?: boolean;
  className?: string;
}

export function Loader({ size = "md", fullscreen = false, className }: LoaderProps) {
  // Dimension definitions for outer ring and inner fixed logo
  const sizeClasses = {
    sm: {
      outer: "w-16 h-16",
      inner: "w-8 h-8 border-[1.5px]",
    },
    md: {
      outer: "w-28 h-28",
      inner: "w-14 h-14 border-[2px]",
    },
    lg: {
      outer: "w-40 h-40",
      inner: "w-20 h-20 border-[3px]",
    },
  };

  const selectedSize = sizeClasses[size];

  const content = (
    <div className={cn("relative flex items-center justify-center select-none", className)}>
      {/* Rotating Loader SVG Text/Ring */}
      <img
        src="/Ossos/logo/SVG/loader.svg"
        alt="Loading..."
        className={cn(selectedSize.outer, "animate-[spin_6s_linear_infinite]")}
      />
      
      {/* Fixed central logo (not rotating) */}
      <div 
        className={cn(
          selectedSize.inner,
          "absolute rounded-full overflow-hidden bg-white border-brand-primary/10 shadow-md flex items-center justify-center"
        )}
      >
        <img
          src="/ossosacademy.jpg"
          alt="Ossos Academy"
          className="w-full h-full object-cover scale-[1.08]"
        />
      </div>
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-50 flex items-center justify-center transition-all duration-300">
        {content}
      </div>
    );
  }

  return content;
}

export default Loader;

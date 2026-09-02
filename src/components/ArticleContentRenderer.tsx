"use client";

import React from "react";

interface ArticleContentRendererProps {
  content: string;
  className?: string;
}

export function ArticleContentRenderer({ content, className = "" }: ArticleContentRendererProps) {
  if (!content) return null;

  // Detect if content contains HTML tags
  const hasHtml = /<[a-z][\s\S]*>/i.test(content);

  if (hasHtml) {
    return (
      <div
        className={`article-formatted-content text-right font-medium leading-[1.9] text-text-primary space-y-4 ${className}`}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  // Parse Markdown or newline paragraphs
  const lines = content.split("\n");

  return (
    <div className={`article-formatted-content text-right font-medium leading-[1.9] text-text-primary space-y-4 ${className}`}>
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-2" />;

        if (trimmed.startsWith("# ")) {
          return (
            <h1 key={idx} className="text-3xl font-black text-text-primary mt-8 mb-4 leading-tight">
              {trimmed.replace("# ", "")}
            </h1>
          );
        }
        if (trimmed.startsWith("## ")) {
          return (
            <h2 key={idx} className="text-2xl font-black text-text-primary mt-6 mb-3 pb-2 border-b border-border/40 leading-tight">
              {trimmed.replace("## ", "")}
            </h2>
          );
        }
        if (trimmed.startsWith("### ")) {
          return (
            <h3 key={idx} className="text-xl font-bold text-text-primary mt-5 mb-2 leading-snug">
              {trimmed.replace("### ", "")}
            </h3>
          );
        }
        if (trimmed.startsWith("> ")) {
          return (
            <blockquote key={idx} className="border-r-4 border-brand-primary bg-surface/60 p-4 rounded-xl italic my-4 text-text-secondary">
              {trimmed.replace("> ", "")}
            </blockquote>
          );
        }
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          return (
            <li key={idx} className="mr-6 list-disc text-text-primary">
              {trimmed.substring(2)}
            </li>
          );
        }

        return (
          <p key={idx} className="text-base sm:text-lg leading-relaxed whitespace-pre-wrap">
            {line}
          </p>
        );
      })}
    </div>
  );
}

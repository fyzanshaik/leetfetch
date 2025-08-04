"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import { Download, BookText, Copy, Loader2 } from "lucide-react";
import { toast } from "sonner";

const ApiDocDialog: React.FC = () => {
  const [markdown, setMarkdown] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMarkdown = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/DOC.md");
      if (!response.ok) throw new Error("Failed to fetch documentation");
      const text = await response.text();
      setMarkdown(text);
    } catch (error) {
      console.error("Error fetching DOC.md:", error);
      toast.error("Failed to load documentation");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch("/DOC.md");
      if (!response.ok) throw new Error("Failed to fetch document");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "LeetCode_API_Documentation.md";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Download started");
    } catch (error) {
      console.error("Error downloading DOC.md:", error);
      toast.error("Download failed");
    }
  };

  const handleCopy = () => {
    if (markdown) {
      navigator.clipboard.writeText(markdown);
      toast.success("Copied to clipboard");
    }
  };

  return (
    <Dialog
      onOpenChange={(isOpen) => {
        if (isOpen && !markdown && !isLoading) {
          fetchMarkdown();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="lg"
          className="relative group overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-2 border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 dark:hover:shadow-blue-500/10"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
          <BookText className="mr-3 h-5 w-5 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300" />
          <span className="relative z-10 font-semibold text-blue-700 dark:text-blue-300">API Documentation</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[98vw] w-[98vw] h-[85vh] flex flex-col bg-gradient-to-br from-background to-muted/20 border-2 border-border/50 shadow-2xl">
        <DialogHeader className="flex-row items-center justify-between space-y-0 pb-6 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-200/50 dark:border-blue-800/50">
              <BookText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                API Documentation
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">Comprehensive GraphQL API reference</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              disabled={!markdown}
              className="hover:bg-green-50 dark:hover:bg-green-950/20 hover:border-green-300 dark:hover:border-green-700 transition-all duration-200"
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              disabled={!markdown}
              className="hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200"
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy
            </Button>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto mt-6 px-2">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200/50 dark:border-blue-800/50">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-center mb-2">Loading Documentation</h3>
                <p className="text-muted-foreground text-center">Fetching the latest API reference...</p>
              </div>
            </div>
          ) : markdown ? (
            <div className="prose prose-lg max-w-none dark:prose-invert
              prose-headings:font-bold prose-headings:text-foreground
              prose-h1:text-4xl prose-h1:mb-8 prose-h1:pb-4 prose-h1:border-b-2 prose-h1:border-blue-200 dark:prose-h1:border-blue-800
              prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:text-blue-600 dark:prose-h2:text-blue-400
              prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-h3:text-indigo-600 dark:prose-h3:text-indigo-400
              prose-h4:text-xl prose-h4:mt-6 prose-h4:mb-3
              prose-p:text-lg prose-p:leading-8 prose-p:mb-6 prose-p:text-foreground/90
              prose-code:bg-muted/80 prose-code:px-3 prose-code:py-1 prose-code:rounded-lg prose-code:text-base prose-code:font-mono prose-code:border prose-code:border-border/50
              prose-pre:bg-muted/50 prose-pre:border-2 prose-pre:border-border/30 prose-pre:rounded-xl prose-pre:p-6 prose-pre:text-base prose-pre:leading-7
              prose-blockquote:border-l-4 prose-blockquote:border-blue-400 prose-blockquote:bg-blue-50/50 dark:prose-blockquote:bg-blue-950/20 prose-blockquote:p-6 prose-blockquote:rounded-r-lg prose-blockquote:italic prose-blockquote:text-lg
              prose-ul:text-lg prose-ol:text-lg prose-li:mb-3 prose-li:leading-8
              prose-strong:font-semibold prose-strong:text-foreground
              prose-table:border-2 prose-table:border-border/30 prose-table:rounded-xl prose-table:overflow-hidden prose-table:text-base
              prose-th:bg-muted/50 prose-th:font-semibold prose-th:p-4 prose-th:border-b prose-th:border-border/30
              prose-td:p-4 prose-td:border-b prose-td:border-border/20
              prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-a:font-medium
              prose-img:rounded-xl prose-img:border-2 prose-img:border-border/30 prose-img:shadow-lg
            ">
              <ReactMarkdown>{markdown}</ReactMarkdown>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-12 rounded-2xl bg-gradient-to-br from-muted/30 to-muted/10 border border-border/50">
                <BookText className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Ready to Load</h3>
                <p className="text-muted-foreground">Documentation will appear here once loaded</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApiDocDialog;

"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import { Download, BookText, Loader2, Copy, X } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const ApiDocDialog: React.FC = () => {
  const [markdown, setMarkdown] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMarkdown = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/DOC.md");
      if (!response.ok) {
        throw new Error(`Failed to fetch document: ${response.statusText}`);
      }
      const text = await response.text();
      setMarkdown(text);
    } catch (err) {
      console.error("Error fetching DOC.md:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load documentation.",
      );
      toast.error("Failed to load documentation", {
        description: "Could not fetch DOC.md. Check console for more details.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch("/DOC.md");
      if (!response.ok) {
        throw new Error(
          `Failed to fetch document for download: ${response.statusText}`,
        );
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "LeetCode_API_Documentation.md";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Download Started", {
        description: "LeetCode_API_Documentation.md is downloading.",
      });
    } catch (err) {
      console.error("Error downloading DOC.md:", err);
      toast.error("Download Failed", {
        description:
          "Could not download DOC.md. Please try again or copy directly.",
      });
    }
  };

  return (
    <Dialog
      onOpenChange={(isOpen) => {
        if (isOpen && markdown === null && !isLoading && !error) {
          fetchMarkdown();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className="hover:shadow-lg hover:scale-[1.02] transition-all duration-300 h-12 px-6 text-base rounded-lg font-medium border-border/50 hover:border-primary/30"
        >
          <BookText className="h-5 w-5 mr-2" />
          API Documentation
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl w-[95%] h-[90vh] flex flex-col bg-background/95 backdrop-blur-sm border-border/30 p-0">
        <DialogHeader className="flex-row items-center justify-between p-4 border-b border-border/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <BookText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-foreground">
                LeetCode API Documentation
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Comprehensive guide to GraphQL endpoints
              </DialogDescription>
            </div>
          </div>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </DialogTrigger>
        </DialogHeader>
        
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 min-h-0">
          <div className="md:col-span-1 md:border-r border-border/30 p-4 overflow-y-auto">
            <h3 className="text-lg font-semibold mb-3 text-foreground">Controls</h3>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                onClick={handleDownload}
                className="w-full justify-start gap-3 hover:bg-muted/50 transition-colors duration-200 border-border/50"
              >
                <Download className="h-4 w-4 text-primary" />
                <span>Download as .md</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  if (markdown) {
                    copyToClipboard(markdown);
                    toast.success("Copied to Clipboard", {
                      description: "Full documentation copied for LLM context.",
                    });
                  } else {
                    toast.error("Content not loaded", {
                      description:
                        "Cannot copy, documentation not available yet.",
                    });
                  }
                }}
                className="w-full justify-start gap-3 hover:bg-muted/50 transition-colors duration-200 border-border/50"
              >
                <Copy className="h-4 w-4 text-primary" />
                <span>Copy for LLM</span>
              </Button>
            </div>
            <Separator className="my-4" />
            <h3 className="text-lg font-semibold mb-3 text-foreground">Status</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Content</span>
                {isLoading ? (
                  <Badge variant="outline" className="animate-pulse">Loading...</Badge>
                ) : error ? (
                  <Badge variant="destructive">Error</Badge>
                ) : (
                  <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">Loaded</Badge>
                )}
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2 overflow-y-auto">
            <div className="p-6 markdown-body">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground pt-20">
                  <Loader2 className="h-12 w-12 animate-spin text-primary mb-6" />
                  <p className="text-xl font-medium animate-pulse">Loading documentation...</p>
                  <p className="text-base text-muted-foreground/70 mt-2">
                    Please wait while we fetch the API documentation
                  </p>
                </div>
              ) : error ? (
                <div className="text-center pt-20">
                  <div className="inline-flex flex-col items-center justify-center p-8 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <p className="font-semibold text-destructive text-lg mb-3">Error loading document:</p>
                    <p className="text-base text-destructive/80 mb-6">{error}</p>
                    <Button 
                      variant="outline" 
                      onClick={fetchMarkdown} 
                      className="border-destructive/30 text-destructive hover:bg-destructive/20"
                    >
                      Retry Load
                    </Button>
                  </div>
                </div>
              ) : markdown ? (
                <ReactMarkdown>{markdown}</ReactMarkdown>
              ) : (
                <div className="text-center text-muted-foreground h-full flex items-center justify-center pt-20">
                  <div className="text-center">
                    <BookText className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                    <p className="font-medium text-xl">No documentation loaded yet</p>
                    <p className="text-base text-muted-foreground/70 mt-2">
                      Open the dialog to load the documentation
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};

export default ApiDocDialog;

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
import { Download, BookText, Loader2, Copy } from "lucide-react";
import { toast } from "sonner";

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
      <DialogContent className="sm:max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0 pb-4 border-b border-border/30">
          <DialogTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
            <BookText className="h-6 w-6 text-primary" />
            LeetCode API Documentation
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            Comprehensive guide to GraphQL endpoints with detailed schemas, 
            variables, and example responses.
          </DialogDescription>
          
          <div className="flex justify-end gap-3 mt-4">
            <Button 
              variant="outline" 
              onClick={handleDownload}
              className="hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border-border/50 hover:border-primary/30"
            >
              <Download className="h-4 w-4 mr-2" />
              Download as .md
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
              className="hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border-border/50 hover:border-primary/30"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy for LLM
            </Button>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="p-6 markdown-body">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-lg font-medium animate-pulse">Loading documentation...</p>
                <p className="text-sm text-muted-foreground/70 mt-1">
                  Please wait while we fetch the API documentation
                </p>
              </div>
            ) : error ? (
              <div className="text-center">
                <div className="inline-flex flex-col items-center justify-center p-6 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="font-semibold text-destructive mb-2">Error loading document:</p>
                  <p className="text-sm text-destructive/80 mb-4">{error}</p>
                  <Button 
                    variant="outline" 
                    onClick={fetchMarkdown} 
                    size="sm"
                    className="border-destructive/30 text-destructive hover:bg-destructive/10"
                  >
                    Retry Load
                  </Button>
                </div>
              </div>
            ) : markdown ? (
              <ReactMarkdown>{markdown}</ReactMarkdown>
            ) : (
              <div className="text-center text-muted-foreground h-48 flex items-center justify-center">
                <div className="text-center">
                  <BookText className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="font-medium">No documentation loaded yet</p>
                  <p className="text-sm text-muted-foreground/70 mt-1">
                    Open the dialog to load the documentation
                  </p>
                </div>
              </div>
            )}
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

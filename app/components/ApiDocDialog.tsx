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
          className="h-12 px-6 text-base rounded-full shadow-md hover:shadow-lg transition-shadow duration-300"
        >
          <BookText className="h-5 w-5 mr-2" />
          API Documentation
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <BookText className="h-6 w-6 text-primary" />
            LeetCode API Documentation
          </DialogTitle>
          <DialogDescription className="text-md text-muted-foreground mt-2">
            A comprehensive guide to the GraphQL endpoints used in this
            application.
          </DialogDescription>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="secondary" onClick={handleDownload}>
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
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy for LLM Context
            </Button>
          </div>
        </DialogHeader>
        <div className="markdown-body mt-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin text-primary/70 mb-4" />
              <p className="text-lg animate-pulse">Loading documentation...</p>
            </div>
          ) : error ? (
            <div className="text-center text-destructive-foreground bg-destructive/10 p-4 rounded-md">
              <p className="font-semibold">Error loading document:</p>
              <p className="text-sm">{error}</p>
              <Button variant="link" onClick={fetchMarkdown} className="mt-2">
                Retry Load
              </Button>
            </div>
          ) : markdown ? (
            <ReactMarkdown>{markdown}</ReactMarkdown>
          ) : (
            <div className="text-center text-muted-foreground h-48 flex items-center justify-center">
              <p>No documentation loaded yet. Open the dialog to load.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};

export default ApiDocDialog;

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Stars } from "lucide-react";

interface AiDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
}

const examplePrompts = [
  "Count my accepted submissions for 'Two Sum'",
  "Show my 5 most recent accepted solutions",
  "Create a progress tracker for my daily challenges this month",
  "Generate a component to fetch user profile stats",
];

export function AiDialog({ open, onOpenChange, onGenerate, isLoading }: AiDialogProps) {
  const [prompt, setPrompt] = useState("");

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    onGenerate(prompt);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Stars className="h-5 w-5 text-primary" />
            Create a Custom Endpoint with AI
          </DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-6">
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-foreground">Describe what you need</h4>
            <p className="text-sm text-muted-foreground">
              The AI will generate a new endpoint card with the logic to fetch and process the data you want.
            </p>
          </div>
          <Textarea
            value={prompt}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPrompt(e.target.value)}
            placeholder="e.g., 'Get my solved problem count by difficulty'"
            className="h-28"
          />
          <div className="space-y-3">
             <h4 className="font-medium text-sm text-foreground">Or try an example</h4>
            <div className="flex flex-wrap gap-2">
              {examplePrompts.map((p) => (
                <Button key={p} variant="outline" size="sm" onClick={() => setPrompt(p)} className="text-xs">
                  {p}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleGenerate} disabled={isLoading || !prompt.trim()}>
            {isLoading ? "Generating..." : "Generate"}
            <Sparkles className="h-4 w-4 ml-2" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 
import { ExternalLink, Github, Heart, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="mt-20 py-8 border-t border-border bg-background relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="w-48 h-48 bg-primary/20 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob-small top-0 left-1/4"></div>
        <div className="w-48 h-48 bg-accent/20 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob-small animation-delay-2000 bottom-0 right-1/4"></div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="flex flex-col items-center gap-2 mb-4">
          <Heart className="h-6 w-6 text-red-500 fill-current animate-pulse-slow" />
          <p className="text-md font-medium text-foreground">
            Created with love for all users by{" "}
            <a
              href="https://github.com/fyzanshaik"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors cursor-pointer group font-semibold"
            >
              @fyzanshaik
              <span className="block h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </a>
          </p>
        </div>

        <div className="flex justify-center gap-3 mb-6">
          <Button
            asChild
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/20 transition-all duration-200"
          >
            <a
              href="https://github.com/fyzanshaik"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-4 w-4" />
              <span className="text-sm font-medium">GitHub</span>
              <ExternalLink className="h-3 w-3 opacity-70" />
            </a>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/20 transition-all duration-200"
          >
            <a
              href="https://x.com/fyzanshaik"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Twitter className="h-4 w-4" />
              <span className="text-sm font-medium">Twitter</span>
              <ExternalLink className="h-3 w-3 opacity-70" />
            </a>
          </Button>
        </div>

        <div className="pt-6 border-t border-border/50 text-xs text-muted-foreground">
          © {new Date().getFullYear()} CodeQuery. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

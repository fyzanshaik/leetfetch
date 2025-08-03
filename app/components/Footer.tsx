import { ExternalLink, Github, Twitter, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="mt-16 py-8 border-t border-border/30 bg-muted/10">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left side - Creator info */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Built with</span>
            <Heart className="h-4 w-4 text-red-500" />
            <span className="text-muted-foreground">by</span>
            <a
              href="https://github.com/fyzanshaik"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors font-medium"
            >
              @fyzanshaik
            </a>
          </div>

          {/* Right side - Social Links */}
          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="h-8 px-3 text-muted-foreground hover:text-foreground"
            >
              <a
                href="https://github.com/fyzanshaik/leetfetch"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5"
              >
                <Github className="h-4 w-4" />
                <span className="text-xs">GitHub</span>
                <ExternalLink className="h-3 w-3 opacity-60" />
              </a>
            </Button>
            
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="h-8 px-3 text-muted-foreground hover:text-foreground"
            >
              <a
                href="https://x.com/fyzanshaik"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5"
              >
                <Twitter className="h-4 w-4" />
                <span className="text-xs">Twitter</span>
                <ExternalLink className="h-3 w-3 opacity-60" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}

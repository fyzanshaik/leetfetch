import { Badge } from "@/components/ui/badge";
import { Code, Zap, Database } from "lucide-react";

export default function Header() {
  return (
    <header className="relative py-8 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Code className="h-6 w-6 text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent tracking-tight">
            LeetFetch
          </h1>
          <Database className="h-6 w-6 text-accent" />
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          Interactive LeetCode GraphQL API Explorer
        </p>

        <div className="flex items-center justify-center gap-2 flex-wrap">
          <Badge
            variant="outline"
            className="hover:shadow-md transition-all duration-300 px-3 py-1 text-xs font-medium border-primary/20 text-primary"
          >
            <Zap className="h-3 w-3 mr-1.5" />
            Interactive Testing
          </Badge>
          <Badge
            className="hover:shadow-md transition-all duration-300 px-3 py-1 text-xs font-medium bg-gradient-to-r from-primary via-accent to-secondary text-white border-none shadow-sm"
          >
            <Database className="h-3 w-3 mr-1.5" />
            GraphQL Explorer
          </Badge>
        </div>
      </div>
    </header>
  );
}

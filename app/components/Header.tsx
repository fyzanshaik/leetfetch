import { Badge } from "@/components/ui/badge";
import { Code, Zap, Database } from "lucide-react";

export default function Header() {
  return (
    <header className="relative py-20 px-4 overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute top-20 right-20 w-40 h-40 bg-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-1/3 w-28 h-28 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto text-center">
        {/* Main title with tech icons */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <Code className="h-8 w-8 text-primary animate-bounce-gentle" />
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent tracking-tight">
            LeetFetch
          </h1>
          <Database className="h-8 w-8 text-accent animate-bounce-gentle" style={{ animationDelay: '0.5s' }} />
        </div>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-muted-foreground font-medium mb-4 max-w-2xl mx-auto leading-relaxed">
          Interactive LeetCode GraphQL API Explorer
        </p>

        {/* Description */}
        <p className="text-base md:text-lg text-muted-foreground/80 max-w-3xl mx-auto mb-8 leading-relaxed">
          Test endpoints, generate code snippets, and visualize data 
          — all in a clean, modern interface
        </p>

        {/* Feature badges */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Badge
            variant="outline"
            className="hover:shadow-lg hover:scale-[1.02] transition-all duration-300 px-4 py-2 text-sm font-medium border-primary/20 text-primary"
          >
            <Zap className="h-4 w-4 mr-2" />
            Interactive Testing
          </Badge>
          <Badge
            variant="outline"
            className="hover:shadow-lg hover:scale-[1.02] transition-all duration-300 px-4 py-2 text-sm font-medium border-accent/20 text-accent-foreground"
          >
            <Code className="h-4 w-4 mr-2" />
            Code Generation
          </Badge>
          <Badge
            className="hover:shadow-lg hover:scale-[1.02] transition-all duration-300 px-4 py-2 text-sm font-medium bg-gradient-to-r from-primary via-accent to-secondary text-white border-none shadow-md"
          >
            <Database className="h-4 w-4 mr-2" />
            GraphQL Explorer
          </Badge>
        </div>
      </div>
    </header>
  );
}

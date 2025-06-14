import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp } from "lucide-react";
import { ModeToggle } from "./mode-toggle";

export default function Header() {
  return (
    <header className="py-16 text-center relative">
      {" "}
      <div className="absolute top-4 right-4 md:top-6 md:right-6">
        {" "}
        <ModeToggle />
      </div>
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent mb-5 tracking-tight flex items-center justify-center gap-4">
          <TrendingUp className="h-12 w-12 md:h-16 md:w-16 text-orange-500 animate-pulse" />
          LeetFetch
          <Sparkles className="h-12 w-12 md:h-16 md:w-16 text-yellow-400 animate-spin-slow" />
        </h1>
        <p className="text-lg md:text-xl text-slate-700 dark:text-slate-300 max-w-3xl mx-auto font-medium leading-relaxed">
          Unlock LeetCode insights with an interactive API explorer. Get{" "}
          <strong className="text-orange-500">code snippets</strong>, test{" "}
          <strong className="text-red-500">GraphQL endpoints</strong>, and view{" "}
          <strong className="text-blue-500">real-time data</strong>
        </p>

        <div className="flex items-center justify-center gap-3 mt-8 flex-wrap">
          <Badge
            variant="outline"
            className="px-4 py-2 text-md animate-badge-glow border-orange-300 dark:border-orange-700"
          >
            Interactive Testing
          </Badge>
          <Badge
            variant="outline"
            className="px-4 py-2 text-md animate-badge-glow border-blue-300 dark:border-blue-700"
          >
            Multi-Language Snippets
          </Badge>
          <Badge
            className="px-4 py-2 text-md animate-graphql-glow
                       bg-gradient-to-r from-pink-500 to-purple-600 text-white
                       border-none shadow-lg hover:shadow-xl
                       dark:from-pink-600 dark:to-purple-700
                       transition-all duration-300 ease-in-out"
          >
            GraphQL API
          </Badge>
        </div>
      </div>
    </header>
  );
}

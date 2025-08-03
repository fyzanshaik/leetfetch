"use client";

import React, { memo, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Copy, 
  Play, 
  ChevronDown, 
  ChevronUp, 
  Lock, 
  Loader2,
  ArrowRight
} from "lucide-react";
import { Endpoint, ApiResponse, ErrorResponse } from "@/lib/api";
import { generateCodeSnippet } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

interface EndpointCardProps {
  endpoint: Endpoint;
  username: string;
  loading: Record<string, boolean>;
  responses: Record<string, ApiResponse>;
  executeQuery: (endpoint: Endpoint) => Promise<void>;
  copyToClipboard: (text: string) => void;
  isCurrentEndpoint: boolean;
}

const CodeBlock = memo(function CodeBlock({
  code,
  language,
  onCopy,
}: {
  code: string;
  language: string;
  onCopy: (code: string) => void;
}) {
  const highlighterLanguage = useMemo(() => {
    switch (language) {
      case "typescript":
        return "tsx";
      case "python":
        return "python";
      case "golang":
        return "go";
      case "cpp":
        return "cpp";
      case "json":
        return "json";
      default:
        return "graphql";
    }
  }, [language]);

  return (
    <div className="relative group rounded-lg overflow-hidden border border-border/30">
      <SyntaxHighlighter
        language={highlighterLanguage}
        style={dracula}
        showLineNumbers={false}
        wrapLines={true}
        customStyle={{
          margin: 0,
          borderRadius: '0.5rem',
          fontSize: '0.75rem',
          padding: '1rem',
        }}
      >
        {code}
      </SyntaxHighlighter>
      <Button
        size="sm"
        variant="ghost"
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-8 w-8 p-0"
        onClick={() => onCopy(code)}
        aria-label="Copy code"
      >
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  );
});

const EndpointCard = memo(function EndpointCard({
  endpoint,
  username,
  loading,
  responses,
  executeQuery,
  copyToClipboard,
  isCurrentEndpoint,
}: EndpointCardProps) {
  const [isCodeOpen, setIsCodeOpen] = useState(false);
  const IconComponent = endpoint.icon;
  const isLoading = loading[endpoint.id];

  const codeSnippets = useMemo(
    () => ({
      typescript: generateCodeSnippet(endpoint, "typescript", username),
      python: generateCodeSnippet(endpoint, "python", username),
      golang: generateCodeSnippet(endpoint, "golang", username),
      cpp: generateCodeSnippet(endpoint, "cpp", username),
    }),
    [endpoint, username],
  );

  const languages = useMemo(
    () => ["typescript", "python", "golang", "cpp", "graphql"],
    [],
  );

  const tabLabels = useMemo(
    () => ({
      typescript: "TypeScript",
      python: "Python",
      golang: "Go",
      cpp: "C++",
      graphql: "GraphQL",
    }),
    [],
  );

  return (
    <Card className={`glass-effect border-border/30 transition-all duration-300 relative ${
      isCurrentEndpoint ? 'ring-2 ring-primary/50 shadow-lg' : 'hover:shadow-md'
    }`}>
      {/* Connecting Arrow */}
      {isCurrentEndpoint && (
        <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-10 hidden lg:block">
          <div className="flex items-center">
            <div className="w-8 h-0.5 bg-primary animate-pulse"></div>
            <ArrowRight className="h-5 w-5 text-primary animate-pulse" />
          </div>
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Icon */}
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 flex-shrink-0">
              <IconComponent className="h-5 w-5 text-primary" />
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <CardTitle className="text-lg font-semibold text-foreground leading-tight">
                  {endpoint.name}
                </CardTitle>
                {endpoint.requiresAuth && (
                  <Badge variant="outline" className="text-xs px-2 py-0.5 border-amber-400/50 text-amber-600">
                    <Lock className="h-3 w-3 mr-1" />
                    Auth
                  </Badge>
                )}
              </div>
              
              <CardDescription className="text-sm text-muted-foreground leading-relaxed mb-2">
                {endpoint.description}
              </CardDescription>
              
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="secondary" className="text-xs bg-secondary/50 text-secondary-foreground">
                  {endpoint.category}
                </Badge>
                <Badge variant="outline" className="text-xs border-border/50 text-muted-foreground">
                  {endpoint.query}
                </Badge>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Collapsible open={isCodeOpen} onOpenChange={setIsCodeOpen}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 px-3 border-border/50 hover:border-primary/30"
                >
                  {isCodeOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </Collapsible>
            
            <Button
              onClick={() => executeQuery(endpoint)}
              disabled={isLoading || endpoint.requiresAuth}
              size="sm"
              className={`h-9 px-4 font-medium ${
                endpoint.requiresAuth 
                  ? "opacity-60 cursor-not-allowed" 
                  : "bg-gradient-to-r from-primary via-accent to-secondary text-white hover:shadow-md"
              }`}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              {isLoading ? "Testing..." : endpoint.requiresAuth ? "Auth Needed" : "Test"}
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Collapsible Code Section */}
      <Collapsible open={isCodeOpen} onOpenChange={setIsCodeOpen}>
        <CollapsibleContent>
          <CardContent className="pt-0">
            <Tabs defaultValue="typescript" className="w-full">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 bg-muted/30 p-1 rounded-lg h-auto">
                {languages.map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className="text-xs rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200 py-2"
                  >
                    {tabLabels[tab as keyof typeof tabLabels]}
                  </TabsTrigger>
                ))}
              </TabsList>

              {(["typescript", "python", "golang", "cpp"] as const).map((lang) => (
                <TabsContent key={lang} value={lang} className="mt-4">
                  <CodeBlock
                    code={codeSnippets[lang]}
                    language={lang}
                    onCopy={copyToClipboard}
                  />
                </TabsContent>
              ))}

              <TabsContent value="graphql" className="mt-4">
                <CodeBlock
                  code={endpoint.graphql}
                  language="graphql"
                  onCopy={copyToClipboard}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
});

export default EndpointCard;

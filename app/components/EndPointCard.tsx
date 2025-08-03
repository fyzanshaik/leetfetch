"use client";

import React, { memo, useMemo } from "react";
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
import { Separator } from "@/components/ui/separator";
import { Copy, Play, Code, AlertTriangle, Loader2, CheckCircle, Lock } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Endpoint, ApiResponse, ErrorResponse } from "@/lib/api";
import { generateCodeSnippet } from "@/lib/utils";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

interface EndpointCardProps {
  endpoint: Endpoint;
  username: string;
  loading: Record<string, boolean>;
  responses: Record<string, ApiResponse>;
  executeQuery: (endpoint: Endpoint) => Promise<void>;
  copyToClipboard: (text: string) => void;
}

const CodeBlock = memo(function CodeBlock({
  code,
  language,
  showCopy = true,
  onCopy,
}: {
  code: string;
  language: string;
  showCopy?: boolean;
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
        showLineNumbers={true}
        wrapLines={true}
        customStyle={{
          margin: 0,
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
        }}
      >
        {code}
      </SyntaxHighlighter>
      {showCopy && (
        <Button
          size="sm"
          variant="ghost"
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-8 w-8 p-0"
          onClick={() => onCopy(code)}
          aria-label="Copy code"
        >
          <Copy className="h-4 w-4" />
        </Button>
      )}
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
}: EndpointCardProps) {
  const IconComponent = endpoint.icon;
  const currentResponse = responses[endpoint.id];
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

  const isErrorResponse = useMemo(
    () =>
      currentResponse &&
      "error" in currentResponse &&
      (currentResponse as ErrorResponse).error,
    [currentResponse],
  );

  const formattedResponse = useMemo(
    () =>
      currentResponse && !isErrorResponse
        ? JSON.stringify(currentResponse, null, 2)
        : "",
    [currentResponse, isErrorResponse],
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
    <Card className="glass-effect hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border-border/30 overflow-hidden animate-fade-in-up">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-20 rounded-lg">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-primary" />
            <p className="text-lg font-medium text-foreground">Testing API...</p>
            <p className="text-sm text-muted-foreground mt-1">
              Please wait while we fetch the data
            </p>
          </div>
        </div>
      )}

      {/* Card Header */}
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            {/* Icon */}
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 flex-shrink-0">
              <IconComponent className="h-6 w-6 text-primary" />
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <CardTitle className="text-xl font-semibold text-foreground leading-tight">
                  {endpoint.name}
                </CardTitle>
                {endpoint.requiresAuth && (
                  <Badge variant="outline" className="text-xs px-2 py-0.5 border-amber-400/50 text-amber-600 dark:text-amber-400">
                    <Lock className="h-3 w-3 mr-1" />
                    Auth Required
                  </Badge>
                )}
              </div>
              
              <CardDescription className="text-base text-muted-foreground leading-relaxed mb-3">
                {endpoint.description}
              </CardDescription>
              
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-secondary/50 text-secondary-foreground">
                  {endpoint.category}
                </Badge>
                <Badge variant="outline" className="border-border/50 text-muted-foreground">
                  {endpoint.query}
                </Badge>
                {currentResponse && !isErrorResponse && (
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Success
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Test Button */}
          <Button
            onClick={() => executeQuery(endpoint)}
            disabled={isLoading || endpoint.requiresAuth}
            className={`hover:shadow-lg hover:scale-[1.02] transition-all duration-300 min-w-[120px] h-11 font-medium ${
              endpoint.requiresAuth 
                ? "opacity-60 cursor-not-allowed" 
                : "bg-gradient-to-r from-primary via-accent to-secondary text-white shadow-md hover:shadow-lg"
            }`}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Play className="h-4 w-4 mr-2" />
            )}
            {isLoading ? "Testing..." : endpoint.requiresAuth ? "Auth Needed" : "Test API"}
          </Button>
        </div>
      </CardHeader>

      {/* Card Content */}
      <CardContent className="pt-0">
        <Tabs defaultValue="typescript" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 bg-muted/30 p-1 rounded-lg">
            {languages.map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="text-sm rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200"
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

        {/* API Response */}
        {currentResponse && (
          <>
            <Separator className="my-6" />
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-lg flex items-center gap-2 text-foreground">
                  <Code className="h-5 w-5 text-primary" />
                  API Response
                </h4>
                {!isErrorResponse && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                    onClick={() => copyToClipboard(formattedResponse)}
                    aria-label="Copy response"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                )}
              </div>
              
              {isErrorResponse ? (
                <Alert variant="destructive" className="border-destructive/50">
                  <AlertTriangle className="h-5 w-5" />
                  <AlertTitle className="font-semibold mb-1">
                    {(currentResponse as ErrorResponse).message}
                  </AlertTitle>
                  <AlertDescription className="text-sm">
                    {(currentResponse as ErrorResponse).details}
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="border border-border/30 rounded-lg overflow-hidden">
                  <ScrollArea className="h-64 w-full">
                    <CodeBlock
                      code={formattedResponse}
                      language="json"
                      showCopy={false}
                      onCopy={copyToClipboard}
                    />
                  </ScrollArea>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
});

export default EndpointCard;

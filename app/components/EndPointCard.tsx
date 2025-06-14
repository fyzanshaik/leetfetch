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
import { Copy, Play, Code, AlertTriangle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Endpoint, ApiResponse, ErrorResponse } from "@/lib/api";
import { generateCodeSnippet } from "@/lib/utils";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { vs } from "react-syntax-highlighter/dist/esm/styles/prism";

import { useTheme } from "next-themes";

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
  const { theme } = useTheme();
  const highlighterTheme = theme === "dark" ? dracula : vs;

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
    <div className="relative group rounded-lg overflow-hidden border border-border">
      <SyntaxHighlighter
        language={highlighterLanguage}
        style={highlighterTheme}
        showLineNumbers={true}
        wrapLines={true}
      >
        {code}
      </SyntaxHighlighter>
      {showCopy && (
        <Button
          size="sm"
          variant="ghost"
          className="absolute top-2 right-2 text-white/70 hover:text-white dark:text-muted-foreground/70 dark:hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20"
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
      graphql: "GraphQL Query",
    }),
    [],
  );

  return (
    <Card
      className={`
        overflow-hidden border border-border rounded-xl relative
        transition-all duration-300 ease-out
        hover:shadow-xl hover:border-primary/50 dark:hover:border-primary/50
        animation-fade-in-up
        group
      `}
    >
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-20 rounded-xl animate-fade-in">
          <div className="text-center text-primary animate-pulse">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
            <p className="text-xl font-semibold ">Testing API endpoint...</p>
            <p className="text-muted-foreground text-sm mt-2">
              Please wait, this might take a moment.
            </p>
          </div>
        </div>
      )}

      <CardHeader
        className={`
          p-5 sm:p-6 pb-4
          bg-gradient-to-br from-orange-100/70 to-red-100/70 dark:from-orange-950/70 dark:to-red-950/70
          flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4
          rounded-t-xl border-b border-border/50
        `}
      >
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div
            className={`
              p-3 rounded-full bg-orange-200/80 dark:bg-orange-800/80
              flex-shrink-0 shadow-lg
              transition-transform duration-300 hover:scale-110 active:scale-95
            `}
          >
            <IconComponent className="h-7 w-7 text-orange-700 dark:text-orange-300" />
          </div>
          <div className="flex flex-col min-w-0 flex-grow">
            <CardTitle className="text-xl font-extrabold flex items-center gap-2 mb-1 leading-tight">
              {endpoint.name}
              {endpoint.requiresAuth && (
                <Badge
                  variant="outline"
                  className="text-xs px-2 py-0.5 border-orange-400 text-orange-700 dark:border-orange-600 dark:text-orange-400 font-semibold"
                >
                  Auth Required
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground leading-snug mb-2 pr-4">
              {endpoint.description}
            </CardDescription>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge
                variant="secondary"
                className="bg-accent text-accent-foreground rounded-full px-3 py-1 text-sm font-medium shadow-sm"
              >
                Category: {endpoint.category}
              </Badge>
              <Badge
                variant="outline"
                className="border-dashed rounded-full px-3 py-1 text-sm font-medium shadow-sm"
              >
                Operation: {endpoint.query}
              </Badge>
            </div>
          </div>
        </div>

        <Button
          onClick={() => executeQuery(endpoint)}
          disabled={isLoading || endpoint.requiresAuth}
          className={`
            min-w-[140px] h-11 px-6 text-base font-semibold rounded-full
            bg-primary text-primary-foreground hover:bg-primary/95 focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background
            shadow-lg transition-all duration-300 transform active:scale-95
            flex-shrink-0
            ${endpoint.requiresAuth && "opacity-60 cursor-not-allowed"}
          `}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
          ) : (
            <Play className="h-5 w-5 mr-2" />
          )}
          {isLoading
            ? "Fetching..."
            : endpoint.requiresAuth
              ? "Auth Needed"
              : "Test API"}
        </Button>
      </CardHeader>

      <CardContent className="p-5 sm:p-6 pt-4">
        <Tabs defaultValue="typescript" className="w-full">
          <TabsList
            className="grid w-full grid-cols-2 sm:grid-cols-5 h-auto rounded-lg
             bg-muted text-muted-foreground p-1 gap-1"
          >
            {languages.map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="h-10 text-sm rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground
                  transition-colors duration-200 whitespace-nowrap overflow-hidden text-ellipsis"
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

        {currentResponse && (
          <>
            <Separator className="my-6 bg-border/70" />
            <div className="animation-fade-in-up">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-lg flex items-center gap-2 text-primary">
                  <Code className="h-5 w-5" />
                  API Response
                </h4>
                {!isErrorResponse && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
                    onClick={() => copyToClipboard(formattedResponse)}
                    aria-label="Copy response"
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                )}
              </div>
              {isErrorResponse ? (
                <Alert
                  variant="destructive"
                  className="flex items-start p-4 rounded-lg border-2 border-destructive-dark shadow-md"
                >
                  <AlertTriangle className="h-6 w-6 mt-0.5 flex-shrink-0 text-destructive-foreground/90" />
                  <div className="ml-4 flex-1">
                    <AlertTitle className="font-bold text-lg leading-tight mb-1">
                      Error: {(currentResponse as ErrorResponse).message}
                    </AlertTitle>
                    <AlertDescription className="text-sm text-destructive-foreground/80">
                      {(currentResponse as ErrorResponse).details}
                    </AlertDescription>
                  </div>
                </Alert>
              ) : (
                <ScrollArea className="h-64 w-full border border-border rounded-lg shadow-inner bg-card">
                  <CodeBlock
                    code={formattedResponse}
                    language="json"
                    showCopy={false}
                    onCopy={copyToClipboard}
                  />
                </ScrollArea>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
});

export default EndpointCard;

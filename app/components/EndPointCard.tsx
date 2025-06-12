"use client";

import React from "react";
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
import { Copy, Play, Code, AlertCircle, Loader2 } from "lucide-react";
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

const EndpointCard: React.FC<EndpointCardProps> = ({
  endpoint,
  username,
  loading,
  responses,
  executeQuery,
  copyToClipboard,
}) => {
  const IconComponent = endpoint.icon;
  const currentResponse = responses[endpoint.id];
  const isLoading = loading[endpoint.id];

  const CodeBlock: React.FC<{
    code: string;
    language: string;
    showCopy?: boolean;
  }> = ({ code, language, showCopy = true }) => {
    const highlighterLanguage =
      language === "typescript"
        ? "tsx"
        : language === "python"
          ? "python"
          : language === "golang"
            ? "go"
            : language === "cpp"
              ? "cpp"
              : "graphql";

    const codeBlockBackground: string = String(
      dracula['pre[class*="language-"]'].background,
    );
    const lineNumberColor: string =
      String(dracula['code[class*="language-"]'].color) + "80";

    return (
      <div className="relative group">
        <SyntaxHighlighter
          language={highlighterLanguage}
          style={dracula}
          showLineNumbers={true}
          wrapLines={true}
          customStyle={{
            borderRadius: "0.5rem",
            padding: "1.25rem",
            fontSize: "0.875rem",
            lineHeight: "1.5",
            fontFamily: "var(--font-mono)",
            backgroundColor: codeBlockBackground,
            border: `1px solid ${codeBlockBackground}80`,
            boxShadow: `0 4px 10px rgba(0,0,0,0.3)`,
          }}
          lineNumberStyle={{
            color: lineNumberColor,
            minWidth: "2.5em",
            paddingRight: "1em",
            userSelect: "none",
            backgroundColor: codeBlockBackground,
          }}
        >
          {code}
        </SyntaxHighlighter>
        {showCopy && (
          <Button
            size="sm"
            variant="ghost"
            className="absolute top-2 right-2 text-white/50 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            onClick={() => copyToClipboard(code)}
            aria-label="Copy code"
          >
            <Copy className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  };

  return (
    <Card
      className={`
        overflow-hidden border border-border rounded-xl
        transition-all duration-300 ease-out
        hover:shadow-lg hover:border-primary/50 dark:hover:border-primary/50
        animation-fade-in-up
      `}
    >
      <CardHeader
        className={`
          p-5 sm:p-6 pb-4
          bg-gradient-to-br from-orange-100/70 to-red-100/70 dark:from-orange-950/70 dark:to-red-950/70
          flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4
          rounded-t-xl
        `}
      >
        <div className="flex items-start gap-4 flex-1">
          <div
            className={`
              p-3 rounded-full bg-orange-200/70 dark:bg-orange-800/70
              flex-shrink-0 shadow-md
              transition-transform duration-300 hover:scale-110
            `}
          >
            <IconComponent className="h-6 w-6 text-orange-700 dark:text-orange-300" />
          </div>
          <div className="flex flex-col min-w-0">
            {" "}
            <CardTitle className="text-xl font-extrabold flex items-center gap-2 mb-1">
              {endpoint.name}
              {endpoint.requiresAuth && (
                <Badge
                  variant="outline"
                  className="text-xs px-2 py-0.5 border-orange-400 text-orange-700 dark:border-orange-600 dark:text-orange-400"
                >
                  Auth Required
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground leading-snug mb-2">
              {endpoint.description}
            </CardDescription>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge
                variant="secondary"
                className="bg-accent text-accent-foreground rounded-full px-3 py-1 text-sm font-medium"
              >
                {endpoint.category}
              </Badge>
              <Badge
                variant="outline"
                className="border-dashed rounded-full px-3 py-1 text-sm font-medium"
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
            min-w-[120px] h-10 px-5 text-base font-semibold rounded-full
            bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-2 focus:ring-primary/50
            shadow-md transition-all duration-300 transform active:scale-95
            flex-shrink-0 // Essential to prevent the button from shrinking
          `}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
          ) : (
            <Play className="h-5 w-5 mr-2" />
          )}
          {isLoading ? "Fetching..." : "Test API"}
        </Button>
      </CardHeader>

      <CardContent className="p-5 sm:p-6 pt-4">
        <Tabs defaultValue="typescript" className="w-full">
          <TabsList
            className="grid w-full grid-cols-2 md:grid-cols-5 h-auto rounded-lg
             bg-muted text-muted-foreground p-1 gap-1
             "
          >
            {["typescript", "python", "golang", "cpp", "graphql"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="h-9 text-sm rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground
                  transition-colors duration-200"
              >
                {tab === "typescript"
                  ? "TS"
                  : tab === "python"
                    ? "Py"
                    : tab === "golang"
                      ? "Go"
                      : tab === "cpp"
                        ? "C++"
                        : "GraphQL"}
              </TabsTrigger>
            ))}
          </TabsList>

          {["typescript", "python", "golang", "cpp"].map((lang) => (
            <TabsContent key={lang} value={lang} className="mt-4">
              <CodeBlock
                code={generateCodeSnippet(endpoint, lang, username)}
                language={lang}
              />
            </TabsContent>
          ))}

          <TabsContent value="graphql" className="mt-4">
            <CodeBlock code={endpoint.graphql} language="graphql" />
          </TabsContent>
        </Tabs>

        {currentResponse && (
          <>
            <Separator className="my-6 bg-border" />
            <div className="animation-fade-in-up">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-lg flex items-center gap-2 text-primary">
                  <Code className="h-5 w-5" />
                  API Response
                </h4>
                {"error" in currentResponse &&
                (currentResponse as ErrorResponse).error ? null : (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-muted-foreground hover:text-primary"
                    onClick={() =>
                      copyToClipboard(
                        String(JSON.stringify(currentResponse, null, 2)),
                      )
                    }
                    aria-label="Copy response"
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                )}
              </div>
              {"error" in currentResponse &&
              (currentResponse as ErrorResponse).error ? (
                <Alert
                  variant="destructive"
                  className="flex items-start p-3 rounded-lg"
                >
                  <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div className="ml-4 flex-1">
                    <AlertTitle>
                      Error: {(currentResponse as ErrorResponse).message}
                    </AlertTitle>
                    <AlertDescription className="text-sm text-destructive-foreground/80 mt-1">
                      {(currentResponse as ErrorResponse).details}
                    </AlertDescription>
                  </div>
                </Alert>
              ) : (
                <ScrollArea className="h-64 w-full border border-border rounded-lg shadow-inner">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full p-4 text-muted-foreground">
                      <Loader2 className="h-8 w-8 animate-spin text-primary/70 mb-4" />
                      <p className="text-lg animate-pulse">
                        Loading response...
                      </p>
                    </div>
                  ) : (
                    <pre className="bg-background text-foreground p-4 text-sm overflow-x-auto font-mono">
                      <code>
                        {String(JSON.stringify(currentResponse, null, 2))}
                      </code>
                    </pre>
                  )}
                </ScrollArea>
              )}
            </div>
          </>
        )}

        {isLoading && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl">
            <div className="text-center text-primary">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
              <p className="text-xl font-semibold animate-pulse">
                Testing API endpoint...
              </p>
              <p className="text-muted-foreground text-sm mt-2">
                This might take a moment.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EndpointCard;

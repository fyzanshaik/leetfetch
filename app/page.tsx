"use client";

import { useState, useMemo, useCallback } from "react";
import { toast } from "sonner";
import {
  endpoints,
  limitedEndpoints,
  Endpoint,
  ApiResponse,
  ErrorResponse,
} from "@/lib/api";
import EndpointCard from "./components/EndPointCard";
import ApiDocDialog from "./components/ApiDocDialog";
import { EndpointListDialog } from "./components/EndpointListDialog";
import { CircuitLines } from "./components/CircuitLines";
import { ShieldCheck, Code, Copy, AlertTriangle, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { ReactScan } from "./components/ReactScan";

export default function CodeQueryApp() {
  const [username, setUsername] = useState("fyzxnshxik");
  const [responses, setResponses] = useState<Record<string, ApiResponse>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [currentEndpoint, setCurrentEndpoint] = useState<string | null>(null);

  const displayedEndpoints = useMemo(() => [...endpoints, ...limitedEndpoints], []);
  const isLoading = currentEndpoint ? loading[currentEndpoint] ?? false : false;

  const executeQuery = useCallback(
    async (endpoint: Endpoint) => {
      if (endpoint.requiresAuth) {
        toast.error("Authentication Required", {
          description:
            "This endpoint requires authentication which is not supported in this demo.",
        });
        return;
      }

      const requiresUsername = Object.keys(endpoint.variables).includes(
        "username",
      );

      if (!username.trim() && requiresUsername) {
        toast.error("Username Required", {
          description: "Please enter a username to test this API endpoint",
        });
        return;
      }

      setCurrentEndpoint(endpoint.id);
      setLoading((prev) => ({ ...prev, [endpoint.id]: true }));

      try {
        let variables: Record<string, string | number> = {};

        switch (endpoint.id) {
          case "problemProgress":
            variables = { userSlug: username };
            break;
          case "recentSubmissions":
            variables = { username, limit: 20 };
            break;
          case "challengeMedal":
            variables = {
              year: new Date().getFullYear(),
              month: new Date().getMonth() + 1,
            };
            break;
          default:
            if (requiresUsername) {
              variables = { username };
            }
        }

        const response = await fetch("/api/leetcode", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: endpoint.graphql,
            variables,
            operationName: endpoint.query,
          }),
        });

        const data = await response.json();

        if (
          "errors" in data &&
          Array.isArray(data.errors) &&
          data.errors.length > 0
        ) {
          throw new Error(data.errors[0]?.message || "GraphQL error occurred");
        }

        setResponses((prev) => ({ ...prev, [endpoint.id]: data }));

        toast.success("Query Executed", {
          description: `Successfully fetched ${endpoint.name}`,
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";

        toast.error("API Error", {
          description: `Failed to fetch ${endpoint.name}: ${errorMessage}`,
        });

        setResponses((prev) => ({
          ...prev,
          [endpoint.id]: {
            error: true,
            message: errorMessage,
            details:
              "This might be due to network issues, the user not existing on LeetCode, or the endpoint requiring authentication.",
          } as ErrorResponse,
        }));

        console.error("Error:", error);
      } finally {
        setLoading((prev) => ({ ...prev, [endpoint.id]: false }));
      }
    },
    [username],
  );

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    toast("Copied", {
      description: "Code snippet copied to clipboard",
    });
  }, []);

  const currentResponse = currentEndpoint ? responses[currentEndpoint] : null;
  const isErrorResponse = currentResponse && "error" in currentResponse && (currentResponse as ErrorResponse).error;
  const formattedResponse = currentResponse && !isErrorResponse ? JSON.stringify(currentResponse, null, 2) : "";

  return (
    <div className="min-h-screen pt-6">
      <CircuitLines
        currentEndpointId={currentEndpoint}
        isLoading={isLoading}
      />
      <section className="py-6 px-4">
        <div className="max-w-[1800px] mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-7 gap-20">
            <div className="xl:col-span-4 space-y-8">
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-bold text-foreground mb-3">
                      Leetcode API Endpoints
                    </h2>
                    <div className="flex items-center gap-4 flex-wrap">
                      <Badge variant="secondary" className="px-4 py-2 text-sm font-medium bg-primary/10 text-primary">
                        <Settings className="h-4 w-4 mr-2" />
                        {displayedEndpoints.length} endpoints available
                      </Badge>
                      <div className="flex items-center gap-3">
                        <ApiDocDialog />
                        <EndpointListDialog endpoints={displayedEndpoints} />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/30 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <p className="text-sm text-green-700 dark:text-green-300">
                      All API requests are securely proxied through{" "}
                      <code className="bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded text-xs font-mono">
                        https://leetcode.com/graphql/
                      </code>
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {displayedEndpoints.map((endpoint, index) => (
                  <EndpointCard
                    key={endpoint.id}
                    endpoint={endpoint}
                    username={username}
                    isLoading={loading[endpoint.id] ?? false}
                    executeQuery={executeQuery}
                    copyToClipboard={copyToClipboard}
                    isCurrentEndpoint={currentEndpoint === endpoint.id}
                    cardIndex={index}
                  />
                ))}
              </div>
            </div>

            <div className="xl:col-span-3">
              <div className="sticky top-8">
                <Card className="glass-effect border-border/30" id="output-box">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Code className="h-6 w-6 text-primary" />
                      Output Console
                    </CardTitle>
                    
                    <div className="space-y-3 pt-3">
                      <label className="text-sm font-medium text-muted-foreground">
                        LeetCode Username
                      </label>
                      <Input
                        placeholder="fysxnshxik"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="h-10 text-sm"
                      />
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    {isLoading ? (
                      <div className="flex items-center justify-center h-96">
                        <ReactScan />
                      </div>
                    ) : currentResponse ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-foreground text-sm">
                            {currentEndpoint && displayedEndpoints.find(e => e.id === currentEndpoint)?.name}
                          </h4>
                          {!isErrorResponse && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(formattedResponse)}
                              className="text-muted-foreground hover:text-foreground h-8 px-2"
                            >
                              <Copy className="h-3 w-3 mr-1" />
                              Copy
                            </Button>
                          )}
                        </div>
                        
                        <Separator />
                        
                        {isErrorResponse ? (
                          <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle className="text-sm font-medium">
                              {(currentResponse as ErrorResponse).message}
                            </AlertTitle>
                            <AlertDescription className="text-xs mt-1">
                              {(currentResponse as ErrorResponse).details}
                            </AlertDescription>
                          </Alert>
                        ) : (
                          <ScrollArea className="h-96 w-full border border-border/30 rounded-lg">
                            <div className="p-3">
                              <SyntaxHighlighter
                                language="json"
                                style={dracula}
                                showLineNumbers={false}
                                customStyle={{
                                  margin: 0,
                                  background: 'transparent',
                                  fontSize: '0.875rem',
                                }}
                              >
                                {formattedResponse}
                              </SyntaxHighlighter>
                            </div>
                          </ScrollArea>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="font-medium mb-2 text-sm">No data yet</p>
                        <p className="text-xs text-muted-foreground/70">
                          Click &quot;Test&quot; on any endpoint to see results here
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

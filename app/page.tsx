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
import UserInput from "./components/UserInput";
import EndpointCard from "./components/EndPointCard";
import ApiDocDialog from "./components/ApiDocDialog";
import { ShieldCheck, Code, Play, Copy, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function CodeQueryApp() {
  const [username, setUsername] = useState("");
  const [responses, setResponses] = useState<Record<string, ApiResponse>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [showLimitedEndpoints, setShowLimitedEndpoints] = useState(false);
  const [currentEndpoint, setCurrentEndpoint] = useState<string | null>(null);

  const displayedEndpoints = useMemo(
    () => [...endpoints, ...(showLimitedEndpoints ? limitedEndpoints : [])],
    [showLimitedEndpoints],
  );

  const handleUsernameChange = useCallback((value: string) => {
    setUsername(value);
  }, []);

  const handleShowLimitedEndpointsToggle = useCallback((value: boolean) => {
    setShowLimitedEndpoints(value);
  }, []);

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
          case "streakCounter":
          case "currentTimestamp":
          case "dailyChallenge":
          case "upcomingContests":
            variables = {};
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
    <div className="min-h-screen">
      {/* Security Notice */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="glass-effect p-4 rounded-lg border border-border/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-grow text-center sm:text-left">
              <ShieldCheck className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                All API requests are securely proxied through our endpoint to{" "}
                <code className="bg-muted px-2 py-1 rounded text-xs font-mono text-primary">
                  https://leetcode.com/graphql/
                </code>
              </p>
            </div>
            <ApiDocDialog />
          </div>
        </div>
      </section>

      {/* User Input Section */}
      <UserInput
        username={username}
        setUsername={handleUsernameChange}
        displayedEndpoints={displayedEndpoints}
        setShowLimitedEndpoints={handleShowLimitedEndpointsToggle}
        showLimitedEndpoints={showLimitedEndpoints}
      />

      {/* Main Content Area */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Side - Endpoint Cards */}
            <div className="lg:col-span-2 space-y-6">
              <div className="text-center lg:text-left mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-3">
                  API Endpoints
                </h2>
                <p className="text-lg text-muted-foreground">
                  {displayedEndpoints.length} endpoints available for testing
                </p>
              </div>

              <div className="space-y-4">
                {displayedEndpoints.map((endpoint) => (
                  <EndpointCard
                    key={endpoint.id}
                    endpoint={endpoint}
                    username={username}
                    loading={loading}
                    responses={responses}
                    executeQuery={executeQuery}
                    copyToClipboard={copyToClipboard}
                    isCurrentEndpoint={currentEndpoint === endpoint.id}
                  />
                ))}
              </div>
            </div>

            {/* Right Side - Sticky Output Box */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <Card className="glass-effect border-border/30">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Code className="h-5 w-5 text-primary" />
                      Output Console
                    </CardTitle>
                    {username && (
                      <p className="text-sm text-muted-foreground">
                        Testing for: <code className="bg-muted px-1 py-0.5 rounded font-mono text-primary">{username}</code>
                      </p>
                    )}
                  </CardHeader>
                  <CardContent>
                    {currentResponse ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-foreground">
                            {currentEndpoint && displayedEndpoints.find(e => e.id === currentEndpoint)?.name}
                          </h4>
                          {!isErrorResponse && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(formattedResponse)}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <Copy className="h-4 w-4 mr-1" />
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
                                  fontSize: '0.75rem',
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
                        <p className="font-medium mb-2">No data yet</p>
                        <p className="text-sm text-muted-foreground/70">
                          Click "Test API" on any endpoint to see results here
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

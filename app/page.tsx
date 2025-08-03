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
import CategoryFilters from "./components/CategoryFilters";
import EndpointCard from "./components/EndPointCard";
import ApiDocDialog from "./components/ApiDocDialog";
import { ShieldCheck, Sprout } from "lucide-react";

export default function CodeQueryApp() {
  const [username, setUsername] = useState("");
  const [responses, setResponses] = useState<Record<string, ApiResponse>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [showLimitedEndpoints, setShowLimitedEndpoints] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const displayedEndpoints = useMemo(
    () => [...endpoints, ...(showLimitedEndpoints ? limitedEndpoints : [])],
    [showLimitedEndpoints],
  );

  const allCategories = useMemo(
    () => [...new Set(displayedEndpoints.map((e) => e.category))].sort(),
    [displayedEndpoints],
  );

  const filteredEndpoints = useMemo(
    () =>
      selectedCategory
        ? displayedEndpoints.filter(
            (endpoint) => endpoint.category === selectedCategory,
          )
        : displayedEndpoints,
    [displayedEndpoints, selectedCategory],
  );

  const handleUsernameChange = useCallback((value: string) => {
    setUsername(value);
  }, []);

  const handleShowLimitedEndpointsToggle = useCallback((value: boolean) => {
    setShowLimitedEndpoints(value);
  }, []);

  const handleCategoryChange = useCallback((category: string | null) => {
    setSelectedCategory(category);
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

  return (
    <div className="min-h-screen">
      {/* Security Notice */}
      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
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

      {/* Category Filters */}
      <CategoryFilters
        categories={allCategories}
        selectedCategory={selectedCategory}
        setSelectedCategory={handleCategoryChange}
      />

      {/* API Endpoints */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Sprout className="h-6 w-6 text-primary" />
              <h2 className="text-3xl font-bold text-foreground">
                Available API Endpoints
              </h2>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore {filteredEndpoints.length} carefully curated GraphQL endpoints 
              to access LeetCode's data and insights
            </p>
          </div>

          <div className="grid gap-8">
            {filteredEndpoints.length > 0 ? (
              filteredEndpoints.map((endpoint) => (
                <EndpointCard
                  key={endpoint.id}
                  endpoint={endpoint}
                  username={username}
                  loading={loading}
                  responses={responses}
                  executeQuery={executeQuery}
                  copyToClipboard={copyToClipboard}
                />
              ))
            ) : (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <Sprout className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-lg text-muted-foreground font-medium mb-2">
                    No endpoints found
                  </p>
                  <p className="text-sm text-muted-foreground/80">
                    Try selecting a different category or show all endpoints
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

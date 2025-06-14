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
import Header from "./components/Header";
import UserInput from "./components/UserInput";
import Footer from "./components/Footer";
import CategoryFilters from "./components/CategoryFilters";
import EndpointCard from "./components/EndPointCard";
import ApiDocDialog from "./components/ApiDocDialog";
import { ShieldCheck } from "lucide-react";

export default function CodeQueryApp() {
  const [username, setUsername] = useState("");
  const [responses, setResponses] = useState<Record<string, ApiResponse>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [showLimitedEndpoints, setShowLimitedEndpoints] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Memoize expensive computations
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

  // Memoize callback functions for UserInput
  const handleUsernameChange = useCallback((value: string) => {
    setUsername(value);
  }, []);

  const handleShowLimitedEndpointsToggle = useCallback((value: boolean) => {
    setShowLimitedEndpoints(value);
  }, []);

  // Memoize callback functions for CategoryFilters
  const handleCategoryChange = useCallback((category: string | null) => {
    setSelectedCategory(category);
  }, []);

  // Memoize main callback functions
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
    <div className="min-h-screen text-foreground relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-40 dark:opacity-20">
        <div className="w-96 h-96 bg-primary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob-page top-10 left-10 absolute"></div>
        <div className="w-80 h-80 bg-accent/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob-page animation-delay-2000 absolute top-1/2 right-10 -translate-y-1/2"></div>
        <div className="w-72 h-72 bg-orange-400/30 dark:bg-orange-800/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob-page animation-delay-4000 absolute bottom-10 left-1/4"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <Header />

        <div className="bg-card border border-border rounded-lg p-3 sm:p-4 mb-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-grow sm:text-left text-center">
            <ShieldCheck className="h-5 w-5 text-green-500 flex-shrink-0" />
            <p className="text-sm text-muted-foreground leading-snug">
              All API requests are proxied through a{" "}
              <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">
                secure
              </code>{" "}
              endpoint to{" "}
              <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">
                https://leetcode.com/graphql/
              </code>
              .
            </p>
          </div>
          <div className="flex-shrink-0">
            <ApiDocDialog />
          </div>
        </div>

        <UserInput
          username={username}
          setUsername={handleUsernameChange}
          displayedEndpoints={displayedEndpoints}
          setShowLimitedEndpoints={handleShowLimitedEndpointsToggle}
          showLimitedEndpoints={showLimitedEndpoints}
        />

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-primary">
            Category Filters
          </h2>
          <CategoryFilters
            categories={allCategories}
            selectedCategory={selectedCategory}
            setSelectedCategory={handleCategoryChange}
          />
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
            <p className="text-center text-muted-foreground text-lg py-10">
              No endpoints found for the selected category.
            </p>
          )}
        </div>

        <Footer />
      </div>
    </div>
  );
}

"use client";

import { memo, useState, useEffect, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CardHeader,
  Card,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Settings, Eye, EyeOff } from "lucide-react";
import { Endpoint } from "@/lib/api";
import { EndpointListDialog } from "./EndpointListDialog";

interface UserInputProps {
  username: string;
  setUsername: (value: string) => void;
  displayedEndpoints: Endpoint[];
  setShowLimitedEndpoints: (value: boolean) => void;
  showLimitedEndpoints: boolean;
}

const UserInput = memo(function UserInput({
  username,
  setUsername,
  displayedEndpoints,
  setShowLimitedEndpoints,
  showLimitedEndpoints,
}: UserInputProps) {
  const [localUsername, setLocalUsername] = useState(username);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localUsername !== username) {
        setUsername(localUsername);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [localUsername, username, setUsername]);

  useEffect(() => {
    if (username !== localUsername) {
      setLocalUsername(username);
    }
  }, [username]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalUsername(e.target.value);
    },
    [],
  );

  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="glass-effect hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border-primary/10">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Search className="h-5 w-5 text-primary" />
              <CardTitle className="text-2xl font-semibold text-foreground">
                Configuration
              </CardTitle>
            </div>
            <CardDescription className="text-base text-muted-foreground max-w-2xl mx-auto">
              Enter a LeetCode username to start testing GraphQL API endpoints
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Username Input */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Search className="h-4 w-4 text-primary" />
                LeetCode Username
              </label>
              <div className="relative">
                <Input
                  placeholder="fysxnshxik"
                  value={localUsername}
                  onChange={handleInputChange}
                  className="pl-10 h-12 text-base border-border/50 focus:border-primary/50 focus:ring-primary/20"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                Find your username at{" "}
                <code className="bg-muted px-2 py-1 rounded text-primary font-mono">
                  leetcode.com/u/your-username/
                </code>
              </p>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/30">
              <div className="flex items-center gap-3 flex-wrap">
                <Badge 
                  variant="secondary" 
                  className="px-3 py-1.5 text-sm font-medium bg-primary/10 text-primary border-primary/20"
                >
                  <Settings className="h-3 w-3 mr-1.5" />
                  {displayedEndpoints.length} Endpoints
                </Badge>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowLimitedEndpoints(!showLimitedEndpoints)}
                  className="hover:shadow-lg hover:scale-[1.02] transition-all duration-300 text-sm font-medium border-border/50 hover:border-primary/30"
                >
                  {showLimitedEndpoints ? (
                    <EyeOff className="h-4 w-4 mr-2" />
                  ) : (
                    <Eye className="h-4 w-4 mr-2" />
                  )}
                  {showLimitedEndpoints
                    ? "Hide Limited"
                    : "Show All"}
                </Button>
              </div>
              
              <EndpointListDialog endpoints={displayedEndpoints} />
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
});

export default UserInput;

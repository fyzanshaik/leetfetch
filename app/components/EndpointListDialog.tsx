import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Endpoint } from "@/lib/api";
import { List as ListIcon, Leaf, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import React, { memo } from "react";

interface EndpointListDialogProps {
  endpoints: Endpoint[];
}

export const EndpointListDialog = memo(function EndpointListDialog({
  endpoints,
}: EndpointListDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="nature-button border-border/50 hover:border-primary/30 font-medium"
        >
          <ListIcon className="h-4 w-4 mr-2" />
          View All Endpoints
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col p-0">
        <div className="p-6 pb-0 flex-shrink-0">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <Leaf className="h-5 w-5 text-primary" />
              <DialogTitle className="text-xl font-semibold">
                API Endpoints Overview
              </DialogTitle>
            </div>
            <DialogDescription className="text-base">
              A comprehensive overview of all available LeetCode GraphQL API endpoints,
              organized by category and functionality.
            </DialogDescription>
          </DialogHeader>
        </div>
        
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <div className="space-y-6 pt-4">
            {endpoints.map((endpoint, index) => (
              <React.Fragment key={endpoint.id}>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 flex-shrink-0 mt-1">
                      <endpoint.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-lg text-foreground leading-tight">
                          {endpoint.name}
                        </h4>
                        {endpoint.requiresAuth && (
                          <Badge variant="outline" className="text-xs px-2 py-0.5 border-amber-400/50 text-amber-600 dark:text-amber-400">
                            <Lock className="h-3 w-3 mr-1" />
                            Auth Required
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                        {endpoint.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="bg-secondary/50 text-secondary-foreground">
                          {endpoint.category}
                        </Badge>
                        <Badge variant="outline" className="border-border/50 text-muted-foreground">
                          {endpoint.query}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                {index < endpoints.length - 1 && <Separator className="opacity-50" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});

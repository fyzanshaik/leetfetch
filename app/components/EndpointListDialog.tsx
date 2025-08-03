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
import { List as ListIcon, Lock } from "lucide-react";
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
          size="lg"
          className="hover:shadow-lg hover:scale-[1.02] transition-all duration-300 h-12 px-6 text-base rounded-lg font-medium border-border/50 hover:border-primary/30"
        >
          <ListIcon className="h-5 w-5 mr-2" />
          View All Endpoints
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col p-0">
        <div className="p-6 pb-0 flex-shrink-0">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <ListIcon className="h-5 w-5 text-primary" />
              API Endpoints Overview
            </DialogTitle>
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
                          <Badge variant="outline" className="text-xs px-2 py-0.5 border-amber-400/50 text-amber-600">
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

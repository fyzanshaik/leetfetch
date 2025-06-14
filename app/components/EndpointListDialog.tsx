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
import { List as ListIcon } from "lucide-react";
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
          variant="secondary"
          size="sm"
          className="flex items-center gap-1"
        >
          <ListIcon className="h-4 w-4" /> Visualize Endpoints
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col p-0">
        <div className="p-6 pb-0 flex-shrink-0">
          <DialogHeader>
            <DialogTitle>All API Endpoints</DialogTitle>
            <DialogDescription>
              A quick overview of all available LeetCode GraphQL API endpoints
              and their descriptions.
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <div className="space-y-4 pt-4">
            {endpoints.map((endpoint, index) => (
              <React.Fragment key={endpoint.id}>
                <div>
                  <h4 className="font-semibold text-lg text-primary">
                    {endpoint.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {endpoint.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="secondary">{endpoint.category}</Badge>
                    <Badge variant="outline">{endpoint.query}</Badge>
                    {endpoint.requiresAuth && (
                      <Badge variant="destructive">Requires Auth</Badge>
                    )}
                  </div>
                </div>
                {index < endpoints.length - 1 && <Separator className="my-2" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});

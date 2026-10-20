import * as React from "react";

import { cn } from "@workspace/ui/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full border-2 border-input bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:shadow-hard-sm disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-50 aria-invalid:border-destructive md:text-sm dark:bg-card dark:disabled:bg-muted ",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };

import * as React from "react";

import { cn } from "@workspace/ui/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 border-2 border-input bg-transparent px-3.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:shadow-hard-sm disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-50 aria-invalid:border-destructive md:text-sm dark:bg-card dark:disabled:bg-muted ",
        className,
      )}
      {...props}
    />
  );
}

export { Input };

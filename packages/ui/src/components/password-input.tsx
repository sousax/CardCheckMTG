import * as React from "react";
import { EyeClosed, EyeIcon } from "lucide-react";

import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";

type PasswordInputProps = Omit<React.ComponentProps<"input">, "type"> & {
  /** Accessible names for the visibility toggle; pass translated strings. */
  showLabel?: string;
  hideLabel?: string;
};

function PasswordInput({
  className,
  disabled,
  showLabel = "Show password",
  hideLabel = "Hide password",
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        className={cn("pr-11", className)}
        disabled={disabled}
        {...props}
      />
      <Button
        type="button"
        size="icon"
        variant="ghost"
        disabled={disabled}
        className="absolute right-1.5 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground"
        aria-label={showPassword ? hideLabel : showLabel}
        aria-pressed={showPassword}
        onClick={() => setShowPassword((prev) => !prev)}
      >
        {showPassword ? <EyeIcon size={18} /> : <EyeClosed size={18} />}
      </Button>
    </div>
  );
}

export { PasswordInput };

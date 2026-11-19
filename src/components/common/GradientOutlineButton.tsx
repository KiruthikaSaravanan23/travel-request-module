import React from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface GradientOutlineButtonProps extends React.ComponentPropsWithoutRef<typeof Button> {
  children: React.ReactNode;
}

export const GradientOutlineButton = React.forwardRef<
  HTMLButtonElement,
  GradientOutlineButtonProps
>(({ children, className, disabled = false, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      type="button"
      size="sm"
      disabled={disabled}
      className={cn(
        "cursor-pointer rounded-lg bg-gradient-to-r from-[#8b33fe] to-[#962fd2] px-3 py-2 text-xs font-semibold whitespace-nowrap text-white shadow-sm transition-all hover:opacity-95 hover:shadow-md",
        className,
      )}
      {...props}
    >
      {children}
    </Button>
  );
});

GradientOutlineButton.displayName = "GradientOutlineButton";

export default GradientOutlineButton;


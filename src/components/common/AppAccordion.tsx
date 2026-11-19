import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppAccordionProps {
  children: React.ReactNode;
  className?: string;
  accordionTrigger: string;
  triggerClassName?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const AppAccordion: React.FC<AppAccordionProps> = ({
  children,
  className,
  accordionTrigger,
  triggerClassName,
  open: controlledOpen,
  onOpenChange,
}) => {
  const [internalOpen, setInternalOpen] = useState(true);
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;

  const toggle = () => {
    if (onOpenChange) {
      onOpenChange(!isOpen);
    } else {
      setInternalOpen(!isOpen);
    }
  };

  return (
    <div className={cn("rounded-2xl border border-gray-200 bg-gray-50/50 p-4 transition-all", className)}>
      <button
        type="button"
        onClick={toggle}
        className={cn(
          "flex w-full items-center justify-between text-left text-xs font-semibold text-[#1c1108] cursor-pointer hover:opacity-80",
          triggerClassName,
        )}
      >
        <span>{accordionTrigger}</span>
        <ChevronDown
          className={cn(
            "size-4 text-gray-500 transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </button>
      {isOpen && <div className="mt-3">{children}</div>}
    </div>
  );
};

export default AppAccordion;


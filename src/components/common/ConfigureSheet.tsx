import React, { useEffect } from "react";
import { X, Globe2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ConfigureSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  children: React.ReactNode;
  onSave: () => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  saveButtonState?: boolean;
  submitText?: string;
  cancelText?: string;
  image?: string;
}

export const ConfigureSheet: React.FC<ConfigureSheetProps> = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  onSave,
  onCancel,
  isSubmitting = false,
  saveButtonState = false,
  submitText = "Save",
  cancelText = "Cancel",
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onCancel();
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onCancel, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={() => {
          onCancel();
          onOpenChange(false);
        }}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-2xl bg-white shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5 bg-gradient-to-b from-[#faf5ff] to-white">
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#f3e8ff] text-[#8b33fe]">
                <Globe2 className="size-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#1c1108]">{title}</h2>
                <p className="text-xs text-gray-500 mt-0.5">{description}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                onCancel();
                onOpenChange(false);
              }}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {children}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4 bg-gray-50">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onCancel();
                onOpenChange(false);
              }}
              disabled={isSubmitting}
            >
              {cancelText}
            </Button>
            <Button
              type="button"
              onClick={onSave}
              disabled={isSubmitting || saveButtonState}
            >
              {isSubmitting ? "Submitting..." : submitText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigureSheet;


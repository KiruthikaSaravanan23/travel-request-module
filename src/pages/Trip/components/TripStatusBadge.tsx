import React from "react";
import { cn } from "@/lib/utils";

interface TripStatusBadgeProps {
  status?: string | null;
  className?: string;
}

export const TripStatusBadge: React.FC<TripStatusBadgeProps> = ({
  status,
  className,
}) => {
  if (!status) return null;

  const normalized = status.toLowerCase();

  let styles = "bg-gray-100 text-gray-700 border-gray-200";

  switch (normalized) {
    case "approved":
    case "active":
    case "completed":
      styles = "bg-emerald-50 text-emerald-700 border-emerald-200";
      break;
    case "submitted":
    case "pending":
      styles = "bg-amber-50 text-amber-700 border-amber-200";
      break;
    case "draft":
      styles = "bg-blue-50 text-blue-700 border-blue-200";
      break;
    case "rejected":
    case "cancelled":
      styles = "bg-rose-50 text-rose-700 border-rose-200";
      break;
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider",
        styles,
        className,
      )}
    >
      {status}
    </span>
  );
};

export default TripStatusBadge;


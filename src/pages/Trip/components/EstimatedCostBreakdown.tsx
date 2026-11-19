import React from "react";
import { Info, TrendingUp } from "lucide-react";
import { formatToINRCurrency } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface EstimatedCostBreakdownProps {
  accommodationCost: number;
  mealsCost: number;
  grandEstimatedCost: number;
}

export const EstimatedCostBreakdown: React.FC<EstimatedCostBreakdownProps> = ({
  accommodationCost,
  mealsCost,
  grandEstimatedCost,
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="View cost breakdown"
          className="flex items-center text-gray-400 hover:text-[#8b33fe] transition-colors cursor-pointer"
        >
          <Info className="size-3.5" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-68 p-4">
        <div className="mb-3 flex items-center gap-2">
          <TrendingUp className="text-[#8b33fe] size-4" />
          <span className="text-xs font-bold text-[#1c1108]">
            Estimated Cost Breakdown
          </span>
        </div>
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between border-b border-dashed border-gray-200 pb-2">
            <span className="text-gray-500">Accommodation Cost</span>
            <span className="font-semibold text-[#1c1108]">
              {formatToINRCurrency(accommodationCost, false, "₹0")}
            </span>
          </div>
          <div className="flex items-center justify-between border-b border-dashed border-gray-200 pb-2">
            <span className="text-gray-500">Meal & Food Cost</span>
            <span className="font-semibold text-[#1c1108]">
              {formatToINRCurrency(mealsCost, false, "₹0")}
            </span>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between pt-1 border-t border-gray-100">
          <span className="text-xs font-bold text-[#1c1108]">
            Grand Estimated Cost
          </span>
          <span className="text-sm font-bold text-[#8b33fe]">
            {formatToINRCurrency(grandEstimatedCost, false, "₹0")}
          </span>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default EstimatedCostBreakdown;


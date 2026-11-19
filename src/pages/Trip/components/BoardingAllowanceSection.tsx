import React from "react";
import { Info } from "lucide-react";

export const BoardingAllowanceSection: React.FC = () => {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-[#ebd9fc] bg-[#fbf6fe] p-4 text-[#73757d]">
      <Info className="mt-0.5 size-5 shrink-0 text-[#8b33fe]" />
      <div className="space-y-0.5">
        <p className="text-sm font-semibold text-[#1c1108]">
          Boarding Allowance
        </p>
        <p className="text-xs text-gray-600">
          One day trips are claimed as a boarding allowance. No lodging is required.
        </p>
      </div>
    </div>
  );
};

export default BoardingAllowanceSection;


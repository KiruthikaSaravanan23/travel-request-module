import React from "react";
import { Trash2, Plus } from "lucide-react";
import { type Control, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { DEFAULT_HOTEL_ITEM } from "@/helpers/constants/trips";
import type { travelRequestFormValues } from "@/helpers/zod-schema/travelRequestFormSchema";
import HotelFields from "./HotelFields";
import AppAccordion from "@/components/common/AppAccordion";
import GradientOutlineButton from "@/components/common/GradientOutlineButton";

interface HotelsListProps {
  destinationIndex: number;
  control: Control<travelRequestFormValues>;
}

export const HotelsList: React.FC<HotelsListProps> = ({
  control,
  destinationIndex,
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `destinations.${destinationIndex}.hotels`,
  });

  return (
    <AppAccordion
      accordionTrigger={`Hotels (${fields.length})`}
      triggerClassName="text-xs font-semibold text-[#1c1108]"
    >
      <div className="space-y-3">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="space-y-4 rounded-xl border border-gray-200 bg-white p-4 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Hotel {index + 1}
              </span>
              {fields.length > 1 && (
                <Button
                  size="sm"
                  type="button"
                  variant="ghost"
                  onClick={() => remove(index)}
                  className="h-7 w-7 p-0 text-red-500 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              )}
            </div>
            <HotelFields
              index={index}
              control={control}
              destinationIndex={destinationIndex}
            />
          </div>
        ))}
        <GradientOutlineButton
          onClick={() => append({ ...DEFAULT_HOTEL_ITEM })}
          className="w-full justify-center"
        >
          <div className="flex items-center gap-1.5 py-1">
            <Plus className="size-3.5" />
            <span>Add Hotel</span>
          </div>
        </GradientOutlineButton>
      </div>
    </AppAccordion>
  );
};

export default HotelsList;


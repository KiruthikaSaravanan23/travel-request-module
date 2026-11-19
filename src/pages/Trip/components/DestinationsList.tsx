import React, { useEffect } from "react";
import { Trash2, Plus } from "lucide-react";
import {
  type Control,
  useFieldArray,
  type UseFormGetValues,
} from "react-hook-form";
import { Button } from "@/components/ui/button";
import { TripTypeEnum } from "@/types/trips.type";
import type { travelRequestFormValues } from "@/helpers/zod-schema/travelRequestFormSchema";
import { DEFAULT_DESTINATION_ITEM } from "@/helpers/constants/trips";
import DestinationFields from "./DestinationFields";
import GradientOutlineButton from "@/components/common/GradientOutlineButton";

interface DestinationsListProps {
  control: Control<travelRequestFormValues>;
  getValues: UseFormGetValues<travelRequestFormValues>;
  tripType: TripTypeEnum;
  isFormOpen: boolean;
  disabled?: boolean;
}

export const DestinationsList: React.FC<DestinationsListProps> = ({
  control,
  getValues,
  tripType,
  isFormOpen,
  disabled = false,
}) => {
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "destinations",
  });

  const isMultiCity = tripType === TripTypeEnum.MULTI_CITY;

  useEffect(() => {
    if (!isMultiCity) {
      const destinations = getValues("destinations");
      if (destinations && destinations.length > 1) {
        replace([destinations[0]]);
      }
    }
  }, [tripType, isMultiCity, getValues, replace]);

  const handleAddDestination = () => {
    const destinations = getValues("destinations");
    const last = destinations[destinations.length - 1];
    append({
      ...DEFAULT_DESTINATION_ITEM,
      from: last?.to ?? null,
    });
  };

  return (
    <div className="space-y-6">
      {fields.map((field, index) => (
        <div key={field.id} className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <span className="text-sm font-bold text-[#1c1108]">
              {isMultiCity ? `Destination Leg ${index + 1}` : "Destination Details"}
            </span>
            {isMultiCity && fields.length > 1 && (
              <Button
                size="sm"
                type="button"
                variant="ghost"
                onClick={() => remove(index)}
                aria-label={`Remove destination ${index + 1}`}
                className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="size-4" />
              </Button>
            )}
          </div>
          <DestinationFields
            index={index}
            control={control}
            tripType={tripType}
            isFormOpen={isFormOpen}
            disabled={disabled}
          />
        </div>
      ))}

      {isMultiCity && (
        <GradientOutlineButton onClick={handleAddDestination} className="w-full justify-center">
          <div className="flex items-center gap-1.5 py-1">
            <Plus className="size-4" />
            <span>Add Destination Leg</span>
          </div>
        </GradientOutlineButton>
      )}
    </div>
  );
};

export default DestinationsList;


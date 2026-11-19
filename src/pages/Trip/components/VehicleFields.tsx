import React from "react";
import type { Control } from "react-hook-form";
import type { travelRequestFormValues } from "@/helpers/zod-schema/travelRequestFormSchema";
import {
  TRAVEL_MODE_OPTIONS,
  TRAVEL_CATEGORY_OPTIONS,
} from "@/helpers/constants/trips";
import FormDateField from "@/components/common/FormDateField";
import FormSelectField from "@/components/common/FormSelectField";
import FormInputField from "@/components/common/FormInputField";

interface VehicleFieldsProps {
  index: number;
  control: Control<travelRequestFormValues>;
  destinationIndex: number;
}

export const VehicleFields: React.FC<VehicleFieldsProps> = ({
  index,
  control,
  destinationIndex,
}) => {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormDateField
          name={`destinations.${destinationIndex}.vehicles.${index}.date`}
          label="Date"
          control={control}
          isRequired
          labelClassName="text-xs font-semibold text-[#1c1108]"
        />
        <FormSelectField
          control={control}
          label="Category"
          name={`destinations.${destinationIndex}.vehicles.${index}.category`}
          placeholder="Select category"
          options={TRAVEL_CATEGORY_OPTIONS}
          isRequired
          labelClassName="text-xs font-semibold text-[#1c1108]"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormSelectField
          control={control}
          label="Mode"
          name={`destinations.${destinationIndex}.vehicles.${index}.mode`}
          placeholder="Select mode"
          options={TRAVEL_MODE_OPTIONS}
          isRequired
          labelClassName="text-xs font-semibold text-[#1c1108]"
        />
        <FormInputField
          control={control}
          label="Notes"
          name={`destinations.${destinationIndex}.vehicles.${index}.notes`}
          placeholder="Enter notes"
          labelClassName="text-xs font-semibold text-[#1c1108]"
        />
      </div>
    </div>
  );
};

export default VehicleFields;


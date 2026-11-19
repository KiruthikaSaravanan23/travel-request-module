import React from "react";
import type { Control } from "react-hook-form";
import type { travelRequestFormValues } from "@/helpers/zod-schema/travelRequestFormSchema";
import FormDateField from "@/components/common/FormDateField";
import FormInputField from "@/components/common/FormInputField";
import FormSelectField from "@/components/common/FormSelectField";
import { AVAILABLE_CITIES } from "@/services/travelService";

interface HotelFieldsProps {
  index: number;
  control: Control<travelRequestFormValues>;
  destinationIndex: number;
}

export const HotelFields: React.FC<HotelFieldsProps> = ({
  index,
  control,
  destinationIndex,
}) => {
  const cityOptions = AVAILABLE_CITIES.map((city) => ({
    label: city,
    value: city,
  }));

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormInputField
          control={control}
          label="Hotel Name"
          name={`destinations.${destinationIndex}.hotels.${index}.name`}
          placeholder="If already decided"
          labelClassName="text-xs font-semibold text-[#1c1108]"
        />
        <FormSelectField
          control={control}
          label="Location"
          name={`destinations.${destinationIndex}.hotels.${index}.location`}
          placeholder="Select city"
          options={cityOptions}
          isRequired
          labelClassName="text-xs font-semibold text-[#1c1108]"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormDateField
          name={`destinations.${destinationIndex}.hotels.${index}.check_in`}
          label="Check-in Date"
          control={control}
          isRequired
          labelClassName="text-xs font-semibold text-[#1c1108]"
        />
        <FormDateField
          name={`destinations.${destinationIndex}.hotels.${index}.check_out`}
          label="Check-out Date"
          control={control}
          isRequired
          labelClassName="text-xs font-semibold text-[#1c1108]"
        />
      </div>
    </div>
  );
};

export default HotelFields;


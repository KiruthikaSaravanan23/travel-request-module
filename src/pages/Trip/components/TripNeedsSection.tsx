import React from "react";
import { useWatch, type Control } from "react-hook-form";
import type { travelRequestFormValues } from "@/helpers/zod-schema/travelRequestFormSchema";
import { FormSwitchField } from "@/components/common/FormSwitchField";
import HotelsList from "./HotelsList";
import VehiclesList from "./VehiclesList";

interface TripNeedsSectionProps {
  index: number;
  control: Control<travelRequestFormValues>;
}

export const TripNeedsSection: React.FC<TripNeedsSectionProps> = ({
  control,
  index,
}) => {
  const accommodationNeeded = useWatch({
    control,
    name: `destinations.${index}.accommodation_needed`,
  });

  const vehicleNeeded = useWatch({
    control,
    name: `destinations.${index}.vehicle_needed`,
  });

  return (
    <div className="space-y-4 pt-2 border-t border-gray-100">
      <FormSwitchField
        control={control}
        name={`destinations.${index}.accommodation_needed`}
        label="Hotel Accommodation Needed ?"
        labelClassName="font-semibold text-xs text-[#1c1108]"
      />

      {accommodationNeeded && (
        <HotelsList control={control} destinationIndex={index} />
      )}

      <FormSwitchField
        control={control}
        name={`destinations.${index}.vehicle_needed`}
        label="Vehicle / Local Commute Needed ?"
        labelClassName="font-semibold text-xs text-[#1c1108]"
      />

      {vehicleNeeded && (
        <VehiclesList control={control} destinationIndex={index} />
      )}
    </div>
  );
};

export default TripNeedsSection;


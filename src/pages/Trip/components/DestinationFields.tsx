import React from "react";
import type { Control } from "react-hook-form";
import { TripTypeEnum } from "@/types/trips.type";
import type { travelRequestFormValues } from "@/helpers/zod-schema/travelRequestFormSchema";
import {
  MODE_OF_TRAVEL_OPTIONS,
  PREFERRED_TIME_OF_TRAVEL_OPTIONS,
} from "@/helpers/constants/trips";
import SelectDropdown from "@/components/common/SelectDropdown";
import FormDateField from "@/components/common/FormDateField";
import FormInputField from "@/components/common/FormInputField";
import FormSelectField from "@/components/common/FormSelectField";
import FormTimeSlotField from "./FormTimeSlotField";
import TripNeedsSection from "./TripNeedsSection";
import { AVAILABLE_CITIES, AVAILABLE_PROJECTS } from "@/services/travelService";

interface DestinationFieldsProps {
  index: number;
  control: Control<travelRequestFormValues>;
  tripType: TripTypeEnum;
  isFormOpen: boolean;
  disabled?: boolean;
}

export const DestinationFields: React.FC<DestinationFieldsProps> = ({
  control,
  index,
  tripType,
  disabled = false,
}) => {
  const isRoundTrip = tripType === TripTypeEnum.ROUND_TRIP;
  const cityOptions = AVAILABLE_CITIES.map((c) => ({ label: c, value: c }));

  return (
    <div className="space-y-4">
      <SelectDropdown
        control={control}
        name={`destinations.${index}.project`}
        label="Project"
        options={AVAILABLE_PROJECTS}
        getLabel={(option) => `${option.code} - ${option.name}`}
        getValue={(option) => `${option.id}`}
        labelClassName="text-xs font-semibold text-[#1c1108]"
        placeholderText="Select project"
        disabled={disabled}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <FormSelectField
          control={control}
          label="From"
          name={`destinations.${index}.from`}
          placeholder="Select departure city"
          options={cityOptions}
          labelClassName="text-xs font-semibold text-[#1c1108]"
          isRequired
          disabled={disabled}
        />
        <FormSelectField
          control={control}
          label="To"
          name={`destinations.${index}.to`}
          placeholder="Select destination city"
          options={cityOptions}
          labelClassName="text-xs font-semibold text-[#1c1108]"
          isRequired
          disabled={disabled}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormDateField
          name={`destinations.${index}.start_date`}
          label="Start Date"
          control={control}
          placeholder="Pick start date"
          labelClassName="text-xs font-semibold text-[#1c1108]"
          isRequired
          disabled={disabled}
        />
        <FormDateField
          name={`destinations.${index}.end_date`}
          label={isRoundTrip ? "Return Date" : "End Date"}
          control={control}
          placeholder={isRoundTrip ? "Pick return date" : "Pick end date"}
          labelClassName="text-xs font-semibold text-[#1c1108]"
          isRequired
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormSelectField
          control={control}
          name={`destinations.${index}.mode`}
          label="Travel Mode"
          options={MODE_OF_TRAVEL_OPTIONS}
          labelClassName="text-xs font-semibold text-[#1c1108]"
          placeholder="Select travel mode"
          isRequired
          disabled={disabled}
        />
        <FormTimeSlotField
          control={control}
          name={`destinations.${index}.preferred_time_of_travel`}
          label="Preferred Time Of Travel"
          options={PREFERRED_TIME_OF_TRAVEL_OPTIONS}
          labelClassName="text-xs font-semibold text-[#1c1108]"
          disabled={disabled}
        />
      </div>

      <TripNeedsSection control={control} index={index} />

      <FormInputField
        control={control}
        label="Destination Notes"
        name={`destinations.${index}.notes`}
        placeholder="Enter notes or preferences"
        labelClassName="text-xs font-semibold text-[#1c1108]"
      />
    </div>
  );
};

export default DestinationFields;


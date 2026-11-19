import React from "react";
import type { Control } from "react-hook-form";
import type { travelRequestFormValues } from "@/helpers/zod-schema/travelRequestFormSchema";
import {
  TRIP_TYPE_OPTIONS,
  TRAVEL_TYPE_OPTIONS,
} from "@/helpers/constants/trips";
import FormInputField from "@/components/common/FormInputField";
import FormSelectField from "@/components/common/FormSelectField";
import FormTabSelectElement from "./FormTabSelectElement";

interface BasicTripInformationProps {
  control: Control<travelRequestFormValues>;
  disabled?: boolean;
}

export const BasicTripInformation: React.FC<BasicTripInformationProps> = ({
  control,
  disabled = false,
}) => {
  return (
    <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
      <h3 className="text-sm font-bold text-[#1c1108]">
        Basic Trip Information
      </h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormInputField
          control={control}
          label="Trip Name"
          name="trip_name"
          placeholder="e.g. Client Architecture Workshop"
          labelClassName="text-xs font-semibold text-[#1c1108]"
          isRequired
          disabled={disabled}
        />
        <FormSelectField
          control={control}
          name="travel_type"
          label="Travel Type"
          options={TRAVEL_TYPE_OPTIONS}
          labelClassName="text-xs font-semibold text-[#1c1108]"
          placeholder="Select travel type"
          isRequired
          disabled={disabled}
        />
      </div>

      <FormInputField
        control={control}
        label="Purpose of Travel"
        name="purpose"
        placeholder="Reason and objectives for the travel"
        labelClassName="text-xs font-semibold text-[#1c1108]"
        isRequired
        disabled={disabled}
      />

      <FormTabSelectElement
        control={control}
        name="trip_type"
        options={TRIP_TYPE_OPTIONS}
        labelClassName="text-xs font-semibold text-[#1c1108]"
        isRequired
        label="Trip Duration Type"
        disabled={disabled}
      />
    </div>
  );
};

export default BasicTripInformation;


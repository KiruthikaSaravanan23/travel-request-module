import React, { useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { allowNumbersWithDecimal } from "@/lib/utils";
import ConfigureSheet from "@/components/common/ConfigureSheet";
import { FormSwitchField } from "@/components/common/FormSwitchField";
import FormInputField from "@/components/common/FormInputField";
import {
  TRAVEL_REQUEST_FORM_DEFAULT_VALUES,
  FORM_CONTENT,
} from "@/helpers/constants/trips";
import {
  travelRequestFormSchema,
  type travelRequestFormValues,
} from "@/helpers/zod-schema/travelRequestFormSchema";
import {
  TravelRequestFormMode,
  TripStateStatusEnum,
  TripTypeEnum,
  type TravelRequestFormContext,
} from "@/types/trips.type";

import DestinationsList from "./DestinationsList";
import BasicTripInformation from "./BasicTripInformation";
import BoardingAllowanceSection from "./BoardingAllowanceSection";
import EstimatedCostBreakdown from "./EstimatedCostBreakdown";
import useEligibleCost from "@/helpers/hooks/useEligibleCost";
import {
  mapNewRequestToFormValues,
  mapEditRequestToFormValues,
} from "@/helpers/utils/tripFormMapper";
import { TravelService } from "@/services/travelService";

interface TravelRequestFormProps {
  onSuccess: () => void;
  isTripFormOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formContext: TravelRequestFormContext;
}

export const TravelRequestForm: React.FC<TravelRequestFormProps> = ({
  onSuccess,
  isTripFormOpen,
  onOpenChange,
  formContext,
}) => {
  const defaultValues = useMemo<travelRequestFormValues>(() => {
    switch (formContext.mode) {
      case TravelRequestFormMode.EDIT:
        return mapEditRequestToFormValues(
          formContext.trip,
          formContext.request,
        );
      case TravelRequestFormMode.NEW_REQUEST:
        return mapNewRequestToFormValues(formContext.trip);
      case TravelRequestFormMode.CREATE:
      default:
        return TRAVEL_REQUEST_FORM_DEFAULT_VALUES;
    }
  }, [formContext]);

  const isEditMode = formContext.mode === TravelRequestFormMode.EDIT;
  const isBasicInfoDisabled =
    formContext.mode === TravelRequestFormMode.NEW_REQUEST ||
    (isEditMode && formContext.trip.status !== TripStateStatusEnum.DRAFT);

  const form = useForm<travelRequestFormValues>({
    resolver: zodResolver(travelRequestFormSchema),
    defaultValues,
    mode: "onChange",
  });

  useEffect(() => {
    if (isTripFormOpen) {
      form.reset(defaultValues);
    }
  }, [isTripFormOpen, defaultValues, form]);

  const tripType = useWatch({ control: form.control, name: "trip_type" });
  const isAdvanceNeeded = useWatch({
    control: form.control,
    name: "advance_needed",
  });
  const additionalCost = useWatch({
    control: form.control,
    name: "additional_cost",
  });
  const isAdditionalCostReasonRequired = Number(additionalCost) > 0;

  const destinations = useWatch({
    control: form.control,
    name: "destinations",
  });

  const { accommodationCost, mealsCost, grandEstimatedCost } = useEligibleCost({
    destinations: destinations || [],
    isEnabled: isTripFormOpen,
  });

  useEffect(() => {
    form.setValue("estimated_cost", String(grandEstimatedCost), {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [grandEstimatedCost, form]);

  const isDestinationLockedExceptEndDate =
    formContext.mode === TravelRequestFormMode.NEW_REQUEST &&
    tripType !== TripTypeEnum.MULTI_CITY;

  const onSubmit = (values: travelRequestFormValues) => {
    try {
      switch (formContext.mode) {
        case TravelRequestFormMode.EDIT:
          TravelService.updateTripRequest(
            formContext.trip.id,
            formContext.request.id,
            values,
          );
          toast.success("Travel request updated successfully");
          break;
        case TravelRequestFormMode.CREATE:
          TravelService.createTrip({
            trip_name: values.trip_name,
            purpose: values.purpose,
            travel_type: values.travel_type!.value,
            duration_type: values.trip_type,
            destinations: values.destinations,
            estimated_cost: values.estimated_cost,
            additional_cost: values.additional_cost as string | null | undefined,
            additional_cost_reason: values.additional_cost_reason,
            advance_needed: values.advance_needed,
            requested_amount: values.requested_amount as string | null | undefined,
          });
          toast.success("Travel request created successfully");
          break;
        case TravelRequestFormMode.NEW_REQUEST:
          TravelService.createRevisionRequest(formContext.trip.id, values);
          toast.success("Revision travel request submitted successfully");
          break;
      }

      form.reset(TRAVEL_REQUEST_FORM_DEFAULT_VALUES);
      onSuccess();
      onOpenChange(false);
    } catch (err) {
      toast.error("Failed to save travel request");
      console.error(err);
    }
  };

  const { title, description, submitText } = FORM_CONTENT[formContext.mode];

  return (
    <ConfigureSheet
      open={isTripFormOpen}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      onSave={form.handleSubmit(onSubmit)}
      onCancel={() => {
        form.reset(TRAVEL_REQUEST_FORM_DEFAULT_VALUES);
        onOpenChange(false);
      }}
      saveButtonState={!form.formState.isDirty}
      submitText={submitText}
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <BasicTripInformation
          control={form.control}
          disabled={isBasicInfoDisabled}
        />

        {tripType === TripTypeEnum.ONE_WAY && <BoardingAllowanceSection />}

        <DestinationsList
          control={form.control}
          getValues={form.getValues}
          tripType={tripType}
          isFormOpen={isTripFormOpen}
          disabled={isDestinationLockedExceptEndDate}
        />

        <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
          <h3 className="text-sm font-bold text-[#1c1108]">
            Cost & Advance Breakdown
          </h3>

          <FormInputField
            control={form.control}
            label="Estimated Eligible Cost"
            name="estimated_cost"
            placeholder="₹0"
            labelClassName="text-xs font-semibold text-[#1c1108]"
            formatAsINR
            isRequired
            readOnly
            labelAddon={
              <EstimatedCostBreakdown
                accommodationCost={accommodationCost}
                mealsCost={mealsCost}
                grandEstimatedCost={grandEstimatedCost}
              />
            }
          />

          <FormInputField
            control={form.control}
            label="Additional Cost (Over Budget / Special Needs)"
            name="additional_cost"
            placeholder="₹0"
            labelClassName="text-xs font-semibold text-[#1c1108]"
            onKeyDown={allowNumbersWithDecimal}
            formatAsINR
          />

          <FormInputField
            control={form.control}
            label="Reason For Additional Cost"
            name="additional_cost_reason"
            placeholder="Specify reason for additional cost request"
            labelClassName="text-xs font-semibold text-[#1c1108]"
            isRequired={isAdditionalCostReasonRequired}
          />

          <FormSwitchField
            control={form.control}
            name="advance_needed"
            label="Advance Needed Prior to Travel ?"
            labelClassName="text-xs font-semibold text-[#1c1108]"
          />

          {isAdvanceNeeded && (
            <FormInputField
              control={form.control}
              label="Requested Advance Amount"
              name="requested_amount"
              placeholder="Enter advance amount"
              labelClassName="text-xs font-semibold text-[#1c1108]"
              onKeyDown={allowNumbersWithDecimal}
              formatAsINR
              isRequired
            />
          )}
        </div>
      </form>
    </ConfigureSheet>
  );
};

export default TravelRequestForm;

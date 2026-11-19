import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import FormInputField from "@/components/common/FormInputField";
import { allowNumbersWithDecimal, formatToINRCurrency } from "@/lib/utils";
import {
  TripRequestDecisionEnum,
  type TripListItem,
  type TripRequestItem,
} from "@/types/trips.type";
import {
  tripReviewFormSchema,
  type tripReviewFormValues,
} from "@/helpers/zod-schema/travelRequestFormSchema";

interface ReviewTripDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trip: TripListItem | null;
  request: TripRequestItem | null;
  onDecision: (
    decision: TripRequestDecisionEnum,
    comment: string | null,
    approvedAmount: string | null,
  ) => void;
}

export const ReviewTripDialog: React.FC<ReviewTripDialogProps> = ({
  open,
  onOpenChange,
  trip,
  request,
  onDecision,
}) => {
  const form = useForm<tripReviewFormValues>({
    resolver: zodResolver(tripReviewFormSchema),
    defaultValues: {
      status: TripRequestDecisionEnum.APPROVE,
      approval_amount: request?.advance_amount || request?.total_amount || "0",
      comments: "",
      requested_amount: request?.advance_amount || request?.total_amount || "0",
      approved_amount: null,
    },
  });

  if (!trip || !request) return null;

  const currentStatus = form.watch("status");

  const handleSubmit = (values: tripReviewFormValues) => {
    onDecision(
      values.status || TripRequestDecisionEnum.APPROVE,
      values.comments || null,
      (values.approval_amount as string) || null,
    );
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Review Travel Request</DialogTitle>
          <DialogDescription>
            {trip.name} • Version v{request.sequence_no}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="rounded-xl bg-gray-50 p-3.5 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">Employee:</span>
              <span className="font-semibold text-[#1c1108]">
                {trip.created_by.first_name} {trip.created_by.last_name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Total Request Amount:</span>
              <span className="font-semibold text-[#1c1108]">
                {formatToINRCurrency(request.total_amount)}
              </span>
            </div>
            {request.advance_needed && (
              <div className="flex justify-between">
                <span className="text-gray-500">Advance Requested:</span>
                <span className="font-semibold text-[#8b33fe]">
                  {formatToINRCurrency(request.advance_amount)}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#1c1108]">Decision</label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={currentStatus === TripRequestDecisionEnum.APPROVE ? "default" : "outline"}
                onClick={() => form.setValue("status", TripRequestDecisionEnum.APPROVE)}
                className="w-full text-xs"
              >
                Approve
              </Button>
              <Button
                type="button"
                variant={currentStatus === TripRequestDecisionEnum.REJECT ? "destructive" : "outline"}
                onClick={() => form.setValue("status", TripRequestDecisionEnum.REJECT)}
                className="w-full text-xs"
              >
                Reject
              </Button>
            </div>
          </div>

          {currentStatus === TripRequestDecisionEnum.APPROVE && request.advance_needed && (
            <FormInputField
              control={form.control}
              name="approval_amount"
              label="Approved Advance Amount"
              placeholder="Enter approved amount"
              onKeyDown={allowNumbersWithDecimal}
              formatAsINR
              isRequired
              labelClassName="text-xs font-semibold text-[#1c1108]"
            />
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#1c1108]">
              Comments {currentStatus === TripRequestDecisionEnum.REJECT && <span className="text-red-500">*</span>}
            </label>
            <textarea
              {...form.register("comments")}
              rows={3}
              placeholder={
                currentStatus === TripRequestDecisionEnum.REJECT
                  ? "Specify reason for rejection"
                  : "Optional review remarks"
              }
              className="w-full rounded-lg border border-gray-200 bg-white p-2.5 text-xs text-[#1c1108] focus:border-[#8b33fe] focus:outline-none"
            />
            {form.formState.errors.comments && (
              <p className="text-xs text-red-500">{form.formState.errors.comments.message}</p>
            )}
          </div>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant={currentStatus === TripRequestDecisionEnum.REJECT ? "destructive" : "default"}
            >
              Confirm Decision
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewTripDialog;

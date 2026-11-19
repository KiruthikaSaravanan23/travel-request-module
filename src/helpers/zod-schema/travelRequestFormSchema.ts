import { z } from "zod";

import {
  amountSchema,
  optionalNumericSchema,
} from "./commonSchema";
import {
  TravelModeEnum,
  TravelTypeEnum,
  TripRequestDecisionEnum,
  TripTravelCategoryEnum,
  TripTravelTime,
  TripTravelTypeEnum,
  TripTypeEnum,
} from "@/types/trips.type";

export const hotelItemSchema = z.object({
  name: z
    .string()
    .trim()
    .nullable()
    .transform((value) => (value === "" ? null : value)),
  location: z.object({ label: z.string(), value: z.string() }).nullable(),
  check_in: z.date().nullable(),
  check_out: z.date().nullable(),
});

export const vehicleItemSchema = z.object({
  date: z.date().nullable(),
  category: z
    .object({
      label: z.string(),
      value: z.nativeEnum(TripTravelCategoryEnum),
    })
    .nullable(),
  mode: z
    .object({ label: z.string(), value: z.nativeEnum(TripTravelTypeEnum) })
    .nullable(),
  notes: z
    .string()
    .trim()
    .nullable()
    .transform((value) => (value === "" ? null : value)),
});

export const destinationItemSchema = z.object({
  project: z
    .object({
      id: z.number(),
      code: z.string(),
    })
    .nullable(),
  from: z.object({ label: z.string(), value: z.string() }).nullable(),
  to: z.object({ label: z.string(), value: z.string() }).nullable(),
  start_date: z.date().nullable(),
  end_date: z.date().nullable(),
  mode: z
    .object({ label: z.string(), value: z.nativeEnum(TravelModeEnum) })
    .nullable(),
  preferred_time_of_travel: z
    .object({
      value: z.nativeEnum(TripTravelTime),
      label: z.string(),
      subLabel: z.string(),
    })
    .nullable(),
  accommodation_needed: z.boolean(),
  vehicle_needed: z.boolean(),
  hotels: z.array(hotelItemSchema),
  vehicles: z.array(vehicleItemSchema),
  notes: z
    .string()
    .trim()
    .nullable()
    .transform((value) => (value === "" ? null : value)),
});

export const travelRequestFormSchema = z
  .object({
    trip_name: z
      .string()
      .trim()
      .nonempty({ message: "Travel request name is required" }),
    purpose: z.string().trim().nonempty({ message: "Purpose is required" }),
    travel_type: z
      .object({ label: z.string(), value: z.nativeEnum(TravelTypeEnum) })
      .nullable(),
    trip_type: z.nativeEnum(TripTypeEnum),
    destinations: z.array(destinationItemSchema).min(1),
    estimated_cost: amountSchema({
      message: "Estimated cost is required",
      min: 1,
      minMessage: "Estimated cost must be a positive value",
    }),
    additional_cost: optionalNumericSchema(
      amountSchema({
        min: 1,
        minMessage: "Additional cost must be a positive value",
      }),
    ).nullable(),
    additional_cost_reason: z
      .string()
      .trim()
      .nullable()
      .transform((value) => (value === "" ? null : value)),
    advance_needed: z.boolean(),
    requested_amount: optionalNumericSchema(
      amountSchema({
        message: "Advance amount is required",
        min: 1,
        minMessage: "Advance amount must be a positive value",
      }),
    ).nullable(),
  })
  .superRefine((data, ctx) => {
    if (!data.travel_type) {
      ctx.addIssue({
        path: ["travel_type"],
        message: "Travel type is required",
        code: "custom",
      });
    }

    if (data.advance_needed && !Number(data.requested_amount)) {
      ctx.addIssue({
        path: ["requested_amount"],
        message: "Advance amount is required",
        code: "custom",
      });
    }

    if (Number(data.additional_cost) > 0 && !data.additional_cost_reason) {
      ctx.addIssue({
        path: ["additional_cost_reason"],
        message: "Reason for additional cost is required",
        code: "custom",
      });
    }

    if (
      data.advance_needed &&
      data.requested_amount &&
      Number(data.requested_amount) >
        Number(data.estimated_cost) + Number(data.additional_cost ?? 0)
    ) {
      ctx.addIssue({
        path: ["requested_amount"],
        message:
          "Advance amount cannot be greater than estimated total cost plus additional cost",
        code: "custom",
      });
    }

    data.destinations.forEach((destination, index) => {
      if (!destination.from) {
        ctx.addIssue({
          path: ["destinations", index, "from"],
          message: "From is required",
          code: "custom",
        });
      }
      if (!destination.to) {
        ctx.addIssue({
          path: ["destinations", index, "to"],
          message: "To is required",
          code: "custom",
        });
      }
      if (!destination.start_date) {
        ctx.addIssue({
          path: ["destinations", index, "start_date"],
          message: "Start date is required",
          code: "custom",
        });
      }
      if (!destination.mode) {
        ctx.addIssue({
          path: ["destinations", index, "mode"],
          message: "Mode is required",
          code: "custom",
        });
      }

      if (!destination.end_date) {
        ctx.addIssue({
          path: ["destinations", index, "end_date"],
          message:
            data.trip_type === TripTypeEnum.ROUND_TRIP
              ? "Return date is required"
              : "End date is required",
          code: "custom",
        });
      } else if (
        destination.start_date &&
        destination.end_date < destination.start_date
      ) {
        ctx.addIssue({
          path: ["destinations", index, "end_date"],
          message:
            data.trip_type === TripTypeEnum.ROUND_TRIP
              ? "Return date must be on or after the start date"
              : "End date must be on or after the start date",
          code: "custom",
        });
      }

      if (destination.accommodation_needed) {
        destination.hotels.forEach((hotel, hotelIndex) => {
          if (!hotel.location) {
            ctx.addIssue({
              path: ["destinations", index, "hotels", hotelIndex, "location"],
              message: "Location is required",
              code: "custom",
            });
          }
          if (!hotel.check_in) {
            ctx.addIssue({
              path: ["destinations", index, "hotels", hotelIndex, "check_in"],
              message: "Check-in date is required",
              code: "custom",
            });
          }
          if (!hotel.check_out) {
            ctx.addIssue({
              path: ["destinations", index, "hotels", hotelIndex, "check_out"],
              message: "Check-out date is required",
              code: "custom",
            });
          } else if (hotel.check_in && hotel.check_out < hotel.check_in) {
            ctx.addIssue({
              path: ["destinations", index, "hotels", hotelIndex, "check_out"],
              message: "Check-out date must be on or after the check-in date",
              code: "custom",
            });
          }
        });
      }

      if (destination.vehicle_needed) {
        destination.vehicles.forEach((vehicle, vehicleIndex) => {
          if (!vehicle.date) {
            ctx.addIssue({
              path: ["destinations", index, "vehicles", vehicleIndex, "date"],
              message: "Date is required",
              code: "custom",
            });
          }
          if (!vehicle.category) {
            ctx.addIssue({
              path: [
                "destinations",
                index,
                "vehicles",
                vehicleIndex,
                "category",
              ],
              message: "Category is required",
              code: "custom",
            });
          }
          if (!vehicle.mode) {
            ctx.addIssue({
              path: ["destinations", index, "vehicles", vehicleIndex, "mode"],
              message: "Mode is required",
              code: "custom",
            });
          }
        });
      }
    });
  });

export type travelRequestFormValues = z.infer<typeof travelRequestFormSchema>;
export type DestinationItemValues = z.infer<typeof destinationItemSchema>;
export type HotelItemValues = z.infer<typeof hotelItemSchema>;
export type VehicleItemValues = z.infer<typeof vehicleItemSchema>;

export const tripReviewFormSchema = z
  .object({
    approval_amount: optionalNumericSchema(
      amountSchema({
        min: 1,
        minMessage: "Approval amount must be a positive value",
      }),
    ).nullable(),
    comments: z
      .string()
      .trim()
      .nullable()
      .transform((value) => (value === "" ? null : value)),
    requested_amount: amountSchema().nullable(),
    approved_amount: amountSchema().nullable(),
    status: z.nativeEnum(TripRequestDecisionEnum).nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.status === TripRequestDecisionEnum.REJECT) {
      if (!data.comments) {
        ctx.addIssue({
          path: ["comments"],
          message: "Please enter rejection comments",
          code: "custom",
        });
      }
      return;
    }

    if (data.status !== TripRequestDecisionEnum.APPROVE) return;

    const { approval_amount, requested_amount } = data;

    if (!approval_amount || Number(approval_amount) <= 0) {
      ctx.addIssue({
        path: ["approval_amount"],
        message: "Approval amount is required",
        code: "custom",
      });
      return;
    }

    if (
      requested_amount &&
      Number(approval_amount) > Number(requested_amount)
    ) {
      ctx.addIssue({
        path: ["approval_amount"],
        message: "Approval amount cannot exceed requested amount",
        code: "custom",
      });
    }
  });

export type tripReviewFormValues = z.infer<typeof tripReviewFormSchema>;


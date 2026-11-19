import type { SelectOption } from "@/types/trips.type";
import {
  TravelModeEnum,
  TripTravelTime,
  RequestActionType,
  TravelTypeEnum,
  TripActionType,
  TripTravelCategoryEnum,
  TripTravelTypeEnum,
  TripTypeEnum,
} from "@/types/trips.type";

export const MODE_OF_TRAVEL_OPTIONS: SelectOption<TravelModeEnum>[] = [
  { label: "Flight", value: TravelModeEnum.FLIGHT },
  { label: "Train", value: TravelModeEnum.TRAIN },
  { label: "Bus", value: TravelModeEnum.BUS },
  { label: "Own vehicle", value: TravelModeEnum.OWN_VEHICLE },
];

export const TRIP_TYPE_OPTIONS: SelectOption<TripTypeEnum>[] = [
  { label: "One Day", value: TripTypeEnum.ONE_WAY },
  { label: "Round Trip", value: TripTypeEnum.ROUND_TRIP },
  { label: "Multi City", value: TripTypeEnum.MULTI_CITY },
];

export const TRAVEL_TYPE_OPTIONS: SelectOption<TravelTypeEnum>[] = [
  { label: "Domestic", value: TravelTypeEnum.DOMESTIC },
  { label: "International", value: TravelTypeEnum.INTERNATIONAL },
];

export interface PreferredTimeOfTravelOption {
  value: TripTravelTime;
  label: string;
  subLabel: string;
}

export const PREFERRED_TIME_OF_TRAVEL_OPTIONS: PreferredTimeOfTravelOption[] = [
  {
    value: TripTravelTime.EARLY_MORNING,
    label: "Early morning",
    subLabel: "12:00 AM - 6:00 AM",
  },
  {
    value: TripTravelTime.MORNING,
    label: "Morning",
    subLabel: "6:00 AM - 11:00 AM",
  },
  {
    value: TripTravelTime.NOON,
    label: "Noon",
    subLabel: "12:00 PM - 2:00 PM",
  },
  {
    value: TripTravelTime.AFTERNOON,
    label: "Afternoon",
    subLabel: "2:00 PM - 5:00 PM",
  },
  {
    value: TripTravelTime.EVENING,
    label: "Evening",
    subLabel: "5:00 PM - 8:00 PM",
  },
  {
    value: TripTravelTime.NIGHT,
    label: "Night",
    subLabel: "9:00 PM - 12:00 AM",
  },
];

export const TRAVEL_CATEGORY_OPTIONS: SelectOption<TripTravelCategoryEnum>[] = [
  {
    label: "Airport transfer",
    value: TripTravelCategoryEnum.AIRPORT_TRANSFER,
  },
  { label: "Local commute", value: TripTravelCategoryEnum.LOCAL_COMMUTE },
  {
    label: "Self drive rental",
    value: TripTravelCategoryEnum.SELF_DRIVE_RENTAL,
  },
  { label: "Company vehicle", value: TripTravelCategoryEnum.COMPANY_VEHICLE },
];

export const TRAVEL_MODE_OPTIONS: SelectOption<TripTravelTypeEnum>[] = [
  { label: "Bus", value: TripTravelTypeEnum.BUS },
  { label: "Car rental", value: TripTravelTypeEnum.CAR_RENTAL },
  { label: "Local train", value: TripTravelTypeEnum.LOCAL_TRAIN },
  { label: "Local cab", value: TripTravelTypeEnum.LOCAL_CAB },
  { label: "Own vehicle", value: TripTravelTypeEnum.OWN_VEHICLE },
];

export const DEFAULT_HOTEL_ITEM = {
  name: "",
  location: null,
  check_in: null,
  check_out: null,
};

export const DEFAULT_VEHICLE_ITEM = {
  date: null,
  category: null,
  mode: null,
  notes: "",
};

export const DEFAULT_DESTINATION_ITEM = {
  project: null,
  from: null,
  to: null,
  start_date: null,
  end_date: null,
  mode: null,
  preferred_time_of_travel: null,
  notes: "",
  accommodation_needed: false,
  vehicle_needed: false,
  hotels: [DEFAULT_HOTEL_ITEM],
  vehicles: [DEFAULT_VEHICLE_ITEM],
};

export const TRAVEL_REQUEST_FORM_DEFAULT_VALUES = {
  trip_name: "",
  purpose: "",
  travel_type: null,
  trip_type: TripTypeEnum.ONE_WAY,
  destinations: [DEFAULT_DESTINATION_ITEM],
  estimated_cost: "0",
  additional_cost: null,
  additional_cost_reason: "",
  advance_needed: false,
  requested_amount: null,
};

export const TRIP_ACTION_DIALOG_CONTENT: Record<
  TripActionType,
  {
    title: string;
    content: string;
    confirmText: string;
    confirmVariant: "primary" | "destructive";
    successTitle: string;
    successMessage: string;
  }
> = {
  delete: {
    title: "Delete trip?",
    content:
      "You're about to delete this draft trip. This action cannot be undone.",
    confirmText: "Delete",
    confirmVariant: "destructive",
    successTitle: "Trip deleted",
    successMessage: "The trip has been deleted successfully.",
  },
  complete: {
    title: "Complete trip?",
    content:
      "You're about to mark this trip as completed. This action cannot be undone.",
    confirmText: "Complete",
    confirmVariant: "primary",
    successTitle: "Trip completed",
    successMessage: "The trip has been marked as completed successfully.",
  },
};

export const REQUEST_ACTION_DIALOG_CONTENT: Record<
  RequestActionType,
  {
    title: string;
    content: string;
    confirmText: string;
    confirmVariant: "primary" | "destructive";
    successTitle: string;
    successMessage: string;
  }
> = {
  withdraw: {
    title: "Withdraw request?",
    content:
      "You're about to withdraw this submitted request. This action cannot be undone.",
    confirmText: "Withdraw",
    confirmVariant: "destructive",
    successTitle: "Request withdrawn",
    successMessage: "The travel request has been withdrawn successfully.",
  },
  submit: {
    title: "Submit request?",
    content: "Are you sure you want to submit the travel request for approval?",
    confirmText: "Submit",
    confirmVariant: "primary",
    successTitle: "Request submitted",
    successMessage: "The travel request has been submitted successfully.",
  },
  delete: {
    title: "Delete request?",
    content:
      "You're about to delete this draft request. This action cannot be undone.",
    confirmText: "Delete",
    confirmVariant: "destructive",
    successTitle: "Request deleted",
    successMessage: "The travel request has been deleted successfully.",
  },
};

export const FORM_CONTENT = {
  create: {
    title: "Create Travel Request",
    description:
      "Fill out trip details, destination route, accommodations, and estimated budget.",
    submitText: "Create Request",
  },
  edit: {
    title: "Edit Travel Request",
    description: "Update details for your travel request before submission.",
    submitText: "Save Changes",
  },
  new_request: {
    title: "Revise Travel Request",
    description:
      "Create a revision request with updated itinerary or additional budget.",
    submitText: "Submit Revision",
  },
};


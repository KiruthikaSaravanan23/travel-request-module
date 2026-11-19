import {
  TripTypeEnum,
  type TripDestination,
  type TripListItem,
  type TripRequestItem,
} from "@/types/trips.type";
import type {
  DestinationItemValues,
  travelRequestFormValues,
} from "../zod-schema/travelRequestFormSchema";
import {
  DEFAULT_DESTINATION_ITEM,
  DEFAULT_HOTEL_ITEM,
  DEFAULT_VEHICLE_ITEM,
  MODE_OF_TRAVEL_OPTIONS,
  PREFERRED_TIME_OF_TRAVEL_OPTIONS,
  TRAVEL_CATEGORY_OPTIONS,
  TRAVEL_MODE_OPTIONS,
  TRAVEL_TYPE_OPTIONS,
} from "../constants/trips";

const findOptionByValue = <Option extends { value: any }>(
  options: Option[],
  value: Option["value"] | null | undefined,
): Option | null => (value ? (options.find((option) => option.value === value) ?? null) : null);

const mapTripDestinationToFormDestination = (
  destination: TripDestination,
): DestinationItemValues => ({
  project: destination.project,
  from: destination.from_city ? { label: destination.from_city, value: destination.from_city } : null,
  to: destination.to_city ? { label: destination.to_city, value: destination.to_city } : null,
  start_date: destination.start_date ? new Date(destination.start_date) : null,
  end_date: destination.end_date ? new Date(destination.end_date) : null,
  mode: findOptionByValue(MODE_OF_TRAVEL_OPTIONS, destination.travel_mode),
  preferred_time_of_travel: findOptionByValue(
    PREFERRED_TIME_OF_TRAVEL_OPTIONS,
    destination.travel_time,
  ),
  accommodation_needed: destination.accommodation_needed ?? false,
  vehicle_needed: destination.vehicle_needed ?? false,
  hotels: destination.accommodations && destination.accommodations.length
    ? destination.accommodations.map((accommodation) => ({
        name: accommodation.name,
        location: { label: accommodation.city, value: accommodation.city },
        check_in: accommodation.check_in_date ? new Date(accommodation.check_in_date) : null,
        check_out: accommodation.check_out_date ? new Date(accommodation.check_out_date) : null,
      }))
    : [DEFAULT_HOTEL_ITEM],
  vehicles: destination.travels && destination.travels.length
    ? destination.travels.map((travel) => ({
        date: travel.date ? new Date(travel.date) : null,
        category: findOptionByValue(TRAVEL_CATEGORY_OPTIONS, travel.category),
        mode: findOptionByValue(TRAVEL_MODE_OPTIONS, travel.type),
        notes: travel.note,
      }))
    : [DEFAULT_VEHICLE_ITEM],
  notes: destination.note ?? "",
});

export const mapEditRequestToFormValues = (
  trip: TripListItem,
  request: TripRequestItem,
): travelRequestFormValues => ({
  trip_name: trip.name,
  purpose: trip.purpose,
  travel_type: findOptionByValue(TRAVEL_TYPE_OPTIONS, trip.travel_type),
  trip_type: trip.duration_type,
  destinations: request.destinations && request.destinations.length
    ? request.destinations.map(mapTripDestinationToFormDestination)
    : [DEFAULT_DESTINATION_ITEM],
  estimated_cost: request.eligible_amount || request.total_amount,
  additional_cost: request.additional_amount,
  additional_cost_reason: request.additional_amount_note,
  advance_needed: request.advance_needed,
  requested_amount: request.advance_amount,
});

export const mapNewRequestToFormValues = (
  trip: TripListItem,
): travelRequestFormValues => {
  const isMultiCity = trip.duration_type === TripTypeEnum.MULTI_CITY;
  const mostRecentRequest = trip.requests.at(-1);

  const sourceDestinations = isMultiCity
    ? trip.requests.flatMap((request) => request.destinations)
    : (mostRecentRequest?.destinations ?? []);

  const destinations = sourceDestinations.length
    ? sourceDestinations.map(mapTripDestinationToFormDestination)
    : [DEFAULT_DESTINATION_ITEM];

  return {
    trip_name: trip.name,
    purpose: trip.purpose,
    travel_type: findOptionByValue(TRAVEL_TYPE_OPTIONS, trip.travel_type),
    trip_type: trip.duration_type,
    destinations,
    estimated_cost: "",
    additional_cost: null,
    additional_cost_reason: null,
    advance_needed: false,
    requested_amount: null,
  };
};

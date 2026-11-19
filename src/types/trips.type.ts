export enum TripApprovalStatus {
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  PENDING = "PENDING",
  CANCELLED = "CANCELLED",
}

export enum TripTravelTime {
  EARLY_MORNING = "early_morning",
  MORNING = "morning",
  NOON = "noon",
  AFTERNOON = "afternoon",
  EVENING = "evening",
  NIGHT = "night",
}

export enum TravelTypeEnum {
  DOMESTIC = "domestic",
  INTERNATIONAL = "international",
}

export enum TripTypeEnum {
  ONE_WAY = "one_way",
  ROUND_TRIP = "two_way",
  MULTI_CITY = "multi_city",
}

export enum TravelModeEnum {
  FLIGHT = "flight",
  TRAIN = "train",
  BUS = "bus",
  OWN_VEHICLE = "own",
}

export enum TripAdvanceStatusEnum {
  PENDING = "pending",
  ISSUED = "issued",
  REJECTED = "rejected",
}

export enum TripStateStatusEnum {
  DRAFT = "draft",
  ACTIVE = "active",
  COMPLETED = "completed",
  REJECTED = "rejected",
}

export enum TripRequestStatusEnum {
  DRAFT = "draft",
  SUBMITTED = "submitted",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export enum TripTravelCategoryEnum {
  AIRPORT_TRANSFER = "airport_transfer",
  LOCAL_COMMUTE = "local_commute",
  SELF_DRIVE_RENTAL = "self_drive_rental",
  COMPANY_VEHICLE = "company_vehicle",
}

export enum TripTravelTypeEnum {
  BUS = "bus",
  CAR_RENTAL = "car_rental",
  LOCAL_CAB = "local_cab",
  LOCAL_TRAIN = "local_train",
  OWN_VEHICLE = "own_vehicle",
}

export enum TripActionType {
  DELETE = "delete",
  COMPLETE = "complete",
}

export enum RequestActionType {
  WITHDRAW = "withdraw",
  SUBMIT = "submit",
  DELETE = "delete",
}

export interface SelectOption<T = string> {
  label: string;
  value: T;
  subLabel?: string;
}

export interface ProjectInfo {
  id: number;
  code: string;
  name?: string;
}

export interface UserDetails {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  reporting_manager?: {
    first_name: string;
    last_name: string;
    email: string;
  } | null;
}

export interface TripTravelLeg {
  category: TripTravelCategoryEnum;
  type: TripTravelTypeEnum;
  note: string | null;
  date: string;
}

export interface TripAccommodation {
  name: string | null;
  city: string;
  check_in_date: string;
  check_out_date: string;
}

export interface TripDestination {
  to_city: string;
  from_city: string;
  start_date: string;
  end_date: string;
  travel_time: TripTravelTime | null;
  travel_mode: TravelModeEnum;
  accommodation_needed?: boolean;
  vehicle_needed?: boolean;
  travels: TripTravelLeg[];
  accommodations: TripAccommodation[];
  project: ProjectInfo | null;
  note: string | null;
}

export interface TripAdvance {
  id: number;
  amount: string | null;
  issuer: { first_name: string; last_name: string } | null;
  issued_at: string | null;
  status: TripAdvanceStatusEnum;
  note: string | null;
}

export interface ApproverInfo {
  id: number;
  name: string;
  status: "approved" | "rejected" | "pending";
  comments?: string | null;
  date?: string | null;
}

export interface TripRequestItem {
  id: number;
  status: TripRequestStatusEnum;
  sequence_no: number;
  eligible_amount: string;
  additional_amount: string | null;
  additional_amount_note: string | null;
  total_amount: string;
  approved_amount: string | null;
  advance_needed: boolean;
  advance_amount: string | null;
  destinations: TripDestination[];
  approvers: ApproverInfo[];
  advance: TripAdvance | null;
}

export interface TripListItem {
  id: number;
  code: string | null;
  name: string;
  status: TripStateStatusEnum;
  travel_type: TravelTypeEnum;
  duration_type: TripTypeEnum;
  purpose: string;
  total_request_amount: string;
  total_approved_amount: string;
  created_by: UserDetails;
  requests: TripRequestItem[];
}

export enum TravelRequestFormMode {
  CREATE = "create",
  EDIT = "edit",
  NEW_REQUEST = "new_request",
}

export type TravelRequestFormContext =
  | { mode: TravelRequestFormMode.CREATE }
  | {
      mode: TravelRequestFormMode.EDIT;
      trip: TripListItem;
      request: TripRequestItem;
    }
  | { mode: TravelRequestFormMode.NEW_REQUEST; trip: TripListItem };

export enum TripRequestDecisionEnum {
  APPROVE = "approve",
  REJECT = "reject",
}

export interface GradePerDiem {
  hotel_accommodation_per_diem: number;
  meals_food_per_diem: number;
}


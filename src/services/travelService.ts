import {
  TravelModeEnum,
  TravelTypeEnum,
  TripActionType,
  TripAdvanceStatusEnum,
  TripApprovalStatus,
  TripListItem,
  TripRequestDecisionEnum,
  TripRequestItem,
  TripRequestStatusEnum,
  TripStateStatusEnum,
  TripTravelCategoryEnum,
  TripTravelTime,
  TripTravelTypeEnum,
  TripTypeEnum,
  type GradePerDiem,
  type ProjectInfo,
} from "@/types/trips.type";

const STORAGE_KEY = "travel_module_trips_data";

export const CITY_PER_DIEM_RATES: Record<string, GradePerDiem> = {
  Bengaluru: { hotel_accommodation_per_diem: 3500, meals_food_per_diem: 1200 },
  Mumbai: { hotel_accommodation_per_diem: 4500, meals_food_per_diem: 1500 },
  Delhi: { hotel_accommodation_per_diem: 4000, meals_food_per_diem: 1400 },
  Chennai: { hotel_accommodation_per_diem: 3200, meals_food_per_diem: 1100 },
  Hyderabad: { hotel_accommodation_per_diem: 3200, meals_food_per_diem: 1100 },
  Pune: { hotel_accommodation_per_diem: 3000, meals_food_per_diem: 1000 },
  Kolkata: { hotel_accommodation_per_diem: 2800, meals_food_per_diem: 1000 },
  Singapore: { hotel_accommodation_per_diem: 16000, meals_food_per_diem: 6000 },
  Dubai: { hotel_accommodation_per_diem: 14000, meals_food_per_diem: 5500 },
  London: { hotel_accommodation_per_diem: 18000, meals_food_per_diem: 7000 },
};

export const getPerDiemByCity = (city?: string): GradePerDiem => {
  if (!city) {
    return { hotel_accommodation_per_diem: 2500, meals_food_per_diem: 800 };
  }
  return (
    CITY_PER_DIEM_RATES[city] || {
      hotel_accommodation_per_diem: 2500,
      meals_food_per_diem: 800,
    }
  );
};

export const AVAILABLE_CITIES = [
  "Bengaluru",
  "Mumbai",
  "Delhi",
  "Chennai",
  "Hyderabad",
  "Pune",
  "Kolkata",
  "Singapore",
  "Dubai",
  "London",
];

export const AVAILABLE_PROJECTS: ProjectInfo[] = [
  { id: 1, code: "PRJ-001", name: "Enterprise ERP Synchronization" },
  { id: 2, code: "PRJ-002", name: "Cloud Infrastructure Modernization" },
  { id: 3, code: "PRJ-003", name: "Global Sales Summit" },
  { id: 4, code: "PRJ-004", name: "Onsite Client Architecture Review" },
];

const INITIAL_TRIPS: TripListItem[] = [
  {
    id: 101,
    code: "TRIP-2026-001",
    name: "Client Onsite Architecture Workshop",
    status: TripStateStatusEnum.ACTIVE,
    travel_type: TravelTypeEnum.DOMESTIC,
    duration_type: TripTypeEnum.ROUND_TRIP,
    purpose: "Meet client architectural committee in Mumbai for phase 2 signoff",
    total_request_amount: "16500",
    total_approved_amount: "16500",
    created_by: {
      id: 1,
      first_name: "Kiruthika",
      last_name: "Saravanan",
      email: "kiruthika.s@arche.global",
      reporting_manager: {
        first_name: "Vinayak",
        last_name: "Nair",
        email: "vinayak@arche.global",
      },
    },
    requests: [
      {
        id: 1001,
        sequence_no: 1,
        status: TripRequestStatusEnum.APPROVED,
        eligible_amount: "15000",
        additional_amount: "1500",
        additional_amount_note: "Late night taxi dispatch for project handover",
        total_amount: "16500",
        approved_amount: "16500",
        advance_needed: true,
        advance_amount: "10000",
        advance: {
          id: 501,
          amount: "10000",
          issuer: { first_name: "Finance", last_name: "Team" },
          issued_at: "2026-11-10T10:00:00Z",
          status: TripAdvanceStatusEnum.ISSUED,
          note: "Direct bank transfer credited",
        },
        approvers: [
          {
            id: 1,
            name: "Vinayak Nair",
            status: "approved",
            comments: "Approved for architecture signoff trip.",
            date: "2026-11-09T14:30:00Z",
          },
        ],
        destinations: [
          {
            from_city: "Bengaluru",
            to_city: "Mumbai",
            start_date: "2026-11-25T00:00:00.000Z",
            end_date: "2026-11-27T00:00:00.000Z",
            travel_time: TripTravelTime.MORNING,
            travel_mode: TravelModeEnum.FLIGHT,
            accommodation_needed: true,
            vehicle_needed: true,
            project: { id: 1, code: "PRJ-001" },
            note: "Flying out on morning flight from BLR T2",
            accommodations: [
              {
                name: "The Grand Hyatt Mumbai",
                city: "Mumbai",
                check_in_date: "2026-11-25T00:00:00.000Z",
                check_out_date: "2026-11-27T00:00:00.000Z",
              },
            ],
            travels: [
              {
                date: "2026-11-25T00:00:00.000Z",
                category: TripTravelCategoryEnum.AIRPORT_TRANSFER,
                type: TripTravelTypeEnum.LOCAL_CAB,
                note: "BOM Airport to Grand Hyatt",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 102,
    code: null,
    name: "Supplier Review Meeting Delhi",
    status: TripStateStatusEnum.DRAFT,
    travel_type: TravelTypeEnum.DOMESTIC,
    duration_type: TripTypeEnum.ONE_WAY,
    purpose: "One day rapid review meeting with hardware supplier in Delhi",
    total_request_amount: "2000",
    total_approved_amount: "0",
    created_by: {
      id: 1,
      first_name: "Kiruthika",
      last_name: "Saravanan",
      email: "kiruthika.s@arche.global",
      reporting_manager: {
        first_name: "Vinayak",
        last_name: "Nair",
        email: "vinayak@arche.global",
      },
    },
    requests: [
      {
        id: 1002,
        sequence_no: 1,
        status: TripRequestStatusEnum.DRAFT,
        eligible_amount: "1400",
        additional_amount: "600",
        additional_amount_note: "Airport express fast rail ticket",
        total_amount: "2000",
        approved_amount: null,
        advance_needed: false,
        advance_amount: null,
        advance: null,
        approvers: [],
        destinations: [
          {
            from_city: "Bengaluru",
            to_city: "Delhi",
            start_date: "2026-12-02T00:00:00.000Z",
            end_date: "2026-12-02T00:00:00.000Z",
            travel_time: TripTravelTime.EARLY_MORNING,
            travel_mode: TravelModeEnum.FLIGHT,
            accommodation_needed: false,
            vehicle_needed: false,
            project: { id: 2, code: "PRJ-002" },
            note: "One day trip with boarding allowance claim",
            accommodations: [],
            travels: [],
          },
        ],
      },
    ],
  },
  {
    id: 103,
    code: "TRIP-2026-003",
    name: "APAC Tech Partner Symposium",
    status: TripStateStatusEnum.ACTIVE,
    travel_type: TravelTypeEnum.INTERNATIONAL,
    duration_type: TripTypeEnum.MULTI_CITY,
    purpose: "Partner keynote and vendor sync in Singapore and Dubai",
    total_request_amount: "86000",
    total_approved_amount: "0",
    created_by: {
      id: 1,
      first_name: "Kiruthika",
      last_name: "Saravanan",
      email: "kiruthika.s@arche.global",
      reporting_manager: {
        first_name: "Vinayak",
        last_name: "Nair",
        email: "vinayak@arche.global",
      },
    },
    requests: [
      {
        id: 1003,
        sequence_no: 1,
        status: TripRequestStatusEnum.SUBMITTED,
        eligible_amount: "80000",
        additional_amount: "6000",
        additional_amount_note: "Visa processing & foreign transaction fee",
        total_amount: "86000",
        approved_amount: null,
        advance_needed: true,
        advance_amount: "50000",
        advance: {
          id: 502,
          amount: "50000",
          issuer: null,
          issued_at: null,
          status: TripAdvanceStatusEnum.PENDING,
          note: "Awaiting managerial and finance approval",
        },
        approvers: [
          {
            id: 1,
            name: "Vinayak Nair",
            status: "pending",
            comments: null,
          },
        ],
        destinations: [
          {
            from_city: "Bengaluru",
            to_city: "Singapore",
            start_date: "2026-12-10T00:00:00.000Z",
            end_date: "2026-12-13T00:00:00.000Z",
            travel_time: TripTravelTime.NIGHT,
            travel_mode: TravelModeEnum.FLIGHT,
            accommodation_needed: true,
            vehicle_needed: false,
            project: { id: 3, code: "PRJ-003" },
            note: "Keynote presentation at Sands Expo",
            accommodations: [
              {
                name: "Marina Bay Sands Hotel",
                city: "Singapore",
                check_in_date: "2026-12-10T00:00:00.000Z",
                check_out_date: "2026-12-13T00:00:00.000Z",
              },
            ],
            travels: [],
          },
          {
            from_city: "Singapore",
            to_city: "Dubai",
            start_date: "2026-12-13T00:00:00.000Z",
            end_date: "2026-12-15T00:00:00.000Z",
            travel_time: TripTravelTime.AFTERNOON,
            travel_mode: TravelModeEnum.FLIGHT,
            accommodation_needed: true,
            vehicle_needed: true,
            project: { id: 3, code: "PRJ-003" },
            note: "Regional stakeholder update",
            accommodations: [
              {
                name: "JW Marriott Marquis Hotel",
                city: "Dubai",
                check_in_date: "2026-12-13T00:00:00.000Z",
                check_out_date: "2026-12-15T00:00:00.000Z",
              },
            ],
            travels: [
              {
                date: "2026-12-14T00:00:00.000Z",
                category: TripTravelCategoryEnum.LOCAL_COMMUTE,
                type: TripTravelTypeEnum.CAR_RENTAL,
                note: "Full day client visit transfer",
              },
            ],
          },
        ],
      },
    ],
  },
];

export class TravelService {
  private static getStoredTrips(): TripListItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error("Failed to read from localStorage", e);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TRIPS));
    return INITIAL_TRIPS;
  }

  private static setStoredTrips(trips: TripListItem[]) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
    } catch (e) {
      console.error("Failed to write to localStorage", e);
    }
  }

  static getTrips(): TripListItem[] {
    return this.getStoredTrips();
  }

  static getTripById(id: number): TripListItem | undefined {
    return this.getStoredTrips().find((t) => t.id === id);
  }

  static createTrip(payload: {
    trip_name: string;
    purpose: string;
    travel_type: TravelTypeEnum;
    duration_type: TripTypeEnum;
    destinations: any[];
    estimated_cost: string;
    additional_cost?: string | null;
    additional_cost_reason?: string | null;
    advance_needed: boolean;
    requested_amount?: string | null;
  }): TripListItem {
    const trips = this.getStoredTrips();
    const newId = Date.now();
    const totalAmount = (
      Number(payload.estimated_cost || 0) +
      Number(payload.additional_cost || 0)
    ).toString();

    const newRequest: TripRequestItem = {
      id: newId + 1,
      sequence_no: 1,
      status: TripRequestStatusEnum.DRAFT,
      eligible_amount: payload.estimated_cost,
      additional_amount: payload.additional_cost || null,
      additional_amount_note: payload.additional_cost_reason || null,
      total_amount: totalAmount,
      approved_amount: null,
      advance_needed: payload.advance_needed,
      advance_amount: payload.advance_needed ? payload.requested_amount || null : null,
      advance: payload.advance_needed
        ? {
            id: newId + 2,
            amount: payload.requested_amount || null,
            issuer: null,
            issued_at: null,
            status: TripAdvanceStatusEnum.PENDING,
            note: null,
          }
        : null,
      approvers: [],
      destinations: payload.destinations.map((d) => ({
        from_city: d.from?.value || d.from_city || "",
        to_city: d.to?.value || d.to_city || "",
        start_date: d.start_date ? new Date(d.start_date).toISOString() : new Date().toISOString(),
        end_date: d.end_date ? new Date(d.end_date).toISOString() : new Date().toISOString(),
        travel_time: d.preferred_time_of_travel?.value || d.travel_time || null,
        travel_mode: d.mode?.value || d.travel_mode || TravelModeEnum.FLIGHT,
        accommodation_needed: Boolean(d.accommodation_needed),
        vehicle_needed: Boolean(d.vehicle_needed),
        project: d.project || null,
        note: d.notes || d.note || null,
        accommodations: d.accommodation_needed && d.hotels
          ? d.hotels.map((h: any) => ({
              name: h.name || null,
              city: h.location?.value || h.city || "",
              check_in_date: h.check_in ? new Date(h.check_in).toISOString() : new Date().toISOString(),
              check_out_date: h.check_out ? new Date(h.check_out).toISOString() : new Date().toISOString(),
            }))
          : [],
        travels: d.vehicle_needed && d.vehicles
          ? d.vehicles.map((v: any) => ({
              category: v.category?.value || v.category,
              type: v.mode?.value || v.type,
              note: v.notes || v.note || null,
              date: v.date ? new Date(v.date).toISOString() : new Date().toISOString(),
            }))
          : [],
      })),
    };

    const newTrip: TripListItem = {
      id: newId,
      code: null,
      name: payload.trip_name,
      status: TripStateStatusEnum.DRAFT,
      travel_type: payload.travel_type,
      duration_type: payload.duration_type,
      purpose: payload.purpose,
      total_request_amount: totalAmount,
      total_approved_amount: "0",
      created_by: {
        id: 1,
        first_name: "Kiruthika",
        last_name: "Saravanan",
        email: "kiruthika.s@arche.global",
        reporting_manager: {
          first_name: "Vinayak",
          last_name: "Nair",
          email: "vinayak@arche.global",
        },
      },
      requests: [newRequest],
    };

    trips.unshift(newTrip);
    this.setStoredTrips(trips);
    return newTrip;
  }

  static updateTripRequest(
    tripId: number,
    requestId: number,
    payload: any,
  ): boolean {
    const trips = this.getStoredTrips();
    const trip = trips.find((t) => t.id === tripId);
    if (!trip) return false;

    const requestIndex = trip.requests.findIndex((r) => r.id === requestId);
    if (requestIndex === -1) return false;

    const totalAmount = (
      Number(payload.estimated_cost || 0) +
      Number(payload.additional_cost || 0)
    ).toString();

    trip.name = payload.trip_name || trip.name;
    trip.purpose = payload.purpose || trip.purpose;
    trip.total_request_amount = totalAmount;

    trip.requests[requestIndex] = {
      ...trip.requests[requestIndex],
      eligible_amount: payload.estimated_cost,
      additional_amount: payload.additional_cost || null,
      additional_amount_note: payload.additional_cost_reason || null,
      total_amount: totalAmount,
      advance_needed: payload.advance_needed,
      advance_amount: payload.advance_needed ? payload.requested_amount || null : null,
      destinations: payload.destinations.map((d: any) => ({
        from_city: d.from?.value || d.from_city || "",
        to_city: d.to?.value || d.to_city || "",
        start_date: d.start_date ? new Date(d.start_date).toISOString() : new Date().toISOString(),
        end_date: d.end_date ? new Date(d.end_date).toISOString() : new Date().toISOString(),
        travel_time: d.preferred_time_of_travel?.value || d.travel_time || null,
        travel_mode: d.mode?.value || d.travel_mode || TravelModeEnum.FLIGHT,
        accommodation_needed: Boolean(d.accommodation_needed),
        vehicle_needed: Boolean(d.vehicle_needed),
        project: d.project || null,
        note: d.notes || d.note || null,
        accommodations: d.accommodation_needed && d.hotels
          ? d.hotels.map((h: any) => ({
              name: h.name || null,
              city: h.location?.value || h.city || "",
              check_in_date: h.check_in ? new Date(h.check_in).toISOString() : new Date().toISOString(),
              check_out_date: h.check_out ? new Date(h.check_out).toISOString() : new Date().toISOString(),
            }))
          : [],
        travels: d.vehicle_needed && d.vehicles
          ? d.vehicles.map((v: any) => ({
              category: v.category?.value || v.category,
              type: v.mode?.value || v.type,
              note: v.notes || v.note || null,
              date: v.date ? new Date(v.date).toISOString() : new Date().toISOString(),
            }))
          : [],
      })),
    };

    this.setStoredTrips(trips);
    return true;
  }

  static submitTripRequest(tripId: number, requestId: number): boolean {
    const trips = this.getStoredTrips();
    const trip = trips.find((t) => t.id === tripId);
    if (!trip) return false;

    const request = trip.requests.find((r) => r.id === requestId);
    if (!request) return false;

    request.status = TripRequestStatusEnum.SUBMITTED;
    request.approvers = [
      {
        id: 1,
        name: "Vinayak Nair",
        status: "pending",
        comments: null,
      },
    ];

    if (!trip.code) {
      trip.code = `TRIP-2026-${String(trip.id).slice(-3)}`;
    }
    trip.status = TripStateStatusEnum.ACTIVE;

    this.setStoredTrips(trips);
    return true;
  }

  static withdrawTripRequest(tripId: number, requestId: number): boolean {
    const trips = this.getStoredTrips();
    const trip = trips.find((t) => t.id === tripId);
    if (!trip) return false;

    const request = trip.requests.find((r) => r.id === requestId);
    if (!request) return false;

    request.status = TripRequestStatusEnum.DRAFT;
    request.approvers = [];

    this.setStoredTrips(trips);
    return true;
  }

  static deleteTripRequest(tripId: number, requestId: number): boolean {
    const trips = this.getStoredTrips();
    const trip = trips.find((t) => t.id === tripId);
    if (!trip) return false;

    trip.requests = trip.requests.filter((r) => r.id !== requestId);
    if (trip.requests.length === 0) {
      return this.deleteTrip(tripId);
    }

    this.setStoredTrips(trips);
    return true;
  }

  static deleteTrip(tripId: number): boolean {
    let trips = this.getStoredTrips();
    trips = trips.filter((t) => t.id !== tripId);
    this.setStoredTrips(trips);
    return true;
  }

  static completeTrip(tripId: number): boolean {
    const trips = this.getStoredTrips();
    const trip = trips.find((t) => t.id === tripId);
    if (!trip) return false;

    trip.status = TripStateStatusEnum.COMPLETED;
    this.setStoredTrips(trips);
    return true;
  }

  static decideTripRequest(
    tripId: number,
    requestId: number,
    decision: TripRequestDecisionEnum,
    comment: string | null,
    approvedAmount: string | null,
  ): boolean {
    const trips = this.getStoredTrips();
    const trip = trips.find((t) => t.id === tripId);
    if (!trip) return false;

    const request = trip.requests.find((r) => r.id === requestId);
    if (!request) return false;

    const isApprove = decision === TripRequestDecisionEnum.APPROVE;
    request.status = isApprove
      ? TripRequestStatusEnum.APPROVED
      : TripRequestStatusEnum.REJECTED;
    request.approved_amount = isApprove ? approvedAmount || request.total_amount : "0";

    if (request.advance && isApprove) {
      request.advance.status = TripAdvanceStatusEnum.ISSUED;
      request.advance.issued_at = new Date().toISOString();
      request.advance.amount = approvedAmount || request.advance.amount;
    }

    request.approvers = [
      {
        id: 1,
        name: "Vinayak Nair",
        status: isApprove ? "approved" : "rejected",
        comments: comment,
        date: new Date().toISOString(),
      },
    ];

    if (isApprove) {
      trip.total_approved_amount = (
        Number(trip.total_approved_amount || 0) + Number(request.approved_amount || 0)
      ).toString();
      trip.status = TripStateStatusEnum.ACTIVE;
    } else {
      trip.status = TripStateStatusEnum.REJECTED;
    }

    this.setStoredTrips(trips);
    return true;
  }

  static createRevisionRequest(tripId: number, payload: any): boolean {
    const trips = this.getStoredTrips();
    const trip = trips.find((t) => t.id === tripId);
    if (!trip) return false;

    const newSeq = (trip.requests.length || 0) + 1;
    const totalAmount = (
      Number(payload.estimated_cost || 0) +
      Number(payload.additional_cost || 0)
    ).toString();

    const newRequest: TripRequestItem = {
      id: Date.now(),
      sequence_no: newSeq,
      status: TripRequestStatusEnum.DRAFT,
      eligible_amount: payload.estimated_cost,
      additional_amount: payload.additional_cost || null,
      additional_amount_note: payload.additional_cost_reason || null,
      total_amount: totalAmount,
      approved_amount: null,
      advance_needed: payload.advance_needed,
      advance_amount: payload.advance_needed ? payload.requested_amount || null : null,
      advance: payload.advance_needed
        ? {
            id: Date.now() + 1,
            amount: payload.requested_amount || null,
            issuer: null,
            issued_at: null,
            status: TripAdvanceStatusEnum.PENDING,
            note: null,
          }
        : null,
      approvers: [],
      destinations: payload.destinations.map((d: any) => ({
        from_city: d.from?.value || d.from_city || "",
        to_city: d.to?.value || d.to_city || "",
        start_date: d.start_date ? new Date(d.start_date).toISOString() : new Date().toISOString(),
        end_date: d.end_date ? new Date(d.end_date).toISOString() : new Date().toISOString(),
        travel_time: d.preferred_time_of_travel?.value || d.travel_time || null,
        travel_mode: d.mode?.value || d.travel_mode || TravelModeEnum.FLIGHT,
        accommodation_needed: Boolean(d.accommodation_needed),
        vehicle_needed: Boolean(d.vehicle_needed),
        project: d.project || null,
        note: d.notes || d.note || null,
        accommodations: d.accommodation_needed && d.hotels
          ? d.hotels.map((h: any) => ({
              name: h.name || null,
              city: h.location?.value || h.city || "",
              check_in_date: h.check_in ? new Date(h.check_in).toISOString() : new Date().toISOString(),
              check_out_date: h.check_out ? new Date(h.check_out).toISOString() : new Date().toISOString(),
            }))
          : [],
        travels: d.vehicle_needed && d.vehicles
          ? d.vehicles.map((v: any) => ({
              category: v.category?.value || v.category,
              type: v.mode?.value || v.type,
              note: v.notes || v.note || null,
              date: v.date ? new Date(v.date).toISOString() : new Date().toISOString(),
            }))
          : [],
      })),
    };

    trip.requests.push(newRequest);
    this.setStoredTrips(trips);
    return true;
  }

  static resetToDefault(): TripListItem[] {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TRIPS));
    return INITIAL_TRIPS;
  }
}


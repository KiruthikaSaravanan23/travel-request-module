import React, { useState } from "react";
import {
  Plane,
  ArrowLeft,
  Calendar,
  Building,
  Car,
  FileText,
  User,
  ShieldCheck,
  CheckCircle,
  Clock,
  Plus,
} from "lucide-react";
import { formatToINRCurrency, formatDateDisplay, getDurationInDays, getNightsCount } from "@/lib/utils";
import {
  TripStateStatusEnum,
  TripRequestStatusEnum,
  TripRequestDecisionEnum,
  TravelRequestFormMode,
  type TripListItem,
  type TripRequestItem,
} from "@/types/trips.type";
import { Button } from "@/components/ui/button";
import TripStatusBadge from "./TripStatusBadge";
import ReviewTripDialog from "./ReviewTripDialog";
import { TravelService } from "@/services/travelService";
import { toast } from "sonner";

interface TripDetailsProps {
  tripId: number;
  onBack: () => void;
  onNewRevision: (trip: TripListItem) => void;
  onRefresh: () => void;
}

export const TripDetails: React.FC<TripDetailsProps> = ({
  tripId,
  onBack,
  onNewRevision,
  onRefresh,
}) => {
  const [reviewRequest, setReviewRequest] = useState<TripRequestItem | null>(null);

  const trip = TravelService.getTripById(tripId);

  if (!trip) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <p className="text-gray-500 mb-4">Travel request not found.</p>
        <Button onClick={onBack} variant="outline">
          <ArrowLeft className="size-4 mr-2" /> Back to Travel Requests
        </Button>
      </div>
    );
  }

  const handleDecision = (
    decision: TripRequestDecisionEnum,
    comment: string | null,
    approvedAmount: string | null,
  ) => {
    if (!reviewRequest) return;
    TravelService.decideTripRequest(
      trip.id,
      reviewRequest.id,
      decision,
      comment,
      approvedAmount,
    );
    toast.success(
      `Request v${reviewRequest.sequence_no} ${
        decision === TripRequestDecisionEnum.APPROVE ? "approved" : "rejected"
      }`,
    );
    onRefresh();
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Navigation */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-gray-600 hover:text-[#1c1108] cursor-pointer"
          >
            <ArrowLeft className="size-4 mr-1.5" /> Back
          </Button>
          <div className="h-4 w-px bg-gray-200" />
          <h1 className="text-lg font-bold text-[#1c1108]">
            {trip.code || "Draft Travel Request"}
          </h1>
          <TripStatusBadge status={trip.status} />
        </div>

        <div className="flex items-center gap-2">
          {trip.status === TripStateStatusEnum.ACTIVE && (
            <Button
              size="sm"
              variant="default"
              onClick={() => onNewRevision(trip)}
              className="gap-1.5"
            >
              <Plus className="size-4" /> Add Revision / Itinerary Leg
            </Button>
          )}
        </div>
      </div>

      {/* Trip Banner */}
      {trip.code && (
        <div className="flex items-center gap-4 rounded-xl border border-purple-200 bg-[#f9f2ff] p-4 text-[#8b33fe]">
          <div className="flex size-10 items-center justify-center rounded-lg bg-white shadow-xs">
            <Plane className="size-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Official Travel Authorization ID
            </p>
            <p className="text-base font-bold text-[#1c1108]">{trip.code}</p>
          </div>
        </div>
      )}

      {/* Info Cards Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[#1c1108] border-b border-gray-100 pb-2">
            <User className="size-4 text-[#8b33fe]" />
            <span>Employee Information</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-gray-400">Employee Name</p>
              <p className="font-semibold text-[#1c1108] mt-0.5">
                {trip.created_by.first_name} {trip.created_by.last_name}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Email Address</p>
              <p className="font-semibold text-[#1c1108] mt-0.5 truncate">
                {trip.created_by.email}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Reporting Manager</p>
              <p className="font-semibold text-[#1c1108] mt-0.5">
                {trip.created_by.reporting_manager
                  ? `${trip.created_by.reporting_manager.first_name} ${trip.created_by.reporting_manager.last_name}`
                  : "Self"}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Total Approved Budget</p>
              <p className="font-bold text-emerald-600 mt-0.5">
                {formatToINRCurrency(trip.total_approved_amount)}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[#1c1108] border-b border-gray-100 pb-2">
            <Plane className="size-4 text-[#8b33fe]" />
            <span>Trip Classification</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-gray-400">Trip Name</p>
              <p className="font-semibold text-[#1c1108] mt-0.5 truncate">
                {trip.name}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Travel Type</p>
              <p className="font-semibold text-[#1c1108] mt-0.5 capitalize">
                {trip.travel_type}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Duration Type</p>
              <p className="font-semibold text-[#1c1108] mt-0.5 capitalize">
                {trip.duration_type.replace("_", " ")}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Total Requested Amount</p>
              <p className="font-bold text-[#8b33fe] mt-0.5">
                {formatToINRCurrency(trip.total_request_amount)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Purpose */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-sm font-bold text-[#1c1108]">
          <FileText className="size-4 text-[#8b33fe]" />
          <span>Purpose of Travel</span>
        </div>
        <p className="text-xs text-gray-700 leading-relaxed bg-gray-50/70 p-3 rounded-xl border border-gray-100">
          {trip.purpose}
        </p>
      </div>

      {/* Requests Timeline / Versions */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#1c1108]">
            Travel Request Versions ({trip.requests.length})
          </h2>
        </div>

        {trip.requests.map((request) => (
          <div
            key={request.id}
            className="rounded-2xl border border-gray-200 bg-white shadow-xs overflow-hidden"
          >
            {/* Request Card Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 bg-gradient-to-r from-[#fbf8ff] to-white px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="rounded-lg bg-[#f3e8ff] px-2.5 py-1 text-xs font-bold text-[#8b33fe]">
                  v{request.sequence_no}
                </span>
                <TripStatusBadge status={request.status} />
              </div>

              <div className="flex items-center gap-4 text-xs">
                <div>
                  <span className="text-gray-400 mr-1.5">Eligible:</span>
                  <span className="font-semibold text-[#1c1108]">
                    {formatToINRCurrency(request.eligible_amount)}
                  </span>
                </div>
                {Number(request.additional_amount) > 0 && (
                  <div>
                    <span className="text-gray-400 mr-1.5">Additional:</span>
                    <span className="font-semibold text-amber-600">
                      +{formatToINRCurrency(request.additional_amount)}
                    </span>
                  </div>
                )}
                <div>
                  <span className="text-gray-400 mr-1.5">Total:</span>
                  <span className="font-bold text-[#8b33fe]">
                    {formatToINRCurrency(request.total_amount)}
                  </span>
                </div>

                {request.status === TripRequestStatusEnum.SUBMITTED && (
                  <Button
                    size="sm"
                    onClick={() => setReviewRequest(request)}
                    className="ml-2 h-8 text-xs font-semibold"
                  >
                    Review & Decide
                  </Button>
                )}
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Additional Cost Note if present */}
              {request.additional_amount_note && (
                <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3 text-xs text-amber-900">
                  <span className="font-semibold">Reason for additional cost: </span>
                  {request.additional_amount_note}
                </div>
              )}

              {/* Advance Requested Banner if present */}
              {request.advance_needed && (
                <div className="flex items-center justify-between rounded-xl border border-purple-100 bg-purple-50/50 p-4 text-xs">
                  <div className="space-y-0.5">
                    <p className="font-bold text-[#1c1108]">Advance Payment Request</p>
                    <p className="text-gray-600">
                      Requested: {formatToINRCurrency(request.advance_amount)}
                      {request.approved_amount && ` • Approved: ${formatToINRCurrency(request.approved_amount)}`}
                    </p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 font-semibold uppercase tracking-wider text-[#8b33fe] border border-purple-200">
                    {request.advance?.status || "Pending"}
                  </span>
                </div>
              )}

              {/* Destinations List */}
              <div className="space-y-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Itinerary Destinations ({request.destinations.length})
                </p>
                <div className="grid grid-cols-1 gap-4">
                  {request.destinations.map((dest, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-gray-100 bg-[#fbfbfc] p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#1c1108]">
                            {dest.from_city} → {dest.to_city}
                          </span>
                          <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-700 capitalize">
                            {dest.travel_mode}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Calendar className="size-3.5" />
                          <span>
                            {formatDateDisplay(dest.start_date)} - {formatDateDisplay(dest.end_date)}
                            {" "}({getDurationInDays(dest.start_date, dest.end_date)} days)
                          </span>
                        </div>
                      </div>

                      {dest.project && (
                        <div className="text-xs text-gray-600">
                          <span className="font-medium text-gray-400">Project: </span>
                          <span className="font-semibold">{dest.project.code}</span>
                        </div>
                      )}

                      {dest.note && (
                        <p className="text-xs text-gray-500 italic">"{dest.note}"</p>
                      )}

                      {/* Hotels in this destination */}
                      {dest.accommodation_needed && dest.accommodations && dest.accommodations.length > 0 && (
                        <div className="rounded-lg bg-white p-3 border border-gray-100 space-y-2">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-[#1c1108]">
                            <Building className="size-3.5 text-[#8b33fe]" />
                            <span>Accommodations</span>
                          </div>
                          <div className="grid gap-2 sm:grid-cols-2">
                            {dest.accommodations.map((hotel, hIdx) => (
                              <div key={hIdx} className="text-xs text-gray-700 bg-gray-50 p-2 rounded-md">
                                <p className="font-semibold text-[#1c1108]">{hotel.name || "Hotel Booking"}</p>
                                <p className="text-gray-500">{hotel.city}</p>
                                <p className="text-gray-400 mt-1">
                                  {formatDateDisplay(hotel.check_in_date)} - {formatDateDisplay(hotel.check_out_date)}
                                  {" "}({getNightsCount(hotel.check_in_date, hotel.check_out_date)} nights)
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Vehicles in this destination */}
                      {dest.vehicle_needed && dest.travels && dest.travels.length > 0 && (
                        <div className="rounded-lg bg-white p-3 border border-gray-100 space-y-2">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-[#1c1108]">
                            <Car className="size-3.5 text-[#8b33fe]" />
                            <span>Local Commute & Vehicle</span>
                          </div>
                          <div className="grid gap-2 sm:grid-cols-2">
                            {dest.travels.map((travel, tIdx) => (
                              <div key={tIdx} className="text-xs text-gray-700 bg-gray-50 p-2 rounded-md">
                                <p className="font-semibold text-[#1c1108] capitalize">
                                  {travel.category.replace("_", " ")} • {travel.type.replace("_", " ")}
                                </p>
                                <p className="text-gray-400">{formatDateDisplay(travel.date)}</p>
                                {travel.note && <p className="text-gray-500 italic mt-0.5">"{travel.note}"</p>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Approval Details */}
              {request.approvers && request.approvers.length > 0 && (
                <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#1c1108]">
                    <ShieldCheck className="size-4 text-[#8b33fe]" />
                    <span>Approval Chain & Decision Log</span>
                  </div>
                  {request.approvers.map((approver) => (
                    <div
                      key={approver.id}
                      className="flex items-center justify-between text-xs bg-white p-2.5 rounded-lg border border-gray-100"
                    >
                      <div>
                        <p className="font-semibold text-[#1c1108]">{approver.name}</p>
                        {approver.comments && (
                          <p className="text-gray-500 italic mt-0.5">"{approver.comments}"</p>
                        )}
                      </div>
                      <div className="text-right">
                        <span
                          className={`font-semibold capitalize ${
                            approver.status === "approved"
                              ? "text-emerald-600"
                              : approver.status === "rejected"
                                ? "text-rose-600"
                                : "text-amber-600"
                          }`}
                        >
                          {approver.status}
                        </span>
                        {approver.date && (
                          <p className="text-gray-400 text-[11px]">
                            {formatDateDisplay(approver.date)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <ReviewTripDialog
        open={Boolean(reviewRequest)}
        onOpenChange={(open) => !open && setReviewRequest(null)}
        trip={trip}
        request={reviewRequest}
        onDecision={handleDecision}
      />
    </div>
  );
};

export default TripDetails;


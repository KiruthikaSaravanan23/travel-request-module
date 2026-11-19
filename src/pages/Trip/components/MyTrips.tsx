import React, { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Plane,
  Clock,
  CheckCircle2,
  FileEdit,
  Trash2,
  ChevronRight,
  ChevronDown,
  RotateCcw,
  Eye,
  Send,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { formatToINRCurrency, formatDateDisplay } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  RequestActionType,
  TravelRequestFormMode,
  TripActionType,
  TripRequestStatusEnum,
  TripStateStatusEnum,
  type TravelRequestFormContext,
  type TripListItem,
  type TripRequestItem,
} from "@/types/trips.type";
import {
  REQUEST_ACTION_DIALOG_CONTENT,
  TRIP_ACTION_DIALOG_CONTENT,
} from "@/helpers/constants/trips";
import TripStatusBadge from "./TripStatusBadge";
import TripRequestsTable from "./TripRequestsTable";
import TravelRequestForm from "./TravelRequestForm";
import ConfirmAlertDialog from "@/components/common/ConfirmAlertDialog";
import { TravelService } from "@/services/travelService";

interface MyTripsProps {
  onViewDetails: (tripId: number) => void;
}

export const MyTrips: React.FC<MyTripsProps> = ({ onViewDetails }) => {
  const [trips, setTrips] = useState<TripListItem[]>(() => TravelService.getTrips());
  const [isTripFormOpen, setIsTripFormOpen] = useState(false);
  const [formContext, setFormContext] = useState<TravelRequestFormContext>({
    mode: TravelRequestFormMode.CREATE,
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expandedTripIds, setExpandedTripIds] = useState<Set<number>>(new Set());

  // Action states
  const [tripAction, setTripAction] = useState<{
    type: TripActionType;
    trip: TripListItem;
  } | null>(null);

  const [requestAction, setRequestAction] = useState<{
    type: RequestActionType;
    trip: TripListItem;
    request: TripRequestItem;
  } | null>(null);

  const refreshTrips = () => {
    setTrips(TravelService.getTrips());
  };

  const toggleExpand = (id: number) => {
    setExpandedTripIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Filtered trips
  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      const matchesSearch =
        trip.name.toLowerCase().includes(search.toLowerCase()) ||
        trip.purpose.toLowerCase().includes(search.toLowerCase()) ||
        (trip.code && trip.code.toLowerCase().includes(search.toLowerCase())) ||
        trip.requests.some((r) =>
          r.destinations.some(
            (d) =>
              d.from_city.toLowerCase().includes(search.toLowerCase()) ||
              d.to_city.toLowerCase().includes(search.toLowerCase()),
          ),
        );

      const matchesStatus =
        statusFilter === "all" ||
        trip.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [trips, search, statusFilter]);

  // Metric stats
  const stats = useMemo(() => {
    const total = trips.length;
    const active = trips.filter((t) => t.status === TripStateStatusEnum.ACTIVE).length;
    const pending = trips.filter((t) =>
      t.requests.some((r) => r.status === TripRequestStatusEnum.SUBMITTED),
    ).length;
    const draft = trips.filter((t) => t.status === TripStateStatusEnum.DRAFT).length;
    return { total, active, pending, draft };
  }, [trips]);

  const handleEditRequest = (trip: TripListItem, request: TripRequestItem) => {
    setFormContext({ mode: TravelRequestFormMode.EDIT, trip, request });
    setIsTripFormOpen(true);
  };

  const handleNewRevision = (trip: TripListItem) => {
    setFormContext({ mode: TravelRequestFormMode.NEW_REQUEST, trip });
    setIsTripFormOpen(true);
  };

  const handleConfirmTripAction = () => {
    if (!tripAction) return;
    const { type, trip } = tripAction;
    if (type === TripActionType.DELETE) {
      TravelService.deleteTrip(trip.id);
      toast.success("Trip deleted successfully");
    } else if (type === TripActionType.COMPLETE) {
      TravelService.completeTrip(trip.id);
      toast.success("Trip marked as completed");
    }
    setTripAction(null);
    refreshTrips();
  };

  const handleConfirmRequestAction = () => {
    if (!requestAction) return;
    const { type, trip, request } = requestAction;
    if (type === RequestActionType.SUBMIT) {
      TravelService.submitTripRequest(trip.id, request.id);
      toast.success("Travel request submitted for approval");
    } else if (type === RequestActionType.WITHDRAW) {
      TravelService.withdrawTripRequest(trip.id, request.id);
      toast.success("Travel request withdrawn");
    } else if (type === RequestActionType.DELETE) {
      TravelService.deleteTripRequest(trip.id, request.id);
      toast.success("Travel request version deleted");
    }
    setRequestAction(null);
    refreshTrips();
  };

  const tripActionContent = tripAction
    ? TRIP_ACTION_DIALOG_CONTENT[tripAction.type]
    : null;

  const requestActionContent = requestAction
    ? REQUEST_ACTION_DIALOG_CONTENT[requestAction.type]
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1c1108]">
            Travel Request
          </h1>
          <p className="text-xs text-gray-500 mt-1 max-w-xl">
            Create and manage travel requests with trip details and approvals, and
            use them when submitting related expenses.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              TravelService.resetToDefault();
              refreshTrips();
              toast.info("Reset sample data");
            }}
            className="text-xs"
          >
            <RotateCcw className="size-3.5 mr-1.5" /> Reset Demo
          </Button>
          <Button
            onClick={() => {
              setFormContext({ mode: TravelRequestFormMode.CREATE });
              setIsTripFormOpen(true);
            }}
            className="gap-2 shadow-sm font-semibold"
          >
            <Plus className="size-4" />
            <span>Create Travel Request</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>Total Trips</span>
            <Plane className="size-4 text-[#8b33fe]" />
          </div>
          <p className="mt-2 text-2xl font-extrabold text-[#1c1108]">
            {stats.total}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>Active Trips</span>
            <CheckCircle2 className="size-4 text-emerald-500" />
          </div>
          <p className="mt-2 text-2xl font-extrabold text-emerald-600">
            {stats.active}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>Pending Approvals</span>
            <Clock className="size-4 text-amber-500" />
          </div>
          <p className="mt-2 text-2xl font-extrabold text-amber-600">
            {stats.pending}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>Draft Requests</span>
            <FileEdit className="size-4 text-blue-500" />
          </div>
          <p className="mt-2 text-2xl font-extrabold text-blue-600">
            {stats.draft}
          </p>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white p-3 rounded-2xl border border-gray-200 shadow-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by trip, city, ID, or purpose..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50/60 pl-9 pr-3 py-1.5 text-xs text-[#1c1108] focus:border-[#8b33fe] focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {["all", "active", "draft", "completed", "rejected"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-all cursor-pointer ${
                statusFilter === st
                  ? "bg-[#8b33fe] text-white shadow-xs"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Trips Table */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-xs overflow-hidden">
        {filteredTrips.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <AlertCircle className="size-10 text-gray-300 mb-2" />
            <p className="text-sm font-semibold text-gray-600">No travel requests found</p>
            <p className="text-xs text-gray-400 mt-1">
              Try adjusting your search criteria or create a new travel request.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#fcfaff] border-b border-gray-200 text-gray-500 font-semibold">
                <tr>
                  <th className="py-3.5 px-4 w-10"></th>
                  <th className="py-3.5 px-4">Trip Code / Name</th>
                  <th className="py-3.5 px-4">Type & Duration</th>
                  <th className="py-3.5 px-4">Destinations Route</th>
                  <th className="py-3.5 px-4">Requested / Approved</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredTrips.map((trip) => {
                  const isExpanded = expandedTripIds.has(trip.id);
                  const latestRequest = trip.requests.at(-1);
                  const hasMultiVersions = trip.requests.length > 1;

                  return (
                    <React.Fragment key={trip.id}>
                      <tr className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-3 px-4">
                          {hasMultiVersions && (
                            <button
                              type="button"
                              onClick={() => toggleExpand(trip.id)}
                              className="text-gray-400 hover:text-[#8b33fe] cursor-pointer"
                            >
                              {isExpanded ? (
                                <ChevronDown className="size-4" />
                              ) : (
                                <ChevronRight className="size-4" />
                              )}
                            </button>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-bold text-sm text-[#1c1108]">
                            {trip.name}
                          </div>
                          <div className="text-[11px] text-gray-400 font-medium">
                            {trip.code ? (
                              <span className="font-mono text-[#8b33fe]">
                                {trip.code}
                              </span>
                            ) : (
                              <span className="italic">Pending Submission</span>
                            )}
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="capitalize font-semibold text-gray-700">
                            {trip.travel_type}
                          </span>
                          <span className="text-gray-400"> • </span>
                          <span className="capitalize text-gray-500">
                            {trip.duration_type.replace("_", " ")}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          {latestRequest && latestRequest.destinations.length > 0 ? (
                            <div className="space-y-0.5">
                              <p className="font-semibold text-gray-800">
                                {latestRequest.destinations
                                  .map((d) => `${d.from_city} → ${d.to_city}`)
                                  .join(", ")}
                              </p>
                              <p className="text-[11px] text-gray-400">
                                {formatDateDisplay(latestRequest.destinations[0]?.start_date)}
                              </p>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-semibold text-[#8b33fe]">
                            {formatToINRCurrency(trip.total_request_amount)}
                          </div>
                          {Number(trip.total_approved_amount) > 0 && (
                            <div className="text-[11px] text-emerald-600 font-medium">
                              Approved: {formatToINRCurrency(trip.total_approved_amount)}
                            </div>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          <TripStatusBadge status={trip.status} />
                        </td>

                        <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onViewDetails(trip.id)}
                            className="h-8 text-xs px-2.5 cursor-pointer"
                          >
                            <Eye className="size-3.5 mr-1" /> View
                          </Button>

                          {trip.status === TripStateStatusEnum.DRAFT && latestRequest && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditRequest(trip, latestRequest)}
                                className="h-8 text-xs px-2.5 cursor-pointer"
                              >
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="primary"
                                onClick={() =>
                                  setRequestAction({
                                    type: RequestActionType.SUBMIT,
                                    trip,
                                    request: latestRequest,
                                  })
                                }
                                className="h-8 text-xs px-2.5 cursor-pointer"
                              >
                                Submit
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  setTripAction({
                                    type: TripActionType.DELETE,
                                    trip,
                                  })
                                }
                                className="h-8 text-xs px-2 text-red-500 hover:bg-red-50 hover:text-red-600"
                              >
                                <Trash2 className="size-3.5" />
                              </Button>
                            </>
                          )}

                          {trip.status === TripStateStatusEnum.ACTIVE && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleNewRevision(trip)}
                                className="h-8 text-xs px-2.5 cursor-pointer"
                              >
                                + Revision
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  setTripAction({
                                    type: TripActionType.COMPLETE,
                                    trip,
                                  })
                                }
                                className="h-8 text-xs px-2.5 text-emerald-600 border-emerald-200 hover:bg-emerald-50 cursor-pointer"
                              >
                                Complete
                              </Button>
                            </>
                          )}
                        </td>
                      </tr>

                      {/* Expandable revisions row */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={7} className="p-0 bg-gray-50/50">
                            <TripRequestsTable
                              trip={trip}
                              onEdit={(request) => handleEditRequest(trip, request)}
                              onSubmit={(request) =>
                                setRequestAction({
                                  type: RequestActionType.SUBMIT,
                                  trip,
                                  request,
                                })
                              }
                              onWithdraw={(request) =>
                                setRequestAction({
                                  type: RequestActionType.WITHDRAW,
                                  trip,
                                  request,
                                })
                              }
                              onDelete={(request) =>
                                setRequestAction({
                                  type: RequestActionType.DELETE,
                                  trip,
                                  request,
                                })
                              }
                            />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Travel Request Form Slide-over Sheet */}
      <TravelRequestForm
        isTripFormOpen={isTripFormOpen}
        onOpenChange={setIsTripFormOpen}
        formContext={formContext}
        onSuccess={() => {
          refreshTrips();
        }}
      />

      {/* Confirmation Dialogs */}
      {tripActionContent && (
        <ConfirmAlertDialog
          open={Boolean(tripAction)}
          onOpenChange={(open) => !open && setTripAction(null)}
          title={tripActionContent.title}
          content={tripActionContent.content}
          confirmText={tripActionContent.confirmText}
          confirmVariant={tripActionContent.confirmVariant}
          onConfirm={handleConfirmTripAction}
          onCancel={() => setTripAction(null)}
        />
      )}

      {requestActionContent && (
        <ConfirmAlertDialog
          open={Boolean(requestAction)}
          onOpenChange={(open) => !open && setRequestAction(null)}
          title={requestActionContent.title}
          content={requestActionContent.content}
          confirmText={requestActionContent.confirmText}
          confirmVariant={requestActionContent.confirmVariant}
          onConfirm={handleConfirmRequestAction}
          onCancel={() => setRequestAction(null)}
        />
      )}
    </div>
  );
};

export default MyTrips;


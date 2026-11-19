import React from "react";
import { formatToINRCurrency, formatDateDisplay } from "@/lib/utils";
import {
  TripRequestStatusEnum,
  type TripListItem,
  type TripRequestItem,
} from "@/types/trips.type";
import { Button } from "@/components/ui/button";
import TripStatusBadge from "./TripStatusBadge";

interface TripRequestsTableProps {
  trip: TripListItem;
  onEdit: (request: TripRequestItem) => void;
  onSubmit: (request: TripRequestItem) => void;
  onWithdraw: (request: TripRequestItem) => void;
  onDelete: (request: TripRequestItem) => void;
}

export const TripRequestsTable: React.FC<TripRequestsTableProps> = ({
  trip,
  onEdit,
  onSubmit,
  onWithdraw,
  onDelete,
}) => {
  return (
    <div className="bg-[#fafbfc] px-6 py-4 rounded-xl border border-gray-100 my-2">
      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
        Request Versions & Revisions ({trip.requests.length})
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-gray-200 text-gray-500">
              <th className="py-2 font-semibold">Version</th>
              <th className="py-2 font-semibold">Status</th>
              <th className="py-2 font-semibold">Eligible Amount</th>
              <th className="py-2 font-semibold">Additional</th>
              <th className="py-2 font-semibold">Total Amount</th>
              <th className="py-2 font-semibold">Advance Req.</th>
              <th className="py-2 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {trip.requests.map((request) => (
              <tr key={request.id} className="hover:bg-white/80 transition-colors">
                <td className="py-2.5 font-medium text-[#1c1108]">
                  v{request.sequence_no}
                </td>
                <td className="py-2.5">
                  <TripStatusBadge status={request.status} />
                </td>
                <td className="py-2.5 text-gray-700">
                  {formatToINRCurrency(request.eligible_amount)}
                </td>
                <td className="py-2.5 text-gray-700">
                  {formatToINRCurrency(request.additional_amount || "0")}
                </td>
                <td className="py-2.5 font-semibold text-[#1c1108]">
                  {formatToINRCurrency(request.total_amount)}
                </td>
                <td className="py-2.5 text-gray-700">
                  {request.advance_needed
                    ? formatToINRCurrency(request.advance_amount)
                    : "No"}
                </td>
                <td className="py-2.5 text-right space-x-2">
                  {request.status === TripRequestStatusEnum.DRAFT && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEdit(request)}
                        className="h-7 text-xs px-2.5"
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => onSubmit(request)}
                        className="h-7 text-xs px-2.5"
                      >
                        Submit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => onDelete(request)}
                        className="h-7 text-xs px-2.5"
                      >
                        Delete
                      </Button>
                    </>
                  )}
                  {request.status === TripRequestStatusEnum.SUBMITTED && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onWithdraw(request)}
                      className="h-7 text-xs px-2.5 text-red-600 border-red-200 hover:bg-red-50"
                    >
                      Withdraw
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TripRequestsTable;


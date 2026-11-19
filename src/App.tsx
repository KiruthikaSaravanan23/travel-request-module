import React, { useState } from "react";
import { Toaster } from "sonner";
import { Plane, Compass, Sparkles, UserCheck } from "lucide-react";
import MyTrips from "./pages/Trip/components/MyTrips";
import TripDetails from "./pages/Trip/components/TripDetails";
import TravelRequestForm from "./pages/Trip/components/TravelRequestForm";
import { TravelRequestFormMode, type TravelRequestFormContext, type TripListItem } from "./types/trips.type";
import { TravelService } from "./services/travelService";

export const App: React.FC = () => {
  const [selectedTripId, setSelectedTripId] = useState<number | null>(null);
  const [isTripFormOpen, setIsTripFormOpen] = useState(false);
  const [formContext, setFormContext] = useState<TravelRequestFormContext>({
    mode: TravelRequestFormMode.CREATE,
  });

  const [refreshKey, setRefreshKey] = useState(0);

  const handleNewRevision = (trip: TripListItem) => {
    setFormContext({ mode: TravelRequestFormMode.NEW_REQUEST, trip });
    setIsTripFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex flex-col font-sans">
      <Toaster position="top-right" richColors />

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 px-6 py-3.5 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setSelectedTripId(null)}>
            <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#8b33fe] to-[#a319c6] text-white shadow-sm">
              <Compass className="size-5" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-[#1c1108]">
                ARCHE <span className="text-[#8b33fe]">TRAVEL</span>
              </span>
              <span className="ml-2 rounded-md bg-purple-50 px-2 py-0.5 text-[11px] font-bold text-[#8b33fe] uppercase tracking-wide">
                Expense Module
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50/70 px-3 py-1.5 text-xs text-gray-600">
              <UserCheck className="size-4 text-emerald-600" />
              <span>Signed in as: <b>Kiruthika Saravanan</b></span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8">
        {selectedTripId ? (
          <TripDetails
            key={refreshKey}
            tripId={selectedTripId}
            onBack={() => setSelectedTripId(null)}
            onNewRevision={handleNewRevision}
            onRefresh={() => setRefreshKey((k) => k + 1)}
          />
        ) : (
          <MyTrips
            onViewDetails={(id) => setSelectedTripId(id)}
          />
        )}
      </main>

      {/* Slide-over Form Sheet */}
      <TravelRequestForm
        isTripFormOpen={isTripFormOpen}
        onOpenChange={setIsTripFormOpen}
        formContext={formContext}
        onSuccess={() => {
          setRefreshKey((k) => k + 1);
        }}
      />
    </div>
  );
};

export default App;


import { useMemo } from "react";
import { getDurationInDays, getNightsCount } from "@/lib/utils";
import { getPerDiemByCity } from "@/services/travelService";
import type { DestinationItemValues } from "../zod-schema/travelRequestFormSchema";

interface UseEligibleCostProps {
  destinations: DestinationItemValues[];
  isEnabled?: boolean;
}

interface MealCostItem {
  city: string | undefined;
  durationDays: number;
}

interface AccommodationCostItem {
  city: string | undefined;
  nights: number;
}

export const useEligibleCost = ({
  destinations,
  isEnabled = true,
}: UseEligibleCostProps) => {
  const relevantFieldsKey = JSON.stringify(
    destinations.map((destination) => ({
      to: destination?.to?.value ?? null,
      start_date: destination?.start_date,
      end_date: destination?.end_date,
      accommodation_needed: destination?.accommodation_needed,
      hotels: destination?.accommodation_needed
        ? (destination?.hotels || []).map((hotel) => ({
            location: hotel?.location?.value ?? null,
            check_in: hotel?.check_in,
            check_out: hotel?.check_out,
          }))
        : [],
    })),
  );

  const { mealItems, accommodationItems } = useMemo(() => {
    if (!isEnabled || !destinations) {
      return { mealItems: [], accommodationItems: [] };
    }

    const mealItems: MealCostItem[] = destinations.map((destination) => ({
      city: destination?.to?.value,
      durationDays: getDurationInDays(
        destination?.start_date ?? null,
        destination?.end_date ?? null,
      ),
    }));

    const accommodationItems: AccommodationCostItem[] = destinations.flatMap(
      (destination) =>
        destination?.accommodation_needed
          ? (destination?.hotels || []).map((hotel) => ({
              city: hotel?.location?.value,
              nights: getNightsCount(hotel?.check_in ?? null, hotel?.check_out ?? null),
            }))
          : [],
    );

    return { mealItems, accommodationItems };
  }, [relevantFieldsKey, isEnabled, destinations]);

  const mealsCost = useMemo(() => {
    return mealItems.reduce((total, item) => {
      const perDiem = getPerDiemByCity(item.city).meals_food_per_diem;
      return total + perDiem * item.durationDays;
    }, 0);
  }, [mealItems]);

  const accommodationCost = useMemo(() => {
    return accommodationItems.reduce((total, item) => {
      const perDiem = getPerDiemByCity(item.city).hotel_accommodation_per_diem;
      return total + perDiem * item.nights;
    }, 0);
  }, [accommodationItems]);

  const grandEstimatedCost = mealsCost + accommodationCost;

  return {
    mealsCost,
    accommodationCost,
    grandEstimatedCost,
    isEligibleCostFetching: false,
  };
};

export default useEligibleCost;


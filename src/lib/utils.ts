import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { differenceInCalendarDays, format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const allowNumbersWithDecimal = (
  event: React.KeyboardEvent<HTMLInputElement>,
) => {
  const input = event.currentTarget;
  const value = input.value;
  const cursorPosition = input.selectionStart ?? value.length;

  const isControlA =
    (event.key === "a" || event.key === "A") &&
    (event.ctrlKey || event.metaKey);

  if (isControlA) return;
  const allowedKeys = [
    "Backspace",
    "Tab",
    "Enter",
    "Escape",
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    "ArrowDown",
    "Delete",
  ];
  if (allowedKeys.includes(event.key)) return;

  if (event.key === ".") {
    if (value.includes(".")) {
      event.preventDefault();
    }
    return;
  }

  if (!/^[0-9]$/.test(event.key)) {
    event.preventDefault();
    return;
  }

  const decimalIndex = value.indexOf(".");
  const isTypingAfterDecimal =
    decimalIndex !== -1 && cursorPosition > decimalIndex;
  const [, decimalPart] = value.split(".");

  if (isTypingAfterDecimal && decimalPart && decimalPart.length >= 2) {
    event.preventDefault();
  }
};

export const formatToINRCurrency = (
  value?: number | string | null,
  compact = false,
  fallbackValue: string = "₹0",
) => {
  if (value === null || value === undefined || value === "") {
    return fallbackValue;
  }
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return fallbackValue;
  return new Intl.NumberFormat("en-IN", {
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
    currency: "INR",
    style: "currency",
  }).format(numeric);
};

export const getDurationInDays = (
  startDate: Date | string | null,
  endDate: Date | string | null,
): number => {
  if (!startDate || !endDate) return 0;
  const start = typeof startDate === "string" ? new Date(startDate) : startDate;
  const end = typeof endDate === "string" ? new Date(endDate) : endDate;
  if (end < start) return 0;
  return differenceInCalendarDays(end, start) + 1;
};

export const getNightsCount = (
  checkIn: Date | string | null,
  checkOut: Date | string | null,
): number => {
  if (!checkIn || !checkOut) return 0;
  const inDate = typeof checkIn === "string" ? new Date(checkIn) : checkIn;
  const outDate = typeof checkOut === "string" ? new Date(checkOut) : checkOut;
  if (outDate < inDate) return 0;
  return differenceInCalendarDays(outDate, inDate);
};

export const formatDateDisplay = (date: Date | string | null) => {
  if (!date) return "-";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "-";
  return format(d, "dd MMM yyyy");
};


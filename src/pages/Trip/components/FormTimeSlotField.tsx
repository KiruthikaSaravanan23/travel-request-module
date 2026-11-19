import React from "react";
import { useController, type Control, type FieldValues, type Path } from "react-hook-form";
import { Clock } from "lucide-react";
import type { PreferredTimeOfTravelOption } from "@/helpers/constants/trips";
import { cn } from "@/lib/utils";

interface FormTimeSlotFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  options: PreferredTimeOfTravelOption[];
  disabled?: boolean;
  isRequired?: boolean;
  labelClassName?: string;
  placeholderClassName?: string;
  triggerClassName?: string;
  className?: string;
}

export const FormTimeSlotField = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder = "Select preferred time",
  options,
  disabled,
  isRequired,
  labelClassName,
  className,
}: FormTimeSlotFieldProps<T>) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const selectedValue = field.value?.value ?? field.value ?? "";

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label
          className={cn(
            "text-xs font-semibold text-[#1c1108]",
            labelClassName,
          )}
        >
          {label}
          {isRequired && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          disabled={disabled}
          value={selectedValue}
          onChange={(e) => {
            const val = e.target.value;
            const found = options.find((opt) => opt.value === val);
            field.onChange(
              found
                ? {
                    value: found.value,
                    label: found.label,
                    subLabel: found.subLabel,
                  }
                : null,
            );
          }}
          className={cn(
            "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#1c1108] transition-colors focus:border-[#8b33fe] focus:outline-none focus:ring-1 focus:ring-[#8b33fe] disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400 cursor-pointer pr-8",
            error && "border-red-500 focus:border-red-500",
          )}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label} ({opt.subLabel})
            </option>
          ))}
        </select>
        <Clock className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
      </div>
      {error && <p className="text-xs text-red-500">{error.message}</p>}
    </div>
  );
};

export default FormTimeSlotField;


import React from "react";
import { useController, type Control, type FieldValues, type Path } from "react-hook-form";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface FormDateFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  isRequired?: boolean;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
  placeholderClassName?: string;
  fieldClassName?: string;
}

export const FormDateField = <T extends FieldValues>({
  control,
  name,
  label,
  isRequired,
  disabled,
  className,
  labelClassName,
  fieldClassName,
}: FormDateFieldProps<T>) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const rawValue = field.value as unknown;
  const valueString = rawValue
    ? rawValue instanceof Date
      ? format(rawValue, "yyyy-MM-dd")
      : typeof rawValue === "string" && !isNaN(new Date(rawValue).getTime())
        ? format(new Date(rawValue), "yyyy-MM-dd")
        : ""
    : "";

  return (
    <div className={cn("flex flex-col gap-1.5", fieldClassName)}>
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
      <input
        type="date"
        disabled={disabled}
        value={valueString}
        onChange={(e) => {
          const val = e.target.value;
          field.onChange(val ? new Date(val) : null);
        }}
        className={cn(
          "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#1c1108] transition-colors focus:border-[#8b33fe] focus:outline-none focus:ring-1 focus:ring-[#8b33fe] disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400 cursor-pointer",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500",
          className,
        )}
      />
      {error && <p className="text-xs text-red-500">{error.message}</p>}
    </div>
  );
};

export default FormDateField;

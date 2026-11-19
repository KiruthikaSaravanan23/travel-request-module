import React from "react";
import { useController, type Control, type FieldValues, type Path } from "react-hook-form";
import { cn, formatToINRCurrency } from "@/lib/utils";

interface FormInputFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  isRequired?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  formatAsINR?: boolean;
  className?: string;
  labelClassName?: string;
  fieldClassName?: string;
  labelAddon?: React.ReactNode;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const FormInputField = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  isRequired,
  disabled,
  readOnly,
  formatAsINR,
  className,
  labelClassName,
  fieldClassName,
  labelAddon,
  onKeyDown,
}: FormInputFieldProps<T>) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const displayValue = formatAsINR && readOnly && field.value
    ? formatToINRCurrency(field.value, false, "₹0")
    : field.value ?? "";

  return (
    <div className={cn("flex flex-col gap-1.5", fieldClassName)}>
      {label && (
        <div className="flex items-center justify-between">
          <label
            className={cn(
              "text-xs font-semibold text-[#1c1108]",
              labelClassName,
            )}
          >
            {label}
            {isRequired && <span className="text-red-500 ml-0.5">*</span>}
          </label>
          {labelAddon}
        </div>
      )}
      <input
        {...field}
        value={displayValue}
        onChange={(e) => {
          let val = e.target.value;
          field.onChange(val);
        }}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        className={cn(
          "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#1c1108] placeholder-gray-400 transition-colors focus:border-[#8b33fe] focus:outline-none focus:ring-1 focus:ring-[#8b33fe] disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400",
          readOnly && "bg-gray-50/70 cursor-default",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500",
          className,
        )}
      />
      {error && <p className="text-xs text-red-500">{error.message}</p>}
    </div>
  );
};

export default FormInputField;


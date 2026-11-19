import React from "react";
import { useController, type Control, type FieldValues, type Path } from "react-hook-form";
import { cn } from "@/lib/utils";

interface OptionItem {
  label: string;
  value: string;
  subLabel?: string;
}

interface FormSelectFieldProps<T extends FieldValues, Option extends OptionItem = OptionItem> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  options: Option[];
  isRequired?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  isCreatable?: boolean;
  className?: string;
  labelClassName?: string;
  placeholderClassName?: string;
  fieldClassName?: string;
  onInputChange?: (value: string) => void;
}

export const FormSelectField = <T extends FieldValues, Option extends OptionItem = OptionItem>({
  control,
  name,
  label,
  placeholder = "Select option",
  options,
  isRequired,
  disabled,
  className,
  labelClassName,
  fieldClassName,
}: FormSelectFieldProps<T, Option>) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const selectedValue = field.value?.value ?? field.value ?? "";

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
      <select
        disabled={disabled}
        value={selectedValue}
        onChange={(e) => {
          const val = e.target.value;
          const found = options.find((opt) => opt.value === val);
          field.onChange(found ? { label: found.label, value: found.value } : null);
        }}
        className={cn(
          "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#1c1108] transition-colors focus:border-[#8b33fe] focus:outline-none focus:ring-1 focus:ring-[#8b33fe] disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400 cursor-pointer",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500",
          className,
        )}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500">{error.message}</p>}
    </div>
  );
};

export default FormSelectField;


import React from "react";
import { useController, type Control, type FieldValues, type Path } from "react-hook-form";
import { cn } from "@/lib/utils";

interface SelectDropdownProps<T extends FieldValues, Option> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholderText?: string;
  options: Option[];
  getLabel: (option: Option) => string;
  getValue: (option: Option) => string;
  isRequired?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  isSearchable?: boolean;
  value?: string;
  className?: string;
  labelClassName?: string;
  fieldClassName?: string;
  onInputChange?: (val: string) => void;
}

export const SelectDropdown = <T extends FieldValues, Option>({
  control,
  name,
  label,
  placeholderText = "Select option",
  options,
  getLabel,
  getValue,
  isRequired,
  disabled,
  className,
  labelClassName,
  fieldClassName,
}: SelectDropdownProps<T, Option>) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const currentVal = field.value
    ? typeof field.value === "object"
      ? (field.value.id !== undefined ? String(field.value.id) : field.value.value ?? "")
      : String(field.value)
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
      <select
        disabled={disabled}
        value={currentVal}
        onChange={(e) => {
          const val = e.target.value;
          const found = options.find((opt) => getValue(opt) === val);
          field.onChange(found || null);
        }}
        className={cn(
          "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#1c1108] transition-colors focus:border-[#8b33fe] focus:outline-none focus:ring-1 focus:ring-[#8b33fe] disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400 cursor-pointer",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500",
          className,
        )}
      >
        <option value="" disabled>
          {placeholderText}
        </option>
        {options.map((option) => {
          const keyVal = getValue(option);
          const labelText = getLabel(option);
          return (
            <option key={keyVal} value={keyVal}>
              {labelText}
            </option>
          );
        })}
      </select>
      {error && <p className="text-xs text-red-500">{error.message}</p>}
    </div>
  );
};

export default SelectDropdown;


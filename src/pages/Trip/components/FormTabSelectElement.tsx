import React from "react";
import { useController, type Control, type FieldValues, type Path } from "react-hook-form";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { SelectOption } from "@/types/trips.type";
import { cn } from "@/lib/utils";

interface FormTabSelectElementProps<T extends FieldValues, OptionValue extends string = string> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  options: SelectOption<OptionValue>[];
  isRequired?: boolean;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
  tabsListClassName?: string;
}

export const FormTabSelectElement = <T extends FieldValues, OptionValue extends string = string>({
  control,
  name,
  label,
  options,
  isRequired,
  disabled,
  className,
  labelClassName,
  tabsListClassName,
}: FormTabSelectElementProps<T, OptionValue>) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

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
      <Tabs
        value={field.value ?? ""}
        onValueChange={(val) => !disabled && field.onChange(val)}
        className="w-full"
      >
        <TabsList className={cn("grid w-full h-10", tabsListClassName)} style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}>
          {options.map((option) => (
            <TabsTrigger
              key={option.value}
              value={option.value}
              disabled={disabled}
              className="text-xs py-2 data-[state=active]:bg-white data-[state=active]:text-[#8b33fe] data-[state=active]:font-bold data-[state=active]:shadow-sm"
            >
              {option.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      {error && <p className="text-xs text-red-500">{error.message}</p>}
    </div>
  );
};

export default FormTabSelectElement;


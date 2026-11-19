import React from "react";
import { useController, type Control, type FieldValues, type Path } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface FormSwitchFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  labelClassName?: string;
  className?: string;
  disabled?: boolean;
}

export const FormSwitchField = <T extends FieldValues>({
  control,
  name,
  label,
  labelClassName,
  className,
  disabled,
}: FormSwitchFieldProps<T>) => {
  const { field } = useController({
    name,
    control,
  });

  return (
    <div className={cn("flex items-center justify-between py-1", className)}>
      <label
        className={cn(
          "text-xs font-semibold text-[#1c1108] cursor-pointer",
          labelClassName,
        )}
        onClick={() => !disabled && field.onChange(!field.value)}
      >
        {label}
      </label>
      <Switch
        checked={Boolean(field.value)}
        onCheckedChange={field.onChange}
        disabled={disabled}
      />
    </div>
  );
};

export default FormSwitchField;


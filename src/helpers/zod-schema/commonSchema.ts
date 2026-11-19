import { z } from "zod";

export interface StringNumberSchemaOptions {
  message?: string;
  min?: number;
  minMessage?: string;
  max?: number;
  maxMessage?: string;
  decimalMessage?: string;
}

export const optionalNumericSchema = (schema: z.ZodTypeAny) =>
  z.union([z.literal(""), z.null(), schema]).nullable().optional();

export const decimalSchema = ({
  message = "Enter a valid decimal number",
  min,
  minMessage,
  max,
  maxMessage,
  decimalMessage = "Decimal cannot end with a decimal point",
}: StringNumberSchemaOptions = {}) => {
  let schema = z
    .string()
    .trim()
    .regex(/^\d+(\.\d+)?$/, message)
    .refine((value) => !value.endsWith("."), {
      message: decimalMessage,
    });

  if (min !== undefined) {
    schema = schema.refine((value) => Number(value) >= min, {
      message: minMessage ?? `Value must be ≥ ${min}`,
    });
  }

  if (max !== undefined) {
    schema = schema.refine((value) => Number(value) <= max, {
      message: maxMessage ?? `Value must be ≤ ${max}`,
    });
  }

  return schema;
};

export const amountSchema = ({
  message = "Enter a valid amount",
  min,
  minMessage,
  max,
  maxMessage,
  decimalMessage = "Amount cannot end with a decimal point",
}: StringNumberSchemaOptions = {}) => {
  return decimalSchema({
    message,
    min,
    minMessage,
    max,
    maxMessage,
    decimalMessage,
  });
};

import { z } from "zod";

import { isValueEmpty } from "./utils";

export type Validator = {
  required?: boolean;
  url?: boolean;
};

const httpUrlSchema = z
  .string()
  .trim()
  .url()
  .refine(
    (value) => value.startsWith("http://") || value.startsWith("https://"),
    {
      message: "URL must start with http:// or https://",
    }
  );

function isValidHttpUrl(value: string): boolean {
  return httpUrlSchema.safeParse(value).success;
}

export function isRawInvalid(
  validator: Validator | undefined,
  value: unknown
): boolean {
  if (!validator) return false;

  if (validator.required && isValueEmpty(value)) {
    return true;
  }

  if (validator.url) {
    // URL is optional unless `required` is also set.
    if (isValueEmpty(value)) {
      return false;
    }
    if (typeof value !== "string") {
      return true;
    }
    return !isValidHttpUrl(value);
  }

  return false;
}

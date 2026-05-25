import { z } from "zod";

import { isValueEmpty } from "./utils";

export type Validator = {
  required?: boolean;
  url?: boolean;
  httpsUrl?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: {
    regex: RegExp;
    message: string;
  };
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

const httpsUrlSchema = z
  .string()
  .trim()
  .url()
  .refine((value) => value.startsWith("https://"), {
    message: "URL must start with https://",
  });

export function validateRequired(value: unknown): string | undefined {
  if (isValueEmpty(value)) {
    return "This field is required";
  }
  return undefined;
}

export function validateHttpsUrl(value: unknown): string | undefined {
  if (isValueEmpty(value)) {
    return undefined;
  }
  if (typeof value !== "string") {
    return "Must be a valid HTTPS URL";
  }
  if (!httpsUrlSchema.safeParse(value).success) {
    return "Must be a valid HTTPS URL";
  }
  return undefined;
}

export function validateHttpUrl(value: unknown): string | undefined {
  if (isValueEmpty(value)) {
    return undefined;
  }
  if (typeof value !== "string") {
    return "Must be a valid URL";
  }
  if (!httpUrlSchema.safeParse(value).success) {
    return "Must be a valid URL starting with http:// or https://";
  }
  return undefined;
}

export function validateMinLength(
  value: string,
  minLength: number
): string | undefined {
  if (value.length < minLength) {
    return `Must be at least ${minLength} character${
      minLength === 1 ? "" : "s"
    }`;
  }
  return undefined;
}

export function validateMaxLength(
  value: string,
  maxLength: number
): string | undefined {
  if (value.length > maxLength) {
    return `Must be at most ${maxLength} characters`;
  }
  return undefined;
}

export function validatePattern(
  value: string,
  pattern: { regex: RegExp; message: string }
): string | undefined {
  if (!pattern.regex.test(value)) {
    return pattern.message;
  }
  return undefined;
}

export function validateStringConstraints(
  value: unknown,
  validator: Validator
): string | undefined {
  if (typeof value !== "string" || isValueEmpty(value)) return undefined;

  if (validator.minLength !== undefined) {
    const error = validateMinLength(value, validator.minLength);
    if (error) return error;
  }

  if (validator.maxLength !== undefined) {
    const error = validateMaxLength(value, validator.maxLength);
    if (error) return error;
  }

  if (validator.pattern) {
    const error = validatePattern(value, validator.pattern);
    if (error) return error;
  }

  return undefined;
}

export function getValidationError(
  validator: Validator | undefined,
  value: unknown
): string | undefined {
  if (!validator) return undefined;

  if (validator.required) {
    const error = validateRequired(value);
    if (error) return error;
  }

  if (validator.httpsUrl) {
    const error = validateHttpsUrl(value);
    if (error) return error;
  }

  if (validator.url) {
    const error = validateHttpUrl(value);
    if (error) return error;
  }

  const stringValidationError = validateStringConstraints(value, validator);
  if (stringValidationError) return stringValidationError;

  return undefined;
}

export function isRawInvalid(
  validator: Validator | undefined,
  value: unknown
): boolean {
  return getValidationError(validator, value) !== undefined;
}

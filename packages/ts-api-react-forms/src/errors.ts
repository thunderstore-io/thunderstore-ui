import { ApiError, isApiError } from "@thunderstore/thunderstore-api";
import { ZodObject, ZodRawShape } from "zod";
import { Path, UseFormSetError } from "react-hook-form";

// TODO: The types and schema usage might be super stupid here
export function getErrorFormKey<
  T extends ZodObject<ZodRawShape>,
  Data extends object,
>(schema: T, key: string): Path<Data> | "root" {
  for (const validKey of Object.keys(schema.shape) as Array<Path<Data>>) {
    if (key === validKey) return validKey;
  }
  return "root";
}

export function handleFormApiErrors<
  Schema extends ZodObject<ZodRawShape>,
  Data extends object,
>(
  error: Error | ApiError | unknown,
  schema: Schema,
  setError: UseFormSetError<Data>
) {
  if (isApiError(error)) {
    // TODO: Improve this to consider for more API error scenarios than
    //       just field errors; there are many other things which can be
    //       known but aren't field errors.

    for (const [k, v] of Object.entries(error.getFieldErrors())) {
      const key = getErrorFormKey<Schema, Data>(schema, k);
      setError(key, { type: "manual", message: v.join(" | ") });
    }
  }
}

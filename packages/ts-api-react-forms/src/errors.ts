import { ApiError, isApiError } from "@thunderstore/thunderstore-api";
import { TypeOf, z, ZodObject, ZodRawShape } from "zod";
import { Path, UseFormReturn } from "react-hook-form";

export function getErrorFormKey<T extends ZodObject<Z>, Z extends ZodRawShape>(
  schema: T,
  key: string
): Path<TypeOf<T>> | "root" {
  for (const validKey of Object.keys(schema.shape) as Array<Path<TypeOf<T>>>) {
    if (key === validKey) return validKey;
  }
  return "root";
}

export function handleFormApiErrors<
  Schema extends ZodObject<Z>,
  Z extends ZodRawShape,
>(
  error: Error | ApiError | unknown,
  schema: Schema,
  setError: UseFormReturn<z.infer<Schema>>["setError"]
) {
  if (isApiError(error)) {
    // TODO: Improve this to consider for more API error scenarios than
    //       just field errors; there are many other things which can be
    //       known but aren't field errors.

    for (const [k, v] of Object.entries(error.getFieldErrors())) {
      const key = getErrorFormKey(schema, k);
      setError(key, { type: "manual", message: v.join(" | ") });
    }
  }
}

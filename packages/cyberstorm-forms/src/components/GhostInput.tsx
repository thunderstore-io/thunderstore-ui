"use client";

import { z, ZodObject, ZodRawShape } from "zod";
import { Path, useController } from "react-hook-form";
import React from "react";

export type GhostInputProps<
  Schema extends ZodObject<Z>,
  Z extends ZodRawShape
> = {
  // The schema is required to allow TS to infer valid values for the name field
  schema: Schema;
  name: Path<z.infer<Schema>>;
  value?: string;
};
export function GhostInput<Schema extends ZodObject<Z>, Z extends ZodRawShape>({
  name,
  value,
}: GhostInputProps<Schema, Z>) {
  const { field } = useController({ name });

  if (value) {
    React.useEffect(() => {
      field.onChange(value);
    }, [value]);
  }

  return <input {...field} ref={field.ref} />;
}

GhostInput.displayName = "GhostInput";

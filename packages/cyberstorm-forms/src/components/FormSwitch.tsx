import { z, ZodObject } from "zod";
import { ZodRawShape } from "zod/lib/types";
import { Path, useController } from "react-hook-form";
import styles from "./FormTextInput.module.css";
import { Switch } from "@thunderstore/cyberstorm";

export type FormSwitchProps<
  Schema extends ZodObject<Z>,
  Z extends ZodRawShape
> = {
  // The schema is required to allow TS to infer valid values for the name field
  schema: Schema;
  name: Path<z.infer<Schema>>;
  placeholder?: string;
};
export function FormSwitch<Schema extends ZodObject<Z>, Z extends ZodRawShape>({
  name,
}: FormSwitchProps<Schema, Z>) {
  const {
    field,
    fieldState: { error },
    formState: { isSubmitting, disabled },
  } = useController({ name });

  return (
    <>
      <Switch {...field} disabled={isSubmitting || disabled} />
      {error && <span className={styles.errorMessage}>{error.message}</span>}
    </>
  );
}

FormSwitch.displayName = "FormSwitch";

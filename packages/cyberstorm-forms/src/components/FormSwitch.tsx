import { z, ZodObject, ZodRawShape } from "zod";
import { Path, useController } from "react-hook-form";
import styles from "./FormTextInput.module.css";
import { NewSwitch } from "@thunderstore/cyberstorm";

export type FormSwitchProps<
  Schema extends ZodObject<Z>,
  Z extends ZodRawShape,
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
      <NewSwitch {...field} disabled={isSubmitting || disabled} />
      {error && <span className={styles.errorMessage}>{error.message}</span>}
    </>
  );
}

FormSwitch.displayName = "FormSwitch";

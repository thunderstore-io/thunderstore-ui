"use client";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  FormProvider,
  Path,
  useController,
  useForm,
  UseFormReturn,
  useFormState,
} from "react-hook-form";
import * as Button from "../../Button";
import { TextInput } from "../../TextInput/TextInput";
import { useToast } from "../../Toast/Provider";
import styles from "./CreateTeamForm.module.css";
import { TypeOf, z, ZodObject } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ApiError,
  createTeam,
  RequestConfig,
} from "@thunderstore/thunderstore-api";
import { ZodRawShape } from "zod/lib/types";
import React, { HTMLAttributes, PropsWithChildren } from "react";

function useApiConfig(): RequestConfig {
  // TODO: Create context manager & read from there instead of hardcoding
  return {
    apiHost: "http://thunderstore.temp",
    sessionId: "74hmbkylkgqge1ne22tzuvzuz6u51tdg",
  };
}

function isApiError(e: Error | ApiError | unknown): e is ApiError {
  return e instanceof ApiError;
}

function getErrorFormKey<T extends ZodObject<Z>, Z extends ZodRawShape>(
  schema: T,
  key: string
): Path<TypeOf<T>> | "root" {
  for (const validKey of Object.keys(schema.shape) as Array<Path<TypeOf<T>>>) {
    if (key === validKey) return validKey;
  }
  return "root";
}

type ApiEndpoint<Data, Result> = (
  config: RequestConfig,
  data: Data
) => Promise<Result>;
function useApiCall<Data, Result>(
  endpoint: ApiEndpoint<Data, Result>
): (data: Data) => Promise<Result> {
  const apiConfig = useApiConfig();
  return (data: Data) => endpoint(apiConfig, data);
}

function handleFormApiErrors<
  Schema extends ZodObject<Z>,
  Z extends ZodRawShape
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

type UseApiFormArgs<
  Schema extends ZodObject<Z>,
  Result extends object,
  Z extends ZodRawShape
> = {
  schema: Schema;
  endpoint: ApiEndpoint<z.infer<Schema>, Result>;
};
type UseApiFormReturn<
  Schema extends ZodObject<Z>,
  Result extends object,
  Z extends ZodRawShape
> = {
  form: UseFormReturn<z.infer<Schema>>;
  submitHandler: (data: z.infer<Schema>) => Promise<Result>;
};
function useApiForm<
  Schema extends ZodObject<Z>,
  Result extends object,
  Z extends ZodRawShape
>(
  args: UseApiFormArgs<Schema, Result, Z>
): UseApiFormReturn<Schema, Result, Z> {
  const { schema, endpoint } = args;
  const apiCall = useApiCall(endpoint);

  const form = useForm<z.infer<Schema>>({
    mode: "onSubmit",
    resolver: zodResolver(schema),
  });
  const submitHandler = async (data: z.infer<Schema>) => {
    try {
      return await apiCall(data);
    } catch (e) {
      handleFormApiErrors(e, schema, form.setError);
      throw e;
    }
  };

  return { form, submitHandler };
}

type SubmitHandler<Data, Result> = (data: Data) => Promise<Result>;
type UseSubmitToasterArgs<Data, Result> = {
  handler: SubmitHandler<Data, Result>;
};
function useSubmitToaster<Data, Result>(
  args: UseSubmitToasterArgs<Data, Result>
): SubmitHandler<Data, Result> {
  const toast = useToast();

  return async (data) => {
    try {
      const result = await args.handler(data);
      toast.addToast({
        variant: "success",
        message: "Team created",
        duration: 30000,
      });
      return result;
    } catch (e) {
      // TODO: This is currently shown even if the error is handled by
      //       the API form, as it'll throw for all errors. Consider
      //       making the API form throw a custom error for already handled
      //       errors or otherwise make it possible to detect if the error
      //       is re-caught later.
      console.error(e);
      toast.addToast({
        variant: "danger",
        message: "Unknown error occurred. The error has been logged",
      });
      throw e;
    }
  };
}

export type ApiFormProps<
  Schema extends ZodObject<Z>,
  Result extends object,
  Z extends ZodRawShape
> = {
  schema: Schema;
  endpoint: ApiEndpoint<z.infer<Schema>, Result>;
  formProps?: Omit<HTMLAttributes<HTMLFormElement>, "onSubmit">;
};
export function ApiForm<
  Schema extends ZodObject<Z>,
  Result extends object,
  Z extends ZodRawShape
>(props: PropsWithChildren<ApiFormProps<Schema, Result, Z>>) {
  const { form, submitHandler } = useApiForm({
    schema: props.schema,
    endpoint: props.endpoint,
  });
  const onSubmit = useSubmitToaster({ handler: submitHandler });

  return (
    <FormProvider {...form}>
      <form {...props.formProps} onSubmit={form.handleSubmit(onSubmit)}>
        {props.children}
      </form>
    </FormProvider>
  );
}

const createTeamSchema = z.object({
  name: z
    .string({ required_error: "Team name is required" })
    .min(1, { message: "Team name is required" }),
});

export type FormTextInputProps<
  Schema extends ZodObject<Z>,
  Z extends ZodRawShape
> = {
  // The schema is required to allow TS to infer valid values for the name field
  schema: Schema;
  name: Path<z.infer<Schema>>;
};
export function FormTextInput<
  Schema extends ZodObject<Z>,
  Z extends ZodRawShape
>({ name }: FormTextInputProps<Schema, Z>) {
  const {
    field,
    fieldState: { isDirty, invalid, error },
    formState: { isSubmitting, disabled },
  } = useController({ name });

  return (
    <>
      <TextInput
        {...field}
        ref={field.ref}
        placeholder={"ExampleName"}
        color={isDirty ? (invalid ? "red" : "green") : undefined}
        disabled={isSubmitting || disabled}
      />
      {error && <span className={styles.errorMessage}>{error.message}</span>}
    </>
  );
}

const SubmitButtonContent = React.memo((props: { isSubmitting: boolean }) => {
  if (props.isSubmitting) {
    return (
      <Button.ButtonIcon iconClasses={styles.spinningIcon}>
        <FontAwesomeIcon icon={faArrowsRotate} />
      </Button.ButtonIcon>
    );
  } else {
    return <Button.ButtonLabel>Create</Button.ButtonLabel>;
  }
});

export function FormSubmitButton() {
  const { isSubmitting, disabled } = useFormState();

  return (
    <Button.Root
      type="submit"
      paddingSize="large"
      colorScheme="success"
      disabled={isSubmitting || disabled}
    >
      <SubmitButtonContent isSubmitting={isSubmitting} />
    </Button.Root>
  );
}

export function CreateTeamForm() {
  return (
    <ApiForm
      schema={createTeamSchema}
      endpoint={createTeam}
      formProps={{ className: styles.root }}
    >
      <div className={styles.dialog}>
        <div className={styles.dialogText}>
          Enter the name of the team you wish to create. Team names can contain
          the characters a-z A-Z 0-9 _ and must not start or end with an _
        </div>
        <div>
          <FormTextInput schema={createTeamSchema} name={"name"} />
        </div>
      </div>
      <div className={styles.footer}>
        <FormSubmitButton />
      </div>
    </ApiForm>
  );
}

CreateTeamForm.displayName = "CreateTeamForm";

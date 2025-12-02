import { useEffect, useState } from "react";

import {
  ParseError,
  RequestBodyParseError,
  RequestQueryParamsParseError,
  UserFacingError,
  mapApiErrorToUserFacingError,
} from "@thunderstore/thunderstore-api";

/**
 * Checks if two types are exactly identical.
 * Returns `true` if A and B are strictly equal, `false` otherwise.
 * This is useful for distinguishing between types that are assignable to each other
 * (e.g. `string` and `string | number`) but not identical.
 */
type IsExact<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B
  ? 1
  : 2
  ? (<T>() => T extends B ? 1 : 2) extends <T>() => T extends A ? 1 : 2
    ? true
    : false
  : false;

/**
 * Enforces the presence of a `refiner` prop when the submission data shape
 * differs from the input shape.
 *
 * If `SubmissionDataShape` is identical to or a subtype of `Inputs`, the refiner
 * is optional (defaults to identity/cast).
 * Otherwise, a refiner is required to transform inputs into the submission shape.
 */
type RefinerRequirement<Inputs, SubmissionDataShape extends Inputs> = [
  SubmissionDataShape,
] extends [Inputs]
  ? {
      refiner?: (inputs: Inputs) => Promise<SubmissionDataShape>;
    }
  : {
      refiner: (inputs: Inputs) => Promise<SubmissionDataShape>;
    };

/**
 * Enforces the presence of an `errorMapper` prop when a custom `SubmissionError` type is used.
 *
 * If `SubmissionError` is exactly `UserFacingError` (the default), the mapper is optional
 * as `mapApiErrorToUserFacingError` is used by default.
 * If a different error type is specified, a mapper must be provided to convert unknown errors
 * into the expected `SubmissionError` type.
 */
type ErrorMapperRequirement<SubmissionError> = IsExact<
  SubmissionError,
  UserFacingError
> extends true
  ? {
      errorMapper?: (error: unknown) => SubmissionError;
    }
  : {
      errorMapper: (error: unknown) => SubmissionError;
    };

interface UseStrongFormPropsBase<
  Inputs,
  SubmissionDataShape extends Inputs = Inputs,
  RefinerError extends Error = Error,
  SubmissionOutput = unknown,
  SubmissionError = UserFacingError,
> {
  inputs: Inputs;
  submitor: (data: SubmissionDataShape) => Promise<SubmissionOutput>;
  onRefineSuccess?: (data: SubmissionDataShape) => void;
  onRefineError?: (error: RefinerError) => void;
  onSubmitSuccess?: (output: SubmissionOutput) => void;
  onSubmitError?: (error: SubmissionError) => void;
}

export type UseStrongFormProps<
  Inputs,
  SubmissionDataShape extends Inputs = Inputs,
  RefinerError extends Error = Error,
  SubmissionOutput = unknown,
  SubmissionError = UserFacingError,
> = UseStrongFormPropsBase<
  Inputs,
  SubmissionDataShape,
  RefinerError,
  SubmissionOutput,
  SubmissionError
> &
  RefinerRequirement<Inputs, SubmissionDataShape> &
  ErrorMapperRequirement<SubmissionError>;

export interface UseStrongFormReturn<
  Inputs,
  SubmissionDataShape extends Inputs = Inputs,
  RefinerError extends Error = Error,
  SubmissionOutput = unknown,
  SubmissionError = UserFacingError,
  InputErrors = Record<string, unknown>,
> {
  submit: () => Promise<SubmissionOutput>;
  submitting: boolean;
  submitOutput?: SubmissionOutput;
  submitError?: SubmissionError;
  submissionData?: SubmissionDataShape;
  refining: boolean;
  refineError?: RefinerError;
  inputErrors?: InputErrors;
}

export function useStrongForm<
  Inputs,
  SubmissionDataShape extends Inputs = Inputs,
  RefinerError extends Error = Error,
  SubmissionOutput = unknown,
  SubmissionError = UserFacingError,
  InputErrors = Record<string, unknown>,
>(
  props: UseStrongFormProps<
    Inputs,
    SubmissionDataShape,
    RefinerError,
    SubmissionOutput,
    SubmissionError
  >
): UseStrongFormReturn<
  Inputs,
  SubmissionDataShape,
  RefinerError,
  SubmissionOutput,
  SubmissionError,
  InputErrors
> {
  const [refining, setRefining] = useState(false);
  const [submissionData, setSubmissionData] = useState<SubmissionDataShape>();
  const [refineError, setRefineError] = useState<RefinerError>();
  const [submitting, setSubmitting] = useState(false);
  const [submitOutput, setSubmitOutput] = useState<SubmissionOutput>();
  const [submitError, setSubmitError] = useState<SubmissionError>();
  const [inputErrors, setInputErrors] = useState<InputErrors>();

  const ensureSubmissionDataShape = (value: Inputs): SubmissionDataShape => {
    if (
      value === null ||
      (typeof value !== "object" && typeof value !== "function")
    ) {
      throw new Error(
        "useStrongForm received primitive form inputs without a refiner; provide a refiner or ensure the input type matches the submission data shape."
      );
    }

    return value as SubmissionDataShape;
  };

  useEffect(() => {
    let cancelled = false;

    setSubmitOutput(undefined);
    setSubmitError(undefined);
    setInputErrors(undefined);

    if (!props.refiner) {
      setSubmissionData(ensureSubmissionDataShape(props.inputs));
      setRefining(false);
      setRefineError(undefined);
      return () => {
        cancelled = true;
      };
    }

    setSubmissionData(undefined);
    setRefineError(undefined);
    setRefining(true);

    props
      .refiner(props.inputs)
      .then((result) => {
        if (cancelled) {
          return;
        }

        setSubmissionData(result);
        if (props.onRefineSuccess) {
          props.onRefineSuccess(result);
        }
      })
      .catch((error) => {
        if (cancelled) {
          return;
        }

        const normalizedError =
          error instanceof Error ? error : new Error(String(error));
        const castError = normalizedError as RefinerError;
        setRefineError(castError);
        if (props.onRefineError) {
          props.onRefineError(castError);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setRefining(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [props.inputs, props.refiner, props.onRefineSuccess, props.onRefineError]);

  const toSubmissionError = (error: unknown): SubmissionError => {
    if (props.errorMapper) {
      return props.errorMapper(error);
    }

    // If errorMapper is not provided, we assume SubmissionError is UserFacingError.
    // This is enforced by the ErrorMapperRequirement type.
    return mapApiErrorToUserFacingError(error) as unknown as SubmissionError;
  };

  const emitSubmissionError = (error: SubmissionError): never => {
    setSubmitError(error);
    if (props.onSubmitError) {
      props.onSubmitError(error);
    }
    throw error;
  };

  const createGuardSubmissionError = (message: string): SubmissionError => {
    return toSubmissionError(
      new UserFacingError({
        category: "validation",
        headline: message,
        description: undefined,
        originalError: new Error(message),
      })
    );
  };

  const submit = async (): Promise<SubmissionOutput> => {
    if (submitting) {
      return emitSubmissionError(
        createGuardSubmissionError("Form is already submitting.")
      );
    }

    if (refining) {
      return emitSubmissionError(
        createGuardSubmissionError("Form is still refining.")
      );
    }

    if (refineError) {
      return emitSubmissionError(toSubmissionError(refineError));
    }

    if (!submissionData) {
      return emitSubmissionError(
        createGuardSubmissionError("Form has not been refined yet.")
      );
    }

    setSubmitting(true);
    setSubmitError(undefined);
    setInputErrors(undefined);

    try {
      const output = await props.submitor(submissionData);
      setSubmitOutput(output);
      if (props.onSubmitSuccess) {
        props.onSubmitSuccess(output);
      }
      return output;
    } catch (error) {
      if (error instanceof RequestBodyParseError) {
        setInputErrors(error.error.formErrors.fieldErrors as InputErrors);
      } else if (error instanceof RequestQueryParamsParseError) {
        setInputErrors(error.error.formErrors.fieldErrors as InputErrors);
      } else if (error instanceof ParseError) {
        setInputErrors(error.error.formErrors.fieldErrors as InputErrors);
      }

      const mappedError = toSubmissionError(error);
      return emitSubmissionError(mappedError);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    submit,
    submitting,
    submitOutput,
    submitError,
    submissionData,
    refining,
    refineError,
    inputErrors,
  };
}

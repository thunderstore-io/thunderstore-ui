import { useEffect, useState } from "react";
import {
  ParseError,
  RequestBodyParseError,
  RequestQueryParamsParseError,
  UserFacingError,
  mapApiErrorToUserFacingError,
} from "@thunderstore/thunderstore-api";

type IsExact<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B
  ? 1
  : 2
  ? (<T>() => T extends B ? 1 : 2) extends <T>() => T extends A ? 1 : 2
    ? true
    : false
  : false;

type RefinerRequirement<Inputs, SubmissionDataShape extends Inputs> = [
  SubmissionDataShape,
] extends [Inputs]
  ? {
      refiner?: (inputs: Inputs) => Promise<SubmissionDataShape>;
    }
  : {
      refiner: (inputs: Inputs) => Promise<SubmissionDataShape>;
    };

type ErrorMapperRequirement<SubmissionError extends UserFacingError> = IsExact<
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
  SubmissionError extends UserFacingError = UserFacingError,
> {
  inputs: Inputs;
  submitor: (data: SubmissionDataShape) => Promise<SubmissionOutput>;
  onRefineSuccess?: (data: SubmissionDataShape) => void;
  onRefineError?: (error: RefinerError) => void;
  onSubmitSuccess?: (output: SubmissionOutput) => void;
  onSubmitError?: (error: SubmissionError) => void;
}

/**
 * Configuration for wiring a StrongForm instance to refiners, submitters and lifecycle hooks.
 */
export type UseStrongFormProps<
  Inputs,
  SubmissionDataShape extends Inputs = Inputs,
  RefinerError extends Error = Error,
  SubmissionOutput = unknown,
  SubmissionError extends UserFacingError = UserFacingError,
> = UseStrongFormPropsBase<
  Inputs,
  SubmissionDataShape,
  RefinerError,
  SubmissionOutput,
  SubmissionError
> &
  RefinerRequirement<Inputs, SubmissionDataShape> &
  ErrorMapperRequirement<SubmissionError>;

/**
 * Return shape emitted by `useStrongForm`, exposing state for UI bindings.
 */
export interface UseStrongFormReturn<
  Inputs,
  SubmissionDataShape extends Inputs = Inputs,
  RefinerError extends Error = Error,
  SubmissionOutput = unknown,
  SubmissionError extends UserFacingError = UserFacingError,
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

/**
 * React hook that orchestrates StrongForm refinement and submission flows while exposing
 * typed state for consumer components.
 */
export function useStrongForm<
  Inputs,
  SubmissionDataShape extends Inputs = Inputs,
  RefinerError extends Error = Error,
  SubmissionOutput = unknown,
  SubmissionError extends UserFacingError = UserFacingError,
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

  const defaultErrorMapper = (error: unknown): UserFacingError => {
    if (error instanceof UserFacingError) {
      return error;
    }
    return mapApiErrorToUserFacingError(error);
  };

  const mapError: (error: unknown) => SubmissionError =
    props.errorMapper ?? defaultErrorMapper;

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
    if (error instanceof UserFacingError) {
      return error as SubmissionError;
    }
    return mapError(error);
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

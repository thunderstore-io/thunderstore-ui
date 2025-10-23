import { useEffect, useState } from "react";
import {
  ParseError,
  RequestBodyParseError,
  RequestQueryParamsParseError,
  UserFacingError,
  mapApiErrorToUserFacingError,
} from "../../../../../packages/thunderstore-api/src";

interface UseStrongFormProps<
  Inputs,
  SubmissionDataShape = Inputs,
  RefinerError extends Error = Error,
  SubmissionOutput = unknown,
  SubmissionError extends Error = UserFacingError,
> {
  inputs: Inputs;
  submitor: (data: SubmissionDataShape) => Promise<SubmissionOutput>;
  refiner?: (inputs: Inputs) => Promise<SubmissionDataShape>;
  onRefineSuccess?: (data: SubmissionDataShape) => void;
  onRefineError?: (error: RefinerError) => void;
  onSubmitSuccess?: (output: SubmissionOutput) => void;
  onSubmitError?: (error: SubmissionError) => void;
  errorMapper?: (error: unknown) => SubmissionError;
}

interface UseStrongFormReturn<
  Inputs,
  SubmissionDataShape = Inputs,
  RefinerError extends Error = Error,
  SubmissionOutput = unknown,
  SubmissionError extends Error = UserFacingError,
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
  SubmissionDataShape = Inputs,
  RefinerError extends Error = Error,
  SubmissionOutput = unknown,
  SubmissionError extends Error = UserFacingError,
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

  const defaultErrorMapper = (error: unknown): SubmissionError => {
    return mapApiErrorToUserFacingError(error) as unknown as SubmissionError;
  };

  const mapError = props.errorMapper ?? defaultErrorMapper;

  useEffect(() => {
    let cancelled = false;

    setSubmitOutput(undefined);
    setSubmitError(undefined);
    setInputErrors(undefined);

    if (!props.refiner) {
      setSubmissionData(props.inputs as unknown as SubmissionDataShape);
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

        const castError = error as RefinerError;
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

  const submit = async (): Promise<SubmissionOutput> => {
    if (submitting) {
      const error = new Error("Form is already submitting!");
      if (props.onSubmitError) {
        props.onSubmitError(error as unknown as SubmissionError);
      }
      throw error;
    }

    if (refining) {
      const error = new Error("Form is still refining!");
      if (props.onSubmitError) {
        props.onSubmitError(error as unknown as SubmissionError);
      }
      throw error;
    }

    if (refineError) {
      if (props.onSubmitError) {
        props.onSubmitError(refineError as unknown as SubmissionError);
      }
      throw refineError;
    }

    if (!submissionData) {
      const error = new Error("Form has not been refined yet!");
      if (props.onSubmitError) {
        props.onSubmitError(error as unknown as SubmissionError);
      }
      throw error;
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
        setInputErrors(error.error.formErrors as InputErrors);
      } else if (error instanceof RequestQueryParamsParseError) {
        setInputErrors(error.error.formErrors as InputErrors);
      } else if (error instanceof ParseError) {
        setInputErrors(error.error.formErrors as InputErrors);
      }

      const mappedError =
        error instanceof UserFacingError
          ? (error as unknown as SubmissionError)
          : mapError(error);

      setSubmitError(mappedError);

      if (props.onSubmitError) {
        props.onSubmitError(mappedError);
      }

      throw mappedError;
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

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ParseError,
  RequestBodyParseError,
  RequestQueryParamsParseError,
} from "../../../../../packages/thunderstore-api/src";
import type { Validator } from "./validation";
import { isRawInvalid } from "./validation";

interface UseStrongFormProps<
  Inputs,
  SubmissionDataShape,
  RefinerError,
  SubmissionOutput,
  SubmissionError,
> {
  inputs: Inputs;
  /**
   * Validators for the form inputs.
   *
   * NOTE: If you add new validator types here, make sure to implement the
   * validation logic in `isRawInvalid` in `validation.ts`.
   */
  validators?: {
    [K in keyof Inputs]?: Validator;
  };
  refiner?: (inputs: Inputs) => Promise<SubmissionDataShape>;
  onRefineSuccess?: (output: SubmissionDataShape) => void;
  onRefineError?: (error: RefinerError) => void;
  submitor: (data: SubmissionDataShape) => Promise<SubmissionOutput>;
  onSubmitSuccess?: (output: SubmissionOutput) => void;
  onSubmitError?: (error: SubmissionError) => void;
}

export function useStrongForm<
  Inputs,
  SubmissionDataShape,
  RefinerError,
  SubmissionOutput,
  SubmissionError,
  InputErrors,
>(
  props: UseStrongFormProps<
    Inputs,
    SubmissionDataShape,
    RefinerError,
    SubmissionOutput,
    SubmissionError
  >
) {
  const [refining, setRefining] = useState(false);
  const [submissionData, setSubmissionData] = useState<SubmissionDataShape>();
  const [refineError, setRefineError] = useState<RefinerError>();
  const [submitting, setSubmitting] = useState(false);
  const [submitOutput, setSubmitOutput] = useState<SubmissionOutput>();
  const [submitError, setSubmitError] = useState<SubmissionError>();
  const [inputErrors, setInputErrors] = useState<InputErrors>();
  const [fieldInteractions, setFieldInteractions] = useState<
    Partial<
      Record<
        keyof Inputs,
        {
          hasFocused: boolean;
          hasBlurred: boolean;
        }
      >
    >
  >({});
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const isReady = useMemo(() => {
    if (!props.validators) return true;
    for (const key in props.validators) {
      const validator = props.validators[key];
      const value = props.inputs[key as keyof Inputs];
      if (isRawInvalid(validator, value)) {
        return false;
      }
    }
    return true;
  }, [props.inputs, props.validators]);

  const getFieldState = useCallback(
    <K extends keyof Inputs>(field: K) => {
      const validator = props.validators?.[field];
      const value = props.inputs[field];
      const isRequired = Boolean(validator?.required);
      const rawInvalid = isRawInvalid(validator, value);
      const interactions = fieldInteractions[field];
      const hasFinishedInteraction =
        Boolean(interactions?.hasFocused && interactions?.hasBlurred) ||
        hasAttemptedSubmit;
      const isInvalid = rawInvalid && hasFinishedInteraction;
      return {
        isRequired,
        isInvalid,
      };
    },
    [fieldInteractions, hasAttemptedSubmit, props.inputs, props.validators]
  );

  const markFieldInteraction = useCallback(
    (field: keyof Inputs, type: "focus" | "blur") => {
      setFieldInteractions((prev) => {
        const current = prev[field] ?? { hasFocused: false, hasBlurred: false };
        const next =
          type === "focus"
            ? { ...current, hasFocused: true }
            : { ...current, hasBlurred: true };
        if (
          current.hasFocused === next.hasFocused &&
          current.hasBlurred === next.hasBlurred
        ) {
          return prev;
        }
        return { ...prev, [field]: next };
      });
    },
    []
  );

  const getFieldInteractionProps = useCallback(
    (field: keyof Inputs) => ({
      onFocus: () => markFieldInteraction(field, "focus"),
      onBlur: () => markFieldInteraction(field, "blur"),
    }),
    [markFieldInteraction]
  );

  const getFieldComponentProps = useCallback(
    (field: keyof Inputs, options?: { disabled?: boolean }) => {
      const fieldState = getFieldState(field);
      const modifiers: ("invalid" | "disabled")[] = [];
      if (fieldState.isInvalid) {
        modifiers.push("invalid" as const);
      }
      if (options?.disabled) {
        modifiers.push("disabled" as const);
      }
      const interactionProps = getFieldInteractionProps(field);
      return {
        ...interactionProps,
        "aria-invalid": fieldState.isInvalid,
        "aria-required": fieldState.isRequired,
        csModifiers: modifiers,
        required: fieldState.isRequired,
      };
    },
    [getFieldInteractionProps, getFieldState]
  );

  useEffect(() => {
    if (refining || submitting) {
      return;
    }
    setSubmitOutput(undefined);
    setSubmitError(undefined);
    setInputErrors(undefined);
    if (props.refiner) {
      setSubmissionData(undefined);
      setRefineError(undefined);
      setRefining(true);
      props
        .refiner(props.inputs)
        .then((refiningOutput) => {
          if (props.onRefineSuccess) {
            props.onRefineSuccess(refiningOutput);
          }
          setSubmissionData(refiningOutput);
          setRefining(false);
        })
        .catch((error) => {
          setRefineError(error);
          if (props.onRefineError) {
            props.onRefineError(error);
          }
          setRefining(false);
        });
    } else {
      // A quick hack to allow the form to work without a refiner.
      setSubmissionData(props.inputs as unknown as SubmissionDataShape);
    }
  }, [props.inputs]);

  const submit = async () => {
    setHasAttemptedSubmit(true);

    if (!isReady) {
      return;
    }
    if (submitting) {
      const error = new Error("Form is already submitting!");
      if (props.onSubmitError) {
        props.onSubmitError(error as SubmissionError);
      }
      throw error;
    }
    if (refining) {
      const error = new Error("Form is still refining!");
      if (props.onSubmitError) {
        props.onSubmitError(error as SubmissionError);
      }
      throw error;
    }
    if (refineError) {
      const error = new Error("Form refinement failed!");
      if (props.onSubmitError) {
        props.onSubmitError(error as SubmissionError);
      }
      throw refineError;
    }
    if (!submissionData) {
      const error = new Error("Form has not been refined yet!");
      if (props.onSubmitError) {
        props.onSubmitError(error as SubmissionError);
      }
      throw error;
    }

    setSubmitting(true);
    try {
      await props
        .submitor(submissionData)
        .then((output) => {
          setSubmitOutput(output);
          if (props.onSubmitSuccess) {
            props.onSubmitSuccess(output);
          }
        })
        .catch((error) => {
          if (error instanceof RequestBodyParseError) {
            setSubmitError(
              new Error(
                "Some of the field values are invalid"
              ) as SubmissionError
            );
            setInputErrors(error.error.formErrors as InputErrors);
            return;
          }
          if (error instanceof RequestQueryParamsParseError) {
            setSubmitError(
              new Error(
                "Some of the query parameters are invalid"
              ) as SubmissionError
            );
            setInputErrors(error.error.formErrors as InputErrors);
            return;
          }
          if (error instanceof ParseError) {
            setSubmitError(
              new Error(
                "Request succeeded, but the response was invalid"
              ) as SubmissionError
            );
            setInputErrors(error.error.formErrors as InputErrors);
            if (props.onSubmitError) {
              props.onSubmitError(error as SubmissionError);
            }
            throw error;
          }

          if (props.onSubmitError) {
            props.onSubmitError(error as SubmissionError);
          }
          throw error;
        });
      return submitOutput;
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = useCallback(
    (e?: { preventDefault: () => void }) => {
      e?.preventDefault();
      setHasAttemptedSubmit(true);
      if (!isReady) {
        return;
      }
      void submit().catch((error) => {
        // Prevent unhandled rejections, but don't silently swallow unexpected errors.
        if (!props.onSubmitError) {
          console.error(error);
        }
      });
    },
    [isReady, submit]
  );

  return {
    submit,
    handleSubmit,
    submitting,
    submitOutput,
    submitError,
    submissionData,
    refining,
    refineError,
    inputErrors,
    isReady,
    getFieldState,
    getFieldInteractionProps,
    getFieldComponentProps,
  };
}

import { useEffect, useState } from "react";
import {
  ParseError,
  RequestBodyParseError,
  RequestQueryParamsParseError,
} from "../../../../../packages/thunderstore-api/src";

interface UseStrongFormProps<
  Inputs,
  SubmissionDataShape,
  RefinerError,
  SubmissionOutput,
  SubmissionError,
> {
  inputs: Inputs;
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
          } else if (error instanceof RequestQueryParamsParseError) {
            setSubmitError(
              new Error(
                "Some of the query parameters are invalid"
              ) as SubmissionError
            );
            setInputErrors(error.error.formErrors as InputErrors);
          } else if (error instanceof ParseError) {
            setSubmitError(
              new Error(
                "Request succeeded, but the response was invalid"
              ) as SubmissionError
            );
            setInputErrors(error.error.formErrors as InputErrors);
          } else {
            throw error;
          }
        });
      return submitOutput;
    } catch (error) {
      if (props.onSubmitError) {
        props.onSubmitError(error as SubmissionError);
      }
      throw error;
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

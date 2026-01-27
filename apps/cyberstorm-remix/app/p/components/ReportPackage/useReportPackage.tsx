import { useCallback, useEffect, useState } from "react";

import {
  type PackageListingReportRequestData,
  type RequestConfig,
} from "@thunderstore/thunderstore-api";

import { ReportPackageButton } from "./ReportPackageButton";
import {
  ReportPackageForm,
  type ReportPackageFormProps,
  type ReportPackageFormState,
} from "./ReportPackageForm";
import { ReportPackageModal } from "./ReportPackageModal";
import { ReportPackageSubmitted } from "./ReportPackageSubmitted";

const createInitialFormInputs = (): ReportPackageFormState => ({
  reason: null,
  description: "",
});

export function useReportPackage(formProps: {
  formPropsPromise: Promise<ReportPackageFormProps>;
  config: () => RequestConfig;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formInputs, setFormInputs] = useState<ReportPackageFormState>(
    createInitialFormInputs
  );

  const onOpenChange = (isOpen: boolean) => {
    setIsOpen(isOpen);
    setIsSubmitted(false);
    setError(null);
  };

  type UpdateFormInput = <K extends keyof ReportPackageFormState>(
    field: K,
    value: ReportPackageFormState[K]
  ) => void;

  const updateFormInput = useCallback<UpdateFormInput>((field, value) => {
    setFormInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const resetFormInputs = useCallback(() => {
    setFormInputs(createInitialFormInputs());
  }, []);

  const [props, setProps] = useState<ReportPackageFormProps | null>(null);

  async function awaitAndSetProps() {
    if (!props) {
      setProps(await formProps.formPropsPromise);
    }
  }

  useEffect(() => {
    awaitAndSetProps();
  }, [formProps, props, awaitAndSetProps]);

  const button = <ReportPackageButton onClick={() => onOpenChange(true)} />;

  const extraProps = {
    error,
    onOpenChange,
    setError,
    setIsSubmitted,
    formInputs,
    updateFormInput,
    resetFormInputs,
  };
  const form = props && (
    <ReportPackageForm {...props} {...extraProps} config={formProps.config} />
  );

  const done = (
    <ReportPackageSubmitted closeModal={() => onOpenChange(false)} />
  );

  const modal = (
    <ReportPackageModal {...{ isOpen, onOpenChange }}>
      {isSubmitted ? done : form}
    </ReportPackageModal>
  );

  return {
    ReportPackageButton: button,
    ReportPackageModal: modal,
  };
}

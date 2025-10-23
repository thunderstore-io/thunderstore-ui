import { useEffect, useState } from "react";

import {
  ReportPackageForm,
  type ReportPackageFormProps,
} from "./ReportPackageForm";
import { ReportPackageButton } from "./ReportPackageButton";
import { ReportPackageModal } from "./ReportPackageModal";
import { ReportPackageSubmitted } from "./ReportPackageSubmitted";
import { type RequestConfig } from "@thunderstore/thunderstore-api";

export function useReportPackage(formProps: {
  formPropsPromise: Promise<ReportPackageFormProps>;
  config: () => RequestConfig;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onOpenChange = (isOpen: boolean) => {
    setIsOpen(isOpen);
    setIsSubmitted(false);
    setError(null);
  };

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

  const extraProps = { error, onOpenChange, setError, setIsSubmitted };
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

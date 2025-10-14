import { useEffect, useState } from "react";

import {
  ReportPackageForm,
  type ReportPackageFormProps,
} from "./ReportPackageForm";
import { ReportPackageButton } from "./ReportPackageButton";
import { ReportPackageModal } from "./ReportPackageModal";
import { ReportPackageSubmitted } from "./ReportPackageSubmitted";

export function useReportPackage(formProps: Promise<ReportPackageFormProps>) {
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
      setProps(await formProps);
    }
  }

  useEffect(() => {
    awaitAndSetProps();
  }, [formProps, props, awaitAndSetProps]);

  const button = <ReportPackageButton onClick={() => onOpenChange(true)} />;

  const extraProps = { error, setError, setIsSubmitted };
  const form = props && <ReportPackageForm {...props} {...extraProps} />;

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

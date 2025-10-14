import { useEffect, useState } from "react";

import {
  ReportPackageForm,
  type ReportPackageFormProps,
} from "./ReportPackage";
import { ReportPackageButton } from "./ReportPackageButton";
import { ReportPackageModal } from "./ReportPackageModal";

export function useReportPackage(formProps: Promise<ReportPackageFormProps>) {
  const [isOpen, setIsOpen] = useState(false);
  const [props, setProps] = useState<ReportPackageFormProps | null>(null);

  async function awaitAndSetProps() {
    if (!props) {
      setProps(await formProps);
    }
  }

  useEffect(() => {
    awaitAndSetProps();
  }, [formProps, props, awaitAndSetProps]);

  const button = <ReportPackageButton onClick={() => setIsOpen(true)} />;

  const form = props && <ReportPackageForm {...props} />;

  const modal = (
    <ReportPackageModal {...{ isOpen, setIsOpen }}>{form}</ReportPackageModal>
  );

  return {
    ReportPackageButton: button,
    ReportPackageModal: modal,
  };
}

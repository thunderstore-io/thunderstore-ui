import { useEffect, useState } from "react";

import {
  ReportPackageForm,
  type ReportPackageFormProps,
} from "./ReportPackage";
import { ReportPackageButton } from "./ReportPackageButton";

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

  const form = props && (
    <ReportPackageForm {...{ isOpen, setIsOpen }} {...props} />
  );

  return {
    ReportPackageButton: button,
    ReportPackageForm: form,
  };
}

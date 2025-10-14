import { useEffect, useState } from "react";
import {
  ReportPackageButton,
  ReportPackageForm,
  type ReportPackageFormProps,
} from "./ReportPackage";

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

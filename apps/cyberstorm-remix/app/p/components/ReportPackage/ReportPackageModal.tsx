import { Modal } from "@thunderstore/cyberstorm";

import "./ReportPackage.css";

interface ReportPackageModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  children: React.ReactNode;
}

export function ReportPackageModal(props: ReportPackageModalProps) {
  return (
    <Modal
      titleContent="Report Package"
      csSize="small"
      disableBody
      open={props.isOpen}
      onOpenChange={props.setIsOpen}
    >
      {props.children}
    </Modal>
  );
}

ReportPackageModal.displayName = "ReportPackageModal";

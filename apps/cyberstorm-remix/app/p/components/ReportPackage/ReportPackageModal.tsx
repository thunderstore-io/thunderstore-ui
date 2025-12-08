import { Modal } from "@thunderstore/cyberstorm";

import "./ReportPackage.css";

interface ReportPackageModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  children: React.ReactNode;
}

export function ReportPackageModal(props: ReportPackageModalProps) {
  return (
    <Modal
      titleContent="Report Package"
      disableBody
      open={props.isOpen}
      onOpenChange={props.onOpenChange}
    >
      {props.children}
    </Modal>
  );
}

ReportPackageModal.displayName = "ReportPackageModal";

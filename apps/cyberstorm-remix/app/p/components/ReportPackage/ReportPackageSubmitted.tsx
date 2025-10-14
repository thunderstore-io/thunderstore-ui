import { faFaceSaluting } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Modal, NewButton, NewIcon } from "@thunderstore/cyberstorm";

export function ReportPackageSubmitted(props: { closeModal: () => void }) {
  return (
    <>
      <Modal.Body>
        <div className="report-package__block">
          <NewIcon csMode="inline" noWrapper>
            <FontAwesomeIcon icon={faFaceSaluting} />
          </NewIcon>
        </div>
        <div className="report-package__block">Thank you for your report.</div>
        <div className="report-package__block">
          We've received your report and will review the content shortly. Your
          feedback helps keep our community safe.
        </div>
      </Modal.Body>
      <Modal.Footer>
        <NewButton csVariant="info" onClick={props.closeModal}>
          Close
        </NewButton>
      </Modal.Footer>
    </>
  );
}

ReportPackageSubmitted.displayName = "ReportPackageSubmitted";

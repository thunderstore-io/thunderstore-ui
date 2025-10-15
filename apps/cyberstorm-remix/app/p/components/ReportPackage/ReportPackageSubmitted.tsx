import { faFaceSaluting } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Modal, NewButton, NewIcon } from "@thunderstore/cyberstorm";

export function ReportPackageSubmitted(props: { closeModal: () => void }) {
  return (
    <>
      <Modal.Body className="report-package--centered">
        <div className="report-package__block ">
          <NewIcon
            csMode="inline"
            noWrapper
            rootClasses="report-package__submitted-icon"
          >
            <FontAwesomeIcon icon={faFaceSaluting} />
          </NewIcon>
        </div>
        <h3 className="report-package__heading">Thank you for your report</h3>
        <p className="report-package__paragraph">
          We've received your report and will review the content shortly.
          <br />
          Your feedback helps keep our community safe.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <NewButton csVariant="secondary" onClick={props.closeModal}>
          Close
        </NewButton>
      </Modal.Footer>
    </>
  );
}

ReportPackageSubmitted.displayName = "ReportPackageSubmitted";

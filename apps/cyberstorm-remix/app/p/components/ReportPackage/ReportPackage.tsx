import "./ReportPackage.css";
import { useReducer, useState } from "react";

import {
  Modal,
  NewAlert,
  NewButton,
  NewIcon,
  NewSelect,
  NewTextInput,
  useToast,
  type SelectOption,
} from "@thunderstore/cyberstorm";
import {
  type RequestConfig,
  type PackageListingReportRequestData,
  packageListingReport,
} from "@thunderstore/thunderstore-api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useStrongForm } from "cyberstorm/utils/StrongForm/useStrongForm";
import {
  faFaceSaluting,
  faFlagSwallowtail,
} from "@fortawesome/pro-solid-svg-icons";

export function ReportPackageButton(
  props: React.HTMLAttributes<HTMLButtonElement>
) {
  return (
    <NewButton
      tooltipText="Report Package"
      csVariant="secondary"
      csModifiers={["only-icon"]}
      {...props}
    >
      <NewIcon csMode="inline" noWrapper>
        <FontAwesomeIcon icon={faFlagSwallowtail} />
      </NewIcon>
    </NewButton>
  );
}

ReportPackageButton.displayName = "ReportPackageButton";

const reportOptions: SelectOption<PackageListingReportRequestData["reason"]>[] =
  [
    { value: "Spam", label: "Spam" },
    { value: "Malware", label: "Malware" },
    { value: "Reupload", label: "Reupload" },
    { value: "CopyrightOrLicense", label: "Copyright Or License" },
    { value: "WrongCommunity", label: "Wrong Community" },
    { value: "WrongCategories", label: "Wrong Categories" },
    { value: "Other", label: "Other" },
  ];

export interface ReportPackageProps {
  community: string;
  namespace: string;
  package: string;
  config: () => RequestConfig;
}

export function ReportPackage(props: ReportPackageProps) {
  const { config, ...requestParams } = props;

  const [submitted, setSubmitted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const toast = useToast();

  function formFieldUpdateAction(
    state: PackageListingReportRequestData,
    action: {
      field: keyof PackageListingReportRequestData;
      value: PackageListingReportRequestData[keyof PackageListingReportRequestData];
    }
  ) {
    return {
      ...state,
      [action.field]: action.value,
    };
  }

  const [formInputs, updateFormFieldState] = useReducer(formFieldUpdateAction, {
    reason: "Other",
    description: "",
  });

  type SubmitorOutput = Awaited<ReturnType<typeof packageListingReport>>;

  async function submitor(data: typeof formInputs): Promise<SubmitorOutput> {
    return await packageListingReport({
      config: config,
      params: requestParams,
      queryParams: {},
      data: { reason: data.reason, description: data.description },
    });
  }

  type InputErrors = {
    [key in keyof typeof formInputs]?: string | string[];
  };

  const strongForm = useStrongForm<
    typeof formInputs,
    PackageListingReportRequestData,
    Error,
    SubmitorOutput,
    Error,
    InputErrors
  >({
    inputs: formInputs,
    submitor,
    onSubmitSuccess: () => {
      setSubmitted(true);
    },
    onSubmitError: (error) => {
      let message = `Error occurred: ${error.message || "Unknown error"}`;
      if (error.message === "401: Unauthorized") {
        message = "You must be logged in to report a package.";
      }
      toast.addToast({
        csVariant: "danger",
        children: message,
        duration: 8000,
      });
    },
  });

  const form = (
    <>
      <Modal.Body className="report-package__body">
        <div className="report-package__block">
          <label htmlFor="reason" className="report-package__label">
            Reason
          </label>
          <NewSelect
            id="reason"
            name={"reason"}
            options={reportOptions}
            // TODO: placeholder doesn't currently work as `value` is set below.
            // Even if `value` is removed, "other" value is submitted if user
            // doesn't choose anything else, which is confusing.
            // placeholder="Please select..."
            value={formInputs.reason}
            onChange={(value) => {
              updateFormFieldState({ field: "reason", value: value });
            }}
            csSize="small"
          />
        </div>
        <div className="report-package__block">
          <label htmlFor="description" className="report-package__label">
            Additional information (optional)
          </label>
          <NewTextInput
            id="description"
            value={formInputs.description || ""}
            onChange={(e) => {
              updateFormFieldState({
                field: "description",
                value: e.target.value,
              });
            }}
            placeholder="Invalid submission"
            csSize="textarea"
            rootClasses="report-package__textarea"
          />
        </div>
        {strongForm.inputErrors ||
        strongForm.refineError ||
        strongForm.submitError ? (
          <div className="report-package__block">
            {strongForm.inputErrors ? (
              <NewAlert csVariant="danger">
                {Object.entries(strongForm.inputErrors).map(([key, value]) => (
                  <div key={key}>
                    <strong>{key}:</strong>{" "}
                    {Array.isArray(value) ? value.join(", ") : value}
                  </div>
                ))}
              </NewAlert>
            ) : null}
            {strongForm.refineError ? (
              <NewAlert csVariant="danger">
                Error while refining: {strongForm.refineError.message}
              </NewAlert>
            ) : null}
            {strongForm.submitError ? (
              <NewAlert csVariant="danger">
                Error while submitting: {strongForm.submitError.message}
              </NewAlert>
            ) : null}
          </div>
        ) : null}
      </Modal.Body>
      <Modal.Footer>
        <Modal.Close asChild>
          <NewButton csVariant="secondary">Cancel</NewButton>
        </Modal.Close>
        <NewButton csVariant="accent" onClick={strongForm.submit}>
          Send report
        </NewButton>
      </Modal.Footer>
    </>
  );

  const done = (
    <>
      <Modal.Body className="report-package__body report-package__body--centered">
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
          We&apos;ve received your report and will review the content shortly.
          <br />
          Your feedback helps keep our community safe.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Modal.Close asChild>
          <NewButton csVariant="secondary">Close</NewButton>
        </Modal.Close>
      </Modal.Footer>
    </>
  );

  return (
    <Modal
      titleContent="Report Package"
      csSize="small"
      disableBody
      onOpenChange={(isOpen) => {
        if (modalOpen && submitted && !isOpen) {
          // If the modal is being closed after a successful submission,
          // reset the form state.
          updateFormFieldState({ field: "reason", value: "Other" });
          updateFormFieldState({ field: "description", value: "" });
          setSubmitted(false);
        }
        setModalOpen(isOpen);
      }}
      trigger={<ReportPackageButton />}
    >
      {submitted ? done : form}
    </Modal>
  );
}

ReportPackage.displayName = "ReportPackage";

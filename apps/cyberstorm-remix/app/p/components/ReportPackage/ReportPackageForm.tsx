import { useReducer } from "react";

import {
  Modal,
  NewAlert,
  NewButton,
  NewSelect,
  NewTextInput,
  type SelectOption,
} from "@thunderstore/cyberstorm";
import {
  type RequestConfig,
  type PackageListingReportRequestData,
  packageListingReport,
} from "@thunderstore/thunderstore-api";

import { useStrongForm } from "cyberstorm/utils/StrongForm/useStrongForm";

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

export interface ReportPackageFormProps {
  community: string;
  namespace: string;
  package: string;
}

interface ReportPackageFormFullProps extends ReportPackageFormProps {
  error: string | null;
  onOpenChange: (isOpen: boolean) => void;
  setError: (error: string | null) => void;
  setIsSubmitted: (isSubmitted: boolean) => void;
}

export function ReportPackageForm(
  props: ReportPackageFormFullProps & {
    config: () => RequestConfig;
  }
) {
  const {
    config,
    onOpenChange,
    setIsSubmitted,
    error,
    setError,
    ...requestParams
  } = props;

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
      setIsSubmitted(true);
      setError(null);
    },
    onSubmitError: (error) => {
      let message = `Error occurred: ${error.message || "Unknown error"}`;
      if (error.message === "401: Unauthorized") {
        message = "You must be logged in to report a package.";
      }
      setError(message);
    },
  });

  return (
    <>
      <Modal.Body>
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
        {error && (
          <div className="report-package__block">
            <NewAlert csVariant="danger">{error}</NewAlert>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <NewButton csVariant="secondary" onClick={() => onOpenChange(false)}>
          Cancel
        </NewButton>
        <NewButton csVariant="accent" onClick={strongForm.submit}>
          Send report
        </NewButton>
      </Modal.Footer>
    </>
  );
}

ReportPackageForm.displayName = "ReportPackageForm";

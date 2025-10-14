import { useReducer, useState } from "react";

import {
  Modal,
  NewAlert,
  NewButton,
  NewSelect,
  NewTextInput,
  type SelectOption,
  useToast,
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
  config: () => RequestConfig;
  toast: ReturnType<typeof useToast>;
}

export function ReportPackageForm(props: ReportPackageFormProps) {
  const { config, toast, ...requestParams } = props;
  const [error, setError] = useState<string | null>(null);

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
      toast.addToast({
        csVariant: "success",
        children: `Package reported`,
        duration: 4000,
      });
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
          <p className="report-package__label">Reason</p>
          <NewSelect
            name={"reason"}
            options={reportOptions}
            placeholder="Please select..."
            value={formInputs.reason}
            onChange={(value) => {
              updateFormFieldState({ field: "reason", value: value });
            }}
            id="reason"
            csSize="small"
          />
        </div>
        <div className="report-package__block">
          <p className="report-package__label">
            Additional information (optional)
          </p>
          <NewTextInput
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
        <NewButton csVariant="success" onClick={strongForm.submit}>
          Submit
        </NewButton>
      </Modal.Footer>
    </>
  );
}

ReportPackageForm.displayName = "ReportPackageForm";

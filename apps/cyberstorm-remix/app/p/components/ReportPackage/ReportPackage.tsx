import { useReducer } from "react";

import {
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
import "./ReportPackage.css";

const reportOptions: SelectOption<
  | "Spam"
  | "Malware"
  | "Reupload"
  | "CopyrightOrLicense"
  | "WrongCommunity"
  | "WrongCategories"
  | "Other"
>[] = [
  { value: "Spam", label: "Spam" },
  { value: "Malware", label: "Malware" },
  { value: "Reupload", label: "Reupload" },
  { value: "CopyrightOrLicense", label: "Copyright Or License" },
  { value: "WrongCommunity", label: "Wrong Community" },
  { value: "WrongCategories", label: "Wrong Categories" },
  { value: "Other", label: "Other" },
];

export function ReportPackageForm(props: {
  // communityId: string;
  // namespaceId: string;
  // packageId: string;
  id: string;
  config: () => RequestConfig;
  toast: ReturnType<typeof useToast>;
}) {
  const {
    // communityId,
    // namespaceId,
    // packageId,
    id,
    toast,
    config,
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
      params: { id: id },
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
      toast.addToast({
        csVariant: "danger",
        children: `Error occurred: ${error.message || "Unknown error"}`,
        duration: 8000,
      });
    },
  });

  return (
    <div className="modal-content">
      <div className="modal-content__header">Report Package</div>
      <div className="modal-content__body report-package__body">
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
      </div>
      <div className="modal-content__footer report-package__footer">
        <NewButton csVariant="success" onClick={strongForm.submit}>
          Submit
        </NewButton>
      </div>
    </div>
  );
}

ReportPackageForm.displayName = "ReportPackageForm";

import { useStrongForm } from "cyberstorm/utils/StrongForm/useStrongForm";

import {
  Modal,
  NewAlert,
  NewButton,
  NewSelect,
  NewTextInput,
  type SelectOption,
} from "@thunderstore/cyberstorm";
import {
  type PackageListingReportRequestData,
  type RequestConfig,
  isApiError,
  packageListingReport,
} from "@thunderstore/thunderstore-api";

const reportOptions: SelectOption<PackageListingReportRequestData["reason"]>[] =
  [
    { value: "Spam", label: "Spam" },
    { value: "Malware", label: "Malware" },
    { value: "Reupload", label: "Reupload" },
    { value: "CopyrightOrLicense", label: "Copyright or license" },
    { value: "WrongCommunity", label: "Wrong community" },
    { value: "WrongCategories", label: "Wrong categories" },
    { value: "Other", label: "Other" },
  ];

export type ReportPackageFormState = Omit<
  PackageListingReportRequestData,
  "reason"
> & {
  reason: PackageListingReportRequestData["reason"] | null;
};

export interface ReportPackageFormProps {
  community: string;
  namespace: string;
  package: string;
  // Available version_numbers (newest first) and the one to preselect (the
  // version the user currently has open).
  versions: string[];
  defaultVersion: string;
}

interface ReportPackageFormFullProps extends ReportPackageFormProps {
  error: string | null;
  onOpenChange: (isOpen: boolean) => void;
  setError: (error: string | null) => void;
  setIsSubmitted: (isSubmitted: boolean) => void;
  formInputs: ReportPackageFormState;
  updateFormInput: <K extends keyof ReportPackageFormState>(
    field: K,
    value: ReportPackageFormState[K]
  ) => void;
  resetFormInputs: () => void;
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
    formInputs,
    updateFormInput,
    resetFormInputs,
    versions,
    // defaultVersion seeds the form state in useReportPackage; not used here.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    defaultVersion,
    ...requestParams
  } = props;

  const versionOptions: SelectOption<string>[] = versions.map((v) => ({
    value: v,
    label: v,
  }));

  type SubmitorOutput = Awaited<ReturnType<typeof packageListingReport>>;

  async function submitor(data: typeof formInputs): Promise<SubmitorOutput> {
    if (!data.reason) {
      throw new Error("Please select a reason");
    }

    return await packageListingReport({
      config: config,
      params: requestParams,
      queryParams: {},
      data: {
        reason: data.reason,
        description: data.description,
        version: data.version ?? undefined,
      },
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
    validators: {
      description: {},
    },
    submitor,
    onSubmitSuccess: () => {
      setIsSubmitted(true);
      setError(null);
      resetFormInputs();
    },
    onSubmitError: (error) => {
      if (isApiError(error) && error.response.status === 401) {
        setError("You must be logged in to report a package.");
        return;
      }

      setError(`Error occurred: ${error.message || "Unknown error"}`);
    },
  });

  const handleCancel = () => {
    resetFormInputs();
    setError(null);
    strongForm.resetFormState();
    onOpenChange(false);
  };

  return (
    <>
      <Modal.Body>
        {versionOptions.length > 0 && (
          <div className="report-package__block">
            <label htmlFor="version" className="report-package__label">
              Version
            </label>
            <NewSelect
              id="version"
              name="version"
              options={versionOptions}
              value={formInputs.version || undefined}
              onChange={(value) => {
                updateFormInput("version", value);
              }}
              csSize="small"
            />
          </div>
        )}
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
            placeholder="Please select..."
            value={formInputs.reason || undefined}
            onChange={(value) => {
              updateFormInput("reason", value);
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
              updateFormInput("description", e.target.value);
            }}
            placeholder="Invalid submission"
            csSize="textarea"
            rootClasses="report-package__textarea"
            {...strongForm.getFieldComponentProps("description")}
          />
          {strongForm.getFieldError("description") && (
            <NewAlert csVariant="danger" csSize="small">
              {strongForm.getFieldError("description")}
            </NewAlert>
          )}
        </div>
        {error && (
          <div className="report-package__block">
            <NewAlert csVariant="danger">{error}</NewAlert>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <NewButton csVariant="secondary" onClick={handleCancel}>
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

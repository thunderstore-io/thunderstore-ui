import { useCallback, useEffect, useRef, useState } from "react";

import { type RequestConfig } from "@thunderstore/thunderstore-api";

import { ReportPackageButton } from "./ReportPackageButton";
import {
  ReportPackageForm,
  type ReportPackageFormProps,
  type ReportPackageFormState,
} from "./ReportPackageForm";
import { ReportPackageModal } from "./ReportPackageModal";
import { ReportPackageSubmitted } from "./ReportPackageSubmitted";

const createInitialFormInputs = (
  defaultVersion?: string
): ReportPackageFormState => ({
  reason: null,
  description: "",
  // Only seed a version when we actually have one: the request schema requires
  // a non-empty version_number (z.string().min(1)), so seeding "" would fail
  // client-side validation — omit it instead.
  ...(defaultVersion ? { version_number: defaultVersion } : {}),
});

export function useReportPackage(formProps: {
  // Factory (not an already-started promise) so the version list is fetched
  // lazily — only when the modal first opens — and is keyed to the package
  // identity: a new factory means a new package, which resets the cached props.
  formPropsFactory: () => Promise<ReportPackageFormProps>;
  config: () => RequestConfig;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formInputs, setFormInputs] = useState<ReportPackageFormState>(
    createInitialFormInputs
  );

  const onOpenChange = (isOpen: boolean) => {
    setIsOpen(isOpen);
    setIsSubmitted(false);
    setError(null);
  };

  type UpdateFormInput = <K extends keyof ReportPackageFormState>(
    field: K,
    value: ReportPackageFormState[K]
  ) => void;

  const updateFormInput = useCallback<UpdateFormInput>((field, value) => {
    setFormInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const { formPropsFactory } = formProps;

  const [props, setProps] = useState<ReportPackageFormProps | null>(null);

  // Reseed the default version on reset so reopening the modal (after a submit
  // or cancel) defaults to the current version again instead of an empty select.
  const resetFormInputs = useCallback(() => {
    setFormInputs(createInitialFormInputs(props?.defaultVersion));
  }, [props?.defaultVersion]);

  // Tracks which factory produced the current props so a new factory (i.e. a
  // different package after client-side nav) discards stale props and refetches.
  const loadedFactory = useRef<typeof formPropsFactory | null>(null);

  // Fetch lazily: only when the modal opens, and only once per package. Keyed to
  // the factory so navigating to another package refetches that package's
  // versions; a cancellation guard avoids setting state after unmount or after
  // the package changed mid-flight.
  useEffect(() => {
    // The package changed (new factory): drop the previous package's props and
    // form inputs so the form doesn't carry the old version list or a reason/
    // description typed for a different package. The version is reseeded below
    // once the new props resolve.
    if (loadedFactory.current && loadedFactory.current !== formPropsFactory) {
      loadedFactory.current = null;
      setProps(null);
      setFormInputs(createInitialFormInputs());
    }
    if (!isOpen || loadedFactory.current === formPropsFactory) {
      return;
    }
    let cancelled = false;
    void formPropsFactory().then((resolved) => {
      if (cancelled) return;
      loadedFactory.current = formPropsFactory;
      setProps(resolved);
      // Preselect the version the user has open once the version list resolves,
      // but only if we have a real version and the user hasn't picked one yet.
      setFormInputs((prev) =>
        prev.version_number || !resolved.defaultVersion
          ? prev
          : { ...prev, version_number: resolved.defaultVersion }
      );
    });
    return () => {
      cancelled = true;
    };
  }, [isOpen, formPropsFactory]);

  const button = <ReportPackageButton onClick={() => onOpenChange(true)} />;

  const extraProps = {
    error,
    onOpenChange,
    setError,
    setIsSubmitted,
    formInputs,
    updateFormInput,
    resetFormInputs,
  };
  const form = props && (
    <ReportPackageForm {...props} {...extraProps} config={formProps.config} />
  );

  const done = (
    <ReportPackageSubmitted closeModal={() => onOpenChange(false)} />
  );

  const modal = (
    <ReportPackageModal {...{ isOpen, onOpenChange }}>
      {isSubmitted ? done : form}
    </ReportPackageModal>
  );

  return {
    ReportPackageButton: button,
    ReportPackageModal: modal,
  };
}

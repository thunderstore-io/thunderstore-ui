import { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router";

import { NewAlert, NewButton, useToast } from "@thunderstore/cyberstorm";
import {
  extractApiErrorMessage,
  isApiError,
  updatePackageVersionReadmeOverride,
} from "@thunderstore/thunderstore-api";

import {
  type PreviousOverride,
  downloadOverrideText,
  findPreviousReadmeOverride,
} from "../../p/readmeEdit/overrideMigration";
import type { OutletContextShape } from "../../root";

export interface OverrideMigrationNoticeProps {
  namespace: string;
  packageName: string;
  newVersion: string;
  /** Copied on mount if the submitter opted in on the upload form. If that
      fails, the manual copy offer is shown instead. */
  overrideToCarry?: PreviousOverride | null;
}

export function OverrideMigrationNotice({
  namespace,
  packageName,
  newVersion,
  overrideToCarry,
}: OverrideMigrationNoticeProps) {
  const outletContext = useOutletContext() as OutletContextShape;
  const toast = useToast();

  const [previousOverride, setPreviousOverride] = useState(
    overrideToCarry ?? null
  );
  const [copying, setCopying] = useState(false);
  const [copied, setCopied] = useState(false);
  const carryAttempted = useRef(false);

  useEffect(() => {
    if (overrideToCarry) return;
    let cancelled = false;
    findPreviousReadmeOverride(
      outletContext.requestConfig,
      namespace,
      packageName,
      newVersion
    )
      .then((result) => {
        if (!cancelled) setPreviousOverride(result);
      })
      .catch(() => {
        // Best effort
      });
    return () => {
      cancelled = true;
    };
  }, [namespace, packageName, newVersion, overrideToCarry]);

  async function copyReadme(override: PreviousOverride) {
    setCopying(true);
    try {
      await updatePackageVersionReadmeOverride({
        config: outletContext.requestConfig,
        params: { namespace, package: packageName, version: newVersion },
        data: { content: override.markdown },
        queryParams: {},
      });
      toast.addToast({
        csVariant: "success",
        children:
          "Site-edited README carried over. Changes might take several minutes to show publicly!",
        duration: 8000,
      });
      setCopied(true);
    } catch (error) {
      toast.addToast({
        csVariant: "danger",
        children: `Carrying the edit over failed: ${
          isApiError(error) ? extractApiErrorMessage(error) : "unknown error"
        }`,
        duration: 8000,
      });
    } finally {
      setCopying(false);
    }
  }

  useEffect(() => {
    if (!overrideToCarry || carryAttempted.current) return;
    carryAttempted.current = true;
    copyReadme(overrideToCarry);
  }, [overrideToCarry]);

  if (!previousOverride || copied) return null;

  return (
    <NewAlert csVariant="info">
      <div className="override-migration-notice">
        <span>
          Version {newVersion} uses the README included in your package. Version{" "}
          {previousOverride.versionNumber} still has its edited README. You can
          copy that README to this version’s Thunderstore page.
        </span>
        <span className="override-migration-notice__actions">
          <NewButton
            csSize="small"
            csVariant="accent"
            onClick={() => copyReadme(previousOverride)}
            disabled={copying}
          >
            {copying ? "Copying…" : "Copy edited README"}
          </NewButton>
          <NewButton
            csSize="small"
            csVariant="secondary"
            onClick={() => downloadOverrideText(previousOverride.markdown)}
            disabled={copying}
          >
            Download edited README
          </NewButton>
        </span>
      </div>
    </NewAlert>
  );
}

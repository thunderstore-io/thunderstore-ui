import { useEffect, useState } from "react";
import { useOutletContext } from "react-router";

import { NewAlert, NewButton } from "@thunderstore/cyberstorm";

import {
  type PreviousOverride,
  downloadOverrideText,
  findHiddenChangelogOverride,
} from "../../p/readmeEdit/overrideMigration";
import type { OutletContextShape } from "../../root";

export interface ChangelogOverrideNoticeProps {
  namespace: string;
  packageName: string;
  newVersion: string;
}

export function ChangelogOverrideNotice({
  namespace,
  packageName,
  newVersion,
}: ChangelogOverrideNoticeProps) {
  const outletContext = useOutletContext() as OutletContextShape;
  const [hidden, setHidden] = useState<PreviousOverride | null>(null);

  useEffect(() => {
    let cancelled = false;
    findHiddenChangelogOverride(
      outletContext.requestConfig,
      namespace,
      packageName,
      newVersion
    )
      .then((result) => {
        if (!cancelled) setHidden(result);
      })
      .catch(() => {
        // Best effort
      });
    return () => {
      cancelled = true;
    };
  }, [namespace, packageName, newVersion]);

  if (!hidden) return null;

  return (
    <NewAlert csVariant="info">
      <div className="override-migration-notice">
        <span>
          Version {newVersion} uses the CHANGELOG included in your package.
          Version {hidden.versionNumber} had an edited CHANGELOG, and edited
          CHANGELOGs are not copied to new versions.
        </span>
        <span className="override-migration-notice__actions">
          <NewButton
            csSize="small"
            csVariant="secondary"
            onClick={() =>
              downloadOverrideText(hidden.markdown, "CHANGELOG.md")
            }
          >
            Download edited CHANGELOG
          </NewButton>
        </span>
      </div>
    </NewAlert>
  );
}

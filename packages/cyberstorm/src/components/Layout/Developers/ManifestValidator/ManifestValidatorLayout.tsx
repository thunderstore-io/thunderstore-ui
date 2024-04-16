"use client";
import styles from "./ManifestValidatorLayout.module.css";
import { SettingItem } from "../../../SettingItem/SettingItem";
import { BreadCrumbs } from "../../../BreadCrumbs/BreadCrumbs";
import { BaseLayout } from "../../BaseLayout/BaseLayout";
import { CyberstormLink } from "../../../Links/Links";
import { PageHeader } from "../../BaseLayout/PageHeader/PageHeader";
import { useState, useEffect } from "react";
import { CodeInput } from "../../../CodeInput/CodeInput";
import { Alert } from "../../../Alert/Alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWarning } from "@fortawesome/pro-solid-svg-icons";
import { Select } from "../../../Select/Select";
import { isRecord, isStringArray } from "../../../../utils/type_guards";
import { usePromise } from "@thunderstore/use-promise";
import { useDapper } from "@thunderstore/dapper";

interface HTMLResponse {
  success?: string;
  non_field_errors?: string[];
  namespace?: string[];
}

function isHTMLResponse(response: unknown): response is HTMLResponse {
  return (
    (isRecord(response) && typeof response.success === "string") ||
    (isRecord(response) && isStringArray(response.non_field_errors)) ||
    (isRecord(response) && isStringArray(response.namespace))
  );
}

const encode = (str: string): string =>
  Buffer.from(str, "binary").toString("base64");

const PLACEHOLDER = `{
  "name": "Textarea",
  "version_number": "1.1.0",
  "number": 0,
  "boolean": true,
  "website_url": "https://github.com/thunderstore-io",
  "description": "This is a description for a mod. 250 characters max",
  "dependencies": [
      "Mythic-TestMod-1.1.0"
  ]
}
`;

interface IManifestValidationResult {
  teamInput: string;
  manifestInput: string;
}

async function ManifestValidationResult(
  props: IManifestValidationResult
): Promise<{
  status: "success" | "failure";
  message: string;
}> {
  const { teamInput, manifestInput } = props;
  const response = await fetch(
    "https://thunderstore.io/api/experimental/submission/validate/manifest-v1/",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        namespace: teamInput,
        manifest_data: encode(manifestInput),
      }),
    }
  );

  if (response.status === 200 || response.status === 400) {
    const parsedResponse = await response.json();
    if (isHTMLResponse(parsedResponse)) {
      if (parsedResponse.success) {
        return { status: "success", message: "All systems go!" };
      } else if (parsedResponse.non_field_errors) {
        return {
          status: "failure",
          message: parsedResponse.non_field_errors[0],
        };
      } else if (
        parsedResponse.namespace &&
        parsedResponse.namespace[0] === "Object not found"
      ) {
        return {
          status: "failure",
          message: "Namespace not found",
        };
      }
    }
  }
  return { status: "failure", message: "Server error" };
}

/**
 * Cyberstorm ManifestValidator Layout
 */
export function ManifestValidatorLayout() {
  const [teamInput, setTeamInput] = useState("");
  const [manifestInput, setManifestInput] = useState("");
  const [validationTrigger, setValidationTrigger] = useState(false);

  const dapper = useDapper();
  const user = usePromise(dapper.getCurrentUser, []);

  const selectOptions = user.teams.map((team) => {
    return { value: team.name, label: team.name };
  });

  const validator = {
    validationFunc: ManifestValidationResult,
    args: { teamInput, manifestInput },
  };

  useEffect(() => {
    if (teamInput && manifestInput) {
      setValidationTrigger(true);
    } else {
      setValidationTrigger(false);
    }
  }, [teamInput, manifestInput]);

  return (
    <BaseLayout
      breadCrumb={
        <BreadCrumbs>
          <CyberstormLink linkId="ManifestValidator">
            Manifest Validator
          </CyberstormLink>
        </BreadCrumbs>
      }
      header={<PageHeader title="Manifest Validator" />}
      mainContent={
        <SettingItem
          title="Manifest Validator"
          description="Select a team to validate a package"
          content={
            <div className={styles.content}>
              <Alert
                content="You must be logged in to see your teams"
                variant="warning"
                icon={<FontAwesomeIcon icon={faWarning} />}
              />
              <Select
                onChange={setTeamInput}
                options={selectOptions}
                value={teamInput}
                placeholder="Select team"
              />
              <CodeInput
                placeholder={PLACEHOLDER}
                setValue={setManifestInput}
                value={manifestInput}
                validator={validator}
                shouldValidate={validationTrigger}
              />
            </div>
          }
        />
      }
    />
  );
}

ManifestValidatorLayout.displayName = "ManifestValidatorLayout";

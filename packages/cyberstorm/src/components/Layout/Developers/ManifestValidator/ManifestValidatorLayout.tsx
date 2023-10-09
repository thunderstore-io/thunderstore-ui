"use client";
import styles from "./ManifestValidatorLayout.module.css";
import { SettingItem } from "../../../SettingItem/SettingItem";
import { BreadCrumbs } from "../../../BreadCrumbs/BreadCrumbs";
import { BaseLayout } from "../../BaseLayout/BaseLayout";
import { ManifestValidatorLink } from "../../../Links/Links";
import { PageHeader } from "../../BaseLayout/PageHeader/PageHeader";
import { useState, useEffect } from "react";
import { CodeInput } from "../../../CodeInput/CodeInput";
import { Alert } from "../../../Alert/Alert";
import { Icon } from "../../../Icon/Icon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWarning } from "@fortawesome/pro-solid-svg-icons";
import { Select } from "../../../Select/Select";

interface HTMLResponse {
  success?: string;
  non_field_errors?: string[];
  namespace?: string[];
}

export const isRecord = (obj: unknown): obj is Record<string, unknown> =>
  obj instanceof Object;

function isHTMLResponse(response: unknown): response is HTMLResponse {
  return isRecord(response);
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

/**
 * Cyberstorm ManifestValidator Layout
 */
export function ManifestValidatorLayout() {
  const [teamInput, setTeamInput] = useState("");
  const [manifestInput, setManifestInput] = useState(PLACEHOLDER);
  const [failureMessage, setFailureMessage] = useState<undefined | string>(
    undefined
  );
  const [validationStatus, setValidationStatus] = useState<
    "waiting" | "validating" | "success" | "failure"
  >("waiting");

  useEffect(() => {
    async function getHTML() {
      setValidationStatus("validating");
      setFailureMessage(undefined);
      fetch(
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
      )
        .then((response) => {
          if (response.status === 200 || response.status === 400) {
            return response.json();
          }
          throw new Error("Something went wrong");
        })
        .then((responseJson) => {
          if (isHTMLResponse(responseJson)) {
            if (responseJson.success) {
              setValidationStatus("success");
            } else if (responseJson.non_field_errors) {
              setFailureMessage(responseJson.non_field_errors[0]);
              setValidationStatus("failure");
            } else if (
              responseJson.namespace &&
              responseJson.namespace[0] === "Object not found"
            ) {
              setFailureMessage("Namespace not found");
              setValidationStatus("failure");
            }
          } else {
            setValidationStatus("failure");
          }
        })
        .catch(() => {
          setValidationStatus("failure");
        });
    }
    if (manifestInput && teamInput) {
      getHTML();
    }
  }, [manifestInput, teamInput]);

  const valdatorContent = (
    <div className={styles.content}>
      <Alert
        content="You must be logged in to see your teams"
        variant="warning"
        icon={
          <Icon>
            <FontAwesomeIcon icon={faWarning} />
          </Icon>
        }
      />
      <Select
        onChange={setTeamInput}
        options={selectOptions}
        value={teamInput}
        placeholder="Select team"
      />
      <div
        className={`${
          validationStatus === "failure" ? styles.inputContainerFailure : ""
        }`}
      >
        <CodeInput
          placeholder={PLACEHOLDER}
          setValue={setManifestInput}
          value={manifestInput}
          validationBar
          validationStatus={validationStatus}
          failureMessage={failureMessage}
        />
      </div>
    </div>
  );

  return (
    <BaseLayout
      breadCrumb={
        <BreadCrumbs>
          <ManifestValidatorLink>Manifest Validator</ManifestValidatorLink>
        </BreadCrumbs>
      }
      header={<PageHeader title="Manifest Validator" />}
      mainContent={
        <SettingItem
          title="Manifest Validator"
          description="Select a team to validate a package"
          content={valdatorContent}
        />
      }
    />
  );
}

const selectOptions = [
  {
    value: "Test_Team_9",
    label: "Test_Team_9",
  },
  {
    value: "Test_Team_8",
  },
];

ManifestValidatorLayout.displayName = "ManifestValidatorLayout";

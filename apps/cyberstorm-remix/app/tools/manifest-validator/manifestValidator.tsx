import {
  CodeInput,
  NewAlert,
  NewBreadCrumbs,
  NewSelect,
  isRecord,
  isStringArray,
} from "@thunderstore/cyberstorm";
import "./manifestValidator.css";
import { useEffect, useState } from "react";
import { useOutletContext } from "@remix-run/react";
import { Buffer } from "buffer";
import {
  isApiError,
  RequestConfig,
  toolsManifestValidate,
} from "@thunderstore/thunderstore-api";
import { PageHeader } from "~/commonComponents/PageHeader/PageHeader";
import { OutletContextShape } from "../../root";

import { useDebounce } from "use-debounce";

export default function ManifestValidator() {
  const outletContext = useOutletContext() as OutletContextShape;
  const currentUser = outletContext.currentUser;

  const [teamInput, setTeamInput] = useState("");
  const [manifestInput, setManifestInput] = useState("");

  const selectOptions = currentUser
    ? currentUser.teams.map((team) => {
        return { value: team.name, label: team.name };
      })
    : [];

  const [validation, setValidation] = useState<{
    status: "waiting" | "processing" | "success" | "failure";
    message?: string;
  }>({ status: "waiting", message: "Waiting for input" });

  const [debouncedTeamInput] = useDebounce(teamInput, 300, {
    maxWait: 300,
  });

  const [debouncedManifestInput] = useDebounce(manifestInput, 300, {
    maxWait: 300,
  });

  useEffect(() => {
    if (debouncedTeamInput !== "") {
      if (debouncedManifestInput !== "") {
        setValidation({ status: "processing" });
        ManifestValidationResult(
          debouncedTeamInput,
          debouncedManifestInput,
          outletContext.requestConfig,
          setValidation
        );
      } else {
        setValidation({
          status: "waiting",
          message: "Waiting for manifest text",
        });
      }
    } else {
      setValidation({
        status: "waiting",
        message: "Waiting for team selection",
      });
    }
  }, [debouncedTeamInput, debouncedManifestInput, outletContext.requestConfig]);

  return (
    <div className="container container--y container--full layout__content">
      <NewBreadCrumbs>
        <span>
          <span>Manifest Validator</span>
        </span>
      </NewBreadCrumbs>
      <PageHeader
        heading="Manifest Validator"
        headingLevel="1"
        headingSize="2"
      />
      <section className="container container--y container--full manifest-validator">
        <div className="container container--x container--full manifest-validator__row">
          <div className="manifest-validator__meta">
            <p className="manifest-validator__title">Manifest Validator</p>
            <p className="manifest-validator__description">
              Select a team to validate a package
            </p>
          </div>
          <div className="manifest-validator__content">
            {currentUser && currentUser.username ? null : (
              <NewAlert csVariant="warning">
                You must be logged in to see your teams
              </NewAlert>
            )}
            <NewSelect
              onChange={setTeamInput}
              options={selectOptions}
              value={teamInput}
              placeholder="Select team"
            />
            <CodeInput
              placeholder={PLACEHOLDER}
              onChange={(e) => setManifestInput(e.currentTarget.value)}
              value={manifestInput}
              validationBarProps={validation}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

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

async function ManifestValidationResult(
  teamInput: string,
  manifestInput: string,
  config: () => RequestConfig,
  setValidation: (validation: {
    status: "waiting" | "processing" | "success" | "failure";
    message?: string;
  }) => void
) {
  try {
    const response = await toolsManifestValidate(config, {
      namespace: teamInput,
      manifest_data: encode(manifestInput),
    });
    if (
      isRecord(response) &&
      typeof response.success === "boolean" &&
      response.success
    ) {
      setValidation({ status: "success", message: "All systems go!" });
    } else {
      const parsedResponse = await response.json();
      if (isHTMLResponse(parsedResponse)) {
        setValidation({ status: "success", message: "All systems go!" });
      }
    }
  } catch (e) {
    if (isApiError(e)) {
      if (isHTMLResponse(e.responseJson)) {
        if (e.responseJson.non_field_errors) {
          setValidation({
            status: "failure",
            message: e.responseJson.non_field_errors[0],
          });
        } else if (
          e.responseJson.namespace &&
          e.responseJson.namespace[0] === "Object not found"
        ) {
          setValidation({
            status: "failure",
            message: "Namespace not found",
          });
        }
      }
    } else {
      // REMIX TODO: Add sentry logging here
      setValidation({ status: "failure", message: "Unknown error" });
      throw e;
    }
  }
}

import {
  Alert,
  BreadCrumbs,
  CodeInput,
  CyberstormLink,
  Select,
  SettingItem,
  isRecord,
  isStringArray,
} from "@thunderstore/cyberstorm";
import styles from "./manifestValidator.module.css";
import { useEffect, useState } from "react";
import { getDapper } from "cyberstorm/dapper/sessionUtils";
import { DapperTs, currentUserSchema } from "@thunderstore/dapper-ts";
import { useLoaderData } from "@remix-run/react";
import { faWarning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Buffer } from "buffer";
import {
  isApiError,
  toolsManifestValidate,
} from "@thunderstore/thunderstore-api";
import { PageHeader } from "~/commonComponents/PageHeader/PageHeader";

export async function loader() {
  const dapper = await getDapper();
  const currentUser = await dapper.getCurrentUser();
  return {
    currentUser: currentUser as typeof currentUserSchema._type,
    dapper: dapper,
  };
}

export async function clientLoader() {
  const dapper = await getDapper(true);
  const currentUser = await dapper.getCurrentUser();
  return {
    currentUser: currentUser as typeof currentUserSchema._type,
    dapper: dapper,
  };
}

clientLoader.hydrate = true;

export default function ManifestValidator() {
  const { currentUser, dapper } = useLoaderData<
    typeof loader | typeof clientLoader
  >();

  const [teamInput, setTeamInput] = useState("");
  const [manifestInput, setManifestInput] = useState("");
  const [validationTrigger, setValidationTrigger] = useState(false);

  const selectOptions = currentUser.teams.map((team) => {
    return { value: team.name, label: team.name };
  });

  const validator = {
    validationFunc: ManifestValidationResult,
    args: { teamInput, manifestInput, dapper },
  };

  useEffect(() => {
    if (teamInput && manifestInput && dapper && manifestInput !== "") {
      setValidationTrigger(true);
    } else {
      setValidationTrigger(false);
    }
  }, [teamInput, manifestInput, dapper]);

  return (
    <>
      <BreadCrumbs>
        <CyberstormLink linkId="ManifestValidator">
          Manifest Validator
        </CyberstormLink>
      </BreadCrumbs>
      <header className="project-root__page-header">
        <PageHeader title="Manifest Validator" />
      </header>
      <main className="project-root__main">
        <SettingItem
          title="Manifest Validator"
          description="Select a team to validate a package"
          content={
            <div className={styles.root}>
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
      </main>
    </>
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

interface IManifestValidationResult {
  teamInput: string;
  manifestInput: string;
  dapper: DapperTs;
}

async function ManifestValidationResult(
  props: IManifestValidationResult
): Promise<{
  status: "success" | "failure";
  message: string;
}> {
  const { teamInput, manifestInput } = props;
  try {
    const response = await toolsManifestValidate(props.dapper.config, {
      namespace: teamInput,
      manifest_data: encode(manifestInput),
    });
    const parsedResponse = await response.json();
    if (isHTMLResponse(parsedResponse)) {
      return { status: "success", message: "All systems go!" };
    }
  } catch (e) {
    if (isApiError(e)) {
      if (isHTMLResponse(e.responseJson)) {
        if (e.responseJson.non_field_errors) {
          return {
            status: "failure",
            message: e.responseJson.non_field_errors[0],
          };
        } else if (
          e.responseJson.namespace &&
          e.responseJson.namespace[0] === "Object not found"
        ) {
          return {
            status: "failure",
            message: "Namespace not found",
          };
        }
      }
    } else {
      throw e;
    }
  }
  return { status: "failure", message: "Server error" };
}

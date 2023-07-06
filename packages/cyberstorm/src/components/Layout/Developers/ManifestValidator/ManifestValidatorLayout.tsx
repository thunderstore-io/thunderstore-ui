import styles from "./ManifestValidatorLayout.module.css";
import { SettingItem } from "../../../SettingItem/SettingItem";
import { TextInput } from "../../../TextInput/TextInput";
import { BreadCrumbs } from "../../../BreadCrumbs/BreadCrumbs";
import { BaseLayout } from "../../BaseLayout/BaseLayout";
import { ManifestValidatorLink } from "../../../Links/Links";
import { PageHeader } from "../../BaseLayout/PageHeader/PageHeader";
import { DependencyList, EffectCallback, useEffect, useState } from "react";
import { Base64 } from "js-base64";
import { TextAreaInput } from "../../../TextAreaInput/TextAreaInput";

// MOSTLY COPY PASTED CODE FROM THUNDERSTORES REACT COMPONENTS

// Copy pasted types
export type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };

interface ManifestV1ValidationErrors {
  non_field_errors?: string[];
}

// Some timeout function?
export const useDebounce = (
  time: number,
  effect: EffectCallback,
  deps?: DependencyList,
  onChange?: () => void
) => {
  useEffect(() => {
    if (onChange) onChange();
    const timeoutId = setTimeout(() => effect(), time);
    return () => clearTimeout(timeoutId);
  }, deps);
};

// Error parsing class
export class ThunderstoreApiError {
  message: string;
  response: Response;
  errorObject: JSONValue | null;

  constructor(
    message: string,
    response: Response,
    errorObject: JSONValue | null
  ) {
    this.message = message;
    this.response = response;
    this.errorObject = errorObject;
  }

  static createFromResponse = async (message: string, response: Response) => {
    let errorObject: JSONValue | null = null;
    try {
      errorObject = await response.json();
    } catch (e) {
      console.error(e);
    }
    return new ThunderstoreApiError(message, response, errorObject);
  };

  get statusText(): string {
    return this.response.statusText;
  }
}

// Base API class
export class ThunderstoreApi {
  apiKey: string | null;

  // TODO: NEEDS THE DJANGO USER ALSO, WHEN AUTH IS IMPLEMENTED
  constructor(apiKey: string | null) {
    this.apiKey = apiKey;
  }

  apiFetch = async (namespace: string, manifest_data: string) => {
    const headers = new Headers({
      "Content-Type": "application/json",
    });
    // TODO: ENABLE WHEN AUTH IS IMPLEMENTED
    // if (this.apiKey) {
    //   headers.set("Authorization", `Session ${this.apiKey}`);
    // }
    const data = { namespace: namespace, manifest_data: manifest_data };
    const result = await fetch(
      "http://thunderstore.temp/api/experimental/submission/validate/manifest-v1/",
      {
        method: "POST",
        headers: headers,
        body: data ? JSON.stringify(data) : undefined,
      }
    );
    if (result.status < 200 || result.status >= 300) {
      const message = `Invalid HTTP response status: ${result.status} ${result.statusText}`;
      throw await ThunderstoreApiError.createFromResponse(message, result);
    }
    return (await result.json()) as { success: boolean };
  };
}

/**
 * Cyberstorm ManifestValidator Layout
 */
export function ManifestValidatorLayout() {
  const ExperimentalApi = new ThunderstoreApi("potato");
  const [validationStatus, setValidationStatus] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [namespace, setNamespace] = useState<string>("");
  const [manifest, setManifest] = useState<string>("");

  const validateManifest = () => {
    const errors: string[] = [];
    if (manifest.length <= 0) {
      errors.push("Enter manifest contents");
    }
    if (namespace == null) {
      errors.push("Select a team. You must be logged in to see your teams.");
    }
    console.log(manifest.length);
    if (manifest.length > 0 && namespace != null) {
      const b = Base64.encode(manifest);
      // TODO: Move the fetching function to dapper
      ExperimentalApi.apiFetch(namespace, b)
        .then((result) => {
          if (result.success) {
            setValidationStatus(true);
            setValidationErrors(["sucess"]);
          } else {
            setValidationErrors(["Unknown validation error"]);
            setValidationStatus(false);
          }
        })
        .catch((e) => {
          if (e instanceof ThunderstoreApiError) {
            const result = e.errorObject as ManifestV1ValidationErrors;
            if (result.non_field_errors) {
              errors.push(...result.non_field_errors);
            }
          } else {
            errors.push(
              "Unknown error occurred when calling the validation API"
            );
            setValidationErrors(errors);
            console.log(e);
          }
          setValidationStatus(false);
          setValidationErrors(errors);
        });
    } else {
      setValidationStatus(false);
      setValidationErrors(errors);
    }
    console.log(validationStatus);
  };

  useDebounce(
    600,
    () => {
      validateManifest();
    },
    [manifest, namespace],
    () => setValidationStatus(false)
  );

  const valdatorContent = (
    <div className={styles.content}>
      <TextInput setValue={setNamespace} value={namespace} />
      <TextAreaInput setValue={setManifest} value={manifest} />
      <div>{validationStatus.toString()}</div>
      <div>{validationErrors}</div>
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

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { RefObject } from "react";

import { NewAlert, NewIcon, classnames } from "@thunderstore/cyberstorm";
import {
  faCheckCircle,
  faCircleXmark,
  faFileZip,
  faTreasureChest,
} from "@thunderstore/icons";
import { DnDFileInput } from "@thunderstore/react-dnd";
import type { IBaseUploadHandle } from "@thunderstore/ts-uploader";

import { FormSection } from "../../commonComponents/FormSection/FormSection";
import { PACKAGE_ZIP_ACCEPT, formatBytes } from "../uploadUtils";
import { SectionErrors } from "./SectionErrors";
import "./UploadFileSection.css";

export interface UploadFileSectionProps {
  file: File | null;
  uploadError: string | null;
  handle?: IBaseUploadHandle;
  sectionErrors: string[];
  fileWarnings: string[];
  fileValidationErrors: string[];
  fileInputRef: RefObject<HTMLInputElement | null>;
  onFileChange: (file: File | null) => void;
  onRemoveFile: () => void;
}

export function UploadFileSection({
  file,
  uploadError,
  handle,
  sectionErrors,
  fileWarnings,
  fileValidationErrors,
  fileInputRef,
  onFileChange,
  onRemoveFile,
}: UploadFileSectionProps) {
  return (
    <FormSection
      title="Upload file"
      description="Upload your package as a ZIP file."
    >
      <DnDFileInput
        rootClasses={classnames(
          "drag-n-drop",
          file && uploadError ? "drag-n-drop--error" : null,
          file && !uploadError ? "drag-n-drop--success" : null
        )}
        name="file"
        accept={PACKAGE_ZIP_ACCEPT}
        baseState={
          <div className="drag-n-drop__body">
            {file ? (
              <>
                {uploadError ? (
                  <>
                    <NewIcon
                      wrapperClasses="drag-n-drop__icon"
                      csVariant="danger"
                    >
                      <FontAwesomeIcon icon={faCircleXmark} />
                    </NewIcon>
                    <span className="drag-n-drop__main-text">
                      {file.name}{" "}
                      {`(${
                        file.size > 0 ? formatBytes(file.size) : "0 Bytes"
                      })`}
                    </span>
                  </>
                ) : (
                  <>
                    <NewIcon
                      wrapperClasses="drag-n-drop__icon"
                      csVariant="success"
                    >
                      <FontAwesomeIcon icon={faCheckCircle} />
                    </NewIcon>
                    <span className="drag-n-drop__main-text">
                      {file.name}{" "}
                      {`(${
                        file.size > 0 ? formatBytes(file.size) : "0 Bytes"
                      })`}
                    </span>
                  </>
                )}
                <button
                  type="button"
                  className="drag-n-drop__remove-button"
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onRemoveFile();
                  }}
                >
                  Remove
                </button>
              </>
            ) : (
              <>
                <NewIcon wrapperClasses="drag-n-drop__icon" csVariant="accent">
                  <FontAwesomeIcon icon={faFileZip} />
                </NewIcon>
                <span className="drag-n-drop__main-text">
                  Choose or drag ZIP file here
                </span>
                <span className="drag-n-drop__sub-text">10GB max</span>
              </>
            )}
          </div>
        }
        dragState={
          <div className="drag-n-drop__body">
            <NewIcon wrapperClasses="drag-n-drop__icon" csVariant="accent">
              <FontAwesomeIcon icon={faTreasureChest} />
            </NewIcon>
            <span className="drag-n-drop__main-text">Drop ZIP file here</span>
            {file ? (
              <span className="drag-n-drop__sub-text">{file.name}</span>
            ) : null}
            <span className="drag-n-drop__sub-text">10GB max</span>
          </div>
        }
        onChange={(files) => {
          const nextFile = files.item(0);
          if (nextFile) {
            onFileChange(nextFile);
          }
        }}
        readonly={!!handle || !!file}
        fileInputRef={fileInputRef}
      />
      {uploadError ? (
        <NewAlert csVariant="danger" rootClasses="upload__alert">
          {uploadError}
        </NewAlert>
      ) : null}
      {fileWarnings.length > 0 ? (
        <NewAlert csVariant="warning" rootClasses="upload__alert">
          <div>
            {fileWarnings.map((msg) => (
              <div key={msg}>{msg}</div>
            ))}
          </div>
        </NewAlert>
      ) : null}
      <SectionErrors errors={fileValidationErrors} />
      <SectionErrors errors={sectionErrors} />
    </FormSection>
  );
}

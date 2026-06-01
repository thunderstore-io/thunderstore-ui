import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import {
  faCircleXmark,
  faFileZip,
  faTreasureChest,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { RefObject } from "react";

import { NewAlert, NewIcon, classnames } from "@thunderstore/cyberstorm";
import { DnDFileInput } from "@thunderstore/react-dnd";
import type { IBaseUploadHandle } from "@thunderstore/ts-uploader";

import { FormSection } from "../../commonComponents/FormSection/FormSection";
import { PACKAGE_ZIP_ACCEPT, formatBytes } from "../uploadUtils";
import { SectionErrors } from "./SectionErrors";

export interface UploadFileSectionProps {
  file: File | null;
  uploadError: string | null;
  handle?: IBaseUploadHandle;
  isDone: boolean;
  sectionErrors: string[];
  fileInputRef: RefObject<HTMLInputElement | null>;
  onFileChange: (file: File | null) => void;
  onRemoveFile: () => void;
}

export function UploadFileSection({
  file,
  uploadError,
  handle,
  isDone,
  sectionErrors,
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
          uploadError ? "drag-n-drop--error" : null,
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
                  className="drag-n-drop__remove-button"
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
                  Drag and drop your ZIP file here
                </span>
                <span className="drag-n-drop__sub-text">5GB max</span>
              </>
            )}
          </div>
        }
        dragState={
          <div className="drag-n-drop__body">
            <NewIcon wrapperClasses="drag-n-drop__icon" csVariant="accent">
              <FontAwesomeIcon icon={faTreasureChest} />
            </NewIcon>
            {file ? (
              <span>{file.name}</span>
            ) : (
              <span className="drag-n-drop__main-text">Drag file here</span>
            )}
          </div>
        }
        onChange={(files) => {
          onFileChange(files.item(0));
        }}
        readonly={!!handle}
        fileInputRef={fileInputRef}
      />
      {uploadError ? (
        <NewAlert csVariant="danger" rootClasses="upload__alert">
          {uploadError}
        </NewAlert>
      ) : null}
      {handle && !isDone ? (
        <p className="upload__processing">Uploading…</p>
      ) : null}
      <SectionErrors errors={sectionErrors} />
    </FormSection>
  );
}

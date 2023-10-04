"use client";
import { SettingItem } from "../../../SettingItem/SettingItem";
import { BreadCrumbs } from "../../../BreadCrumbs/BreadCrumbs";
import { MarkdownPreviewLink } from "../../../Links/Links";
import { BaseLayout } from "../../BaseLayout/BaseLayout";
import { PageHeader } from "../../BaseLayout/PageHeader/PageHeader";
import { Suspense, useState, useEffect } from "react";
import { Markdown } from "../../../Markdown/Markdown";
import styles from "./MarkdownPreviewLayout.module.css";
import { TextAreaInput } from "../../../TextAreaInput/TextAreaInput";
import { Icon } from "../../../Icon/Icon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faTriangleExclamation,
  faPenToSquare,
  faArrowsRotate,
} from "@fortawesome/free-solid-svg-icons";

/**
 * Cyberstorm MarkdownPreview Layout
 */
export function MarkdownPreviewLayout() {
  const [markdownPreviewInput, setMarkdownPreviewInput] = useState("");
  const [validationStatus, setValidationStatus] = useState<
    "waiting" | "validating" | "success" | "failure"
  >("waiting");

  let statusElement = null;
  if (validationStatus === "waiting") {
    statusElement = (
      <div className={styles.statusBar}>
        <div className={styles.icon}>
          <Icon>
            <FontAwesomeIcon icon={faPenToSquare} />
          </Icon>
        </div>
        Waiting for input
      </div>
    );
  } else if (validationStatus === "validating") {
    statusElement = (
      <div className={styles.statusBar}>
        <div className={styles.icon}>
          <Icon>
            <FontAwesomeIcon icon={faArrowsRotate} />
          </Icon>
        </div>
        Validating...
      </div>
    );
  } else if (validationStatus === "success") {
    statusElement = (
      <div className={`${styles.statusBar} ${styles.statusBarSuccess}`}>
        <div className={styles.icon}>
          <Icon>
            <FontAwesomeIcon icon={faCircleCheck} />
          </Icon>
        </div>
        All systems go!
      </div>
    );
  } else if (validationStatus === "failure") {
    statusElement = (
      <div className={`${styles.statusBar} ${styles.statusBarFailure}`}>
        <div className={`${styles.icon} ${styles.iconFailure}`}>
          <Icon>
            <FontAwesomeIcon icon={faTriangleExclamation} />
          </Icon>
        </div>
        Problem, alarm, danger. Everything is going to explode.
      </div>
    );
  }

  const input = (
    <div
      className={`${styles.inputContainer} ${
        validationStatus === "failure" ? styles.inputContainerFailure : null
      }`}
    >
      <TextAreaInput
        placeHolder="# This is a markdown preview placeholder"
        setValue={setMarkdownPreviewInput}
        value={markdownPreviewInput}
      />
      {statusElement}
    </div>
  );

  return (
    <BaseLayout
      breadCrumb={
        <BreadCrumbs>
          <MarkdownPreviewLink>Markdown Preview</MarkdownPreviewLink>
        </BreadCrumbs>
      }
      header={<PageHeader title="Markdown Preview" />}
      mainContent={
        <div className={styles.root}>
          <SettingItem
            title="Markdown input"
            description="Input your markdown code"
            content={input}
          />
          <SettingItem
            title="Markdown output"
            description="A preview of your rendered markdown"
            content={
              <Suspense
                fallback={<h2 className={styles.showing}>🌀 Loading...</h2>}
              >
                <Markdown
                  input={markdownPreviewInput}
                  setStatus={setValidationStatus}
                />
              </Suspense>
            }
          />
        </div>
      }
    />
  );
}

MarkdownPreviewLayout.displayName = "MarkdownPreviewLayout";

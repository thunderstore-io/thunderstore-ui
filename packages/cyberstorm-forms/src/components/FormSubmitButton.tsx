"use client";

import { Button } from "@thunderstore/cyberstorm";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import { useFormState } from "react-hook-form";
import styles from "./FormSubmitButton.module.css";

const SubmitButtonContent = React.memo(
  (props: { isSubmitting: boolean; text: string }) => {
    if (props.isSubmitting) {
      return (
        <Button.ButtonIcon iconClasses={styles.spinningIcon}>
          <FontAwesomeIcon icon={faArrowsRotate} />
        </Button.ButtonIcon>
      );
    } else {
      return <Button.ButtonLabel>{props.text}</Button.ButtonLabel>;
    }
  }
);

SubmitButtonContent.displayName = "SubmitButtonContent";

export function FormSubmitButton({
  text,
  colorScheme = "accent",
  icon,
}: {
  text: string;
  colorScheme?:
    | "danger"
    | "default"
    | "primary"
    | "accent"
    | "tertiary"
    | "fancyAccent"
    | "success"
    | "warning"
    | "discord"
    | "github"
    | "overwolf"
    | "specialGreen"
    | "specialPurple"
    | "transparentDanger"
    | "transparentDefault"
    | "transparentTertiary"
    | "transparentAccent"
    | "transparentPrimary"
    | "wideDarker";
  icon: JSX.Element;
}) {
  const { isSubmitting, disabled } = useFormState();

  return (
    <Button.Root
      type="submit"
      paddingSize="large"
      colorScheme={colorScheme}
      disabled={isSubmitting || disabled}
    >
      {icon && <Button.ButtonIcon>{icon}</Button.ButtonIcon>}
      <SubmitButtonContent isSubmitting={isSubmitting} text={text} />
    </Button.Root>
  );
}

FormSubmitButton.displayName = "FormSubmitButton";

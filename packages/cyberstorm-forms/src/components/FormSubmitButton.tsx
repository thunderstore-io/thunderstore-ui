"use client";

import { Button } from "@thunderstore/cyberstorm";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import { useFormState } from "react-hook-form";
import styles from "./FormSubmitButton.module.css";

const SubmitButtonContent = React.memo((props: { isSubmitting: boolean }) => {
  if (props.isSubmitting) {
    return (
      <Button.ButtonIcon iconClasses={styles.spinningIcon}>
        <FontAwesomeIcon icon={faArrowsRotate} />
      </Button.ButtonIcon>
    );
  } else {
    return <Button.ButtonLabel>Create</Button.ButtonLabel>;
  }
});

SubmitButtonContent.displayName = "SubmitButtonContent";

export function FormSubmitButton() {
  const { isSubmitting, disabled } = useFormState();

  return (
    <Button.Root
      type="submit"
      paddingSize="large"
      colorScheme="success"
      disabled={isSubmitting || disabled}
    >
      <SubmitButtonContent isSubmitting={isSubmitting} />
    </Button.Root>
  );
}

FormSubmitButton.displayName = "FormSubmitButton";

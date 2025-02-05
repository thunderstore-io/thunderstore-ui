import { Button, NewButton, NewIcon } from "@thunderstore/cyberstorm";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import { useFormState } from "react-hook-form";
import styles from "./FormSubmitButton.module.css";
import { ButtonComponentProps } from "@thunderstore/cyberstorm/src/newComponents/Button/Button";

// TODO: Add style support for disabled
export const FormSubmitButton = React.forwardRef<
  HTMLButtonElement,
  ButtonComponentProps
>((props: ButtonComponentProps, forwardedRef) => {
  const { children, disabled, ...fProps } = props;
  const formState = useFormState();

  return (
    <NewButton
      ref={forwardedRef}
      type="submit"
      disabled={formState.isSubmitting || formState.disabled || disabled}
      {...fProps}
    >
      {formState.isSubmitting ? (
        <NewIcon csMode="inline" noWrapper rootClasses={styles.spinningIcon}>
          <FontAwesomeIcon icon={faArrowsRotate} />
        </NewIcon>
      ) : (
        children
      )}
    </NewButton>
  );
});

FormSubmitButton.displayName = "FormSubmitButton";

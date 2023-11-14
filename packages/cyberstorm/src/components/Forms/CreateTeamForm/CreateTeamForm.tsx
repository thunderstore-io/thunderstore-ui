"use client";
import styles from "./CreateTeamForm.module.css";
import * as Button from "../../Button";
import { TextInput } from "../../TextInput/TextInput";
import { useForm, FieldErrors, useController } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";

import { useContext } from "react";
import { ToastContext } from "../../Toast/ToastContext";
import {
  faCircleCheck,
  faCircleExclamation,
  faOctagonExclamation,
} from "@fortawesome/pro-solid-svg-icons";

/**
 * Form for creating a team
 */
export function CreateTeamForm() {
  const useToast = () => useContext(ToastContext);
  const toast = useToast();

  async function onValid(data: { teamName: string }) {
    // TODO: Add sending to TS API endpoint
    toast?.addToast(
      "info",
      <FontAwesomeIcon icon={faCircleExclamation} />,
      "Creating team"
    );
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
    // TODO: Add a toast on response return based on the response
    toast?.addToast(
      "success",
      <FontAwesomeIcon icon={faCircleCheck} />,
      "Team created"
    );
    console.log(JSON.stringify(data));
  }

  async function onInvalid(
    errors: FieldErrors<{
      teamName: string;
    }>
  ) {
    if (errors.teamName) {
      toast?.addToast(
        "danger",
        <FontAwesomeIcon icon={faOctagonExclamation} />,
        errors.teamName.message,
        30000
      );
    } else {
      toast?.addToast(
        "danger",
        <FontAwesomeIcon icon={faOctagonExclamation} />,
        "Unknown error",
        30000
      );
    }
  }

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<{ teamName: string }>({
    mode: "onSubmit",
  });

  const teamName = useController({
    control: control,
    name: "teamName",
    rules: {
      required: "Team name is required",
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onValid, onInvalid)}
      className={styles.createTeamForm}
    >
      <div className={styles.createTeamDialog}>
        <div className={styles.createTeamDialogText}>
          Enter the name of the team you wish to create. Team names can contain
          the characters a-z A-Z 0-9 _ and must not start or end with an _
        </div>
        <TextInput
          {...teamName.field}
          placeHolder={"ExampleTeamName"}
          color={
            teamName.fieldState.isDirty
              ? teamName.fieldState.invalid
                ? "red"
                : "green"
              : undefined
          }
        />
      </div>
      <div className={styles.footer}>
        <Button.Root type="submit" paddingSize="large" colorScheme="success">
          {isSubmitting ? (
            <Button.ButtonIcon iconClasses={styles.spinningIcon}>
              <FontAwesomeIcon icon={faArrowsRotate} />
            </Button.ButtonIcon>
          ) : (
            <Button.ButtonLabel>Create</Button.ButtonLabel>
          )}
        </Button.Root>
      </div>
    </form>
  );
}

CreateTeamForm.displayName = "CreateTeamForm";

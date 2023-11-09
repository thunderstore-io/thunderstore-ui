"use client";
import styles from "./CreateTeamForm.module.css";
import * as Button from "../../Button";
import { TextInput } from "../../TextInput/TextInput";
import {
  useForm,
  useController,
  UseControllerProps,
  FieldErrors,
} from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";

import { useContext } from "react";
import { ToastContext } from "../../Toast/ToastContext";
import {
  faCircleCheck,
  faCircleExclamation,
  faOctagonExclamation,
} from "@fortawesome/pro-solid-svg-icons";

// Temp util
function wait(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

/**
 * Form for creating a team
 */
export function CreateTeamForm() {
  const useToast = () => useContext(ToastContext);
  const toast = useToast();

  // If client-side form validation succeedes, run this
  async function onValid(data: { teamName: string }) {
    toast?.addToast(
      "info",
      <FontAwesomeIcon icon={faCircleExclamation} />,
      "Creating team"
    );
    await wait(1000);
    toast?.addToast(
      "success",
      <FontAwesomeIcon icon={faCircleCheck} />,
      "Team created"
    );
    console.log(JSON.stringify(data));
  }

  // If client-side form validation fails, run this
  async function onInvalid(
    errors: FieldErrors<{
      teamName: string;
    }>
  ) {
    if (errors.teamName && errors.teamName.type === "noUnderscoreStartOrEnd") {
      toast?.addToast(
        "danger",
        <FontAwesomeIcon icon={faOctagonExclamation} />,
        "Team name cannot start or end with underscore.",
        true
      );
    } else if (
      errors.teamName &&
      errors.teamName.type === "hasAllowedCharacters"
    ) {
      toast?.addToast(
        "danger",
        <FontAwesomeIcon icon={faOctagonExclamation} />,
        "Team name can contain the following characters: a-z A-Z 0-9 _",
        true
      );
    } else if (errors.teamName && errors.teamName.type === "required") {
      toast?.addToast(
        "danger",
        <FontAwesomeIcon icon={faOctagonExclamation} />,
        "Team name is required",
        true
      );
    }
  }

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<{ teamName: string }>({
    defaultValues: {
      teamName: "",
    },
    mode: "onChange",
  });

  // Start of singular field, with custom validation
  const inputProps: UseControllerProps<{ teamName: string }> = {
    control: control,
    name: "teamName",
    rules: {
      required: "Team name is required",
      validate: {
        noUnderscoreStartOrEnd: (value) =>
          /^(?!_)(?!.*_$).*/.test(value) ? true : false,
        hasAllowedCharacters: (value) =>
          /^[a-zA-Z0-9_]*$/.test(value) ? true : false,
      },
    },
  };
  const { field, fieldState } = useController(inputProps);
  // End of singular field, with custom validation

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
          onChange={field.onChange}
          onBlur={field.onBlur}
          value={field.value}
          name={field.name}
          inputRef={field.ref}
          placeHolder={"ExampleTeamName"}
          color={
            fieldState.isDirty
              ? fieldState.invalid
                ? "red"
                : "green"
              : "purple"
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

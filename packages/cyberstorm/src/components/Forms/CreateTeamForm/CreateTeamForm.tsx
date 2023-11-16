"use client";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useController, useForm, Form } from "react-hook-form";
import * as Button from "../../Button";
import { TextInput } from "../../TextInput/TextInput";
import { useToast } from "../../Toast/Provider";
import styles from "./CreateTeamForm.module.css";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { isErrorResponse } from "../../../utils/type_guards";
import { useEffect } from "react";

export function CreateTeamForm() {
  const toast = useToast();

  // "Required field" error is different from value being too little
  // Check that the value is "> 0"
  const schema = z.object({
    teamName: z
      .string({ required_error: "Team name is required" })
      .min(1, { message: "Team name is required" }),
  });

  const {
    control,
    formState: { isSubmitting, errors },
  } = useForm<z.infer<typeof schema>>({
    mode: "onSubmit",
    resolver: zodResolver(schema),
  });

  const teamName = useController({
    control: control,
    name: "teamName",
  });

  // We have to do this because the RHF Form component is in beta and it
  // doesn't have a callback prop like "onValidation" that could take in
  // the generalized addToast error informing block.
  useEffect(() => {
    if (errors.teamName) {
      console.log(errors);
      toast.addToast({
        variant: "danger",
        message: errors.teamName.message,
        duration: 30000,
      });
    }
  }, [errors]);

  return (
    <Form
      control={control}
      action="https://thunderstore.io/api/team/create"
      method="post"
      onSubmit={() => {
        toast.addToast({ variant: "info", message: "Creating team" });
      }}
      onSuccess={(response) => {
        console.log(response);
        toast.addToast({ variant: "success", message: "Team created" });
      }}
      onError={(response) => {
        if (isErrorResponse(response)) {
          toast.addToast({
            variant: "danger",
            message: response.error.message,
            duration: 30000,
          });
        } else {
          // TODO: Add sentry error here
          console.log("TODO: Sentry error logging missing!");
          toast.addToast({
            variant: "danger",
            message: "Unhandled form response error",
            duration: 30000,
          });
        }
      }}
      validateStatus={(status) => status === 200}
      className={styles.root}
    >
      <div className={styles.dialog}>
        <div className={styles.dialogText}>
          Enter the name of the team you wish to create. Team names can contain
          the characters a-z A-Z 0-9 _ and must not start or end with an _
        </div>
        <TextInput
          {...teamName.field}
          ref={teamName.field.ref}
          placeholder={"ExampleTeamName"}
          color={
            teamName.fieldState.isDirty
              ? teamName.fieldState.invalid
                ? "red"
                : "green"
              : undefined
          }
          disabled={isSubmitting}
        />
      </div>
      <div className={styles.footer}>
        <Button.Root
          type="submit"
          paddingSize="large"
          colorScheme="success"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Button.ButtonIcon iconClasses={styles.spinningIcon}>
              <FontAwesomeIcon icon={faArrowsRotate} />
            </Button.ButtonIcon>
          ) : (
            <Button.ButtonLabel>Create</Button.ButtonLabel>
          )}
        </Button.Root>
      </div>
    </Form>
  );
}

CreateTeamForm.displayName = "CreateTeamForm";

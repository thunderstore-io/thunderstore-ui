"use client";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useController, useForm } from "react-hook-form";
import * as Button from "../../Button";
import { TextInput } from "../../TextInput/TextInput";
import { useToast } from "../../Toast/Provider";
import styles from "./CreateTeamForm.module.css";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormErrorResponse,
  isFormErrorResponse,
} from "../../../utils/type_guards";

export function CreateTeamForm() {
  const toast = useToast();

  // "Required field" error only checks, if the field has been touched. (It's probably broken)
  // Check that the value is "> 0"
  const schema = z.object({
    name: z
      .string({ required_error: "Team name is required" })
      .min(1, { message: "Team name is required" }),
  });

  const {
    control,
    formState: { isSubmitting, errors },
    handleSubmit,
    setError,
  } = useForm<z.infer<typeof schema>>({
    mode: "onSubmit",
    resolver: zodResolver(schema),
  });

  const name = useController({
    control: control,
    name: "name",
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    // SESSION TODO: Add sessionid here
    const session = { sessionid: "74hmbkylkgqge1ne22tzuvzuz6u51tdg" };

    const payload = JSON.stringify(data);
    let response = undefined;
    try {
      // TODO: Change to dev env url
      response = await fetch(
        `http://thunderstore.temp/api/cyberstorm/teams/create/`,
        {
          method: "POST",
          headers: {
            authorization: `Session ${session.sessionid}`,
            "Content-Type": "application/json",
          },
          body: payload,
        }
      );
    } catch (e) {
      toast.addToast({
        variant: "danger",
        message: "There was a problem reaching the server",
        duration: 30000,
      });
    }

    if (response) {
      const responseJson = await response.json();
      if (response.ok) {
        toast.addToast({ variant: "success", message: "Team created" });
      } else if (isFormErrorResponse(responseJson)) {
        const errors = responseJson as FormErrorResponse;
        Object.keys(errors).forEach((key) => {
          // Hardcoded because types are hard
          const k = key as "name";
          errors[key].forEach((message) => {
            setError(k, { type: "manual", message: message });
          });
        });
      } else {
        // TODO: Add sentry error here
        toast.addToast({
          variant: "danger",
          message: "Skidaddle skidoodle the server gave you a noodle",
          duration: 30000,
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.root}>
      <div className={styles.dialog}>
        <div className={styles.dialogText}>
          Enter the name of the team you wish to create. Team names can contain
          the characters a-z A-Z 0-9 _ and must not start or end with an _
        </div>
        <div>
          <TextInput
            {...name.field}
            ref={name.field.ref}
            placeholder={"ExampleName"}
            color={
              name.fieldState.isDirty
                ? name.fieldState.invalid
                  ? "red"
                  : "green"
                : undefined
            }
            disabled={isSubmitting}
          />
          <span className={styles.errorMessage}>{errors.name?.message}</span>
        </div>
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
    </form>
  );
}

CreateTeamForm.displayName = "CreateTeamForm";

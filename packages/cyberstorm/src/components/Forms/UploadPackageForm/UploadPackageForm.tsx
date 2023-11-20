"use client";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useController, useForm, Controller } from "react-hook-form";
import * as Button from "../../Button";
import { useToast } from "../../Toast/Provider";
import styles from "./UploadPackageForm.module.css";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SettingItem } from "../../SettingItem/SettingItem";
import { CreateTeamForm } from "./../CreateTeamForm/CreateTeamForm";
import { Switch } from "../../Switch/Switch";
import * as Dialog from "../../Dialog/Dialog";
import { MultiSelect } from "../../MultiSelect/MultiSelect";
import {
  FormErrorResponse,
  isFormErrorResponse,
} from "../../../utils/type_guards";
import React from "react";

export function UploadPackageForm() {
  const toast = useToast();

  const schema = z.object({
    nsfw: z.boolean(),
    communities: z.array(z.object({ label: z.string(), value: z.string() })),
  });

  const {
    control,
    formState: { isSubmitting, errors },
    handleSubmit,
    setError,
  } = useForm<z.infer<typeof schema>>({
    defaultValues: {
      nsfw: false,
    },
    mode: "onSubmit",
    resolver: zodResolver(schema),
  });

  const communitiesField = useController({
    control: control,
    name: "communities",
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
        toast.addToast({ variant: "success", message: "Package submitted" });
      } else if (isFormErrorResponse(responseJson)) {
        const errors = responseJson as FormErrorResponse;
        Object.keys(errors).forEach((key) => {
          // Hardcoded because types are hard
          const k = key as "nsfw" | "communities";
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

  const options = [
    { label: "Asd", value: "asd" },
    { label: "Asd2", value: "asd2" },
    { label: "Asd3", value: "asd3" },
  ];

  React.useEffect(() => {
    console.log(communitiesField.field.value);
  }, [communitiesField.field.value]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.root}>
      <div className={styles.root}>
        <SettingItem
          title="Upload file"
          description="Upload your package as a ZIP file."
          content={<div></div>}
        />
        <SettingItem
          title="Team"
          description="No teams available?"
          additionalLeftColumnContent={
            <Dialog.Root
              title="Create Team"
              trigger={
                <Button.Root colorScheme="primary" paddingSize="large">
                  <Button.ButtonLabel>Create team</Button.ButtonLabel>
                  <Button.ButtonIcon>
                    <FontAwesomeIcon icon={faPlus} />
                  </Button.ButtonIcon>
                </Button.Root>
              }
            >
              <CreateTeamForm />
            </Dialog.Root>
          }
          content={<div></div>}
        />
        <SettingItem
          title="Communities"
          description="Select communities you want your package to be listed under. Current community is selected by default."
          content={
            <>
              <MultiSelect
                {...communitiesField.field}
                options={options}
                placeholder="Select communities..."
                color={
                  communitiesField.fieldState.isDirty
                    ? communitiesField.fieldState.invalid
                      ? "red"
                      : "green"
                    : undefined
                }
                disabled={isSubmitting}
              />
              <span className={styles.errorMessage}>
                {errors.communities?.message}
              </span>
            </>
          }
        />
        <SettingItem
          title="Categories"
          description="Select descriptive categories to help people discover your package."
          content={<div></div>}
        />
        <SettingItem
          title="Contains NSFW content"
          description='A "NSFW" -tag will be applied to your package.'
          content={
            <Controller
              name="nsfw"
              control={control}
              render={({ field }) => (
                <Switch
                  {...field}
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked ? true : false);
                  }}
                />
              )}
            />
          }
        />
        <SettingItem
          title="Submit"
          description='Double-check your selections and hit "Submit" when you are ready!'
          content={
            <div className={styles.submit}>
              <Button.Root
                type="submit"
                colorScheme="danger"
                disabled={isSubmitting}
              >
                <Button.ButtonLabel>Reset</Button.ButtonLabel>
              </Button.Root>
              <Button.Root
                type="submit"
                colorScheme="accent"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Button.ButtonIcon iconClasses={styles.spinningIcon}>
                    <FontAwesomeIcon icon={faArrowsRotate} />
                  </Button.ButtonIcon>
                ) : (
                  <Button.ButtonLabel>Submit</Button.ButtonLabel>
                )}
              </Button.Root>
            </div>
          }
        />
      </div>
    </form>
  );
}

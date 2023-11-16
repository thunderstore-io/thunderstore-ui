"use client";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useController, useForm, Form, Controller } from "react-hook-form";
import * as Button from "../../Button";
import { TextInput } from "../../TextInput/TextInput";
import { useToast } from "../../Toast/Provider";
import styles from "./UploadPackageForm.module.css";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { isErrorResponse } from "../../../utils/type_guards";
import { useEffect } from "react";
import { SettingItem } from "../../SettingItem/SettingItem";
import { CreateTeamForm } from "./../CreateTeamForm/CreateTeamForm";
import { Switch } from "../../Switch/Switch";
import * as Dialog from "../../Dialog/Dialog";
import { SearchSelect } from "../../SearchSelect/SearchSelect";

export function UploadPackageForm() {
  const toast = useToast();

  //   <TextInput
  //   {...teamName.field}
  //   ref={teamName.field.ref}
  //   placeholder={"ExampleTeamName"}
  //   color={
  //     teamName.fieldState.isDirty
  //       ? teamName.fieldState.invalid
  //         ? "red"
  //         : "green"
  //       : undefined
  //   }
  //   disabled={isSubmitting}
  // />

  const schema = z.object({
    nsfw: z.boolean(),
    communities: z.string().array(),
  });

  const {
    control,
    formState: { isSubmitting, errors },
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

  // We have to do this because the RHF Form component is in beta and it
  // doesn't have a callback prop like "onValidation" that could take in
  // the generalized addToast error informing block.
  useEffect(() => {
    // if (errors.teamName) {
    //   console.log(errors);
    //   toast.addToast({
    //     variant: "danger",
    //     message: errors.teamName.message,
    //     duration: 30000,
    //   });
    // }
  }, [errors]);

  return (
    <Form
      control={control}
      action="https://thunderstore.io/api/team/create"
      method="post"
      onSubmit={() => {
        toast.addToast({ variant: "info", message: "Starting package upload" });
      }}
      onSuccess={(response) => {
        console.log(response);
        toast.addToast({
          variant: "success",
          message: "Package submission successful",
        });
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
            <SearchSelect
              {...communitiesField.field}
              options={[
                { label: "Asd", value: "asd" },
                { label: "Asd2", value: "asd2" },
                { label: "Asd3", value: "asd3" },
              ]}
              // color={
              //   communitiesField.fieldState.isDirty
              //     ? communitiesField.fieldState.invalid
              //       ? "red"
              //       : "green"
              //     : undefined
              // }
              // disabled={isSubmitting}
            />
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
    </Form>
  );
}

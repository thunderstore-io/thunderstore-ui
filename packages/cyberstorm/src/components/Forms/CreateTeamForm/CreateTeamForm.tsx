"use client";
import styles from "./CreateTeamForm.module.css";
import * as Button from "../../Button";
import { TextInput } from "../../TextInput/TextInput";
import { useForm, useController, UseControllerProps } from "react-hook-form";

/**
 * Form for creating a team
 */
export function CreateTeamForm() {
  const { handleSubmit, control } = useForm<{ teamName: string }>({
    defaultValues: {
      teamName: "",
    },
    mode: "onChange",
  });

  const onSubmit = (data: { teamName: string }) => console.log(data);

  const controllerProps = {
    control: control,
    name: "teamName",
    rules: { required: true },
  } as UseControllerProps<{ teamName: string }>;

  const { field, fieldState } = useController(controllerProps);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.createTeamDialog}>
        <div className={styles.createTeamDialogText}>
          Enter the name of the team you wish to create. Team names can contain
          the characters a-z A-Z 0-9 _ and must not start or end with an _
        </div>
        <TextInput {...field} placeHolder="Team name" />
        <p>{fieldState.isTouched && "Touched"}</p>
        <p>{fieldState.isDirty && "Dirty"}</p>
        <p>{fieldState.invalid ? "invalid" : "valid"}</p>
      </div>
      <div className={styles.footer}>
        <Button.Root type="submit" paddingSize="large" colorScheme="success">
          <Button.ButtonLabel>Create</Button.ButtonLabel>
        </Button.Root>
      </div>
    </form>
  );
}

CreateTeamForm.displayName = "CreateTeamForm";

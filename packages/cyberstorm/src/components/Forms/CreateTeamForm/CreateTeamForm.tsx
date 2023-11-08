"use client";
import styles from "./CreateTeamForm.module.css";
import * as Button from "../../Button";
import { TextInput } from "../../TextInput/TextInput";
import { useForm, useController, UseControllerProps } from "react-hook-form";

type FormValues = {
  teamName: string;
};

function Input(props: UseControllerProps<FormValues>) {
  const { field, fieldState } = useController(props);

  return (
    <div>
      <TextInput asChild>
        <input
          {...field}
          placeholder={props.name}
          data-state={
            fieldState.isDirty
              ? fieldState.invalid
                ? "invalid"
                : "valid"
              : "empty"
          }
        />
      </TextInput>
      <p>{fieldState.isTouched && "Touched"}</p>
    </div>
  );
}

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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.createTeamDialog}>
        <div className={styles.createTeamDialogText}>
          Enter the name of the team you wish to create. Team names can contain
          the characters a-z A-Z 0-9 _ and must not start or end with an _
        </div>
        <Input
          control={control}
          name="teamName"
          rules={{ required: true, minLength: 5 }}
        />
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

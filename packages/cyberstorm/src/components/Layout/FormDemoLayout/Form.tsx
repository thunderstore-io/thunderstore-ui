import { useState } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";

import { EmployeeField } from "./EmployeeField";
import styles from "./FormDemoLayout.module.css";
import { Button } from "../../Button/Button";

// Define the fields present in the formm, and their data types.
interface DemoForm {
  boss: string;

  // It would seem to me that this should be string[], but that doesn't
  // pass type checking currently.
  employees: { value: string }[];
}

export function Form() {
  const { control, handleSubmit } = useForm<DemoForm>();
  const {
    fields: employees,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "employees",
  });

  const [formValues, setFormValues] = useState("Submit the form to see values");

  const onSubmit: SubmitHandler<DemoForm> = (data) =>
    setFormValues(JSON.stringify(data, null, 2));

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <h2>Bosmang</h2>
        <EmployeeField name="boss" control={control} />

        {/* I wanted to use the same custom component as a single field
            and a "field array". This might not have been the best
            approach: the example for using full subforms as field array
            items looked cleaner. Didn't have the time to test it yet.*/}
        <h2>Team</h2>
        {employees.map((field, i) => (
          <>
            {/* Documentation tells to use field.id as the key, but console
               shows errors since it's undefined... */}
            <EmployeeField<DemoForm>
              key={field.id}
              name={`employees.${i}` as const}
              control={control}
            />
            <Button label="Yeet employee" onClick={() => remove(i)} />
          </>
        ))}
        <Button label="Add employee" onClick={() => append({ value: "" })} />

        <Button type="submit" label="Submit" colorScheme="specialGreen" />
      </form>

      <h1>Form values:</h1>
      <pre className={styles.formData}>{formValues}</pre>
    </>
  );
}

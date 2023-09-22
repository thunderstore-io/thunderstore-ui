// Switch doesn't seem to support labels currently.
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useEffect, useState } from "react";
import {
  FieldValues,
  useController,
  UseControllerProps,
} from "react-hook-form";

import styles from "./FormDemoLayout.module.css";
import { Switch } from "../../Switch/Switch";
import { TextInput } from "../../TextInput/TextInput";

// Custom component as a form field, outputs a single field to the form
// data as stringified JSON.
export const EmployeeField = <T extends FieldValues>(
  props: UseControllerProps<T>
) => {
  const { field } = useController(props);

  // Apparently default values, set when useForm was called, should be
  // readable here but couldn't find yet a clean way to do that. For
  // this component the default value would be a stringified JSON that
  // we'd need to parse and set to state manually.
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isExcellent, setIsExcellent] = useState(false);

  // Update the value the form sees one of the internal field changes.
  useEffect(() => {
    field.onChange(JSON.stringify({ firstName, lastName, isExcellent }));
  }, [firstName, lastName, isExcellent]);

  return (
    <fieldset name="Employee" className={styles.fieldset}>
      <div>
        <label htmlFor="first">First Name</label>
        <TextInput id="first" value={firstName} setValue={setFirstName} />
      </div>

      <div>
        <label htmlFor="last">Last Name</label>
        <TextInput id="last" value={lastName} setValue={setLastName} />
      </div>

      <label className={styles.switchLabel}>
        <Switch
          state={isExcellent}
          onChange={() => setIsExcellent(!isExcellent)}
        />
        Excellent performance
      </label>
    </fieldset>
  );
};

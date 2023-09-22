import { Form } from "./Form";
import styles from "./FormDemoLayout.module.css";
import { Notes } from "./Notes";

export function FormDemoLayout() {
  return (
    <div className={styles.root}>
      <div>
        <Form />
      </div>
      <div>
        <Notes />
      </div>
    </div>
  );
}

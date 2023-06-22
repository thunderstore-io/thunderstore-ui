import styles from "./PackageManagementForm.module.css";
import { Tag } from "../../../Tag/Tag";
import { TextInput } from "../../../TextInput/TextInput";

export interface PackageManagementFormProps {
  packageStatus?: string;
}

export function PackageManagementForm(props: PackageManagementFormProps) {
  const { packageStatus = "active" } = props;
  return (
    <div className={styles.root}>
      <div className={styles.section}>
        <div className={styles.title}>Package status</div>
        <div className={styles.statusTag}>
          <Tag
            size="medium"
            label={packageStatus.toUpperCase()}
            colorScheme="success"
          />
        </div>
      </div>
      <div className={styles.section}>
        <div className={styles.title}>Edit categories</div>
        <TextInput />
      </div>
    </div>
  );
}

PackageManagementForm.displayName = "PackageManagementForm";

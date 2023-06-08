import styles from "./PackageManagementForm.module.css";
import { Title } from "../../../Title/Title";
import { Tag } from "../../../Tag/Tag";
import { TextInput } from "../../../TextInput/TextInput";

export interface PackageManagementFormProps {
  packageStatus?: string;
}

export function PackageManagementForm(props: PackageManagementFormProps) {
  const { packageStatus = "active" } = props;
  return (
    <div className={styles.root}>
      <Title text="Package status" size="smallest" />
      <div className={styles.statusTag}>
        <Tag label={packageStatus} colorScheme="success" />
      </div>
      <Title text="Edit categories" size="smallest" />
      <TextInput />
    </div>
  );
}

PackageManagementForm.displayName = "PackageManagementForm";

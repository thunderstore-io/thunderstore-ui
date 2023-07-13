import styles from "./PackageManagementForm.module.css";
import { Tag } from "../../../Tag/Tag";
import { TextInput } from "../../../TextInput/TextInput";
import { Alert } from "../../../Alert/Alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/pro-solid-svg-icons";

export interface PackageManagementFormProps {
  packageStatus?: string;
}

export function PackageManagementForm(props: PackageManagementFormProps) {
  const { packageStatus = "active" } = props;
  return (
    <div className={styles.root}>
      <div className={styles.section}>
        <Alert
          icon={<FontAwesomeIcon fixedWidth icon={faCircleExclamation} />}
          content={
            "Changes might take several minutes to show publicly! Info shown below is always up to date."
          }
          variant="info"
        />
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

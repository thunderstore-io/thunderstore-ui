import styles from "./PackageManagementForm.module.css";
import { Tag } from "../../../Tag/Tag";
import { TextInput } from "../../../TextInput/TextInput";
import { Alert } from "../../../Alert/Alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/pro-solid-svg-icons";
import { Button } from "../../../../index";

export interface PackageManagementFormProps {
  packageStatus?: string;
  isDeprecated: boolean;
}

export function PackageManagementForm(props: PackageManagementFormProps) {
  const { packageStatus = "active", isDeprecated } = props;
  return (
    <div className={styles.root}>
      <div className={styles.section}>
        <Alert
          icon={<FontAwesomeIcon icon={faCircleExclamation} />}
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
      <div className={styles.footer}>
        {isDeprecated ? (
          <Button.Root paddingSize="large" colorScheme="default">
            <Button.ButtonLabel>Undeprecate</Button.ButtonLabel>
          </Button.Root>
        ) : (
          <Button.Root paddingSize="large" colorScheme="warning">
            <Button.ButtonLabel>Deprecate</Button.ButtonLabel>
          </Button.Root>
        )}
        <Button.Root paddingSize="large" colorScheme="success">
          <Button.ButtonLabel>Save changes</Button.ButtonLabel>
        </Button.Root>
      </div>
    </div>
  );
}

PackageManagementForm.displayName = "PackageManagementForm";

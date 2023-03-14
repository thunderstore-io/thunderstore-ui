import React from "react";
import styles from "./PackageManagementForm.module.css";
import { Title } from "../../Title/Title";
import { Tag } from "../../Tag/Tag";
import { TextInput } from "../../TextInput/TextInput";

export interface PackageManagementFormProps {
  packageStatus?: string;
}

export const PackageManagementForm: React.FC<PackageManagementFormProps> = (
  props
) => {
  const { packageStatus } = props;
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
};

PackageManagementForm.displayName = "PackageManagementForm";
PackageManagementForm.defaultProps = { packageStatus: "active" };

"use client";
import { Alert, Button, Tag, TextInput } from "@thunderstore/cyberstorm";
import styles from "./PackageManagementForm.module.css";
import { useDapper } from "@thunderstore/dapper";
import { usePromise } from "@thunderstore/use-promise";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Page({
  params,
}: {
  params: { community: string; namespace: string; package: string };
}) {
  const dapper = useDapper();
  const packageData = usePromise(dapper.getPackageListingDetails, [
    params.community,
    params.namespace,
    params.package,
  ]);

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
            label={packageData.is_deprecated ? "DEPRECATED" : "ACTIVE"}
            colorScheme={packageData.is_deprecated ? "yellow" : "success"}
          />
        </div>
      </div>
      <div className={styles.section}>
        <div className={styles.title}>Edit categories</div>
        <TextInput />
      </div>
      <div className={styles.footer}>
        {packageData.is_deprecated ? (
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
